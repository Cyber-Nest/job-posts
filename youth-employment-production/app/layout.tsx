import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://youthemployment.ca"),

  title:
    "Youth Employment Canada | Jobs for Young Canadians & Hiring Employers",

  description:
    "Youth Employment Canada connects young Canadians with inclusive employers across Canada. Explore job opportunities, hire youth talent, post jobs, and build the future workforce.",

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  keywords: [
    "Youth Employment Canada",
    "Canada jobs",
    "Jobs for youth",
    "Youth jobs Canada",
    "Canadian employers",
    "Hiring young workers",
    "Student jobs Canada",
    "Entry level jobs Canada",
    "Career opportunities Canada",
    "Job board Canada",
  ],

  openGraph: {
    title:
      "Youth Employment Canada | Jobs for Young Canadians & Hiring Employers",

    description:
      "Discover youth employment opportunities across Canada. Connect with employers, post jobs, and grow your career with Youth Employment Canada.",

    url: "https://youthemployment.ca",

    siteName: "Youth Employment Canada",

    locale: "en_CA",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Youth Employment Canada | Jobs for Young Canadians & Hiring Employers",

    description:
      "Find jobs, connect with employers, and explore career opportunities across Canada.",
  },

  alternates: {
    canonical: "https://youthemployment.ca",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
