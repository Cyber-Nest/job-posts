import { Router } from "express";
import {
  checkEmployerHandler,
  getEmployerProfileHandler,
  updateEmployerProfileHandler,
  getEmployerPackageHandler,
  getEmployerStatsHandler,
  getEmployerJobsHandler,
} from "./employer.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/check", checkEmployerHandler);
router.get("/profile", authMiddleware, getEmployerProfileHandler);
router.put("/profile", authMiddleware, updateEmployerProfileHandler);
router.get("/package", authMiddleware, getEmployerPackageHandler);
router.get("/stats", authMiddleware, getEmployerStatsHandler);
router.get("/jobs", authMiddleware, getEmployerJobsHandler);

export default router;
