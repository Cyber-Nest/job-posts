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
  metadataBase: new URL("https://aboriginal-jobs.ca"),

  title: {
    default: "Aboriginal Jobs Canada — Canada's Indigenous Job Platform",
    template: "%s | Aboriginal Jobs Canada",
  },

  description:
    "Aboriginal Jobs Canada connects First Nations, Métis, and Inuit job seekers with inclusive employers across Canada. Find jobs, post opportunities, and build your career.",

  keywords: [
    "Indigenous jobs Canada",
    "First Nations jobs",
    "Métis jobs",
    "Inuit careers",
    "Canada job board",
    "Indigenous employment",
    "Aboriginal jobs",
    "Canadian careers",
    "remote jobs Canada",
    "inclusive employers",
  ],

  authors: [{ name: "Aboriginal Jobs Canada" }],
  creator: "Aboriginal Jobs Canada",
  publisher: "Aboriginal Jobs Canada",

  icons: {
    icon: "/logo.svg",
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
    url: "https://aboriginal-jobs.ca",
    siteName: "Aboriginal Jobs Canada",
    title: "Aboriginal Jobs Canada — Canada's Indigenous Job Platform",
    description:
      "Find inclusive jobs across Canada for First Nations, Métis, and Inuit communities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aboriginal Jobs Canada",
      },
    ],
  },

  //add in future, img
  twitter: {
    card: "summary_large_image",
    title: "Aboriginal Jobs Canada",
    description:
      "Canada's Indigenous job platform connecting talent with inclusive employers.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://aboriginal-jobs.ca",
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
