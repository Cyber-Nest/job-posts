import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("[Vercel Serverless Function] Unhandled error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error in Serverless Function",
    });
  }
}
