"use client";

import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { useRouter } from "@/router";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Star,
  Zap,
  Building2,
  ShieldCheck,
  Crown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const DEFAULT_STATIC_PACKAGES = [
  {
    icon: Star,
    name: "Starter",
    originalPrice: 25,
    discountedPrice: 12.5,
    tagline: "FEATURES OF STARTER PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "1 Job Posting",
    ],
    cta: "Select Package",
    highlight: false,
    badge: "50% OFF",
  },
  {
    icon: Zap,
    name: "Deluxe",
    originalPrice: 95,
    discountedPrice: 47.5,
    tagline: "FEATURES OF DELUXE PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "5 Job Posting",
    ],
    cta: "Select Package",
    highlight: true,
    badge: "Most Popular • 50% OFF",
  },
  {
    icon: Building2,
    name: "Ultimate",
    originalPrice: 195,
    discountedPrice: 97.5,
    tagline: "FEATURES OF ULTIMATE PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "10 Job Posting",
    ],
    cta: "Select Package",
    highlight: false,
    badge: "50% OFF",
  },
  {
    icon: ShieldCheck,
    name: "Pro Plan",
    originalPrice: 380,
    discountedPrice: 190,
    tagline: "FEATURES OF PRO PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "20 Job Posting",
    ],
    cta: "Select Package",
    highlight: false,
    badge: "Best Value • 50% OFF",
  },
  {
    icon: Crown,
    name: "Unlimited",
    originalPrice: 1350,
    discountedPrice: 675,
    tagline: "FEATURES OF UNLIMITED PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Expire 1 Year",
      "Unlimited Jobs Posting",
    ],
    cta: "Select Package",
    highlight: false,
    darkVariant: true,
    badge: "Mega Deal • 50% OFF",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Starter: Star,
  Deluxe: Zap,
  Ultimate: Building2,
  "Pro Plan": ShieldCheck,
  Unlimited: Crown,
};

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
    a: "Starter, Deluxe, Ultimate, and Pro credits never expire. Unlimited plan remains valid for 1 year.",
  },
  {
    q: "Can I purchase the same package again?",
    a: "Yes. Credits are added to your existing account automatically.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const [packagesList, setPackagesList] = useState<any[]>(DEFAULT_STATIC_PACKAGES);

  // Modal states
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`/api/packages?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && data.packages && data.packages.length > 0) {
          const mapped = data.packages.map((pkg: any) => ({
            ...pkg,
            icon: ICON_MAP[pkg.name] || Star,
            cta: "Select Package",
          }));
          setPackagesList(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch packages:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  //initial check before opening modal
  const handleInitiatePurchase = (pkg: any) => {
    if (!user) {
      toast.error("Please log in to purchase a package.");
      router.push("/login");
      return;
    }

    if (user.accountType !== "employer") {
      toast.error("Only employer accounts can purchase packages.");
      return;
    }

    setSelectedPkg(pkg);
    setPromoCode("");
    setPromoApplied(false);
    setPromoError("");
    setFinalPrice(null);
  };

  const handleApplyPromo = async () => {
    if (!selectedPkg || !promoCode) return;

    try {
      setPromoLoading(true);
      setPromoError("");

      const response = await fetch("/api/promo/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode,
          packageName: selectedPkg.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid promo code");
      }

      setPromoApplied(true);
      setFinalPrice(0);
      toast.success("Promo code applied! Package is now free 🎉");
    } catch (error: any) {
      setPromoApplied(false);
      setFinalPrice(null);
      setPromoError(error.message);
      toast.error(error.message || "Invalid promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  
  const handleConfirmPurchase = async () => {
    if (!selectedPkg) return;

    const packageName = selectedPkg.name;

    try {
      setLoadingPackage(packageName);

      // FREE PROMO FLOW
      if (finalPrice === 0) {
        const response = await fetch("/api/employer/package/purchase", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageName, promoCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to activate package");
        }

        toast.success(`${packageName} package activated successfully! 🎉`);
        setSelectedPkg(null);
        router.push("/dashboard");
        return;
      }

      // STRIPE FLOW
      const toastId = toast.loading("Redirecting to secure checkout...");

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName,
          promoCode: promoApplied ? promoCode : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(toastId);
        throw new Error(data.error || "Failed to start payment");
      }

      // REDIRECT TO STRIPE
      if (data.checkoutUrl) {
        toast.success("Redirecting to Stripe checkout...", { id: toastId });
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.dismiss(toastId);
      throw new Error("Stripe checkout URL missing");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingPackage(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Pricing & Packages — Youth Employment Canada</title>
        <meta
          name="description"
          content="Flexible employer packages with limited-time 50% off."
        />
      </Helmet>

      {/* HERO */}
      <section className="bg-[#F8FAFC] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-[#2563EB] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <div className="inline-flex items-center gap-2 bg-[#EF4444]/10 text-[#EF4444] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
              🔥 Limited Time Offer: 50% OFF All Packages
            </div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl lg:text-6xl font-bold text-[#0F172A] mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Packages for Every Hiring Need
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#475569]/70 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Choose the perfect package for your hiring needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-white py-12 pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch"
          >
            {packagesList.map((pkg) => {
              let cardStyles =
                "bg-[#F8FAFC] border border-[#2563EB]/10 hover:shadow-xl";

              if (pkg.highlight) {
                cardStyles =
                  "bg-white border-2 border-[#EF4444] shadow-2xl xl:-mt-4 xl:mb-4 transform scale-[1.02]";
              } else if (pkg.darkVariant) {
                cardStyles =
                  "bg-[#1E1B18] text-[#F5EBE6] border border-[#3A3530] shadow-xl";
              }

              return (
                <motion.div
                  key={pkg.name}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                  }}
                  className={`rounded-2xl p-5 relative flex flex-col justify-between transition-all duration-300 ${cardStyles}`}
                >
                  {/* BADGE */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap uppercase tracking-wider ${
                          pkg.highlight
                            ? "bg-[#EF4444] text-white"
                            : pkg.darkVariant
                              ? "bg-[#E6A15C] text-[#1E1B18]"
                              : "bg-[#2563EB] text-white"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`font-bold text-lg ${
                          pkg.darkVariant ? "text-[#E6A15C]" : "text-[#0F172A]"
                        }`}
                        style={{
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        {pkg.name}
                      </h3>

                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          pkg.darkVariant
                            ? "bg-[#E6A15C]/10"
                            : pkg.highlight
                              ? "bg-[#EF4444]/10"
                              : "bg-[#2563EB]/10"
                        }`}
                      >
                        <pkg.icon
                          size={16}
                          className={
                            pkg.darkVariant
                              ? "text-[#E6A15C]"
                              : pkg.highlight
                                ? "text-[#EF4444]"
                                : "text-[#2563EB]"
                          }
                        />
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="mb-4 border-b border-dashed pb-3">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                            pkg.darkVariant
                              ? "text-[#F5EBE6]"
                              : "text-[#0F172A]"
                          }`}
                        >
                          ${pkg.discountedPrice}
                        </span>

                        <span
                          className={`text-xs line-through ${
                            pkg.darkVariant
                              ? "text-white/40"
                              : "text-[#475569]/50"
                          }`}
                        >
                          ${pkg.originalPrice}
                        </span>
                      </div>

                      <p
                        className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase ${
                          pkg.darkVariant
                            ? "text-white/50"
                            : "text-[#475569]/60"
                        }`}
                      >
                        CAD • One-Time
                      </p>
                    </div>

                    {/* TAGLINE */}
                    <p
                      className={`text-[10px] font-bold tracking-wider mb-2 uppercase ${
                        pkg.darkVariant ? "text-[#E6A15C]/80" : "text-[#2563EB]"
                      }`}
                    >
                      {pkg.tagline}
                    </p>

                    {/* FEATURES */}
                    <ul className="flex flex-col gap-2.5 mb-6">
                      {pkg.features.map((feature: string) => (
                        <li
                          key={feature}
                          className={`flex items-start gap-2 text-xs leading-normal ${
                            pkg.darkVariant
                              ? "text-white/80"
                              : "text-[#0F172A]/80"
                          }`}
                        >
                          <CheckCircle
                            size={13}
                            className={`flex-shrink-0 mt-0.5 ${
                              pkg.darkVariant
                                ? "text-[#E6A15C]"
                                : pkg.highlight
                                  ? "text-[#EF4444]"
                                  : "text-[#2563EB]"
                            }`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* BUTTON */}
                  <Button
                    onClick={() => handleInitiatePurchase(pkg)}
                    className={`w-full font-semibold transition-colors text-xs py-4 rounded-xl ${
                      pkg.darkVariant
                        ? "bg-[#E6A15C] text-[#1E1B18] hover:bg-[#d4904b]"
                        : pkg.highlight
                          ? "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                          : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    }`}
                  >
                    {pkg.cta}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* PREMIUM MODAL INTEGRATION WITH ANIMATEPRESENCE */}
      <AnimatePresence>
        {selectedPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (loadingPackage !== selectedPkg.name) setSelectedPkg(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              {/* Close Button */}
              <button
                disabled={loadingPackage === selectedPkg.name}
                onClick={() => setSelectedPkg(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-50"
              >
                <X size={18} />
              </button>

              {/* Modal Content */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <selectedPkg.icon size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                    Checkout
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-none mt-0.5">
                    {selectedPkg.name} Plan
                  </h3>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Total Amount Due
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Includes 50% discount
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">
                    $
                    {finalPrice !== null
                      ? finalPrice
                      : selectedPkg.discountedPrice}{" "}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">
                    CAD
                  </span>
                </div>
              </div>

              {/* PROMO CODE */}
              <div className="mb-5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
                  Promo Code
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <Button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 rounded-xl"
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
              {/* Dummy Dummy Credit Card Payment UI Section */}
              {/* <div className="space-y-3.5 mb-6">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                  Payment Details (Demo Flow)
                </label>

                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242"
                    className="w-full bg-slate-50 text-slate-600 font-mono text-sm border border-slate-200 rounded-xl px-4 py-3 pl-10 cursor-not-allowed"
                  />
                  <CreditCard
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      disabled
                      value="12/29"
                      className="w-full bg-slate-50 text-slate-600 font-mono text-sm border border-slate-200 rounded-xl px-4 py-3 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      disabled
                      value="***"
                      className="w-full bg-slate-50 text-slate-600 font-mono text-sm border border-slate-200 rounded-xl px-4 py-3 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-medium bg-emerald-50/50 px-3 py-2 rounded-lg border border-emerald-100/50">
                  <Lock size={12} />
                  <span>Secure demo checkout env. No real charge applies.</span>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={loadingPackage === selectedPkg.name}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl shadow-lg shadow-blue-600/10 transition-colors"
                >
                  {loadingPackage === selectedPkg.name
                    ? "Processing Securely..."
                    : finalPrice === 0
                      ? "Activate Package"
                      : `Confirm & Pay $${
                          finalPrice !== null
                            ? finalPrice
                            : selectedPkg.discountedPrice
                        }`}
                </Button>

                <button
                  disabled={loadingPackage === selectedPkg.name}
                  onClick={() => setSelectedPkg(null)}
                  className="w-full text-slate-400 hover:text-slate-600 font-medium text-xs py-2 transition-colors"
                >
                  Cancel Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <section className="bg-[#F8FAFC] py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-[#0F172A]"
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
                className="bg-white rounded-2xl p-7 border border-[#2563EB]/10 shadow-sm"
              >
                <h3 className="font-bold text-[#0F172A] mb-2">{faq.q}</h3>
                <p className="text-[#475569]/70 text-sm leading-relaxed">
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
