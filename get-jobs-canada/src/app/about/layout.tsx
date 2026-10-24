import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Canada's Leading Employment Network",
  description:
    "Learn how GetJobsCanada connects top Canadian talent with inclusive employers across every province and territory. Discover our mission, values, and community impact.",
  alternates: {
    canonical: "https://getjobscanada.ca/about",
  },
  openGraph: {
    title: "About GetJobsCanada — Empowering Canadian Careers",
    description:
      "Bridging the gap between Canadian employers and qualified talent with verified, transparent job opportunities.",
    url: "https://getjobscanada.ca/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
