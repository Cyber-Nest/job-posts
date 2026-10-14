import { Router } from "express";
import {
  verifyPromoCodeHandler,
  checkPromoCodeHandler,
} from "./promo.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/check", authMiddleware, checkPromoCodeHandler);
router.post("/verify", authMiddleware, verifyPromoCodeHandler);

export default router;
