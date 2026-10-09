"use client";

import Link from "next/link";

import { motion } from "motion/react";

import { XCircle, RotateCcw, CreditCard, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/lib/auth/auth-client";

export default function PaymentCancelPage() {
  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-100 flex items-center justify-center px-4 py-16 overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-300/20 blur-3xl rounded-full" />

        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-300/20 blur-3xl rounded-full" />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative z-10 w-full max-w-xl"
        >
          <div className="bg-white border border-rose-100 shadow-2xl rounded-3xl p-8 sm:p-10 text-center overflow-hidden relative">
            {/* Decorative */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-100 rounded-full blur-2xl opacity-70" />

            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-70" />

            {/* Icon */}
            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
              }}
              className="w-24 h-24 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-6 shadow-inner"
            >
              <XCircle size={52} className="text-rose-600" />
            </motion.div>

            {/* Heading */}
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-rose-600">
              Payment Cancelled
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mt-3">
              Transaction Cancelled
            </h1>

            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Your payment process was cancelled and no charges were made to
              your account.
            </p>

            {/* Info */}
            <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50/70 p-5 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={18} className="text-rose-700" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    No payment was completed
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You can safely retry the payment anytime from the pricing
                    page without losing any data or credits.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/pricing" className="flex-1">
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 rounded-2xl font-bold shadow-lg shadow-rose-600/20">
                  <RotateCcw size={16} />
                  Retry Payment
                </Button>
              </Link>

              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full py-6 rounded-2xl font-bold border-slate-200 hover:bg-blue-500"
                >
                  <ArrowLeft size={15} />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Footer */}
            <p className="text-[11px] text-slate-400 mt-6">
              Stripe secure checkout session cancelled
            </p>
          </div>
        </motion.div>
      </section>
    </ProtectedRoute>
  );
}
