import { transporter } from "./transporter";

export const sendOTP = async (
  email: string,
  otp: string,
  purpose: "registration" | "password_reset" | "admin_change" = "registration",
) => {
  try {
    // Dynamic Content
    const emailContent = {
      registration: {
        subject: "Aboriginal Jobs Canada | Verify Your Email",
        heading: "Verify Your Email Address",
        subHeading:
          "Welcome to Aboriginal Jobs Canada. Please verify your email to continue.",
        instruction:
          "Use the verification code below to complete your registration process.",
      },

      password_reset: {
        subject: "Aboriginal Jobs Canada | Reset Your Password",
        heading: "Password Reset Request",
        subHeading: "We received a request to reset your password.",
        instruction:
          "Use the verification code below to continue resetting your password.",
      },

      admin_change: {
        subject: "Aboriginal Jobs Canada | Admin Credential Change OTP",
        heading: "Admin Credential Change Verification",
        subHeading: "We received a request to change your admin email and/or password.",
        instruction:
          "Use the verification code below to verify your identity and confirm these changes.",
      },
    };

    const content = emailContent[purpose];

    // Send Email
    const info = await transporter.sendMail({
      from: `"Aboriginal Jobs Canada" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: content.subject,

      html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${content.subject}</title>
      </head>

      <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#f5f5f5; padding:40px 15px;">

          <tr>
            <td align="center">

              <!-- Main Container -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="max-width:550px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5e5;">

                <!-- Header -->
                <tr>
                  <td align="center"
                    style="background:#C8782A; padding:32px 20px;">

                    <h1
                      style="margin:0; color:#ffffff; font-size:28px; font-weight:700;">
                      Aboriginal Jobs Canada
                    </h1>

                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 30px;">

                    <h2
                      style="margin:0 0 15px; color:#222222; font-size:24px; font-weight:700;">
                      ${content.heading}
                    </h2>

                    <p
                      style="margin:0 0 20px; color:#555555; font-size:15px; line-height:1.7;">
                      ${content.subHeading}
                    </p>

                    <p
                      style="margin:0 0 30px; color:#555555; font-size:15px; line-height:1.7;">
                      ${content.instruction}
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center; margin:35px 0;">

                      <div
                        style="display:inline-block; background:#fafafa; border:1px solid #dddddd; border-radius:12px; padding:20px 35px;">

                        <p
                          style="margin:0 0 10px; color:#777777; font-size:13px;">
                          Verification Code
                        </p>

                        <div
                          style="font-size:36px; font-weight:700; letter-spacing:8px; color:#C8782A; font-family:monospace;">
                          ${otp}
                        </div>

                      </div>

                    </div>

                    <!-- Info Box -->
                    <div
                      style="background:#fafafa; border:1px solid #eeeeee; border-radius:10px; padding:18px;">

                      <p
                        style="margin:0 0 10px; color:#555555; font-size:14px;">
                        ⏳ This OTP will expire in 10 minutes.
                      </p>

                      <p
                        style="margin:0; color:#555555; font-size:14px;">
                        🔒 Never share this code with anyone.
                      </p>

                    </div>

                    <!-- Ignore -->
                    <p
                      style="margin:30px 0 0; color:#888888; font-size:13px; line-height:1.6;">
                      If you didn’t request this email, you can safely ignore it.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="padding:22px 20px; background:#fafafa; border-top:1px solid #eeeeee; text-align:center;">

                    <p
                      style="margin:0; color:#888888; font-size:12px;">
                      © ${new Date().getFullYear()} Aboriginal Jobs Canada. All rights reserved.
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
