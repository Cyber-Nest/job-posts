import { Router } from "express";
import {
  sendOtpHandler,
  verifyOtpHandler,
  registerEmployerHandler,
  loginHandler,
  getSessionHandler,
  logoutHandler,
  forgotPasswordSendOtpHandler,
  forgotPasswordVerifyOtpHandler,
  forgotPasswordResetHandler,
} from "./auth.controller.js";

const router = Router();

// Registration & OTP
router.post("/otp/send", sendOtpHandler);
router.post("/otp/verify", verifyOtpHandler);
router.post("/register-employer", registerEmployerHandler);

// Login & Session
router.post("/login", loginHandler);
router.get("/session", getSessionHandler);
router.get("/me", getSessionHandler);
router.post("/logout", logoutHandler);

// Password Reset
router.post("/forgot-password/send-otp", forgotPasswordSendOtpHandler);
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtpHandler);
router.post("/forgot-password/reset", forgotPasswordResetHandler);

export default router;
