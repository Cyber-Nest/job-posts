import crypto from "crypto";
import mongoose from "mongoose";
import { Admin } from "./admin.model.js";
import { PromoCode } from "../promo/promoCode.model.js";
import { Job } from "../jobs/job.model.js";
import { Employer } from "../employers/employer.model.js";
import { PaymentTransaction } from "../payments/paymentTransaction.model.js";
import { Package, DEFAULT_PACKAGES } from "../packages/package.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { sendOtpEmail } from "../../utils/mailer.js";
import { decryptPassword, encryptPassword, hmacSign, toBase64url } from "../../utils/crypto.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

async function generateAdminToken(email) {
  const secret = env.ADMIN_JWT_SECRET;
  const payload = toBase64url(JSON.stringify({ email, ts: Date.now() }));
  const sig = hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

/* ── Auth Handlers ─────────────────────────────────────────────────── */

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

    const isProd = env.NODE_ENV === "production";
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info(`[ADMIN] Login successful for ${admin.email}`);

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
  const isProd = env.NODE_ENV === "production";
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully." });
}

export async function getAdminMeHandler(req, res) {
  return res.status(200).json({ success: true, admin: req.admin, email: req.admin?.email });
}

export async function getAdminCredentialsHandler(req, res, next) {
  try {
    const admin = await Admin.findOne({ email: req.admin.email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found." });
    }
    return res.status(200).json({
      success: true,
      email: admin.email,
      emailChangeCount: admin.emailChangeCount || 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminChangeRequestHandler(req, res, next) {
  try {
    const { newEmail, newPassword } = req.body;
    if (!newEmail && !newPassword) {
      return res.status(400).json({ success: false, error: "Provide a new email or password." });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const db = mongoose.connection.db;
    const adminChangeCollection = db.collection("admin_change_requests");

    await adminChangeCollection.deleteMany({ email: req.admin.email.toLowerCase() });

    await adminChangeCollection.insertOne({
      email: req.admin.email.toLowerCase(),
      code,
      newEmail: newEmail ? newEmail.toLowerCase().trim() : null,
      newPassword: newPassword || null,
      expiresAt,
      createdAt: new Date(),
    });

    try {
      await sendOtpEmail(req.admin.email, code, "Your Admin Security Verification Code");
    } catch (mailErr) {
      logger.error("[ADMIN] Failed to send security OTP:", mailErr);
    }

    logger.info(`[ADMIN] Verification code generated for change request (${req.admin.email}): ${code}`);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to admin email.",
      _devCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminChangeConfirmHandler(req, res, next) {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Verification code is required." });
    }

    const db = mongoose.connection.db;
    const adminChangeCollection = db.collection("admin_change_requests");

    const record = await adminChangeCollection.findOne({
      email: req.admin.email.toLowerCase(),
      code: String(code).trim(),
    });

    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Invalid or expired verification code." });
    }

    const admin = await Admin.findOne({ email: req.admin.email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin account not found." });
    }

    if (record.newEmail) {
      admin.email = record.newEmail;
      admin.emailChangeCount = (admin.emailChangeCount || 0) + 1;
    }

    if (record.newPassword) {
      admin.password = encryptPassword(record.newPassword);
    }

    await admin.save();
    await adminChangeCollection.deleteOne({ _id: record._id });

    // Re-issue new token if email changed
    const newToken = await generateAdminToken(admin.email);
    const isProd = env.NODE_ENV === "production";
    res.cookie("admin_token", newToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info(`[ADMIN] Credentials updated successfully for ${admin.email}`);

    return res.status(200).json({
      success: true,
      message: "Admin credentials updated successfully.",
      email: admin.email,
    });
  } catch (error) {
    next(error);
  }
}

/* ── Employers Handlers ────────────────────────────────────────────── */

export async function getAdminEmployersHandler(req, res, next) {
  try {
    const { search = "", site, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (site && site !== "all") {
      filter.site = site;
    }
    if (search) {
      filter.$or = [
        { orgName: { $regex: search, $options: "i" } },
        { contactName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [employers, total] = await Promise.all([
      Employer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Employer.countDocuments(filter),
    ]);

    // Attach Active Packages & Job Counts
    const employerObjectIds = employers
      .map((e) => e._id)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const employerStringIds = employers.map((e) => String(e._id));
    const authUserIds = employers.map((e) => e.authUserId).filter(Boolean);

    const allEmployerKeys = [
      ...employerObjectIds,
      ...employerStringIds,
      ...authUserIds,
    ];

    // Find all packages for these employers
    const [packages, jobCounts] = await Promise.all([
      EmployerPackage.collection
        .find({
          employerId: { $in: [...employerObjectIds, ...employerStringIds] },
        })
        .sort({ createdAt: -1 })
        .toArray(),
      Job.collection
        .aggregate([
          {
            $match: {
              employerId: { $in: allEmployerKeys },
            },
          },
          {
            $group: {
              _id: "$employerId",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
    ]);

    const pkgMap = new Map();
    // Prioritize active packages, otherwise latest package
    packages.forEach((pkg) => {
      const key = String(pkg.employerId);
      if (!pkgMap.has(key)) {
        pkgMap.set(key, pkg);
      } else if (pkg.status === "Active" && pkgMap.get(key).status !== "Active") {
        pkgMap.set(key, pkg);
      }
    });

    const jobCountMap = new Map();
    jobCounts.forEach((j) => {
      jobCountMap.set(String(j._id), j.count);
    });

    const result = employers.map((emp) => {
      const empIdStr = String(emp._id);
      const pkgDoc = pkgMap.get(empIdStr);

      const countFromEmpId = jobCountMap.get(empIdStr) || 0;
      const countFromAuthId =
        emp.authUserId && emp.authUserId !== empIdStr
          ? jobCountMap.get(String(emp.authUserId)) || 0
          : 0;
      const jobCount = countFromEmpId + countFromAuthId;

      let pkgData = null;
      if (pkgDoc) {
        pkgData = {
          packageName: pkgDoc.packageName,
          status: pkgDoc.status || "Active",
          totalCreditsPurchased: pkgDoc.totalCreditsPurchased ?? 0,
          remainingCredits: pkgDoc.remainingCredits ?? 0,
          unlimitedJobs: Boolean(pkgDoc.unlimitedJobs),
        };
      } else if (jobCount > 0) {
        // Fallback for free job posts if no package record exists
        pkgData = {
          packageName: "Free Plan",
          status: "Active",
          totalCreditsPurchased: jobCount,
          remainingCredits: 0,
          unlimitedJobs: false,
        };
      }

      return {
        _id: emp._id,
        authUserId: emp.authUserId,
        orgName: emp.orgName,
        site: emp.site || "getjobscanada",
        contactName: emp.contactName,
        email: emp.email,
        phone: emp.phone,
        city: emp.city,
        province: emp.province,
        website: emp.website || "",
        createdAt: emp.createdAt,
        activePackage: pkgData ? pkgData.packageName : "No Plan",
        package: pkgData,
        jobCount,
        totalJobsPosted: jobCount,
      };
    });

    return res.status(200).json({
      success: true,
      employers: result,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminEmployerJobsHandler(req, res, next) {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer not found." });
    }

    const matchIds = [
      employer._id,
      String(employer._id),
    ];
    if (employer.authUserId) {
      matchIds.push(employer.authUserId);
      if (mongoose.Types.ObjectId.isValid(employer.authUserId)) {
        matchIds.push(new mongoose.Types.ObjectId(employer.authUserId));
      }
    }

    const rawJobs = await Job.collection
      .find({
        employerId: { $in: matchIds },
      })
      .sort({ createdAt: -1, postedAt: -1, postDate: -1 })
      .toArray();

    const jobs = rawJobs.map((j) => ({
      ...j,
      _id: String(j._id),
      id: String(j._id),
      jobId: j.jobId || String(j._id).slice(-6).toUpperCase(),
    }));

    return res.status(200).json({
      success: true,
      employer: {
        _id: employer._id,
        orgName: employer.orgName,
        email: employer.email,
        website: employer.website,
        province: employer.province,
      },
      employerName: employer.orgName,
      jobs,
    });
  } catch (error) {
    next(error);
  }
}

/* ── Jobs Moderation Handlers ──────────────────────────────────────── */

export async function getAdminJobsHandler(req, res, next) {
  try {
    const { status, search, site, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (site && site !== "all") {
      filter.site = site;
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminJobDetailHandler(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminJobStatusHandler(req, res, next) {
  try {
    const { status, postDate, expiresAt } = req.body;
    const updateFields = { updatedAt: new Date() };

    if (status) updateFields.status = status;
    if (postDate) {
      const parsedDate = new Date(postDate);
      if (!isNaN(parsedDate.getTime())) {
        updateFields.postDate = parsedDate;
        updateFields.postedAt = parsedDate;
      }
    }
    if (expiresAt) {
      const parsedExpires = new Date(expiresAt);
      if (!isNaN(parsedExpires.getTime())) {
        updateFields.expiresAt = parsedExpires;
      }
    }

    if (Object.keys(updateFields).length === 1) {
      return res.status(400).json({
        success: false,
        error: "At least one field (status or postDate) is required to update.",
      });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }

    logger.info(`[ADMIN] Job updated for ${job._id}:`, updateFields);

    return res.status(200).json({
      success: true,
      job,
      message: "Job updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

/* ── Promo Codes / Coupons Handlers ───────────────────────────────── */

export async function getCouponsHandler(req, res, next) {
  try {
    const { page = 1, limit = 20, packageName, status, search } = req.query;

    const filter = {};
    if (packageName && packageName !== "All") filter.packageName = packageName;
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        { assignedName: { $regex: search, $options: "i" } },
        { assignedEmail: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [coupons, total] = await Promise.all([
      PromoCode.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      PromoCode.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: coupons,
      coupons,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
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

export async function assignCouponHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { assignedName, assignedEmail } = req.body;

    if (!assignedName || !assignedEmail) {
      return res.status(400).json({ success: false, error: "Name and email are required." });
    }

    const coupon = await PromoCode.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, error: "Coupon not found." });
    }

    if (coupon.status === "Used") {
      return res.status(400).json({ success: false, error: "Cannot assign an already used coupon." });
    }

    if (coupon.assignedName) {
      return res.status(400).json({ success: false, error: "Coupon is already assigned." });
    }

    coupon.assignedName = assignedName.trim();
    coupon.assignedEmail = assignedEmail.trim().toLowerCase();
    coupon.assignedAt = new Date();
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon assigned successfully.",
      coupon,
    });
  } catch (error) {
    next(error);
  }
}

export async function seedCouponsHandler(req, res, next) {
  try {
    const PACKAGE_PREFIX = {
      Starter: "ST",
      Deluxe: "DE",
      Ultimate: "UL",
      "Pro Plan": "PP",
      Unlimited: "UN",
    };
    const TOTAL_PER_PACKAGE = 100;

    const existingCount = await PromoCode.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ success: false, error: "Database already contains coupons. No seeding performed." });
    }

    const allCouponsToInsert = [];
    const usedCodesSet = new Set();

    for (const [pkgName, prefix] of Object.entries(PACKAGE_PREFIX)) {
      for (let i = 1; i <= TOTAL_PER_PACKAGE; i++) {
        let uniqueCode = "";
        do {
          const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
          uniqueCode = `${prefix}-${randomSuffix}`;
        } while (usedCodesSet.has(uniqueCode));

        usedCodesSet.add(uniqueCode);
        allCouponsToInsert.push({
          code: uniqueCode,
          packageName: pkgName,
          status: "Unused",
          assignedName: null,
          assignedEmail: null,
          usedByEmail: null,
          assignedAt: null,
          usedAt: null,
        });
      }
    }

    await PromoCode.insertMany(allCouponsToInsert);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${allCouponsToInsert.length} coupons (100 per package).`,
      count: allCouponsToInsert.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCouponStatsHandler(req, res, next) {
  try {
    const PACKAGES = ["Starter", "Deluxe", "Ultimate", "Pro Plan", "Unlimited"];

    const statsList = await Promise.all(
      PACKAGES.map(async (pkg) => {
        const [total, used, unused, assigned] = await Promise.all([
          PromoCode.countDocuments({ packageName: pkg }),
          PromoCode.countDocuments({ packageName: pkg, status: "Used" }),
          PromoCode.countDocuments({ packageName: pkg, status: "Unused" }),
          PromoCode.countDocuments({ packageName: pkg, assignedName: { $ne: null } }),
        ]);

        return {
          packageName: pkg,
          total,
          used,
          unused,
          assigned,
          unassigned: Math.max(0, total - assigned),
        };
      })
    );

    return res.status(200).json({ success: true, stats: statsList, data: statsList });
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

/* ── Packages Handlers ─────────────────────────────────────────────── */

export async function getAdminPackagesHandler(req, res, next) {
  try {
    let packages = await Package.find().sort({ order: 1 });
    if (packages.length === 0) {
      packages = await Package.insertMany(DEFAULT_PACKAGES);
    }
    return res.status(200).json({ success: true, packages, data: packages });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminPackageHandler(req, res, next) {
  try {
    const { name, originalPrice, discountedPrice, tagline, badge, features, credits, expiryDays, active } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Package name is required." });
    }

    const updated = await Package.findOneAndUpdate(
      { name: name.trim() },
      {
        $set: {
          originalPrice: Number(originalPrice),
          discountedPrice: Number(discountedPrice),
          tagline,
          badge,
          features,
          credits: Number(credits),
          expiryDays: Number(expiryDays),
          active: active !== undefined ? active : true,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: "Package not found." });
    }

    return res.status(200).json({ success: true, package: updated, message: "Package updated successfully." });
  } catch (error) {
    next(error);
  }
}

export async function seedAdminPackagesHandler(req, res, next) {
  try {
    const count = await Package.countDocuments();
    if (count > 0) {
      return res.status(400).json({ success: false, error: "Database already contains packages." });
    }
    const created = await Package.insertMany(DEFAULT_PACKAGES);
    return res.status(201).json({ success: true, packages: created, message: "Packages seeded successfully." });
  } catch (error) {
    next(error);
  }
}

/* ── Payments History Handlers ─────────────────────────────────────── */

export async function getAdminPaymentsHandler(req, res, next) {
  try {
    const { page = 1, limit = 50, search } = req.query;

    const rawTxs = await PaymentTransaction.find()
      .populate("employerId", "orgName contactName email")
      .sort({ createdAt: -1 });

    const totalRevenue = rawTxs
      .filter((t) => t.paymentStatus === "paid" || t.paymentStatus === "completed")
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    const totalSales = rawTxs.length;
    const promoCodesUsedCount = rawTxs.filter((t) => !!t.promoCodeUsed).length;

    const formattedTxs = rawTxs.map((tx) => {
      const emp = tx.employerId || {};
      return {
        _id: tx._id,
        employerName: emp.orgName || emp.contactName || "Employer",
        employerEmail: emp.email || "N/A",
        packageName: tx.packageName || "Package",
        creditsAdded: tx.creditsAdded || 1,
        unlimitedJobs: tx.packageName === "Unlimited",
        jobPostExpiryDays: 180,
        amount: tx.amount || 0,
        promoCodeUsed: tx.promoCodeUsed || null,
        paymentMethod: tx.paymentMethod || tx.paymentProvider || "Stripe",
        status: tx.paymentStatus || "completed",
        purchasedAt: tx.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      transactions: formattedTxs,
      payments: formattedTxs,
      stats: {
        totalRevenue,
        totalSales,
        promoCodesUsedCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ── Dashboard Stats Handler ───────────────────────────────────────── */

export async function getAdminDashboardStatsHandler(req, res, next) {
  try {
    const [totalJobs, totalEmployers, totalTransactions, totalCoupons, activeJobsCount] = await Promise.all([
      Job.countDocuments(),
      Employer.countDocuments(),
      PaymentTransaction.countDocuments(),
      PromoCode.countDocuments(),
      Job.countDocuments({ status: "active" }),
    ]);

    // Calculate total revenue
    const successfulPayments = await PaymentTransaction.find({ status: "completed" });
    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + (curr.amountPaid || curr.amount || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalEmployers,
        totalTransactions,
        totalCoupons,
        activeJobsCount,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
}
