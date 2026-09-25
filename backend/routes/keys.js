import express from "express";
import ApiKey from "../models/ApiKey.js";
import { encrypt } from "../utils/crypto.js";
import { getDecryptedKey } from "../utils/keys.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const KEYS_LIST = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GITHUB_PAT",
  "VITE_SERVICE_KEY",
  "VITE_TEMPLATE_KEY",
  "VITE_PUBLIC_KEY",
  "MONGODB_URI",
];

// @route   GET api/keys
// @desc    Get all decrypted credentials (Admin only)
router.get("/", auth, async (req, res) => {
  try {
    const result = {};
    for (const key of KEYS_LIST) {
      result[key] = await getDecryptedKey(key);
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching credentials:", err);
    res.status(500).send("Server error");
  }
});

// @route   POST api/keys
// @desc    Save/update credentials (Admin only)
router.post("/", auth, async (req, res) => {
  const { keys } = req.body;
  if (!keys || typeof keys !== "object") {
    return res.status(400).json({ msg: "Invalid keys format" });
  }

  try {
    for (const [key, value] of Object.entries(keys)) {
      if (!KEYS_LIST.includes(key)) continue; // Only allow approved keys
      
      const encrypted = encrypt(value);
      await ApiKey.findOneAndUpdate(
        { key },
        { key, value: encrypted },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, msg: "Credentials saved and encrypted successfully" });
  } catch (err) {
    console.error("Error saving credentials:", err);
    res.status(500).send("Server error");
  }
});

export default router;
