import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  about: { type: String, required: true },
  heroImage: { type: String },
  cvUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("Profile", ProfileSchema);
