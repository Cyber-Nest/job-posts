import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch with GetJobsCanada",
  description:
    "Have questions about posting a job or finding employment in Canada? Contact our support team for employer inquiries, candidate assistance, and partnerships.",
  alternates: {
    canonical: "https://getjobscanada.ca/contact",
  },
  openGraph: {
    title: "Contact GetJobsCanada Support Team",
    description:
      "Get in touch with GetJobsCanada for recruiting support, job seeker help, and advertising inquiries.",
    url: "https://getjobscanada.ca/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
