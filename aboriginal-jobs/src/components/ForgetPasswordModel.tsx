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
} from "lucide-react";
import toast from "react-hot-toast";

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
        className={`w-2 h-2 rounded-full ${lengthValid ? "bg-green-500" : "bg-amber-500"}`}
      />
      <span className={lengthValid ? "text-green-600" : "text-amber-600"}>
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

  //Background Scroll Prevention
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
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to send OTP. Please try again.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      if (data._devOtp) setDevOtp(data._devOtp);
      setSuccess("Verification code sent to your email.");
      toast.success("Verification code sent to your email!");
      setOtpCountdown(60);
      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
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
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to resend OTP.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      if (data._devOtp) setDevOtp(data._devOtp);
      setSuccess("New verification code sent.");
      toast.success("New verification code sent!");
      setOtpCountdown(60);
      setOtp("");
    } catch {
      setError("Failed to resend code.");
      toast.error("Failed to resend code.");
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
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Invalid or expired verification code.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      setSuccess("OTP verified! Set your new password.");
      toast.success("OTP verified! Set your new password.");
      setStep("reset");
    } catch {
      setError("Failed to verify OTP.");
      toast.error("Failed to verify OTP.");
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
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          otp,
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to reset password.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      setSuccess("Password reset successfully! You can now login.");
      toast.success("Password reset successfully!");
      setTimeout(() => {
        handleForcedReset();
      }, 2000);
    } catch {
      setError("Failed to reset password.");
      toast.error("Failed to reset password.");
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

  // Step 1 helper close
  const handleCloseClick = () => {
    if (step === "email") {
      handleForcedReset();
    }
  };

  // Outside layout barrier controller
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
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 ${step !== "email" ? "cursor-not-allowed" : "cursor-pointer"}`}
          />

          {/* Modal Center Layout */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#C8782A] to-[#B06820] px-6 py-5 flex justify-between items-center">
                <div>
                  <h3
                    className="text-white font-bold text-xl tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Forgot Password
                  </h3>
                  <p className="text-white/80 text-xs mt-1 font-medium">
                    {step === "email" &&
                      "Reset your password in 3 simple steps"}
                    {step === "otp" && "Enter the verification code"}
                    {step === "reset" && "Create a new secure password"}
                  </p>
                </div>
                {/* Close Button is hidden strictly if workflow passes Step 1 */}
                {step === "email" && (
                  <button
                    onClick={handleCloseClick}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200"
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
                              ? "bg-[#7A9E7E] text-white shadow-sm"
                              : isActive
                                ? "bg-[#C8782A] text-white shadow-md"
                                : "bg-[#C8782A]/10 text-[#6B3A2A]/40"
                          }`}
                        >
                          {isDone ? <CheckCircle size={14} /> : stepNum}
                        </div>
                        {idx < 2 && (
                          <div
                            className={`w-10 h-0.5 rounded-full mx-1 ${isDone ? "bg-[#7A9E7E]" : "bg-[#C8782A]/15"}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Error/Success Feedback Panels */}
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 animate-in fade-in duration-200">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 animate-in fade-in duration-200">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">
                      {success}
                    </span>
                  </div>
                )}

                {/* Step 1: Email Form */}
                {step === "email" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1.5 h-11 placeholder:text-[#1C1C1C]/30 border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 text-sm rounded-xl"
                        onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                      />
                      <p className="text-xs text-[#6B3A2A]/50 mt-2 font-medium leading-normal">
                        We'll send a 6-digit verification code to confirm
                        ownership.
                      </p>
                    </div>
                    <Button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md shadow-[#C8782A]/10 active:scale-[0.99] transition-transform cursor-pointer"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2 justify-center">
                          <svg
                            className="animate-spin w-4 h-4 text-white"
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
                          Sending Code...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          Send Verification Code <Mail size={15} />
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === "otp" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="text-center bg-[#FAF5EE]/60 rounded-xl py-2.5 px-3 border border-[#C8782A]/5">
                      <p className="text-xs font-medium text-[#6B3A2A]/70">
                        We sent a verification code to
                      </p>
                      <p className="text-sm font-bold text-[#C8782A] break-all mt-0.5">
                        {email}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center my-5">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={loading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="border-[#C8782A]/20 focus:border-[#C8782A] w-11 h-12 text-base rounded-l-xl"
                          />
                          <InputOTPSlot
                            index={1}
                            className="border-[#C8782A]/20 focus:border-[#C8782A] w-11 h-12 text-base"
                          />
                          <InputOTPSlot
                            index={2}
                            className="border-[#C8782A]/20 focus:border-[#C8782A] w-11 h-12 text-base rounded-r-xl"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-[#C8782A]/40 mx-1" />
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="border-[#C8782A]/20 focus:border-[#C8782A] w-11 h-12 text-base rounded-l-xl"
                          />
                          <InputOTPSlot
                            index={4}
                            className="border-[#C8782A]/20 focus:border-[#C8782A] w-11 h-12 text-base"
                          />
                          <InputOTPSlot
                            index={5}
                            className="border-[#C8782A]/20 focus:border-[#C8782A] w-11 h-12 text-base rounded-r-xl"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <div className="text-center min-h-[24px]">
                      {otpCountdown > 0 ? (
                        <p className="text-xs font-medium text-[#6B3A2A]/50">
                          Resend code in{" "}
                          <span className="font-bold text-[#6B3A2A]">
                            {otpCountdown}s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={loading}
                          className="inline-flex items-center gap-1.5 text-xs text-[#C8782A] hover:text-[#B06820] font-bold transition-colors cursor-pointer"
                        >
                          <RefreshCw
                            size={12}
                            className={loading ? "animate-spin" : ""}
                          />
                          Resend Verification Code
                        </button>
                      )}
                    </div>

                    {/* {devOtp && (
                      <div className="bg-[#FAF5EE] border border-[#C8782A]/15 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-[#C8782A] uppercase tracking-wider mb-0.5">
                          🛠️ Dev Sandbox
                        </p>
                        <p className="text-xs text-[#6B3A2A]/70 font-medium">
                          Auto-generated OTP:{" "}
                          <span className="text-[#C8782A] font-mono text-sm font-bold tracking-wider">
                            {devOtp}
                          </span>
                        </p>
                      </div>
                    )} */}

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length < 6}
                      className="w-full h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md shadow-[#C8782A]/10 transition-all cursor-pointer"
                    >
                      {loading ? "Verifying Code..." : "Verify & Continue"}
                    </Button>
                  </div>
                )}

                {/* Step 3: Reset Password Form */}
                {step === "reset" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div>
                      <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                        New Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="h-11 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 pr-10 text-sm rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] p-1 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                      <PasswordStrength password={newPassword} />
                    </div>

                    <div>
                      <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                        Confirm New Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="h-11 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 pr-10 text-sm rounded-xl"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleResetPassword()
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] p-1 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="w-full h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md shadow-[#C8782A]/10 transition-all cursor-pointer"
                    >
                      {loading ? (
                        "Updating Password..."
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          Reset Password <Lock size={15} />
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
