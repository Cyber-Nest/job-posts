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

export async function sendOtpEmail(toEmail, otpCode, subject = "Your GetJobsCanada Verification Code") {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    logger.warn("[MAILER] Nodemailer credentials missing in backend .env. Skipping actual email dispatch.");
    return true;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #059669; font-size: 20px; font-weight: 800; margin-bottom: 12px;">GetJobsCanada</h2>
      <p style="color: #334155; font-size: 14px; margin-bottom: 20px;">Use the verification code below to complete your authentication process. This code will expire in 10 minutes.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #a7f3d0; padding: 16px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #059669;">${otpCode}</span>
      </div>

      <p style="color: #64748b; font-size: 12px;">If you did not request this verification code, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: env.EMAIL_FROM || `"GetJobsCanada" <${env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: html,
  });

  return true;
}
