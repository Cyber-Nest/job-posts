import crypto from "crypto";
import mongoose from "mongoose";
import { Employer } from "../employers/employer.model.js";
import { sendOtpEmail } from "../../utils/mailer.js";
import { hashPasswordSync, comparePasswordSync } from "../../utils/password.js";
import { logger } from "../../utils/logger.js";

/**
 * POST /api/v1/auth/otp/send
 * Sends registration OTP code
 */
export async function sendOtpHandler(req, res, next) {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = mongoose.connection.db;

    // Check if user already exists
    const userCollection = db.collection("user");
    const existingUser = await userCollection.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Account already exists. Please login instead.",
      });
    }

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Delete old OTPs for this identifier
    const verificationCollection = db.collection("verification");
    await verificationCollection.deleteMany({ identifier: cleanEmail });

    // Store new OTP
    await verificationCollection.insertOne({
      identifier: cleanEmail,
      value: otpCode,
      verified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      createdAt: new Date(),
    });

    logger.info(`[AUTH] Verification OTP generated for ${cleanEmail}: ${otpCode}`);

    // Send Email
    try {
      await sendOtpEmail(cleanEmail, otpCode, "Your GetJobsCanada Verification Code");
      logger.info(`[AUTH] Verification OTP email dispatched to ${cleanEmail}`);
    } catch (mailErr) {
      logger.error(`[AUTH] Failed to send OTP email to ${cleanEmail}`, { error: mailErr.message });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      _devOtp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/otp/verify
 * Verifies OTP code
 */
export async function verifyOtpHandler(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = mongoose.connection.db;
    const verificationCollection = db.collection("verification");

    const record = await verificationCollection.findOne({
      identifier: cleanEmail,
      value: String(otp).trim(),
    });

    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Invalid or expired verification code" });
    }

    await verificationCollection.updateOne(
      { _id: record._id },
      { $set: { verified: true } }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/register-employer
 * Registers a new employer account
 */
export async function registerEmployerHandler(req, res, next) {
  try {
    const { email, password, name, company, contactName, phone, city, province, address, postalCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userCollection = db.collection("user");

    const existingUser = await userCollection.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "An account with this email already exists" });
    }

    const hashedPassword = hashPasswordSync(password);
    const userId = new mongoose.Types.ObjectId();

    const newUserDoc = {
      _id: userId,
      email: cleanEmail,
      name: name || company || "Employer",
      password: hashedPassword,
      role: "employer",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userCollection.insertOne(newUserDoc);

    // Create or update Employer profile
    const employerOrgName = company || name || "Company";
    let employer = await Employer.findOne({ authUserId: String(userId) });
    if (!employer) {
      employer = await Employer.create({
        authUserId: String(userId),
        orgName: employerOrgName,
        contactName: contactName || name || "Hiring Team",
        email: cleanEmail,
        phone: phone || "",
        city: city || "",
        province: province || "",
        address: address || "",
        postalCode: postalCode || "",
      });
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionCollection = db.collection("session");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sessionCollection.insertOne({
      userId: userId,
      token: sessionToken,
      expiresAt: expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.cookie("better-auth.session_token", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: String(userId),
        email: cleanEmail,
        name: newUserDoc.name,
      },
      session: {
        token: sessionToken,
        expiresAt: expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/login
 * Authenticates user with email & password
 */
export async function loginHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userCollection = db.collection("user");

    const userDoc = await userCollection.findOne({ email: cleanEmail });
    if (!userDoc) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const isValidPw = comparePasswordSync(password, userDoc.password);
    if (!isValidPw) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionCollection = db.collection("session");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await sessionCollection.insertOne({
      userId: userDoc._id,
      token: sessionToken,
      expiresAt: expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.cookie("better-auth.session_token", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      user: {
        id: String(userDoc._id),
        email: userDoc.email,
        name: userDoc.name,
      },
      session: {
        token: sessionToken,
        expiresAt: expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/session & GET /api/v1/auth/me
 * Gets current active user session
 */
export async function getSessionHandler(req, res, next) {
  try {
    const token =
      req.cookies?.["better-auth.session_token"] ||
      req.cookies?.["__Secure-better-auth.session_token"] ||
      req.cookies?.["__Host-better-auth.session_token"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(200).json({ session: null, user: null });
    }

    const db = mongoose.connection.db;
    const sessionCollection = db.collection("session");
    const sessionDoc = await sessionCollection.findOne({ token });

    if (!sessionDoc || new Date(sessionDoc.expiresAt) < new Date()) {
      return res.status(200).json({ session: null, user: null });
    }

    const userCollection = db.collection("user");
    const userDoc = await userCollection.findOne({ _id: sessionDoc.userId });

    if (!userDoc) {
      return res.status(200).json({ session: null, user: null });
    }

    const userData = {
      id: String(userDoc._id),
      email: userDoc.email,
      name: userDoc.name,
    };

    return res.status(200).json({
      session: {
        id: String(sessionDoc._id),
        userId: String(userDoc._id),
        expiresAt: sessionDoc.expiresAt,
        token: token,
      },
      user: userData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/logout
 * Logs out user by clearing cookie and session
 */
export async function logoutHandler(req, res, next) {
  try {
    const token =
      req.cookies?.["better-auth.session_token"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const db = mongoose.connection.db;
      await db.collection("session").deleteMany({ token });
    }

    res.clearCookie("better-auth.session_token", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/forgot-password/send-otp
 */
export async function forgotPasswordSendOtpHandler(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userDoc = await db.collection("user").findOne({ email: cleanEmail });

    if (!userDoc) {
      return res.status(404).json({ success: false, error: "No account found with this email address" });
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const verificationCollection = db.collection("verification");

    await verificationCollection.deleteMany({ identifier: cleanEmail });
    await verificationCollection.insertOne({
      identifier: cleanEmail,
      value: otpCode,
      verified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date(),
    });

    try {
      await sendOtpEmail(cleanEmail, otpCode, "Reset Your Password - GetJobsCanada");
    } catch (mailErr) {
      console.error("Failed to send reset OTP:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/forgot-password/verify-otp
 */
export async function forgotPasswordVerifyOtpHandler(req, res, next) {
  return verifyOtpHandler(req, res, next);
}

/**
 * POST /api/v1/auth/forgot-password/reset
 */
export async function forgotPasswordResetHandler(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: "Email, OTP, and new password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = mongoose.connection.db;
    const verificationCollection = db.collection("verification");

    const record = await verificationCollection.findOne({
      identifier: cleanEmail,
      value: String(otp).trim(),
    });

    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Invalid or expired verification code" });
    }

    const hashedPassword = hashPasswordSync(newPassword);
    await db.collection("user").updateOne(
      { email: cleanEmail },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    await verificationCollection.deleteMany({ identifier: cleanEmail });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
}
