import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse All Jobs in Canada — Tech, Trades, Healthcare & Remote Roles",
  description:
    "Explore thousands of active, verified jobs across Canada. Filter by Canadian province, industry, NOC code, remote work, and competitive salaries on GetJobsCanada.",
  keywords: [
    "jobs in Canada",
    "Canada job board",
    "Canada job search",
    "Ontario jobs",
    "Toronto careers",
    "Vancouver jobs",
    "Alberta employment",
    "remote jobs Canada",
    "high paying jobs Canada",
  ],
  alternates: {
    canonical: "https://getjobscanada.ca/jobs",
  },
  openGraph: {
    title: "Browse All Jobs in Canada | GetJobsCanada",
    description:
      "Find your next career opportunity in Canada. Search verified listings across Ontario, BC, Alberta, and remote roles.",
    url: "https://getjobscanada.ca/jobs",
    type: "website",
    locale: "en_CA",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
