import { transporter } from "./transporter";

export const sendOTP = async (
  email: string,
  otp: string,
  purpose: "registration" | "password_reset" | "admin_change" = "registration"
) => {
  try {
    // Dynamic Content
    const emailContent = {
      registration: {
        subject: "Verify your email address - GetJobsCanada",
        heading: "Verify Your Email Address",
        subHeading: "Welcome to GetJobsCanada. Please verify your email to complete your registration.",
        instruction: "Enter the 6-digit verification code below to activate your account:",
      },

      password_reset: {
        subject: "Reset your password - GetJobsCanada",
        heading: "Reset Your Password",
        subHeading: "We received a request to reset your password for your GetJobsCanada account.",
        instruction: "Use the verification code below to proceed with resetting your password:",
      },

      admin_change: {
        subject: "Admin verification code - GetJobsCanada",
        heading: "Admin Credential Change",
        subHeading: "We received a request to update your admin credentials.",
        instruction: "Enter the verification code below to confirm this administrative change:",
      },
    };

    const content = emailContent[purpose];

    // Plain text alternative (Crucial for preventing Spam classification)
    const textBody = `
${content.heading}

${content.subHeading}
${content.instruction}

VERIFICATION CODE: ${otp}

Important Security Notes:
- This verification code will expire in 10 minutes.
- Do not share this code with anyone. GetJobsCanada support will never ask for your code.
- If you did not request this email, you can safely ignore it.

© ${new Date().getFullYear()} GetJobsCanada. All rights reserved.
`.trim();

    // Send Email with both HTML and Plain Text
    const info = await transporter.sendMail({
      from: `"GetJobsCanada" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: content.subject,
      text: textBody,
      headers: {
        "X-Auto-Response-Suppress": "OOF, AutoReply",
        "X-Priority": "3",
        "Importance": "Normal"
      },
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>${content.subject}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:32px 16px;">
          <tr>
            <td align="center">
              <!-- Main Card Container -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                
                <!-- Brand Header -->
                <tr>
                  <td align="center" style="background-color:#0f172a; padding:28px 24px; border-bottom:3px solid #c8782a;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <span style="font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">GetJobs<span style="color:#c8782a;">Canada</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding:36px 32px 28px 32px;">
                    
                    <h1 style="margin:0 0 12px 0; color:#0f172a; font-size:22px; font-weight:700; line-height:1.3; text-align:left;">
                      ${content.heading}
                    </h1>

                    <p style="margin:0 0 16px 0; color:#475569; font-size:15px; line-height:1.6;">
                      ${content.subHeading}
                    </p>

                    <p style="margin:0 0 28px 0; color:#475569; font-size:15px; line-height:1.6;">
                      ${content.instruction}
                    </p>

                    <!-- OTP Code Box Container -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                      <tr>
                        <td align="center">
                          <div style="background-color:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:20px 24px; display:inline-block; width:100%; box-sizing:border-box; text-align:center;">
                            <span style="display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; margin-bottom:8px;">Verification Code</span>
                            <div style="font-family:'Courier New', Courier, monospace; font-size:38px; font-weight:800; letter-spacing:10px; color:#c8782a; margin:4px 0;">
                              ${otp}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Alert Card -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#fffbe6; border:1px solid #ffe58f; border-radius:10px; padding:16px; margin-bottom:24px;">
                      <tr>
                        <td style="font-size:13px; line-height:1.6; color:#714500;">
                          <strong style="color:#8c5400;">Security Reminder:</strong>
                          <ul style="margin:6px 0 0 0; padding-left:18px;">
                            <li>This code is valid for <strong>10 minutes</strong>.</li>
                            <li>Never share this code with anyone. Our support team will never ask for it.</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- Safe Ignore note -->
                    <p style="margin:0; color:#94a3b8; font-size:13px; line-height:1.5;">
                      If you didn’t request this verification code, no action is needed. You can safely ignore this email.
                    </p>

                  </td>
                </tr>

                <!-- Clean Footer -->
                <tr>
                  <td style="padding:20px 32px; background-color:#f8fafc; border-top:1px solid #f1f5f9; text-align:center;">
                    <p style="margin:0 0 6px 0; color:#94a3b8; font-size:12px; font-weight:500;">
                      Official email from GetJobsCanada
                    </p>
                    <p style="margin:0; color:#cbd5e1; font-size:12px;">
                      &copy; ${new Date().getFullYear()} GetJobsCanada. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("SMTP Error:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });

    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

