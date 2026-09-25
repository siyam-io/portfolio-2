import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  about: { type: String, required: true },
  heroImage: { type: String },
  cvUrl: { type: String },
  cvData: { type: String }, // Base64 encoded PDF
  cvName: { type: String, default: "Esthyak_Ahmmed_Siyam_CV.pdf" },
  cvContentType: { type: String, default: "application/pdf" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  email: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Profile", ProfileSchema);
