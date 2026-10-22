import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Job Seekers — Indigenous & Aboriginal Career Pathways in Canada",
  description:
    "Find meaningful careers with employers who value Indigenous perspectives. Access opportunities for First Nations, Métis, and Inuit professionals across all Canadian provinces.",
  alternates: {
    canonical: "/job-seekers",
  },
  openGraph: {
    title: "For Job Seekers | Aboriginal Jobs Canada",
    description:
      "Explore inclusive jobs, remote work options, and community-focused careers tailored for Indigenous job seekers.",
    url: "https://aboriginal-jobs.ca/job-seekers",
  },
};

export default function JobSeekersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
