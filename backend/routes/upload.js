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
      { folder: "portfolio", resource_type: "raw", public_id: originalname },
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
    const cloudName = await getDecryptedKey("CLOUDINARY_CLOUD_NAME");
    const apiKey = await getDecryptedKey("CLOUDINARY_API_KEY");
    const apiSecret = await getDecryptedKey("CLOUDINARY_API_SECRET");

    let cvUrl = "";

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      cvUrl = await uploadRawStreamToCloudinary(req.file.buffer, req.file.originalname);
      return res.json({ success: true, url: cvUrl, source: "cloudinary" });
    } else {
      cvUrl = saveFileLocally(req.file);
      return res.json({ success: true, url: cvUrl, source: "local" });
    }
  } catch (err) {
    console.error("Upload CV error:", err);
    res.status(500).json({ msg: "CV upload failed", error: err.message });
  }
});

export default router;
