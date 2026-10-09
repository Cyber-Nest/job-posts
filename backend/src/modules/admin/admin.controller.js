import { Admin } from "./admin.model.js";
import { PromoCode } from "../promo/promoCode.model.js";
import { Job } from "../jobs/job.model.js";
import { Employer } from "../employers/employer.model.js";
import { PaymentTransaction } from "../payments/paymentTransaction.model.js";
import { decryptPassword, hmacSign, toBase64url } from "../../utils/crypto.js";
import { env } from "../../config/env.js";

async function generateAdminToken(email) {
  const secret = env.ADMIN_JWT_SECRET;
  const payload = toBase64url(JSON.stringify({ email, ts: Date.now() }));
  const sig = hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

export async function adminLoginHandler(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }

    const decryptedPassword = decryptPassword(admin.password);
    if (decryptedPassword !== password) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }

    const token = await generateAdminToken(admin.email);

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      message: "Admin login successful.",
    });
  } catch (error) {
    next(error);
  }
}

export async function adminLogoutHandler(req, res) {
  res.clearCookie("admin_token");
  return res.status(200).json({ success: true, message: "Logged out successfully." });
}

export async function getAdminMeHandler(req, res) {
  return res.status(200).json({ success: true, admin: req.admin });
}

export async function getCouponsHandler(req, res, next) {
  try {
    const coupons = await PromoCode.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
}

export async function createCouponHandler(req, res, next) {
  try {
    const { code, packageName, assignedName, assignedEmail } = req.body;

    if (!code || !packageName) {
      return res.status(400).json({ success: false, error: "Coupon code and package name are required." });
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await PromoCode.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ success: false, error: "Coupon code already exists." });
    }

    const coupon = await PromoCode.create({
      code: cleanCode,
      packageName: packageName.trim(),
      status: "Unused",
      assignedName: assignedName?.trim() || null,
      assignedEmail: assignedEmail?.trim()?.toLowerCase() || null,
      assignedAt: assignedEmail ? new Date() : null,
    });

    return res.status(201).json({ success: true, data: coupon, message: "Coupon created successfully." });
  } catch (error) {
    next(error);
  }
}

export async function deleteCouponHandler(req, res, next) {
  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Coupon not found." });
    }
    return res.status(200).json({ success: true, message: "Coupon deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getAdminDashboardStatsHandler(req, res, next) {
  try {
    const [totalJobs, totalEmployers, totalTransactions, totalCoupons] = await Promise.all([
      Job.countDocuments(),
      Employer.countDocuments(),
      PaymentTransaction.countDocuments(),
      PromoCode.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalEmployers,
        totalTransactions,
        totalCoupons,
      },
    });
  } catch (error) {
    next(error);
  }
}
