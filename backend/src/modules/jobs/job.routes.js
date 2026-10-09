import { Router } from "express";
import {
  getJobsHandler,
  getJobByIdHandler,
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
} from "./job.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getJobsHandler);
router.get("/:id", getJobByIdHandler);
router.post("/", authMiddleware, createJobHandler);
router.put("/:id", authMiddleware, updateJobHandler);
router.delete("/:id", authMiddleware, deleteJobHandler);

export default router;
