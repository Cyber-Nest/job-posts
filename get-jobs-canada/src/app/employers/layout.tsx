import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employers — Hire Canadian Talent & Post Job Vacancies",
  description:
    "Post job openings and reach thousands of verified Canadian professionals, skilled tradespeople, and remote workers on GetJobsCanada.",
  alternates: {
    canonical: "https://getjobscanada.ca/employers",
  },
  openGraph: {
    title: "Hire Top Talent in Canada | GetJobsCanada for Employers",
    description:
      "Find qualified candidates faster. Post your open positions to Canada's fastest-growing employment board.",
    url: "https://getjobscanada.ca/employers",
  },
};

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
