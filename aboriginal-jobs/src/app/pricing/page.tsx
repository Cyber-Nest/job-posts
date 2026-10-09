"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  Star,
  Zap,
  Building2,
  HeartHandshake,
  Crown,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
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

function OrganicShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
      />
      <circle
        cx="200"
        cy="200"
        r="130"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.12"
      />
      <circle
        cx="200"
        cy="200"
        r="80"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

// Icon map — stays client-side (React components can't be stored in DB)
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

// Enriched package (adds icon for rendering)
type PkgDisplay = PkgData & { icon: React.ElementType };

const faqs = [
  {
    q: "How long are job postings active?",
    a: "Postings are active for 180 days across most standard plans.",
  },
  {
    q: "Can I edit my job posting after it's live?",
    a: "Yes, you can edit your job posting anytime through your employer dashboard.",
  },
  {
    q: "Do credits expire?",
    a: "Starter, Deluxe, Ultimate and Pro Plan credits never expire. Unlimited plan remains active for 1 year.",
  },
  {
    q: "Can I purchase the same package again?",
    a: "Yes. Credits are added to your existing account automatically.",
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

  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<PkgDisplay | null>(null);

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      // no-op; handled on click
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C8782A]/20 border-t-[#C8782A]" />
      </div>
    );
  }

  return (
    <>
      <section className="bg-[#FAF5EE] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-[#C8782A] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <div className="inline-flex items-center gap-2 bg-[#C8782A]/10 text-[#C8782A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
              🔥 Limited Time Offer: 50% OFF All Packages
            </div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Packages for Every Hiring Need
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Whether you&apos;re posting your first job or building a long-term
              Indigenous hiring strategy, we have a package designed for you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 items-stretch pt-6"
          >
            {/* Loading skeleton */}
            {pkgLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="rounded-2xl bg-[#FAF5EE] border border-[#C8782A]/10 h-96 animate-pulse"
                  />
                ))
              : pkgList.map((pkg: PkgDisplay) => (
                  <motion.div
                    key={pkg.name}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    className={`rounded-2xl p-5 relative transition-all duration-200 flex flex-col h-full ${
                      pkg.highlight
                        ? "bg-[#C8782A] text-white ring-2 ring-[#C8782A] shadow-xl xl:-mt-4 xl:mb-4"
                        : "bg-[#FAF5EE] border border-[#C8782A]/10 hover:shadow-md"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap tracking-wide uppercase ${
                            pkg.highlight
                              ? "bg-[#6B3A2A] text-white"
                              : "bg-[#C8782A] text-white"
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    <div className="flex-grow">
                      <div
                        className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${
                          pkg.highlight ? "bg-white/20" : "bg-[#C8782A]/10"
                        }`}
                      >
                        <pkg.icon
                          size={16}
                          className={
                            pkg.highlight ? "text-white" : "text-[#C8782A]"
                          }
                        />
                      </div>

                      <h3
                        className={`font-bold text-lg mb-0.5 ${
                          pkg.highlight ? "text-white" : "text-[#1C1C1C]"
                        }`}
                        style={{
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        {pkg.name}
                      </h3>

                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                          pkg.highlight ? "text-white/70" : "text-[#6B3A2A]/60"
                        }`}
                      >
                        {pkg.tagline}
                      </p>

                      <div className="mb-4 border-b border-dashed border-current/20 pb-3">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                              pkg.highlight ? "text-white" : "text-[#1C1C1C]"
                            }`}
                          >
                            ${pkg.discountedPrice}
                          </span>

                          <span
                            className={`text-xs line-through ${
                              pkg.highlight
                                ? "text-white/50"
                                : "text-[#6B3A2A]/50"
                            }`}
                          >
                            ${pkg.originalPrice}
                          </span>
                        </div>

                        <p
                          className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase ${
                            pkg.highlight
                              ? "text-white/60"
                              : "text-[#6B3A2A]/60"
                          }`}
                        >
                          CAD • One-Time
                        </p>
                      </div>

                      <ul className="flex flex-col gap-2.5 mb-6">
                        {pkg.features.map((f) => (
                          <li
                            key={f}
                            className={`flex items-start gap-2 text-xs leading-normal ${
                              pkg.highlight
                                ? "text-white/90"
                                : "text-[#1C1C1C]/70"
                            }`}
                          >
                            <CheckCircle
                              size={13}
                              className={`flex-shrink-0 mt-0.5 ${
                                pkg.highlight ? "text-white" : "text-[#7A9E7E]"
                              }`}
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <Button
                        onClick={() => handleInitiatePurchase(pkg)}
                        className={`w-full font-semibold transition-colors rounded-xl py-4.5 ${
                          pkg.highlight
                            ? "bg-white text-[#C8782A] hover:bg-[#FAF5EE]"
                            : "bg-[#C8782A] hover:bg-[#B06820] text-white"
                        }`}
                      >
                        Select Package
                      </Button>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-[#C8782A]/10"
            >
              <button
                disabled={loadingPackage === selectedPkg.name}
                onClick={() => setSelectedPkg(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-50"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#C8782A]/10 text-[#C8782A] rounded-xl">
                  <selectedPkg.icon size={20} />
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C8782A] uppercase">
                    Checkout
                  </span>

                  <h3 className="text-xl font-bold text-[#1C1C1C] leading-none mt-0.5">
                    {selectedPkg.name}
                  </h3>
                </div>
              </div>

              <div className="bg-[#FAF5EE] rounded-xl p-4 mb-5 border border-[#C8782A]/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1C1C1C]">
                    Total Amount Due
                  </p>
                  <p className="text-[11px] text-[#6B3A2A]/60 mt-0.5">
                    {promoApplied
                      ? "Promo applied successfully"
                      : "Includes 50% discount"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-[#1C1C1C]">
                    ${finalPrice ?? selectedPkg.discountedPrice}
                  </span>
                  <span className="text-xs text-[#6B3A2A]/60 block font-medium">
                    CAD
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-[11px] font-bold tracking-wider text-[#6B3A2A]/60 uppercase block mb-2">
                  Promo Code
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
                    className="flex-1 border border-[#C8782A]/20 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                  />

                  <Button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="bg-[#1C1C1C] hover:bg-[#2A2A2A] text-white px-5 rounded-xl"
                  >
                    {promoLoading ? "Checking..." : "Apply"}
                  </Button>
                </div>

                {promoApplied && (
                  <p className="text-emerald-600 text-xs font-semibold mt-2">
                    Promo applied successfully 🎉
                  </p>
                )}

                {promoError && (
                  <p className="text-red-500 text-xs font-semibold mt-2">
                    {promoError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={loadingPackage === selectedPkg.name}
                  className="w-full bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold py-5 rounded-xl"
                >
                  {loadingPackage === selectedPkg.name
                    ? "Processing..."
                    : finalPrice === 0
                      ? "Activate Package"
                      : `Confirm & Pay $${finalPrice}`}
                </Button>

                <button
                  disabled={loadingPackage === selectedPkg.name}
                  onClick={() => setSelectedPkg(null)}
                  className="w-full text-[#6B3A2A]/60 hover:text-[#6B3A2A] font-medium text-xs py-2 transition-colors"
                >
                  Cancel Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
              {(error as Error).message}
            </div>
          )}

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-[#1C1C1C]"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {faqs.map((faq) => (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 border border-[#C8782A]/10"
              >
                <h3 className="font-bold text-[#1C1C1C] mb-2">{faq.q}</h3>
                <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
