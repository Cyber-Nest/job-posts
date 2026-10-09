"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Star,
  Zap,
  Building2,
  HeartHandshake,
  Crown,
  X,
  ArrowRight,
  HelpCircle,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Icon map — stays client-side
const ICON_MAP: Record<string, React.ElementType> = {
  Starter: Star,
  Deluxe: Zap,
  Ultimate: Building2,
  "Pro Plan": HeartHandshake,
  Unlimited: Crown,
};

// DB package shape
interface PkgData {
  _id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  tagline: string;
  badge: string;
  features: string[];
  highlight: boolean;
  darkVariant: boolean;
  order: number;
}

// Enriched package
type PkgDisplay = PkgData & { icon: React.ElementType };

const faqs = [
  {
    q: "How long are job postings active?",
    a: "Postings remain active for 180 days across standard packages (and 365 days for Unlimited plans).",
  },
  {
    q: "Can I edit my job posting after it's published?",
    a: "Yes, you can update role requirements, descriptions, and salary info anytime from your Employer Dashboard.",
  },
  {
    q: "Do purchased job posting credits expire?",
    a: "No! Credits for Starter, Deluxe, Ultimate, and Pro plans never expire, allowing you to post whenever you need talent.",
  },
  {
    q: "Can I upgrade or purchase additional packages?",
    a: "Yes, credits stack automatically in your account upon purchase.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isPending } = useSession();

  // Dynamic packages from backend
  const {
    data: packagesResponse,
    isPending: pkgLoading,
    error,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await fetch(`/api/packages?_t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch packages");
      }

      return res.json();
    },

    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const pkgList = useMemo(() => {
    const packages = packagesResponse?.packages || [];

    return packages.map((p: PkgData) => ({
      ...p,
      icon: ICON_MAP[p.name] || Star,
    }));
  }, [packagesResponse]);

  // Split packages into 3 Core Plans & 2 High-Volume Enterprise Plans
  const corePackages = useMemo(() => {
    if (!pkgList || pkgList.length === 0) return [];
    const coreNames = ["Starter", "Deluxe", "Ultimate"];
    const filtered = pkgList.filter((p: { name: string; }) => coreNames.includes(p.name));
    return filtered.length > 0 ? filtered : pkgList.slice(0, 3);
  }, [pkgList]);

  const enterprisePackages = useMemo(() => {
    if (!pkgList || pkgList.length === 0) return [];
    const entNames = ["Pro Plan", "Unlimited"];
    const filtered = pkgList.filter((p: { name: string; }) => entNames.includes(p.name));
    return filtered.length > 0 ? filtered : pkgList.slice(3);
  }, [pkgList]);

  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<PkgDisplay | null>(null);

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      // no-op
    }
  }, [isPending, isAuthenticated]);

  const finalPrice = useMemo(() => {
    if (!selectedPkg) return null;
    return promoApplied ? 0 : selectedPkg.discountedPrice;
  }, [selectedPkg, promoApplied]);

  const resetModalState = () => {
    setPromoCode("");
    setPromoLoading(false);
    setPromoApplied(false);
    setPromoError("");
  };

  const handleInitiatePurchase = (pkg: PkgDisplay) => {
    if (isPending) return;

    if (!isAuthenticated) {
      router.push("/login?from=/pricing");
      return;
    }

    setSelectedPkg(pkg);
    resetModalState();
  };

  const handleApplyPromo = async () => {
    if (!selectedPkg || !promoCode.trim()) return;

    try {
      setPromoLoading(true);
      setPromoError("");

      const response = await fetch("/api/promo/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: selectedPkg.name,
          promoCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid promo code");
      }

      setPromoApplied(true);
      toast.success("Promo code applied successfully.");
    } catch (error: any) {
      setPromoApplied(false);
      setPromoError(error.message || "Something went wrong");
      toast.error(error.message || "Something went wrong");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPkg) return;

    try {
      setLoadingPackage(selectedPkg.name);

      const endpoint = promoApplied
        ? "/api/promo/verify"
        : "/api/stripe/create-checkout-session";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: selectedPkg.name,
          promoCode: promoApplied ? promoCode : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      // PROMO FLOW
      if (promoApplied) {
        toast.success(
          data.message || `${selectedPkg.name} activated successfully`,
        );

        setSelectedPkg(null);
        router.push("/employers/dashboard");
        return;
      }

      // STRIPE FLOW
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      throw new Error("Checkout URL missing");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingPackage(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#059669]" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 pb-24">
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-left">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
            {/* Dual-Pill Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4">
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none flex items-center gap-1">
                <Flame size={12} className="animate-bounce" />
                <span>50% OFF SALE</span>
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                Transparent Canadian Employer Packages
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Post Jobs & Hire Top <span className="text-[#059669]">Canadian Talent</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              Select the package that fits your hiring needs. No recurring subscriptions or hidden fees. Job credits never expire across Canada.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── ROW 1: CORE EMPLOYER PACKAGES (SPACIOUS 3-COLUMN GRID) ──────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm font-semibold">
            {(error as Error).message}
          </div>
        )}

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-left mb-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 text-[#059669] text-xs font-extrabold uppercase tracking-wider mb-2">
            <span>STANDARD PACKAGES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Popular Job Credit Packages
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Flexible posting credits designed for small businesses and growing teams.
          </p>
        </motion.div>

        {/* 3 Spacious Columns */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {pkgLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white border border-slate-200/80 h-[480px] animate-pulse"
                />
              ))
            : corePackages.map((pkg: PkgDisplay) => {
                const isFeatured = pkg.highlight;
                return (
                  <motion.div
                    key={pkg.name}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    className={`rounded-3xl p-8 relative transition-all duration-300 flex flex-col justify-between h-full ${
                      isFeatured
                        ? "bg-slate-900 text-white border border-slate-800 shadow-2xl ring-2 ring-[#059669] transform lg:-translate-y-3"
                        : "bg-white border border-slate-200/90 text-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-300"
                    }`}
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isFeatured
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-[#059669]"
                              : "bg-emerald-50 border border-emerald-100 text-[#059669]"
                          }`}
                        >
                          <pkg.icon size={22} />
                        </div>

                        {pkg.badge && (
                          <span
                            className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap tracking-wider uppercase leading-none ${
                              isFeatured
                                ? "bg-[#059669] text-white shadow-sm"
                                : "bg-slate-900 text-white shadow-xs"
                            }`}
                          >
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`font-extrabold text-2xl mb-1 ${
                          isFeatured ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {pkg.name}
                      </h3>

                      <p
                        className={`text-xs font-semibold mb-6 leading-normal ${
                          isFeatured ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {pkg.tagline}
                      </p>

                      {/* Structured Pricing Container */}
                      <div
                        className={`rounded-2xl p-5 mb-6 border ${
                          isFeatured
                            ? "bg-slate-950/90 border-slate-800"
                            : "bg-slate-50/80 border-slate-100"
                        }`}
                      >
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-4xl font-black tracking-tight ${
                              isFeatured ? "text-white" : "text-slate-900"
                            }`}
                          >
                            ${pkg.discountedPrice}
                          </span>

                          <span
                            className={`text-sm line-through font-semibold ${
                              isFeatured ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            ${pkg.originalPrice}
                          </span>
                        </div>

                        <p
                          className={`text-[10px] font-extrabold tracking-wider uppercase mt-1.5 ${
                            isFeatured ? "text-emerald-400" : "text-[#059669]"
                          }`}
                        >
                          CAD • One-Time Payment
                        </p>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3.5 mb-8 text-left">
                        {pkg.features.map((f) => (
                          <li
                            key={f}
                            className={`flex items-start gap-3 text-xs sm:text-sm font-medium leading-relaxed ${
                              isFeatured ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            <CheckCircle2
                              size={16}
                              className="text-[#059669] flex-shrink-0 mt-0.5"
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button
                        onClick={() => handleInitiatePurchase(pkg)}
                        className={`w-full font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group ${
                          isFeatured
                            ? "bg-[#059669] hover:bg-[#047857] text-white shadow-lg shadow-emerald-950/40"
                            : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                        }`}
                      >
                        <span>Select Package</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
        </motion.div>
      </section>

      {/* ── ROW 2: ENTERPRISE & HIGH-VOLUME (WIDE HORIZONTAL SPLIT CARDS) ─ */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14 border-t border-slate-200/60">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-left mb-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-900 text-white shadow-xs mb-3">
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
              ENTERPRISE
            </span>
            <span className="text-xs font-semibold text-slate-300 leading-none">
              High-Volume & Unlimited Recruitment Solutions
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            High-Volume Hiring & Unlimited Annual Access
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            Designed for recruitment agencies, enterprise employers, and organizations hiring continuously across Canada.
          </p>
        </motion.div>

        {/* 2 Wide Horizontal Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
        >
          {pkgLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white border border-slate-200/80 h-72 animate-pulse" />
              ))
            : enterprisePackages.map((pkg: PkgDisplay) => {
                const isFeatured = pkg.name === "Unlimited";
                return (
                  <motion.div
                    key={pkg.name}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className={`rounded-3xl p-8 transition-all duration-300 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center ${
                      isFeatured
                        ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl ring-1 ring-emerald-500/40"
                        : "bg-white border border-slate-200/90 text-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-300"
                    }`}
                  >
                    {/* Left Column: Info & Price */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isFeatured
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-[#059669]"
                              : "bg-emerald-50 border border-emerald-100 text-[#059669]"
                          }`}
                        >
                          <pkg.icon size={22} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-extrabold text-2xl ${isFeatured ? "text-white" : "text-slate-900"}`}>
                              {pkg.name}
                            </h3>
                            {pkg.badge && (
                              <span
                                className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  isFeatured ? "bg-[#059669] text-white" : "bg-slate-900 text-white"
                                }`}
                              >
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-semibold ${isFeatured ? "text-slate-400" : "text-slate-500"}`}>
                            {pkg.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 mt-4">
                        <span className={`text-4xl font-black ${isFeatured ? "text-white" : "text-slate-900"}`}>
                          ${pkg.discountedPrice}
                        </span>
                        <span className={`text-sm line-through font-semibold ${isFeatured ? "text-slate-500" : "text-slate-400"}`}>
                          ${pkg.originalPrice}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ml-1 ${isFeatured ? "text-emerald-400" : "text-[#059669]"}`}>
                          CAD • One-Time
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Features & Action */}
                    <div className="w-full sm:w-auto flex flex-col gap-5 border-t sm:border-t-0 sm:border-l border-slate-200/40 sm:pt-0 pt-4 sm:pl-6">
                      <ul className="space-y-2 text-left">
                        {pkg.features.map((f) => (
                          <li
                            key={f}
                            className={`flex items-center gap-2 text-xs font-medium ${
                              isFeatured ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            <CheckCircle2 size={14} className="text-[#059669] flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleInitiatePurchase(pkg)}
                        className={`w-full sm:w-auto px-6 py-3.5 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 group whitespace-nowrap ${
                          isFeatured
                            ? "bg-[#059669] hover:bg-[#047857] text-white shadow-lg shadow-emerald-950/40"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        <span>Select Package</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
        </motion.div>
      </section>

      {/* ── MODAL DIALOG (Checkout & Promo) ──────────────────────────────── */}
      <AnimatePresence>
        {selectedPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (loadingPackage !== selectedPkg.name) setSelectedPkg(null);
              }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 text-white p-7 shadow-2xl border border-slate-800 z-10"
            >
              <button
                disabled={loadingPackage === selectedPkg.name}
                onClick={() => setSelectedPkg(null)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white transition-colors rounded-full p-1.5 hover:bg-slate-800"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#059669] flex items-center justify-center">
                  <selectedPkg.icon size={22} />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-[#059669] uppercase">
                    Checkout Summary
                  </span>
                  <h3 className="text-xl font-extrabold text-white leading-tight">
                    {selectedPkg.name}
                  </h3>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-slate-950/80 rounded-2xl p-4 mb-6 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    Total Amount Due
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {promoApplied
                      ? "Promo applied successfully (100% Off)"
                      : "Includes 50% discount"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-white">
                    ${finalPrice ?? selectedPkg.discountedPrice}
                  </span>
                  <span className="text-xs text-slate-400 block font-semibold">
                    CAD
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mb-6">
                <label className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase block mb-2">
                  Promo / Coupon Code
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      if (promoApplied) {
                        setPromoApplied(false);
                      }
                      if (promoError) {
                        setPromoError("");
                      }
                    }}
                    placeholder="Enter promo code"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                  />

                  <Button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="bg-[#059669] hover:bg-[#047857] text-white px-4 rounded-xl text-xs font-bold"
                  >
                    {promoLoading ? "Checking..." : "Apply"}
                  </Button>
                </div>

                {promoApplied && (
                  <p className="text-emerald-400 text-xs font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Promo code applied successfully 🎉</span>
                  </p>
                )}

                {promoError && (
                  <p className="text-red-400 text-xs font-semibold mt-2">
                    {promoError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={loadingPackage === selectedPkg.name}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-950/50"
                >
                  {loadingPackage === selectedPkg.name
                    ? "Processing Checkout..."
                    : finalPrice === 0
                      ? "Activate Package Now"
                      : `Confirm & Pay $${finalPrice}`}
                </Button>

                <button
                  disabled={loadingPackage === selectedPkg.name}
                  onClick={() => setSelectedPkg(null)}
                  className="w-full text-slate-400 hover:text-white font-medium text-xs py-2 transition-colors"
                >
                  Cancel Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FREQUENTLY ASKED QUESTIONS ──────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20 border-t border-slate-200/60">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-left mb-12 max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-3"
          >
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
              FAQ
            </span>
            <span className="text-xs font-semibold text-slate-700 leading-none">
              Employer Hiring Questions & Guidance
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed"
          >
            Everything you need to know about job posting credits, expiry policies, and employer account management.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {faqs.map((faq) => (
            <motion.div
              key={faq.q}
              variants={fadeUp}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm text-left flex items-start gap-4 hover:border-emerald-300 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center flex-shrink-0 border border-emerald-100 mt-0.5">
                <HelpCircle size={20} />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                  {faq.q}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
