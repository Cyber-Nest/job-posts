import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Pricing & Job Posting Plans",
  description:
    "Affordable, transparent pricing plans for Canadian employers. Choose single job postings, featured boosts, or unlimited hiring packages on GetJobsCanada.",
  alternates: {
    canonical: "https://getjobscanada.ca/pricing",
  },
  openGraph: {
    title: "Job Posting Pricing & Packages | GetJobsCanada",
    description:
      "Transparent hiring packages designed for startups, growing businesses, and enterprise recruiters across Canada.",
    url: "https://getjobscanada.ca/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
