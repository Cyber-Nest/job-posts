import { Router } from "express";
import {
  createCheckoutSessionHandler,
  verifyPaymentHandler,
} from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSessionHandler);
router.post("/verify-payment", authMiddleware, verifyPaymentHandler);

export default router;
