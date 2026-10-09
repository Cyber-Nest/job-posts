import { Router } from "express";
import { uploadResumeHandler } from "./upload.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/resume",
  authMiddleware,
  uploadMiddleware.single("resume"),
  uploadResumeHandler
);

export default router;
