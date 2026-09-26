import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import auth from "../middleware/auth.js";
import { getDecryptedKey } from "../utils/keys.js";

const router = express.Router();

// Configure multer (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload memory buffer to Cloudinary
const uploadStreamToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "portfolio" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Helper to save file locally (Vite public fallback)
const saveFileLocally = (file) => {
  const uploadDir = path.resolve("../web/public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Safe filename
  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const filePath = path.join(uploadDir, safeName);
  
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${safeName}`;
};

// @route   POST api/upload
// @desc    Upload an image (Admin only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  try {
    // Dynamic lookups of credentials from DB (or env fallback)
    const cloudName = await getDecryptedKey("CLOUDINARY_CLOUD_NAME");
    const apiKey = await getDecryptedKey("CLOUDINARY_API_KEY");
    const apiSecret = await getDecryptedKey("CLOUDINARY_API_SECRET");

    let imageUrl = "";

    if (cloudName && apiKey && apiSecret) {
      // Configure Cloudinary dynamically on demand
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      // Upload to Cloudinary
      imageUrl = await uploadStreamToCloudinary(req.file.buffer);
      return res.json({ success: true, url: imageUrl, source: "cloudinary" });
    } else {
      // Fallback to local upload
      imageUrl = saveFileLocally(req.file);
      return res.json({ success: true, url: imageUrl, source: "local" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: "File upload failed", error: err.message });
  }
});

// Helper to upload RAW memory buffer to Cloudinary (for PDFs)
const uploadRawStreamToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "portfolio", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// @route   POST api/upload/cv
// @desc    Upload a CV document (Admin only)
router.post("/cv", auth, upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  try {
    // 1. Save locally in web/public/uploads
    const localUrl = saveFileLocally(req.file);
    const base64Data = req.file.buffer.toString("base64");
    const filename = req.file.originalname || "Esthyak_Ahmmed_Siyam_CV.pdf";

    // 2. Also try uploading to Cloudinary if configured
    let cloudUrl = "";
    try {
      const cloudName = await getDecryptedKey("CLOUDINARY_CLOUD_NAME");
      const apiKey = await getDecryptedKey("CLOUDINARY_API_KEY");
      const apiSecret = await getDecryptedKey("CLOUDINARY_API_SECRET");

      if (cloudName && apiKey && apiSecret) {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
        cloudUrl = await uploadRawStreamToCloudinary(req.file.buffer, req.file.originalname);
      }
    } catch (cErr) {
      console.warn("Cloudinary upload warning:", cErr.message);
    }

    // 3. Automatically persist CV in CV collection
    const CV = (await import("../models/CV.js")).default;
    // Check if it's the first CV, if so make it active
    const existingCvs = await CV.countDocuments();
    const isActive = existingCvs === 0;

    const newCv = new CV({
      name: filename.split('.')[0] + " (Upload)",
      fileName: filename,
      cvData: base64Data,
      contentType: req.file.mimetype || "application/pdf",
      isActive: isActive
    });
    await newCv.save();

    console.log("CV uploaded and stored successfully. Size:", req.file.buffer.length);
    return res.json({ 
      success: true, 
      url: "/api/portfolio/cv", 
      localUrl, 
      cloudUrl: cloudUrl || null,
      msg: "CV uploaded and saved to profile successfully!" 
    });
  } catch (err) {
    console.error("Upload CV error:", err);
    res.status(500).json({ msg: "CV upload failed", error: err.message });
  }
});

export default router;
