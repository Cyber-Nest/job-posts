import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { logger } from "./utils/logger.js";

// Import modular routes
import jobRoutes from "./modules/jobs/job.routes.js";
import employerRoutes from "./modules/employers/employer.routes.js";
import packageRoutes from "./modules/packages/package.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import promoRoutes from "./modules/promo/promo.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import applicationRoutes from "./modules/applications/application.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  })
);

// Winston HTTP Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";
    logger.log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`, {
      ip: req.ip || req.headers["x-forwarded-for"],
      userAgent: req.headers["user-agent"],
    });
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "GetJobsCanada Modular Express Backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount V1 API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/employer", employerRoutes);
app.use("/api/v1/packages", packageRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/promo", promoRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
