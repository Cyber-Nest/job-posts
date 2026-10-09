import { Router } from "express";
import {
  adminLoginHandler,
  adminLogoutHandler,
  getAdminMeHandler,
  getCouponsHandler,
  createCouponHandler,
  deleteCouponHandler,
  getAdminDashboardStatsHandler,
} from "./admin.controller.js";
import { adminAuthMiddleware } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// Auth routes
router.post("/auth/login", adminLoginHandler);
router.post("/auth/logout", adminAuthMiddleware, adminLogoutHandler);
router.get("/auth/me", adminAuthMiddleware, getAdminMeHandler);

// Coupons management
router.get("/coupons", adminAuthMiddleware, getCouponsHandler);
router.post("/coupons", adminAuthMiddleware, createCouponHandler);
router.delete("/coupons/:id", adminAuthMiddleware, deleteCouponHandler);

// Stats & Dashboard
router.get("/stats", adminAuthMiddleware, getAdminDashboardStatsHandler);

export default router;
