"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth/auth-client";

/* ── Types ──────────────────────────────────────────────────────────── */
interface FormData {
  firstName: string;
  lastName: string;
  orgName: string;
  province: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

type StepErrors = Partial<Record<keyof FormData, string>>;

/* ── Constants ──────────────────────────────────────────────────────── */
const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland & Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Québec",
  "Saskatchewan",
  "Yukon",
];

const STEP_LABELS = ["Your Details", "Create Account", "Verify Email"];

/* ── Helpers ────────────────────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
      <AlertCircle size={12} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center group mb-6">
      <span
        className="flex flex-col leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="font-bold text-2xl tracking-tight text-[#6B3A2A] group-hover:text-[#C8782A] transition-colors duration-200 leading-none">
          Aboriginal Jobs
        </span>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C8782A] uppercase mt-0.5">
          Canada
        </span>
      </span>
    </Link>
  );
}

/* ── Step indicator ─────────────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                done
                  ? "bg-[#7A9E7E] text-white"
                  : active
                    ? "bg-[#C8782A] text-white shadow-md"
                    : "bg-[#C8782A]/10 text-[#6B3A2A]/40"
              }`}
            >
              {done ? <CheckCircle size={14} /> : step}
            </div>
            {i < total - 1 && (
              <div
                className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
                  done ? "bg-[#7A9E7E]" : "bg-[#C8782A]/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Slide animation ────────────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  }),
};

/* ── Validation per step ────────────────────────────────────────────── */
function validateStep1(data: FormData): StepErrors {
  const errs: StepErrors = {};
  if (!data.firstName.trim()) errs.firstName = "First name is required.";
  if (!data.lastName.trim()) errs.lastName = "Last name is required.";
  if (!data.orgName.trim()) errs.orgName = "Organization name is required.";
  if (!data.province)
    errs.province = "Please select your province or territory.";
  return errs;
}

function validateStep2(data: FormData): StepErrors {
  const errs: StepErrors = {};
  if (!data.email) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errs.email = "Enter a valid email address.";
  if (!data.password) errs.password = "Password is required.";
  else if (data.password.length < 8)
    errs.password = "Password must be at least 8 characters.";
  if (!data.confirmPassword)
    errs.confirmPassword = "Please confirm your password.";
  else if (data.password !== data.confirmPassword)
    errs.confirmPassword = "Passwords do not match.";
  if (!data.agreeTerms)
    errs.agreeTerms = "You must agree to the terms to continue.";
  return errs;
}

/* ── Password strength ──────────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-[#7A9E7E]",
  ];
  const textColors = [
    "",
    "text-red-500",
    "text-yellow-600",
    "text-blue-600",
    "text-[#7A9E7E]",
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-[#C8782A]/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>
        {labels[score]}
      </p>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
function RegisterForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<StepErrors>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const [otpVal, setOtpVal] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSentMsg, setOtpSentMsg] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState(""); // Store email for OTP resend

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    orgName: "",
    province: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  useEffect(() => {
    if (step === 3) {
      // Push a new state to prevent back navigation
      window.history.pushState(null, "", window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        // When back button is pressed on step 3, push state again
        window.history.pushState(null, "", window.location.href);
        // Show a warning message
        setServerError(
          'Please complete verification or use the "Continue" button.',
        );
        setTimeout(() => setServerError(""), 3000);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [step]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const interval = setInterval(() => {
      setOtpCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const goNext = async () => {
    if (step === 1) {
      const errs = validateStep1(form);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setDirection(1);
      setStep(2);
      return;
    }
    if (step === 2) {
      const errs = validateStep2(form);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      setLoading(true);
      setServerError("");
      setOtpSentMsg("");
      setEmailForOtp(form.email); // Store email for resend

      try {
        const res = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();

        if (!res.ok) {
          const errMsg =
            data.error || "Failed to send verification code. Please try again.";
          setServerError(errMsg);
          toast.error(errMsg);
          setLoading(false);
          return;
        }

        if (data._devOtp) {
          setDevOtp(data._devOtp);
        } else {
          setDevOtp("");
        }

        setDirection(1);
        setStep(3);
        setOtpVal("");
        setOtpCountdown(60);
        setOtpSentMsg(
          "A 6-digit verification code has been sent to your email.",
        );
        toast.success("Verification code sent to your email!");
      } catch {
        setServerError("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
    if (step === 3) {
      if (otpVal.length < 6) {
        setServerError("Please enter the full 6-digit verification code.");
        return;
      }
      setLoading(true);
      setServerError("");
      try {
        // Verify the OTP
        const verifyRes = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp: otpVal }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          const errMsg =
            verifyData.error || "Incorrect or expired verification code.";
          setServerError(errMsg);
          toast.error(errMsg);
          setLoading(false);
          return;
        }

        // Register the employer
        const registerRes = await fetch("/api/auth/register-employer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            orgName: form.orgName,
            province: form.province,
          }),
        });

        const registerData = await registerRes.json();

        if (!registerRes.ok) {
          const errMsg = registerData.error || "Registration failed.";
          setServerError(errMsg);
          toast.error(errMsg);
          setLoading(false);
          return;
        }
        // Auto login after successful registration
        const loginResult = await signIn.email({
          email: form.email,
          password: form.password,
        });

        if (loginResult.error) {
          setServerError(
            "Account created, but auto-login failed. Please sign in manually.",
          );
          toast.error("Please login manually.");
          setLoading(false);
          return;
        }

        toast.success("Account created successfully! Welcome aboard!");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSubmitted(true);
      } catch {
        setServerError(
          "An error occurred during account creation. Please try again.",
        );
        toast.error(
          "An error occurred during account creation. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0 || loading) return;
    setLoading(true);
    setServerError("");
    setOtpSentMsg("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp || form.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to resend verification code.";
        setServerError(errMsg);
        toast.error(errMsg);
        setLoading(false);
        return;
      }

      if (data._devOtp) {
        setDevOtp(data._devOtp);
      }

      setOtpCountdown(60);
      setOtpSentMsg(
        "A new 6-digit verification code has been sent to your email.",
      );
      setOtpVal("");
      toast.success("New verification code sent!");
    } catch {
      setServerError("Failed to resend code. Please try again.");
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Back button - disabled on step 3
  const goBack = () => {
    if (step === 3) {
      // No back navigation on OTP step
      setServerError(
        "Cannot go back after verification step. Please complete verification.",
      );
      setTimeout(() => setServerError(""), 3000);
      return;
    }
    setDirection(-1);
    setStep((s) => s - 1);
    setErrors({});
    setServerError("");
    setOtpSentMsg("");
  };

  /* ── Success ─────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <section className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-10 border border-[#C8782A]/10 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-[#C8782A]/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={28} className="text-[#C8782A]" />
            </div>
            <h1
              className="text-2xl font-bold text-[#1C1C1C] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome to Aboriginal Jobs Canada!
            </h1>
            <p className="text-[#6B3A2A]/70 text-sm mb-1">
              Your employer account has been created for
            </p>
            <p className="text-[#C8782A] font-semibold mb-6">{form.email}</p>

            <div className="bg-[#FAF5EE] rounded-2xl p-5 mb-7 text-left">
              <p className="text-xs font-semibold text-[#6B3A2A]/50 uppercase tracking-wider mb-3">
                Your next steps
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Complete your employer profile",
                  "Post your first job listing",
                  "Review incoming applications",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-[#6B3A2A]/75"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#C8782A] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <a href="/post-a-job">
                <Button className="w-full bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold">
                  Post Your First Job
                  <ChevronRight size={15} className="ml-1" />
                </Button>
              </a>
              <a href="/employers/dashboard">
                <Button
                  variant="outline"
                  className="w-full border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black font-medium"
                >
                  Go to Dashboard
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────── */
  return (
    <section className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-2">
          <LogoMark />
          <h1
            className="text-3xl font-bold text-[#1C1C1C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Employer Registration
          </h1>
          <p className="text-[#6B3A2A]/65 mt-2 text-sm">
            Join Canada's Indigenous job platform — connect with top talent
          </p>
        </div>

        {/* Step indicator */}
        <div className="mt-7">
          <StepIndicator current={step} total={3} />
        </div>

        {/* Step label */}
        <p className="text-center text-xs font-semibold text-[#C8782A] uppercase tracking-widest mb-5">
          Step {step} of 3 — {STEP_LABELS[step - 1]}
        </p>

        {/* Animated step content */}
        <div className="bg-white rounded-3xl border border-[#C8782A]/10 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8"
            >
              {/* ── STEP 1: Personal / org details ───────────────── */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="reg-first"
                        className="text-[#6B3A2A] font-medium text-sm"
                      >
                        First Name <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="reg-first"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        placeholder="First name"
                        className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 ${errors.firstName ? "border-red-400" : ""}`}
                      />
                      <FieldError msg={errors.firstName} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="reg-last"
                        className="text-[#6B3A2A] font-medium text-sm"
                      >
                        Last Name <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="reg-last"
                        value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                        placeholder="Last name"
                        className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 ${errors.lastName ? "border-red-400" : ""}`}
                      />
                      <FieldError msg={errors.lastName} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="reg-org"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Organization Name{" "}
                      <span className="text-[#C8782A]">*</span>
                    </Label>
                    <Input
                      id="reg-org"
                      value={form.orgName}
                      onChange={(e) => set("orgName", e.target.value)}
                      placeholder="Your organization or company"
                      className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 ${errors.orgName ? "border-red-400" : ""}`}
                    />
                    <FieldError msg={errors.orgName} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="reg-province"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Province / Territory{" "}
                      <span className="text-[#C8782A]">*</span>
                    </Label>
                    <select
                      id="reg-province"
                      value={form.province}
                      onChange={(e) => set("province", e.target.value)}
                      className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 ${errors.province ? "border-red-400" : "border-[#C8782A]/20"}`}
                    >
                      <option value="">Select province / territory</option>
                      {PROVINCES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <FieldError msg={errors.province} />
                  </div>
                </div>
              )}

              {/* ── STEP 2: Credentials ───────────────────────────── */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  {serverError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      {serverError}
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="reg-email"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Email Address <span className="text-[#C8782A]">*</span>
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com"
                      className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 ${errors.email ? "border-red-400" : ""}`}
                    />
                    <FieldError msg={errors.email} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="reg-password"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Password <span className="text-[#C8782A]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPw ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        placeholder="Create a strong password"
                        className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 pr-10 ${errors.password ? "border-red-400" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] transition-colors"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                    <FieldError msg={errors.password} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="reg-confirm"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Confirm Password <span className="text-[#C8782A]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-confirm"
                        type={showConfirmPw ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={(e) => set("confirmPassword", e.target.value)}
                        placeholder="Repeat your password"
                        className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 pr-10 ${errors.confirmPassword ? "border-red-400" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] transition-colors"
                        aria-label={
                          showConfirmPw ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirmPw ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <FieldError msg={errors.confirmPassword} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => set("agreeTerms", e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#C8782A] flex-shrink-0"
                      />
                      <span className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                        I agree to Aboriginal Jobs Canada's{" "}
                        <a
                          href="/terms"
                          target="blank"
                          className="text-[#C8782A] hover:underline font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="privacy"
                          target="blank"
                          className="text-[#C8782A] hover:underline font-medium"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    <FieldError msg={errors.agreeTerms} />
                  </div>
                </div>
              )}

              {/* ── STEP 3: OTP Verification (No Back Button) ─────── */}
              {step === 3 && (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#C8782A]/10 flex items-center justify-center">
                    <Lock size={20} className="text-[#C8782A]" />
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#1C1C1C]">
                      Enter Verification Code
                    </h3>
                    <p className="text-xs text-[#6B3A2A]/60 mt-1 max-w-xs mx-auto leading-relaxed">
                      We sent a 6-digit verification code to
                    </p>
                    <p className="text-sm text-[#C8782A] font-semibold mt-0.5">
                      {form.email}
                    </p>
                  </div>

                  {otpSentMsg && (
                    <div className="text-center text-xs text-green-600 bg-green-50 border border-green-200 py-1.5 px-3 rounded-lg w-full">
                      {otpSentMsg}
                    </div>
                  )}

                  {serverError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 w-full">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      {serverError}
                    </div>
                  )}

                  {/* InputOTP Component */}
                  <div className="my-3">
                    <InputOTP
                      maxLength={6}
                      value={otpVal}
                      onChange={setOtpVal}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="border-[#C8782A]/30 focus:border-[#C8782A] w-10 h-12 sm:w-12 sm:h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="border-[#C8782A]/30 focus:border-[#C8782A] w-10 h-12 sm:w-12 sm:h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={2}
                          className="border-[#C8782A]/30 focus:border-[#C8782A] w-10 h-12 sm:w-12 sm:h-14 text-lg"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="border-[#C8782A]/30 focus:border-[#C8782A] w-10 h-12 sm:w-12 sm:h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={4}
                          className="border-[#C8782A]/30 focus:border-[#C8782A] w-10 h-12 sm:w-12 sm:h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={5}
                          className="border-[#C8782A]/30 focus:border-[#C8782A] w-10 h-12 sm:w-12 sm:h-14 text-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Resend timer */}
                  <div className="text-center w-full">
                    {otpCountdown > 0 ? (
                      <p className="text-xs text-[#6B3A2A]/50">
                        Resend code in{" "}
                        <span className="font-semibold text-[#6B3A2A]">
                          {otpCountdown}s
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 text-xs text-[#C8782A] hover:text-[#B06820] font-semibold transition-colors disabled:opacity-50"
                      >
                        <RefreshCw
                          size={12}
                          className={loading ? "animate-spin" : ""}
                        />
                        Resend Verification Code
                      </button>
                    )}
                  </div>

                  {/* Dev OTP for testing */}
                  {/* {devOtp && (
                    <div className="w-full bg-[#FAF5EE] border border-[#C8782A]/20 rounded-xl p-3.5 text-left mt-2">
                      <p className="text-[10px] font-bold text-[#C8782A] uppercase tracking-wider mb-1">
                        🛠️ Development Mode
                      </p>
                      <p className="text-xs text-[#6B3A2A]/70">
                        Use this code to test: <span className="text-[#C8782A] font-mono text-sm tracking-wider font-bold">{devOtp}</span>
                      </p>
                    </div>
                  )} */}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons - Back button hidden on step 3 */}
          <div
            className={`flex gap-3 px-8 pb-8 ${step > 1 && step !== 3 ? "justify-between" : "justify-end"}`}
          >
            {step > 1 && step !== 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={loading}
                className="border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black font-medium"
              >
                <ArrowLeft size={15} className="mr-1.5" /> Back
              </Button>
            )}
            <Button
              type="button"
              onClick={goNext}
              disabled={loading}
              className="font-semibold px-8 text-white transition-all duration-200 bg-[#6B3A2A] hover:bg-[#5A2F1F]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Processing…
                </span>
              ) : step === 3 ? (
                <span className="flex items-center gap-1.5">
                  Verify & Register <CheckCircle size={15} />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Continue <ChevronRight size={15} />
                </span>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-[#6B3A2A]/60 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#C8782A] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-16 px-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8782A]" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
