import { transporter } from "./transporter";

interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async ({
  firstName,
  lastName,
  email,
  subject,
  message,
}: ContactEmailProps) => {
  const subjectMap: Record<string, string> = {
    jobseeker: "Job Seeker",
    employer: "Employer",
    organization: "Indigenous Organization",
    other: "Other",
  };

  const userType = subjectMap[subject] || subject;

  return await transporter.sendMail({
    from: `"Aboriginal Jobs Canada" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: email,
    subject: `New Contact Form Submission - ${userType}`,

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#C8782A">
          New Contact Form Submission
        </h2>

        <p><strong>Name:</strong> ${firstName} ${lastName}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>User Type:</strong> ${userType}</p>

        <p><strong>Message:</strong></p>

        <div
          style="
            background:#f8f8f8;
            padding:15px;
            border-radius:8px;
            border:1px solid #ddd;
            white-space:pre-wrap;
          "
        >
          ${message}
        </div>
      </div>
    `,
  });
};
