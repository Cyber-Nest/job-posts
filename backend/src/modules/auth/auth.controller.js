import crypto from "crypto";
import mongoose from "mongoose";
import { Employer } from "../employers/employer.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { EmployerPackageHistory } from "../packages/employerPackageHistory.model.js";
import { sendOtpEmail, resolveSiteFromRequest } from "../../utils/mailer.js";
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
    const site = resolveSiteFromRequest(req);
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

    logger.info(`[AUTH] Verification OTP generated for ${cleanEmail} (site: ${site}): ${otpCode}`);

    // Send Email
    try {
      await sendOtpEmail(cleanEmail, otpCode, { site, type: "verification" });
      logger.info(`[AUTH] Verification OTP email dispatched to ${cleanEmail} for site: ${site}`);
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
    const site = resolveSiteFromRequest(req);
    const employerOrgName = company || name || "Company";
    let employer = await Employer.findOne({
      $or: [{ authUserId: String(userId) }, { email: cleanEmail }],
    });
    if (!employer) {
      employer = await Employer.create({
        authUserId: String(userId),
        site: site,
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

    // Auto-provision 1 Free Credit for new Employer
    let existingPackage = await EmployerPackage.findOne({ employerId: employer._id });
    if (!existingPackage) {
      const freePackage = await EmployerPackage.create({
        employerId: employer._id,
        packageName: "Free Plan",
        remainingCredits: 1,
        totalCreditsPurchased: 1,
        unlimitedJobs: false,
        isFreePlan: true,
        jobPostExpiryDays: 30,
        status: "Active",
        purchasedAt: new Date(),
      });

      employer.currentPackageId = freePackage._id;
      await employer.save();

      await EmployerPackageHistory.create({
        employerId: employer._id,
        packageName: "Free Plan",
        creditsAdded: 1,
        unlimitedJobs: false,
        isFreePlan: true,
        paymentStatus: "paid",
        paymentProvider: "free_registration",
        amount: 0,
        currency: "CAD",
        jobPostExpiryDays: 30,
        purchasedAt: new Date(),
      });
      logger.info(`[AUTH] 1 Free Credit successfully provisioned for employer ${employer._id} (${cleanEmail})`);
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

    const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
    res.cookie("better-auth.session_token", sessionToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
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
        role: "employer",
      },
      session: {
        token: sessionToken,
        expiresAt: expiresAt,
        userId: String(userId),
        user: {
          id: String(userId),
          email: cleanEmail,
          name: newUserDoc.name,
          role: "employer",
        },
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
    const { email, password, identifier } = req.body;
    const inputId = email || identifier;
    if (!inputId || !password) {
      return res.status(400).json({ success: false, error: "Email or username and password are required" });
    }

    const cleanIdentifier = inputId.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userCollection = db.collection("user");

    const userDoc = await userCollection.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier },
      ],
    });
    if (!userDoc) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const cleanEmail = (userDoc.email || cleanIdentifier).toLowerCase().trim();

    let passwordHash = userDoc.password;
    if (!passwordHash) {
      // Fallback: Check 'account' or 'accounts' collection from existing auth data
      const accountDoc =
        (await db.collection("account").findOne({
          $or: [
            { userId: userDoc._id },
            { userId: String(userDoc._id) },
            { providerAccountId: cleanEmail },
          ],
        })) ||
        (await db.collection("accounts").findOne({
          $or: [
            { userId: userDoc._id },
            { userId: String(userDoc._id) },
            { providerAccountId: cleanEmail },
          ],
        }));
      if (accountDoc && accountDoc.password) {
        passwordHash = accountDoc.password;
      }
    }

    if (!passwordHash) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const isValidPw = comparePasswordSync(password, passwordHash);
    if (!isValidPw) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Auto-provision 1 free credit if existing employer doesn't have a package yet
    const employer = await Employer.findOne({
      $or: [
        { authUserId: String(userDoc._id) },
        { authUserId: userDoc._id },
        { email: cleanEmail },
      ],
    });

    if (employer) {
      const anyPkg = await EmployerPackage.findOne({ employerId: employer._id });
      if (!anyPkg) {
        const freePkg = await EmployerPackage.create({
          employerId: employer._id,
          packageName: "Free Plan",
          remainingCredits: 1,
          totalCreditsPurchased: 1,
          unlimitedJobs: false,
          isFreePlan: true,
          jobPostExpiryDays: 30,
          status: "Active",
          purchasedAt: new Date(),
        });
        employer.currentPackageId = freePkg._id;
        await employer.save();
        await EmployerPackageHistory.create({
          employerId: employer._id,
          packageName: "Free Plan",
          creditsAdded: 1,
          unlimitedJobs: false,
          isFreePlan: true,
          paymentStatus: "paid",
          paymentProvider: "free_registration",
          amount: 0,
          currency: "CAD",
          jobPostExpiryDays: 30,
          purchasedAt: new Date(),
        });
        logger.info(`[AUTH] Auto-provisioned free credit for logging-in employer ${employer._id}`);
      }
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

    const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
    res.cookie("better-auth.session_token", sessionToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      expires: expiresAt,
      path: "/",
    });

    const userPayload = {
      id: String(userDoc._id),
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role || "employer",
      accountType: userDoc.accountType || userDoc.role || "employer",
    };

    return res.status(200).json({
      success: true,
      user: userPayload,
      session: {
        token: sessionToken,
        expiresAt: expiresAt,
        userId: String(userDoc._id),
        user: userPayload,
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
    let userQuery = { _id: sessionDoc.userId };
    if (typeof sessionDoc.userId === "string" && mongoose.Types.ObjectId.isValid(sessionDoc.userId)) {
      userQuery = { $or: [{ _id: sessionDoc.userId }, { _id: new mongoose.Types.ObjectId(sessionDoc.userId) }] };
    }

    const userDoc = await userCollection.findOne(userQuery);

    if (!userDoc) {
      return res.status(200).json({ session: null, user: null });
    }

    const userData = {
      id: String(userDoc._id),
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role || "employer",
      accountType: userDoc.accountType || userDoc.role || "employer",
    };

    return res.status(200).json({
      session: {
        id: String(sessionDoc._id),
        userId: String(userDoc._id),
        expiresAt: sessionDoc.expiresAt,
        token: token,
        user: userData,
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
    const { email, identifier } = req.body;
    const inputId = email || identifier;
    if (!inputId) {
      return res.status(400).json({ success: false, error: "Email or username is required" });
    }

    const cleanIdentifier = inputId.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userDoc = await db.collection("user").findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
    });

    if (!userDoc) {
      return res.status(404).json({ success: false, error: "No account found with this email address" });
    }

    const cleanEmail = (userDoc.email || cleanIdentifier).toLowerCase().trim();
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

    const site = resolveSiteFromRequest(req);
    try {
      await sendOtpEmail(cleanEmail, otpCode, { site, type: "password_reset" });
    } catch (mailErr) {
      console.error("Failed to send reset OTP:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      _devOtp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/forgot-password/verify-otp
 */
export async function forgotPasswordVerifyOtpHandler(req, res, next) {
  try {
    const { email, identifier, otp } = req.body;
    const inputId = email || identifier;
    if (!inputId || !otp) {
      return res.status(400).json({ success: false, error: "Email and verification code are required" });
    }

    const cleanIdentifier = inputId.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userDoc = await db.collection("user").findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
    });

    const cleanEmail = (userDoc?.email || cleanIdentifier).toLowerCase().trim();
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
 * POST /api/v1/auth/forgot-password/reset
 */
export async function forgotPasswordResetHandler(req, res, next) {
  try {
    const { email, identifier, otp, newPassword, confirmPassword } = req.body;
    const inputId = email || identifier;
    const finalPassword = newPassword || confirmPassword;
    if (!inputId || !finalPassword) {
      return res.status(400).json({ success: false, error: "Email and new password are required" });
    }

    const cleanIdentifier = inputId.toLowerCase().trim();
    const db = mongoose.connection.db;
    const userDoc = await db.collection("user").findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
    });

    if (!userDoc) {
      return res.status(404).json({ success: false, error: "No account found with this email address" });
    }

    const cleanEmail = (userDoc.email || cleanIdentifier).toLowerCase().trim();
    const verificationCollection = db.collection("verification");

    let record = null;
    if (otp) {
      record = await verificationCollection.findOne({
        identifier: cleanEmail,
        value: String(otp).trim(),
      });
    } else {
      record = await verificationCollection.findOne({
        identifier: cleanEmail,
        verified: true,
      });
    }

    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Invalid or expired verification code" });
    }

    const hashedPassword = hashPasswordSync(finalPassword);

    // Update user collection
    await db.collection("user").updateOne(
      { _id: userDoc._id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    // Also update account and accounts collections if present
    await db.collection("account").updateMany(
      {
        $or: [
          { userId: userDoc._id },
          { userId: String(userDoc._id) },
          { providerAccountId: cleanEmail },
        ],
      },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    await db.collection("accounts").updateMany(
      {
        $or: [
          { userId: userDoc._id },
          { userId: String(userDoc._id) },
          { providerAccountId: cleanEmail },
        ],
      },
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
