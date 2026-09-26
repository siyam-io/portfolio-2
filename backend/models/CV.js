import mongoose from "mongoose";

const CVSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileName: { type: String, required: true },
  cvData: { type: String, required: true }, // Base64 encoded PDF
  contentType: { type: String, default: "application/pdf" },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save middleware to ensure only one CV is active at a time
CVSchema.pre('save', async function() {
  if (this.isActive) {
    await this.constructor.updateMany({ _id: { $ne: this._id } }, { isActive: false });
  }
});

export default mongoose.model("CV", CVSchema);
