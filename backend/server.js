import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import messageRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/upload.js";
import keysRoutes from "./routes/keys.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("../web/public/uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/keys", keysRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Portfolio Backend is running" });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Only listen if not running in production (Vercel Serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
