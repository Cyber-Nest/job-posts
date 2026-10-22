import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse All Indigenous & Aboriginal Jobs Across Canada",
  description:
    "Explore active First Nations, Métis, and Inuit job postings across British Columbia, Ontario, Alberta, Saskatchewan, and all Canadian territories. Filter by sector, salary, and remote work.",
  alternates: {
    canonical: "/jobs",
  },
  openGraph: {
    title: "Browse Indigenous & Aboriginal Jobs Across Canada | Aboriginal Jobs Canada",
    description:
      "Find inclusive career opportunities for First Nations, Métis, and Inuit talent with Canadian employers.",
    url: "https://aboriginal-jobs.ca/jobs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Indigenous & Aboriginal Jobs Across Canada",
    description:
      "Find inclusive career opportunities for First Nations, Métis, and Inuit talent with Canadian employers.",
  },
  keywords: [
    "Indigenous jobs Canada",
    "Aboriginal job board",
    "First Nations careers",
    "Métis jobs",
    "Inuit job opportunities",
    "Remote Indigenous jobs",
    "Canada inclusive employers",
  ],
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
