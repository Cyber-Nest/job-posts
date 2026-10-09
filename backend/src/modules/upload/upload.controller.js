import { randomUUID } from "crypto";
import path from "path";
import cloudinary from "../../config/cloudinary.js";

export async function uploadResumeHandler(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    const file = req.file;
    const ext = path.extname(file.originalname) || ".pdf";

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
          public_id: `resumes/${randomUUID()}`,
          format: ext.replace(".", ""),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    next(error);
  }
}
