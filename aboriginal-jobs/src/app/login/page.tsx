"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, 
  CheckCircle, Mail, Lock, RefreshCw, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth/auth-client';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import ForgotPasswordModal from '@/components/ForgetPasswordModel';
import toast from 'react-hot-toast';

/* ── Logo mark ──────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center group mb-6">
      <span
        className="flex flex-col leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="font-bold text-2xl tracking-tight text-[#6B3A2A] group-hover:text-[#C8782A] transition-colors duration-200 leading-none">Aboriginal Jobs</span>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C8782A] uppercase mt-0.5">Canada</span>
      </span>
    </Link>
  );
}

/* ── Field error ────────────────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
      <AlertCircle size={12} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

/* ── Password Strength Meter ────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-[#7A9E7E]'];
  const textColors = ['', 'text-red-500', 'text-yellow-600', 'text-blue-600', 'text-[#7A9E7E]'];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-[#C8782A]/10'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}



/* ── Main Login Form ────────────────────────────────────────────────── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        const errMsg = result.error.message || 'Invalid email or password.';
        setServerError(errMsg);
        toast.error(errMsg);
      } else {
        toast.success('Signed in successfully!');
        window.location.href = from;
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />

      <section className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <LogoMark />
            <h1 className="text-3xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome Back
            </h1>
            <p className="text-[#6B3A2A]/65 mt-2 text-sm">
              Sign in to your Aboriginal Jobs Canada account
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#C8782A]/10 shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {serverError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {serverError}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-email" className="text-[#6B3A2A] font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="your@email.com"
                  className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 ${errors.email ? 'border-red-400' : ''}`}
                />
                <FieldError msg={errors.email} />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-[#6B3A2A] font-medium text-sm">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-[#C8782A] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Your password"
                    className={`border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30 focus-visible:ring-[#C8782A]/30 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 hover:text-[#C8782A] transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldError msg={errors.password} />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#C8782A]" />
                <span className="text-sm text-[#6B3A2A]/70">Keep me signed in</span>
              </label>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full mt-1 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <LogIn size={15} /></span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-[#6B3A2A]/60 mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#C8782A] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          <Link href="/register?type=employer" className="w-full mt-5 block">
            <Button
              variant="outline"
              className="w-full border-[#6B3A2A]/25 text-[#6B3A2A] hover:bg-[#6B3A2A]/5 hover:text-black hover:border-[#6B3A2A]/50 text-sm font-medium"
            >
              Employer Sign Up
            </Button>
          </Link>

          <p className="text-center text-xs text-[#6B3A2A]/40 mt-5 leading-relaxed">
            By signing in you agree to Aboriginal Jobs Canada's{' '}
            <a href="/terms" className="hover:text-[#C8782A] underline underline-offset-2">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="hover:text-[#C8782A] underline underline-offset-2">Privacy Policy</a>.
          </p>
        </motion.div>
      </section>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-16 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8782A]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}