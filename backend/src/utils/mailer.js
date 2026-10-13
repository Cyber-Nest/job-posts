import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

/**
 * Returns brand metadata for a given site ID
 */
export function getSiteBrandConfig(siteId = "getjobscanada") {
  const normalized = String(siteId || "getjobscanada").toLowerCase().trim();

  if (normalized.includes("aboriginal")) {
    return {
      siteId: "aboriginal",
      name: "Aboriginal Jobs Canada",
      shortName: "Aboriginal Jobs",
      primaryColor: "#C8782A",
      primaryDark: "#A85D1A",
      bgLight: "#FDF8F3",
      borderColor: "#F3E2CE",
      footerText: "Aboriginal Jobs Canada - Dedicated to Indigenous Career Opportunities.",
      domain: "aboriginal-jobs.ca",
    };
  }

  if (normalized.includes("youth")) {
    return {
      siteId: "youthemployment",
      name: "Youth Employment Canada",
      shortName: "Youth Employment",
      primaryColor: "#2563EB",
      primaryDark: "#1D4ED8",
      bgLight: "#EFF6FF",
      borderColor: "#BFDBFE",
      footerText: "Youth Employment Canada - Empowering Young Canadian Talent in the Workforce.",
      domain: "youthemployment.ca",
    };
  }

  // Default: GetJobsCanada
  return {
    siteId: "getjobscanada",
    name: "GetJobsCanada",
    shortName: "GetJobsCanada",
    primaryColor: "#059669",
    primaryDark: "#047857",
    bgLight: "#F0FDF4",
    borderColor: "#A7F3D0",
    footerText: "GetJobsCanada - Connecting Canadian Talent with Top Employers.",
    domain: "getjobscanada.ca",
  };
}

/**
 * Resolves site ID from Express request headers, body, or origin/referer
 */
export function resolveSiteFromRequest(req) {
  if (!req) return "getjobscanada";

  // 1. Direct header
  const headerSite = req.headers?.["x-site-id"] || req.headers?.["site-id"];
  if (headerSite) {
    const s = String(headerSite).toLowerCase().trim();
    if (s.includes("aboriginal")) return "aboriginal";
    if (s.includes("youth")) return "youthemployment";
    if (s.includes("getjobs")) return "getjobscanada";
    return s;
  }

  // 2. Request body
  const bodySite = req.body?.site;
  if (bodySite) {
    const s = String(bodySite).toLowerCase().trim();
    if (s.includes("aboriginal")) return "aboriginal";
    if (s.includes("youth")) return "youthemployment";
    if (s.includes("getjobs")) return "getjobscanada";
    return s;
  }

  // 3. Query params
  const querySite = req.query?.site;
  if (querySite) {
    const s = String(querySite).toLowerCase().trim();
    if (s.includes("aboriginal")) return "aboriginal";
    if (s.includes("youth")) return "youthemployment";
    if (s.includes("getjobs")) return "getjobscanada";
    return s;
  }

  // 4. Origin & Referer detection
  const origin = String(req.headers?.origin || req.headers?.referer || "").toLowerCase();
  if (origin.includes("aboriginal") || origin.includes("3002")) return "aboriginal";
  if (origin.includes("youth") || origin.includes("3001")) return "youthemployment";
  if (origin.includes("getjobs") || origin.includes("3000")) return "getjobscanada";

  return "getjobscanada";
}

/**
 * Sends a branded OTP verification email customized per site
 */
export async function sendOtpEmail(toEmail, otpCode, options = {}) {
  let site = "getjobscanada";
  let subject = null;
  let type = "verification"; // "verification" | "password_reset" | "security"

  if (typeof options === "string") {
    subject = options;
    if (options.toLowerCase().includes("aboriginal")) site = "aboriginal";
    else if (options.toLowerCase().includes("youth")) site = "youthemployment";
  } else if (options && typeof options === "object") {
    site = options.site || "getjobscanada";
    subject = options.subject || null;
    type = options.type || "verification";
  }

  const brand = getSiteBrandConfig(site);

  if (!subject) {
    if (type === "password_reset") {
      subject = `Reset Your Password - ${brand.name}`;
    } else {
      subject = `Your ${brand.name} Verification Code`;
    }
  }

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    logger.warn(`[MAILER] Nodemailer credentials missing in backend .env. Skipping actual email dispatch for ${brand.name} to ${toEmail}.`);
    return true;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 520px; margin: 32px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Header Banner -->
        <div style="background-color: ${brand.primaryColor}; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
            ${brand.name}
          </h1>
        </div>

        <!-- Body Content -->
        <div style="padding: 32px;">
          <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 20px; font-weight: 700;">
            ${type === "password_reset" ? "Reset Your Password" : "Verify Your Account"}
          </h2>
          <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
            Use the 6-digit verification code below to complete your authentication on <strong>${brand.name}</strong>. This code will expire in 10 minutes.
          </p>

          <!-- OTP Box -->
          <div style="background-color: ${brand.bgLight}; border: 2px dashed ${brand.borderColor}; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 28px;">
            <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: ${brand.primaryColor}; font-family: monospace;">
              ${otpCode}
            </span>
          </div>

          <p style="margin: 0 0 12px; color: #64748b; font-size: 13px; line-height: 1.5;">
            If you did not request this verification code, please ignore this email. No changes have been made to your account.
          </p>
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">
            For security, please never share this verification code with anyone.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
            ${brand.footerText}
          </p>
          <p style="margin: 8px 0 0; color: #94a3b8; font-size: 11px;">
            © ${new Date().getFullYear()} ${brand.name}. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${brand.name}" <${env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: html,
  });

  return true;
}
