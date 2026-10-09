"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { Suspense, lazy, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

import CookieBannerErrorBoundary from "@/components/CookieBannerErrorBoundary";
import Header from "@/layouts/parts/Header";
import Footer from "@/layouts/parts/Footer";
import Website from "@/layouts/Website";

const CookieBanner = lazy(() =>
  import("@/components/CookieBanner").catch(() => ({
    default: () => null,
  })),
);

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    [],
  );

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {isAdminRoute ? (
          children
        ) : (
          <Website>
            <Header />
            {children}
            <Footer />
          </Website>
        )}

        <CookieBannerErrorBoundary>
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
        </CookieBannerErrorBoundary>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            },
            success: {
              style: {
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
              },
              iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
            },
            error: {
              style: {
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
              },
              iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
