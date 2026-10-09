import { Router } from "express";
import {
  submitApplicationHandler,
  getUserApplicationsHandler,
} from "./application.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, submitApplicationHandler);
router.get("/my-applications", authMiddleware, getUserApplicationsHandler);

export default router;
