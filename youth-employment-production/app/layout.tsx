import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://youthemployment.ca"),

  title: {
    default: "Youth Employment Canada | Jobs for Young Canadians & Hiring Employers",
    template: "%s | Youth Employment Canada",
  },

  description:
    "Youth Employment Canada connects young Canadians and students with top inclusive employers across Canada. Search entry-level, student, part-time, and remote jobs nationwide.",

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  keywords: [
    "Jobs in Canada",
    "Youth Employment Canada",
    "Canada jobs",
    "Jobs for youth",
    "Youth jobs Canada",
    "Student jobs Canada",
    "Entry level jobs Canada",
    "Part time jobs Canada",
    "Summer jobs Canada",
    "Remote jobs Canada",
    "Canadian employers hiring youth",
    "Career opportunities Canada",
    "Job board Canada",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Youth Employment Canada | Jobs for Young Canadians & Hiring Employers",
    description:
      "Discover thousands of youth & student employment opportunities across Canada. Connect with employers, post jobs, and build your career.",
    url: "https://youthemployment.ca",
    siteName: "Youth Employment Canada",
    locale: "en_CA",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Youth Employment Canada | Jobs for Young Canadians & Hiring Employers",
    description:
      "Find entry-level, student, and youth jobs across Canada with top hiring employers.",
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Youth Employment Canada",
  url: "https://youthemployment.ca",
  description:
    "Canada's premier youth and student employment network connecting young job seekers with verified employers.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://youthemployment.ca/jobs?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Youth Employment Canada",
  legalName: "Youth Employment Canada Network",
  url: "https://youthemployment.ca",
  logo: {
    "@type": "ImageObject",
    url: "https://youthemployment.ca/logo.svg",
    width: "240",
    height: "60",
  },
  description:
    "A national Canadian employment resource connecting young job seekers, high school students, college and university graduates with verified inclusive employers across Canada.",
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  knowsAbout: [
    "Youth Employment in Canada",
    "Student Jobs in Canada",
    "Summer Jobs Canada",
    "Entry Level Jobs Canada",
    "Internships Canada",
    "Canadian Labor Standards",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "CA",
    addressRegion: "Canada",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "contact@youthemployment.ca",
    areaServed: "CA",
    availableLanguage: ["English", "French"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
