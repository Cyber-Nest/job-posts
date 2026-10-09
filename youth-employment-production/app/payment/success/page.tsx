"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/lib/auth/auth-client";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // States for verification flow
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isVerifying = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    if (isVerifying.current) return;
    isVerifying.current = true;

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/stripe/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment");
        }

        // Verification successful
        setLoading(false);
      } catch (err: any) {
        console.error("Verification Page Error:", err);
        setError(
          err.message || "Something went wrong while verifying payment.",
        );
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="bg-white border border-emerald-100 shadow-2xl rounded-3xl p-8 sm:p-10 text-center overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-70" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-70" />

      {/* LOADING STATE */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-800">
            Verifying Your Payment
          </h2>
          <p className="text-slate-500 text-xs mt-2 max-w-xs">
            Please hold tight while we securely confirm your transaction with
            Stripe and load your credits...
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="py-6 min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="w-24 h-24 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-6 shadow-inner">
              <XCircle size={52} className="text-rose-600" />
            </div>
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-rose-600 block mb-2">
              Verification Issue
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Couldn't Confirm Payment
            </h1>
            <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              {error}
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-2xl font-bold">
                Go to Dashboard
              </Button>
            </Link>
            <a href="mailto:support@yourdomain.com" className="flex-1">
              <Button
                variant="outline"
                className="w-full py-6 rounded-2xl font-bold border-slate-200"
              >
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* SUCCESS STATE */}
      {!loading && !error && (
        <>
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-inner"
          >
            <CheckCircle2 size={52} className="text-emerald-600" />
          </motion.div>

          {/* Heading */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-emerald-600">
              Payment Successful
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Package Activated 🎉
          </h1>

          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Your payment has been processed successfully. Your employer package
            and credits are now active in your dashboard.
          </p>

          {/* Info Box */}
          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="text-emerald-700" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Your package is ready
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  You can now post jobs, manage hiring, and access all premium
                  employer features directly from your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-2xl font-bold shadow-lg shadow-emerald-600/20">
                <LayoutDashboard size={16} />
                Go to Dashboard
              </Button>
            </Link>

            <Link href="/post-a-job" className="flex-1">
              <Button
                variant="outline"
                className="w-full py-6 rounded-2xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Post a Job
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </>
      )}

      {/* Footer */}
      <p className="text-[11px] text-slate-400 mt-6">
        Secure payments powered by Stripe
      </p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-16 overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-xl"
        >
          <Suspense
            fallback={
              <div className="bg-white border border-emerald-100 shadow-2xl rounded-3xl p-8 sm:p-10 text-center min-h-[400px] flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-800">
                  Loading Session...
                </h2>
              </div>
            }
          >
            <SuccessPageContent />
          </Suspense>
        </motion.div>
      </section>
    </ProtectedRoute>
  );
}
