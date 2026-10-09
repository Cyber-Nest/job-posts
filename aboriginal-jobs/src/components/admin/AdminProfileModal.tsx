"use client";

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
  User,
  KeyRound,
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

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newEmail: string) => void;
}

export default function AdminProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminProfileModalProps) {
  const [step, setStep] = useState<"view" | "edit" | "otp">("view");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailChangeCount, setEmailChangeCount] = useState(0);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState("");

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchCredentials();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const interval = setInterval(() => {
      setOtpCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const fetchCredentials = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/credentials");
      if (!res.ok) {
        throw new Error("Failed to load admin details.");
      }
      const data = await res.json();
      if (data.success) {
        setEmail(data.email);
        setPassword(data.password);
        setNewEmail(data.email);
        setNewPassword(data.password);
        setEmailChangeCount(data.emailChangeCount || 0);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!newEmail) {
      setError("Email address is required.");
      toast.error("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    const payload: any = {};
    let isEmailChanged = false;
    let isPasswordChanged = false;

    if (newEmail.toLowerCase() !== email.toLowerCase()) {
      payload.newEmail = newEmail.toLowerCase().trim();
      isEmailChanged = true;
    }
    if (newPassword && newPassword !== "••••••••" && newPassword.trim() !== "") {
      payload.newPassword = newPassword.trim();
      isPasswordChanged = true;
    }

    if (!isEmailChanged && !isPasswordChanged) {
      setError("No changes detected from current credentials.");
      toast.error("No changes detected from current credentials.");
      return;
    }

    // Check client side email change count limit
    if (isEmailChanged && emailChangeCount >= 3) {
      setError("You have reached the maximum limit of 3 email changes.");
      toast.error("Maximum limit of 3 email changes reached.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/auth/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to send verification code.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      if (data._devOtp) {
        setDevOtp(data._devOtp);
      }
      setSuccess(`Verification code sent to current email: ${email}`);
      toast.success("Verification code sent to your email!");
      setOtpCountdown(60);
      setStep("otp");
      setOtp("");
    } catch {
      setError("Failed to process request. Please try again.");
      toast.error("Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpCountdown > 0 || loading) return;
    
    const payload: any = {};
    if (newEmail.toLowerCase() !== email.toLowerCase()) {
      payload.newEmail = newEmail.toLowerCase().trim();
    }
    if (newPassword && newPassword !== "••••••••" && newPassword.trim() !== "") {
      payload.newPassword = newPassword.trim();
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/auth/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to resend code.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      if (data._devOtp) {
        setDevOtp(data._devOtp);
      }
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

  const handleVerifyAndUpdate = async () => {
    if (otp.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      toast.error("Please enter the 6-digit code.");
      return;
    }

    const payload: any = { otp };
    let isEmailChanged = false;
    if (newEmail.toLowerCase() !== email.toLowerCase()) {
      payload.newEmail = newEmail.toLowerCase().trim();
      isEmailChanged = true;
    }
    if (newPassword && newPassword !== "••••••••" && newPassword.trim() !== "") {
      payload.newPassword = newPassword.trim();
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/auth/change-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Verification failed. Please try again.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      toast.success("Admin credentials updated successfully!");
      const updatedEmail = newEmail.toLowerCase().trim();
      const updatedPassword = (newPassword && newPassword !== "••••••••" && newPassword.trim() !== "") 
        ? newPassword.trim() 
        : password;

      setEmail(updatedEmail);
      setPassword(updatedPassword);
      setNewEmail(updatedEmail);
      setNewPassword(updatedPassword);

      if (isEmailChanged) {
        setEmailChangeCount((prev) => prev + 1);
      }

      if (onSuccess) {
        onSuccess(updatedEmail);
      }

      // Go back to view mode
      setStep("view");
      setDevOtp("");
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setStep("view");
    setError("");
    setSuccess("");
    setDevOtp("");
    setNewEmail(email);
    setNewPassword(password);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-auto pointer-events-auto border border-[#C8782A]/10"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#C8782A] to-[#B06820] px-6 py-5 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-xl tracking-wide">
                    Admin Profile
                  </h3>
                  <p className="text-white/80 text-xs mt-1 font-medium">
                    {step === "view" && `View credentials (Email changes: ${emailChangeCount}/3)`}
                    {step === "edit" && `Change email & password (Email changes: ${emailChangeCount}/3)`}
                    {step === "otp" && "Verify identity with verification code"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Body */}
              <div className="p-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-6 select-none">
                  {["Credentials", "Update", "Verify"].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive =
                      (step === "view" && stepNum === 1) ||
                      (step === "edit" && stepNum === 2) ||
                      (step === "otp" && stepNum === 3);
                    const isDone =
                      (step === "edit" && stepNum === 1) ||
                      (step === "otp" && (stepNum === 1 || stepNum === 2));

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

                {/* Inline Errors/Success */}
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 animate-in fade-in duration-200 font-medium">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 animate-in fade-in duration-200 font-medium">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* VIEW MODE */}
                {step === "view" && (
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                          Current Admin Email
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            type="text"
                            value={email}
                            readOnly
                            className="bg-[#FAF5EE]/40 border-[#C8782A]/10 h-11 text-sm rounded-xl font-medium focus-visible:ring-0 cursor-default"
                          />
                          <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                          Current Admin Password
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={showPassword ? password : "••••••••"}
                            readOnly
                            className="bg-[#FAF5EE]/40 border-[#C8782A]/10 h-11 text-sm rounded-xl font-medium focus-visible:ring-0 cursor-default pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] transition-colors p-1"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep("edit")}
                      disabled={loading}
                      className="w-full h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer mt-2"
                    >
                      Change Credentials
                    </Button>
                  </div>
                )}

                {/* EDIT MODE */}
                {step === "edit" && (
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                            New Admin Email
                          </Label>
                          {emailChangeCount >= 3 && (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 animate-pulse">
                              Limit reached (3/3)
                            </span>
                          )}
                        </div>
                        <div className="relative mt-1.5">
                          <Input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="new-admin@email.com"
                            disabled={emailChangeCount >= 3}
                            className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 h-11 text-sm rounded-xl font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#6B3A2A] font-bold text-sm tracking-wide">
                          New Admin Password
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword === "••••••••" ? "" : newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (leave empty to keep current)"
                            className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 h-11 text-sm rounded-xl font-medium pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] transition-colors p-1"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep("view");
                          setNewEmail(email);
                          setNewPassword(password);
                        }}
                        disabled={loading}
                        className="flex-1 h-11 border-[#C8782A]/20 text-[#6B3A2A] hover:bg-[#FAF5EE]/60 hover:text-black rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="flex-1 h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2 justify-center">
                            <RefreshCw size={14} className="animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          "Send OTP Code"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* OTP VERIFICATION MODE */}
                {step === "otp" && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center bg-[#FAF5EE]/60 rounded-2xl py-3.5 px-4 border border-[#C8782A]/10">
                      <p className="text-xs font-semibold text-[#6B3A2A]/70">
                        A 6-digit OTP code was sent to the old email:
                      </p>
                      <p className="text-sm font-bold text-[#C8782A] break-all mt-1">
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

                    {/* Resend button / countdown */}
                    <div className="text-center min-h-[24px]">
                      {otpCountdown > 0 ? (
                        <p className="text-xs font-semibold text-[#6B3A2A]/50">
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

                    {/* Dev OTP Box */}
                    {devOtp && (
                      <div className="bg-[#FAF5EE]/80 border border-[#C8782A]/15 rounded-2xl p-3 text-center">
                        <p className="text-[10px] font-bold text-[#C8782A] uppercase tracking-wider mb-0.5">
                          🛠️ Dev Mode Auto-OTP
                        </p>
                        <p className="text-xs text-[#6B3A2A]/70 font-medium">
                          OTP:{" "}
                          <span className="text-[#C8782A] font-mono text-sm font-bold tracking-wider">
                            {devOtp}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep("edit");
                          setOtp("");
                        }}
                        disabled={loading}
                        className="flex-1 h-11 border-[#C8782A]/20 text-[#6B3A2A] hover:bg-[#FAF5EE]/60 rounded-xl"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleVerifyAndUpdate}
                        disabled={loading || otp.length < 6}
                        className="flex-1 h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2 justify-center">
                            <RefreshCw size={14} className="animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          "Verify & Update"
                        )}
                      </Button>
                    </div>
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
