import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Posting Pricing & Recruitment Packages",
  description:
    "Affordable job posting packages for Canadian employers. Standard, Featured, and Enterprise packages to reach First Nations, Métis, and Inuit job seekers.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing & Packages | Aboriginal Jobs Canada",
    description:
      "Simple, transparent pricing to hire top Indigenous talent across Canada.",
    url: "https://aboriginal-jobs.ca/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
