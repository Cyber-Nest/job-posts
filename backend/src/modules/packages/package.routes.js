import { Router } from "express";
import {
  getPackagesHandler,
  getEmployerActivePackageHandler,
} from "./package.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getPackagesHandler);
router.get("/my-package", authMiddleware, getEmployerActivePackageHandler);

export default router;
