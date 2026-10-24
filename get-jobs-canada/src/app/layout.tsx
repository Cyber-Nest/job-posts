import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getjobscanada.ca"),

  title: {
    default: "Jobs in Canada — Find Top Careers & Remote Work | GetJobsCanada",
    template: "%s | GetJobsCanada",
  },

  description:
    "Explore thousands of verified jobs in Canada. Connect with inclusive Canadian employers hiring across Ontario, British Columbia, Alberta, Quebec, and remote roles. Apply today on GetJobsCanada.",

  keywords: [
    "jobs in Canada",
    "Canada jobs",
    "Canada job board",
    "Canadian careers",
    "remote jobs Canada",
    "work in Canada",
    "Canada job search",
    "jobs in Ontario",
    "jobs in Toronto",
    "jobs in Vancouver",
    "jobs in Alberta",
    "IT jobs Canada",
    "healthcare jobs Canada",
    "GetJobsCanada",
    "verified Canadian employers",
  ],

  authors: [{ name: "GetJobsCanada", url: "https://getjobscanada.ca" }],
  creator: "GetJobsCanada",
  publisher: "GetJobsCanada",

  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

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
    type: "website",
    locale: "en_CA",
    url: "https://getjobscanada.ca",
    siteName: "GetJobsCanada",
    title: "Jobs in Canada — Find Top Careers & Remote Work | GetJobsCanada",
    description:
      "Search verified jobs across Canada. Top employers hiring full-time, part-time, and remote talent.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "GetJobsCanada — Canada's Leading Job Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jobs in Canada — Find Top Careers & Remote Work | GetJobsCanada",
    description:
      "Canada's leading job platform connecting talent with verified, inclusive employers.",
    images: ["/logo.svg"],
  },

  alternates: {
    canonical: "https://getjobscanada.ca",
  },

  category: "jobs",
};

// Global WebSite & Organization Schemas for Google AI Overviews & Sitelinks Search
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GetJobsCanada",
  alternateName: ["Get Jobs Canada", "GetJobsCanada.ca", "Canada Jobs Board"],
  url: "https://getjobscanada.ca",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://getjobscanada.ca/jobs?query={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GetJobsCanada",
  url: "https://getjobscanada.ca",
  logo: "https://getjobscanada.ca/logo.svg",
  description:
    "GetJobsCanada is a Canadian job portal connecting job seekers with inclusive employers across all Canadian provinces and territories.",
  sameAs: [
    "https://www.linkedin.com/company/getjobscanada",
    "https://twitter.com/getjobscanada",
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AppShell>{children}</AppShell>

          {/*Toast UI */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
              duration: 4000,

              style: {
                background: "#fff",
                color: "#1C1C1C",
                border: "1px solid rgba(200, 120, 42, 0.15)",
                borderRadius: "16px",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)",
              },

              success: {
                iconTheme: {
                  primary: "#16A34A",
                  secondary: "#ffffff",
                },
              },

              error: {
                iconTheme: {
                  primary: "#DC2626",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
