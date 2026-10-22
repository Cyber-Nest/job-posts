import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Employers — Hire Inclusive Indigenous Talent Across Canada",
  description:
    "Partner with Canada's dedicated Indigenous job board. Reach First Nations, Métis, and Inuit candidates, fulfill TRC Call to Action 92, and build an inclusive workplace.",
  alternates: {
    canonical: "/employers",
  },
  openGraph: {
    title: "For Employers | Aboriginal Jobs Canada",
    description:
      "Connect with Canada's premier network of Indigenous job seekers and forward-thinking inclusive employers.",
    url: "https://aboriginal-jobs.ca/employers",
  },
};

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
