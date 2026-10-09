"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Lock,
  RefreshCw,
  Mail,
  User,
  MapPin,
  ShieldCheck,
  ChevronDown,
  Globe,
  Award,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
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

const STEP_LABELS = ["Organization", "Credentials", "Email Verify"];

/* ── Helpers ────────────────────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] text-red-500 font-medium mt-0.5">
      <AlertCircle size={11} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-1 group mb-2">
      <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-[#059669] transition-colors">
        GetJobs<span className="text-[#059669] font-black">Canada</span>
      </span>
    </Link>
  );
}

/* ── Step indicator ─────────────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                done
                  ? "bg-[#059669] text-white shadow-sm"
                  : active
                    ? "bg-[#059669] text-white shadow-md ring-4 ring-[#059669]/15"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              {done ? <CheckCircle2 size={14} /> : step}
            </div>
            {i < total - 1 && (
              <div
                className={`w-10 sm:w-12 h-1 rounded-full transition-all duration-300 ${
                  done ? "bg-[#059669]" : "bg-slate-200"
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
    x: dir > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" as const },
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
    "bg-[#059669]",
  ];
  const textColors = [
    "",
    "text-red-500",
    "text-yellow-600",
    "text-blue-600",
    "text-[#059669]",
  ];

  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-slate-100"
            }`}
          />
        ))}
      </div>
      <p className={`text-[10px] font-bold ${textColors[score]}`}>
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
  const [emailForOtp, setEmailForOtp] = useState("");

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
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
        setServerError(
          'Please complete verification or use the "Continue" button.',
        );
        setTimeout(() => setServerError(""), 3000);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [step]);

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
      setEmailForOtp(form.email);

      try {
        const data = await apiClient.post("/auth/otp/send", { email: form.email });

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
      } catch (err: any) {
        const errMsg = err.message || "Failed to send verification code. Please try again.";
        setServerError(errMsg);
        toast.error(errMsg);
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
        await apiClient.post("/auth/otp/verify", { email: form.email, otp: otpVal });

        await apiClient.post("/auth/register-employer", {
          firstName: form.firstName,
          lastName: form.lastName,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          company: form.orgName,
          orgName: form.orgName,
          province: form.province,
        });

        toast.success("Employer Account Created Successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSubmitted(true);
      } catch (err: any) {
        const errMsg = err.message || "An error occurred during account creation. Please try again.";
        setServerError(errMsg);
        toast.error(errMsg);
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
      const data = await apiClient.post("/auth/otp/send", { email: emailForOtp || form.email });

      if (data._devOtp) {
        setDevOtp(data._devOtp);
      }

      setOtpCountdown(60);
      setOtpSentMsg(
        "A new 6-digit verification code has been sent to your email.",
      );
      setOtpVal("");
      toast.success("New verification code sent!");
    } catch (err: any) {
      const errMsg = err.message || "Failed to resend code. Please try again.";
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 3) {
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

  /* ── Success State ─────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <section className="bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 min-h-[calc(100vh-4.2rem)] flex items-center justify-center py-4 px-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl text-center my-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Sparkles size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
            Welcome to GetJobsCanada!
          </h1>
          <p className="text-slate-500 text-xs mb-1">
            Your employer account has been created for
          </p>
          <p className="text-[#059669] font-bold text-sm mb-5">{form.email}</p>

          <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-left border border-slate-200/60">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Your Employer Onboarding Steps
            </p>
            <ul className="space-y-2">
              {[
                "Complete your organization profile",
                "Post your first job listing to nationwide talent",
                "Review incoming applications in recruiter dashboard",
              ].map((item, i) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                    {i + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <a href="/post-a-job">
              <Button className="w-full h-10 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/15">
                Post Your First Job Now
                <ChevronRight size={15} className="ml-1" />
              </Button>
            </a>
            <a href="/employers/dashboard">
              <Button
                variant="outline"
                className="w-full h-10 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm rounded-xl"
              >
                Go to Employer Dashboard
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  /* ── Form View ──────────────────────────────────────────────────────── */
  return (
    <section className="bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 min-h-[calc(100vh-4.2rem)] flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-[1240px] bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-emerald-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* Left Hero Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#059669]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            {/* Executive Dual-Pill Badge */}
            <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-900/90 border border-slate-800 shadow-xs mb-5">
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                RECRUITMENT
              </span>
              <span className="text-xs font-semibold text-slate-300 leading-none">
                Employer Recruitment Portal
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Hire Top Canadian Candidates Coast to Coast.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Create an employer account to post job openings, manage candidates, and reach verified job seekers across Canada.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { title: "Targeted Canadian Reach", desc: "Post to job seekers in Ontario, BC, Alberta, Quebec & all provinces" },
                { title: "Dedicated Recruiter Tools", desc: "Easy job management & application review dashboard" },
                { title: "100% Free & Transparent", desc: "Simple pricing with no hidden recruitment fees" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#059669]/20 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stat Pill */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">100% Verified Canadian Network</h4>
                <p className="text-[10px] text-slate-400">Trusted by recruiters across 10 provinces & 3 territories</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-6 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">© {new Date().getFullYear()} GetJobsCanada</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck size={13} /> Employer Access
            </span>
          </div>
        </div>

        {/* Right Multi-step Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <LogoMark />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Employer Registration
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Step {step} of 3 — <span className="text-[#059669] font-bold">{STEP_LABELS[step - 1]}</span>
              </p>
            </div>

            {/* Step Pills */}
            <StepIndicator current={step} total={3} />

            {serverError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl p-3">
                <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
                <span>{serverError}</span>
              </div>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* STEP 1: Details */}
                {step === 1 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* First Name */}
                      <div className="space-y-1">
                        <Label htmlFor="reg-first" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          First Name <span className="text-[#059669]">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            id="reg-first"
                            type="text"
                            value={form.firstName}
                            onChange={(e) => set("firstName", e.target.value)}
                            placeholder="First name"
                            className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                              errors.firstName ? "border-red-500 bg-red-50/20" : ""
                            }`}
                          />
                        </div>
                        <FieldError msg={errors.firstName} />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-1">
                        <Label htmlFor="reg-last" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Last Name <span className="text-[#059669]">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            id="reg-last"
                            type="text"
                            value={form.lastName}
                            onChange={(e) => set("lastName", e.target.value)}
                            placeholder="Last name"
                            className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                              errors.lastName ? "border-red-500 bg-red-50/20" : ""
                            }`}
                          />
                        </div>
                        <FieldError msg={errors.lastName} />
                      </div>
                    </div>

                    {/* Organization Name */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-org" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Organization Name <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          id="reg-org"
                          type="text"
                          value={form.orgName}
                          onChange={(e) => set("orgName", e.target.value)}
                          placeholder="Company or organization name"
                          className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                            errors.orgName ? "border-red-500 bg-red-50/20" : ""
                          }`}
                        />
                      </div>
                      <FieldError msg={errors.orgName} />
                    </div>

                    {/* Province / Territory */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-province" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Province / Territory <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                          id="reg-province"
                          value={form.province}
                          onChange={(e) => set("province", e.target.value)}
                          className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all cursor-pointer ${
                            errors.province ? "border-red-500 bg-red-50/20" : ""
                          }`}
                        >
                          <option value="">Select province or territory</option>
                          {PROVINCES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <FieldError msg={errors.province} />
                    </div>
                  </div>
                )}

                {/* STEP 2: Credentials */}
                {step === 2 && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="reg-email" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Email Address <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          id="reg-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="recruiter@company.ca"
                          className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                            errors.email ? "border-red-500 bg-red-50/20" : ""
                          }`}
                        />
                      </div>
                      <FieldError msg={errors.email} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="reg-password" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Password <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          id="reg-password"
                          type={showPw ? "text" : "password"}
                          value={form.password}
                          onChange={(e) => set("password", e.target.value)}
                          placeholder="Min 8 characters"
                          className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                            errors.password ? "border-red-500 bg-red-50/20" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <PasswordStrength password={form.password} />
                      <FieldError msg={errors.password} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="reg-confirm" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Confirm Password <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          id="reg-confirm"
                          type={showConfirmPw ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={(e) => set("confirmPassword", e.target.value)}
                          placeholder="Repeat password"
                          className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                            errors.confirmPassword ? "border-red-500 bg-red-50/20" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw((v) => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <FieldError msg={errors.confirmPassword} />
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreeTerms}
                          onChange={(e) => set("agreeTerms", e.target.checked)}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-[#059669] focus:ring-[#059669] accent-[#059669]"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I agree to GetJobsCanada's{" "}
                          <a href="/terms" target="_blank" className="text-[#059669] font-bold hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" target="_blank" className="text-[#059669] font-bold hover:underline">
                            Privacy Policy
                          </a>.
                        </span>
                      </label>
                      <FieldError msg={errors.agreeTerms} />
                    </div>
                  </div>
                )}

                {/* STEP 3: OTP Verification */}
                {step === 3 && (
                  <div className="space-y-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto mb-1">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Verify Your Email</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        We sent a 6-digit verification code to <span className="font-bold text-slate-800">{form.email}</span>
                      </p>
                    </div>

                    {otpSentMsg && (
                      <p className="text-xs text-[#059669] font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        {otpSentMsg}
                      </p>
                    )}

                    {devOtp && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-mono">
                        Dev OTP: <strong>{devOtp}</strong>
                      </div>
                    )}

                    <div className="flex justify-center py-1">
                      <InputOTP
                        maxLength={6}
                        value={otpVal}
                        onChange={(v) => setOtpVal(v)}
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <InputOTPSlot
                              key={idx}
                              index={idx}
                              className="w-9 h-11 text-base font-bold border-slate-200 bg-slate-50/80 rounded-lg focus:border-[#059669]"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                      <span>Didn't receive code?</span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpCountdown > 0 || loading}
                        className="text-[#059669] font-bold hover:underline disabled:opacity-50"
                      >
                        {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : "Resend Code"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              {step > 1 && step < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="h-10 px-4 border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-xs"
                >
                  <ArrowLeft size={14} className="mr-1" /> Back
                </Button>
              )}

              <Button
                type="button"
                onClick={goNext}
                disabled={loading}
                className="flex-1 h-10 sm:h-11 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/15 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </span>
                ) : step === 3 ? (
                  <>
                    <span>Verify & Create Account</span>
                    <CheckCircle2 size={15} />
                  </>
                ) : (
                  <>
                    <span>Continue to Next Step</span>
                    <ChevronRight size={15} />
                  </>
                )}
              </Button>
            </div>

            {/* Existing User Login Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-[#059669] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-4">
            By registering, you agree to GetJobsCanada's{" "}
            <a href="/terms" className="hover:text-[#059669] underline">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="hover:text-[#059669] underline">Privacy Policy</a>.
          </p>
        </div>

      </div>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-16 px-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
