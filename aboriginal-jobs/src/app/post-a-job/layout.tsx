import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job — Reach Indigenous & Aboriginal Talent Across Canada",
  description:
    "Post job opportunities to reach skilled First Nations, Métis, and Inuit professionals across Canada. Meet DEI commitments and support Truth and Reconciliation Call to Action #92.",
  alternates: {
    canonical: "/post-a-job",
  },
  openGraph: {
    title: "Post a Job | Aboriginal Jobs Canada",
    description:
      "Connect with thousands of qualified Indigenous job seekers across Canada. Fast posting, direct applications, and maximum visibility.",
    url: "https://aboriginal-jobs.ca/post-a-job",
  },
  keywords: [
    "Post Indigenous jobs Canada",
    "Post Aboriginal jobs",
    "Hire First Nations talent",
    "Indigenous diversity recruitment",
    "Canadian inclusive hiring",
    "TRC 92 employer recruitment",
  ],
};

export default function PostAJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
