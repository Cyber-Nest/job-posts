import { useState, useEffect } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Link, useNavigate, useLocation } from "@/router";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithIdentifier } from "@/lib/auth/auth-client";
import toast from "react-hot-toast";

/* ── Animation ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ── Logo mark ──────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <Link to="/" className="inline-flex items-center group mb-6">
      <span
        className="flex flex-col leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-none">
          Youth Employment
        </span>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-blue-600 uppercase mt-0.5">
          Canada
        </span>
      </span>
    </Link>
  );
}

/* ── Validation ─────────────────────────────────────────────────────── */
function validate(identifier: string, password: string) {
  const errs: { identifier?: string; password?: string } = {};
  if (!identifier.trim()) errs.identifier = "Email or username is required.";
  else if (
    identifier.includes("@") &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
  ) {
    errs.identifier = "Enter a valid email address or username.";
  }
  if (!password) errs.password = "Password is required.";
  else if (password.length < 6)
    errs.password = "Password must be at least 6 characters.";
  return errs;
}

/* ── Field error ────────────────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
      <AlertCircle size={12} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

/* ── OTP Timer Component ───────────────────────────────────────────── */
function OTPTimer({
  expiryTime,
  onResend,
  isResending,
}: {
  expiryTime: number | null;
  onResend: () => void;
  isResending: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiryTime - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft > 0) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return (
      <p className="text-xs text-gray-500 text-center mt-3">
        Resend code in {minutes}:{seconds.toString().padStart(2, "0")}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onResend}
      disabled={isResending}
      className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-3 flex items-center justify-center gap-1 w-full"
    >
      {isResending ? (
        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
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
      ) : (
        "Resend verification code"
      )}
    </button>
  );
}

/* ── Forgot Password Modal ─────────────────────────────────────────── */
function ForgotPasswordModal({
  closeModal,
  resetStep,
  setResetStep,
  showResetPassword,
  setShowResetPassword,
  resetEmail,
  setResetEmail,
  resetOtp,
  setResetOtp,
  resetNewPassword,
  setResetNewPassword,
  resetConfirmPassword,
  setResetConfirmPassword,
  resetError,
  setResetError,
  resetSuccess,
  resetLoading,
  otpExpiry,
  handleSendResetOtp,
  handleVerifyOtp,
  handleResetPassword,
  handleResendOtp,
}: any) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button for OTP step */}
        {resetStep === "otp" && !showResetPassword && (
          <button
            onClick={() => {
              setResetStep("email");
              setResetError("");
              setResetOtp("");
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {/* Back button for reset password step */}
        {showResetPassword && (
          <button
            onClick={() => {
              setShowResetPassword(false);
              setResetNewPassword("");
              setResetConfirmPassword("");
              setResetError("");
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={16} /> Back to OTP
          </button>
        )}

        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {showResetPassword
            ? "Set New Password"
            : resetStep === "success"
              ? "Success!"
              : "Reset Password"}
        </h2>

        {/* Step 1 */}
        {resetStep === "email" && !showResetPassword && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address and we'll send you a verification code to
              reset your password.
            </p>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={14} />
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {resetSuccess}
              </div>
            )}

            <Input
              type="email"
              placeholder="your@email.com"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value);
                setResetError("");
              }}
              className="border-gray-200 focus-visible:ring-blue-300 mb-4"
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1 border-gray-200"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSendResetOtp}
                disabled={resetLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {resetLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {resetStep === "otp" && !showResetPassword && (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Enter the 6-digit verification code sent to{" "}
              <strong className="text-blue-600">{resetEmail}</strong>
            </p>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={14} />
                {resetError}
              </div>
            )}

            <Input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={resetOtp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                setResetOtp(value);
                setResetError("");
              }}
              className="border-gray-200 focus-visible:ring-blue-300 mb-2 text-center text-sm tracking-[8px] font-mono"
            />

            <OTPTimer
              expiryTime={otpExpiry}
              onResend={handleResendOtp}
              isResending={resetLoading}
            />

            <div className="flex gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1 border-gray-200"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={resetLoading || resetOtp.length !== 6}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {resetLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {showResetPassword && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Create a new password for{" "}
              <strong className="text-blue-600">{resetEmail}</strong>
            </p>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={14} />
                {resetError}
              </div>
            )}

            <div className="relative mb-3">
              <Input
                type="password"
                placeholder="New password"
                value={resetNewPassword}
                onChange={(e) => {
                  setResetNewPassword(e.target.value);
                  setResetError("");
                }}
                className="border-gray-200 focus-visible:ring-blue-300"
              />
            </div>

            <div className="relative mb-4">
              <Input
                type="password"
                placeholder="Confirm new password"
                value={resetConfirmPassword}
                onChange={(e) => {
                  setResetConfirmPassword(e.target.value);
                  setResetError("");
                }}
                className="border-gray-200 focus-visible:ring-blue-300"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1 border-gray-200"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </>
        )}

        {/* Success */}
        {resetStep === "success" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <LogIn size={28} className="text-green-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Password Reset Successfully!
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              You can now log in with your new password.
            </p>

            <Button
              type="button"
              onClick={closeModal}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              Back to Login
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  // Login form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState<"email" | "otp" | "success">(
    "email",
  );
  const [resetOtp, setResetOtp] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(identifier, password);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      const result = await loginWithIdentifier(identifier, password);
      if (result.error) {
        const msg =
          result.error.message || "Invalid email, username, or password.";
        setServerError(msg);
        toast.error(msg);
      } else {
        toast.success("Signed in successfully!");
        const user = result.data?.user;
        if (user?.accountType === "employer") {
          navigate("/dashboard", { replace: true });
        } else if (from === "/dashboard") {
          navigate("/", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch {
      const msg = "Something went wrong. Please try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for password reset
  const handleSendResetOtp = async () => {
    if (!resetEmail) {
      setResetError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Enter a valid email address.");
      return;
    }

    setResetLoading(true);
    setResetError("");
    setResetSuccess("");
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, purpose: "password_reset" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code.");
      }
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      setResetStep("otp");
    } catch (error: any) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!resetOtp || resetOtp.length !== 6) {
      setResetError("Please enter the 6-digit verification code.");
      return;
    }

    setResetLoading(true);
    setResetError("");
    try {
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          otp: resetOtp,
          purpose: "password_reset",
        }),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Invalid verification code.");
      }

      // OTP verified, show reset password form
      setShowResetPassword(true);
    } catch (error: any) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!resetNewPassword || resetNewPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    setResetError("");
    try {
      const resetResponse = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          newPassword: resetNewPassword,
          confirmPassword: resetConfirmPassword,
        }),
      });
      const resetData = await resetResponse.json();
      if (!resetResponse.ok) {
        throw new Error(resetData.error || "Failed to reset password.");
      }

      setResetStep("success");
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetStep("email");
        setShowResetPassword(false);
        setResetEmail("");
        setResetOtp("");
        setResetNewPassword("");
        setResetConfirmPassword("");
        setResetSuccess("");
        setResetError("");
      }, 3000);
    } catch (error: any) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResetLoading(true);
    setResetError("");
    setResetSuccess("");
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, purpose: "password_reset" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
    } catch (error: any) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  // Close modal and reset all states
  const closeModal = () => {
    setShowForgotPassword(false);
    setResetStep("email");
    setShowResetPassword(false);
    setResetEmail("");
    setResetOtp("");
    setResetNewPassword("");
    setResetConfirmPassword("");
    setResetError("");
    setResetSuccess("");
    setOtpExpiry(null);
  };

  /* ── Login form ────────────────────────────────────────────────── */
  return (
    <>
      <Helmet>
        <title>Login — Youth Employment Canada</title>
        <meta
          name="description"
          content="Log in to your Youth Employment Canada account to manage your job applications or employer dashboard."
        />
      </Helmet>
      <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center py-16 px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <LogoMark />
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in to your Youth Employment Canada account
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {serverError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="login-identifier"
                  className="text-gray-700 font-medium text-sm"
                >
                  Email Address or Username
                </Label>
                <Input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier)
                      setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  placeholder="Email or username"
                  className={`border-gray-200 focus-visible:ring-blue-300 ${errors.identifier ? "border-red-400" : ""}`}
                />
                <FieldError msg={errors.identifier} />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="login-password"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Your password"
                    className={`border-gray-200 focus-visible:ring-blue-300 pr-10 ${errors.password ? "border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldError msg={errors.password} />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span className="text-sm text-gray-600">Keep me signed in</span>
              </label>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full mt-1 transition-all duration-200 shadow-md hover:shadow-lg"
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
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <LogIn size={15} />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <Link to="/register">
              <Button
                variant="outline"
                className="w-full border-gray-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-sm font-medium"
              >
                Employer Sign Up
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
            By signing in you agree to Youth Employment Canada's{" "}
            <a
              href="/terms-of-use"
              className="hover:text-blue-600 underline underline-offset-2"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="hover:text-blue-600 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </section>
      {showForgotPassword && (
        <ForgotPasswordModal
          closeModal={closeModal}
          resetStep={resetStep}
          setResetStep={setResetStep}
          showResetPassword={showResetPassword}
          setShowResetPassword={setShowResetPassword}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          resetOtp={resetOtp}
          setResetOtp={setResetOtp}
          resetNewPassword={resetNewPassword}
          setResetNewPassword={setResetNewPassword}
          resetConfirmPassword={resetConfirmPassword}
          setResetConfirmPassword={setResetConfirmPassword}
          resetError={resetError}
          setResetError={setResetError}
          resetSuccess={resetSuccess}
          resetLoading={resetLoading}
          otpExpiry={otpExpiry}
          handleSendResetOtp={handleSendResetOtp}
          handleVerifyOtp={handleVerifyOtp}
          handleResetPassword={handleResetPassword}
          handleResendOtp={handleResendOtp}
        />
      )}
    </>
  );
}
