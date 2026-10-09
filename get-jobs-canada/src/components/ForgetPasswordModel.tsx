import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function PasswordStrength({ password }: { password?: string }) {
  if (!password) return null;
  const lengthValid = password.length >= 8;
  return (
    <div className="mt-2 text-xs flex items-center gap-1.5 font-medium">
      <div
        className={`w-2 h-2 rounded-full ${lengthValid ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      <span className={lengthValid ? "text-[#059669]" : "text-amber-600"}>
        {lengthValid
          ? "Strong password format"
          : "Password must be at least 8 characters"}
      </span>
    </div>
  );
}

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState("");

  // Background Scroll Prevention
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const interval = setInterval(() => {
      setOtpCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCountdown]);

  // Prevent browser back button on OTP step
  useEffect(() => {
    if (step === "otp") {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
        setError("Please complete verification or wait for the process.");
        setTimeout(() => setError(""), 3000);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [step]);

  // Handlers
  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiClient.post("/auth/forgot-password/send-otp", {
        email: email.toLowerCase().trim(),
      });

      if (data._devOtp) setDevOtp(data._devOtp);
      setSuccess("Verification code sent to your email.");
      toast.success("Verification code sent to your email!");
      setOtpCountdown(60);
      setStep("otp");
    } catch (err: any) {
      const errMsg = err.message || "Failed to send OTP. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpCountdown > 0 || loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiClient.post("/auth/forgot-password/send-otp", {
        email: email.toLowerCase().trim(),
      });

      if (data._devOtp) setDevOtp(data._devOtp);
      setSuccess("New verification code sent.");
      toast.success("New verification code sent!");
      setOtpCountdown(60);
      setOtp("");
    } catch (err: any) {
      const errMsg = err.message || "Failed to resend code.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/forgot-password/verify-otp", {
        email: email.toLowerCase().trim(),
        otp,
      });

      setSuccess("OTP verified! Set your new password.");
      toast.success("OTP verified! Set your new password.");
      setStep("reset");
    } catch (err: any) {
      const errMsg = err.message || "Failed to verify OTP.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError("Please enter a new password.");
      toast.error("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/forgot-password/reset", {
        email: email.toLowerCase().trim(),
        otp,
        newPassword,
      });

      setSuccess("Password reset successfully! Redirecting to login...");
      toast.success("Password reset successfully!");
      setTimeout(() => {
        handleForcedReset();
      }, 1500);
    } catch (err: any) {
      const errMsg = err.message || "Failed to reset password.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForcedReset = () => {
    onClose();
    setTimeout(() => {
      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
      setDevOtp("");
      setOtpCountdown(0);
    }, 300);
  };

  const handleCloseClick = () => {
    if (step === "email") {
      handleForcedReset();
    }
  };

  const handleBackdropClick = () => {
    if (step === "email") {
      handleForcedReset();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 ${step !== "email" ? "cursor-not-allowed" : "cursor-pointer"}`}
          />

          {/* Modal Center Layout */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-auto pointer-events-auto border border-slate-200"
            >
              {/* Header */}
              <div className="bg-slate-950 px-6 py-5 flex justify-between items-center text-white border-b border-slate-800">
                <div>
                  <h3 className="text-white font-extrabold text-xl tracking-tight">
                    Reset Password
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">
                    {step === "email" && "Reset your password in 3 simple steps"}
                    {step === "otp" && "Enter the verification code"}
                    {step === "reset" && "Create a new secure password"}
                  </p>
                </div>
                {step === "email" && (
                  <button
                    onClick={handleCloseClick}
                    className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-2 rounded-full transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Content Core Wrapper */}
              <div className="p-6">
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-6 select-none">
                  {["Email", "OTP", "Reset"].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive =
                      (step === "email" && stepNum === 1) ||
                      (step === "otp" && stepNum === 2) ||
                      (step === "reset" && stepNum === 3);
                    const isDone =
                      (step === "otp" && stepNum === 1) ||
                      (step === "reset" && (stepNum === 1 || stepNum === 2));

                    return (
                      <div key={label} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isDone
                              ? "bg-[#059669] text-white shadow-sm"
                              : isActive
                                ? "bg-[#059669] text-white shadow-md ring-4 ring-[#059669]/15"
                                : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={16} /> : stepNum}
                        </div>
                        {idx < 2 && (
                          <div
                            className={`w-10 h-1 rounded-full mx-1 ${isDone ? "bg-[#059669]" : "bg-slate-200"}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Error/Success Feedback Panels */}
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl p-4 mb-4">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-600" />
                    <span className="leading-normal font-medium">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-[#059669] text-xs sm:text-sm rounded-2xl p-4 mb-4">
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">
                      {success}
                    </span>
                  </div>
                )}

                {/* Step 1: Email Form */}
                {step === "email" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Email Address <span className="text-[#059669]">*</span>
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full h-11 bg-slate-50/60 border border-slate-200 rounded-2xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                        onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                      />
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        We'll send a 6-digit verification code to confirm ownership.
                      </p>
                    </div>
                    <Button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2 justify-center">
                          <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending Code...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          Send Verification Code <Mail size={16} />
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === "otp" && (
                  <div className="space-y-4">
                    <div className="text-center bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
                      <p className="text-xs font-medium text-slate-500">
                        Verification code sent to
                      </p>
                      <p className="text-sm font-bold text-[#059669] break-all mt-0.5">
                        {email}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center my-4">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={loading}
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <InputOTPSlot
                              key={idx}
                              index={idx}
                              className="w-10 h-12 text-lg font-bold border-slate-200 bg-slate-50/80 rounded-xl focus:border-[#059669]"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <div className="text-center min-h-[24px]">
                      {otpCountdown > 0 ? (
                        <p className="text-xs font-medium text-slate-500">
                          Resend code in{" "}
                          <span className="font-bold text-slate-800">
                            {otpCountdown}s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={loading}
                          className="inline-flex items-center gap-1.5 text-xs text-[#059669] hover:underline font-bold transition-colors cursor-pointer"
                        >
                          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                          Resend Verification Code
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length < 6}
                      className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-900/15"
                    >
                      {loading ? "Verifying Code..." : "Verify & Continue"}
                    </Button>
                  </div>
                )}

                {/* Step 3: Reset Password Form */}
                {step === "reset" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        New Password <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full h-11 bg-slate-50/60 border border-slate-200 rounded-2xl pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <PasswordStrength password={newPassword} />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Confirm New Password <span className="text-[#059669]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full h-11 bg-slate-50/60 border border-slate-200 rounded-2xl pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                          onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-900/15"
                    >
                      {loading ? (
                        "Updating Password..."
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          Reset Password <Lock size={16} />
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ForgotPasswordModal;
