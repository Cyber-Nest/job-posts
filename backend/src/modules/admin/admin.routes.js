import { Router } from "express";
import {
  adminLoginHandler,
  adminLogoutHandler,
  getAdminMeHandler,
  getAdminCredentialsHandler,
  adminChangeRequestHandler,
  adminChangeConfirmHandler,
  getAdminEmployersHandler,
  getAdminEmployerJobsHandler,
  getAdminJobsHandler,
  getAdminJobDetailHandler,
  updateAdminJobStatusHandler,
  getCouponsHandler,
  createCouponHandler,
  assignCouponHandler,
  seedCouponsHandler,
  getCouponStatsHandler,
  deleteCouponHandler,
  getAdminPackagesHandler,
  updateAdminPackageHandler,
  seedAdminPackagesHandler,
  getAdminPaymentsHandler,
  getAdminDashboardStatsHandler,
} from "./admin.controller.js";
import { adminAuthMiddleware } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// Auth routes
router.post("/auth/login", adminLoginHandler);
router.post("/auth/logout", adminAuthMiddleware, adminLogoutHandler);
router.get("/auth/me", adminAuthMiddleware, getAdminMeHandler);
router.get("/auth/credentials", adminAuthMiddleware, getAdminCredentialsHandler);
router.post("/auth/change-request", adminAuthMiddleware, adminChangeRequestHandler);
router.post("/auth/change-confirm", adminAuthMiddleware, adminChangeConfirmHandler);

// Employers Management
router.get("/employers", adminAuthMiddleware, getAdminEmployersHandler);
router.get("/employers/:id/jobs", adminAuthMiddleware, getAdminEmployerJobsHandler);

// Jobs Moderation
router.get("/jobs", adminAuthMiddleware, getAdminJobsHandler);
router.get("/jobs/:id", adminAuthMiddleware, getAdminJobDetailHandler);
router.patch("/jobs/:id", adminAuthMiddleware, updateAdminJobStatusHandler);
router.put("/jobs/:id", adminAuthMiddleware, updateAdminJobStatusHandler);

// Coupons Management
router.get("/coupons", adminAuthMiddleware, getCouponsHandler);
router.post("/coupons", adminAuthMiddleware, createCouponHandler);
router.post("/coupons/seed", adminAuthMiddleware, seedCouponsHandler);
router.post("/coupons/:id/assign", adminAuthMiddleware, assignCouponHandler);
router.get("/coupons/stats", adminAuthMiddleware, getCouponStatsHandler);
router.delete("/coupons/:id", adminAuthMiddleware, deleteCouponHandler);

// Packages Management
router.get("/packages", adminAuthMiddleware, getAdminPackagesHandler);
router.put("/packages", adminAuthMiddleware, updateAdminPackageHandler);
router.post("/packages/seed", adminAuthMiddleware, seedAdminPackagesHandler);

// Payments History
router.get("/payments", adminAuthMiddleware, getAdminPaymentsHandler);

// Stats & Dashboard
router.get("/stats", adminAuthMiddleware, getAdminDashboardStatsHandler);

export default router;
