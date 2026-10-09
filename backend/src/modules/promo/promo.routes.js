import { Router } from "express";
import { verifyPromoCodeHandler } from "./promo.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/verify", authMiddleware, verifyPromoCodeHandler);

export default router;
