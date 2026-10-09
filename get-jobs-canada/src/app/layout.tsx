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
  //add in future, url
  metadataBase: new URL("https://getjobscanada.ca"),

  title: {
    default: "GetJobsCanada — Canada's Leading Job Platform",
    template: "%s | GetJobsCanada",
  },

  description:
    "GetJobsCanada connects job seekers with inclusive employers across Canada. Find jobs, post opportunities, and build your career.",

  keywords: [
    "GetJobsCanada",
    "Canada jobs",
    "Canada job board",
    "Canadian careers",
    "remote jobs Canada",
    "verified Canadian employers",
    "Ontario jobs",
    "BC jobs",
    "Alberta careers",
    "Quebec employment",
  ],

  authors: [{ name: "GetJobsCanada" }],
  creator: "GetJobsCanada",
  publisher: "GetJobsCanada",

  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
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

  //add in future,url
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://getjobscanada.ca",
    siteName: "GetJobsCanada",
    title: "GetJobsCanada — Canada's Leading Job Platform",
    description:
      "Find inclusive jobs across Canada for job seekers and top employers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GetJobsCanada",
      },
    ],
  },

  //add in future, img
  twitter: {
    card: "summary_large_image",
    title: "GetJobsCanada",
    description:
      "Canada's job platform connecting talent with inclusive employers.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://getjobscanada.ca",
  },

  category: "jobs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />
          </div> */}

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
