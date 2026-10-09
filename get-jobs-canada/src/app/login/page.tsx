"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Eye, EyeOff, LogIn, AlertCircle, 
  Mail, Lock, Briefcase, ShieldCheck, Sparkles, Building2, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth/auth-client';
import ForgotPasswordModal from '@/components/ForgetPasswordModel';
import toast from 'react-hot-toast';

/* ── Brand Logo Header ────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-1 group mb-3">
      <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-[#059669] transition-colors">
        GetJobs<span className="text-[#059669] font-black">Canada</span>
      </span>
    </Link>
  );
}

/* ── Main Login Component ─────────────────────────────────────────────── */
function LoginForm() {
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

      <section className="bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 min-h-[calc(100vh-4.2rem)] flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="w-full max-w-[1240px] bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-emerald-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
          
          {/* Left Hero Panel (5 cols on Desktop) */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#059669]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              {/* Executive Dual-Pill Badge */}
              <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-900/90 border border-slate-800 shadow-xs mb-5">
                <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                  PORTAL
                </span>
                <span className="text-xs font-semibold text-slate-300 leading-none">
                  Canada Wide Career Network
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Connecting Canadian Talent with Top Employers.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Sign in to manage your job applications, save favorite postings, or access your recruiter dashboard.
              </p>

              {/* Value Points */}
              <div className="space-y-3">
                {[
                  { title: "Thousands of Active Listings", desc: "Discover verified jobs across all 10 provinces & territories" },
                  { title: "Verified Canadian Employers", desc: "Direct access to top companies and recruiters" },
                  { title: "Instant Application Tracking", desc: "Stay updated on your application status in real-time" },
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
            </div>

            {/* Bottom Footer Trust Badge */}
            <div className="relative z-10 pt-4 mt-6 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">© {new Date().getFullYear()} GetJobsCanada</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck size={13} /> 100% Secure Auth
              </span>
            </div>
          </div>

          {/* Right Form Container (7 cols on Desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <LogoMark />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">
                  Enter your account credentials to continue
                </p>
              </div>

              {serverError && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl p-3">
                  <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {/* Email Address */}
                <div className="space-y-1">
                  <Label htmlFor="login-email" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Email Address <span className="text-[#059669]">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@example.com"
                      className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                        errors.email ? 'border-red-500 bg-red-50/20' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Password <span className="text-[#059669]">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] text-[#059669] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className={`w-full h-10 bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                        errors.password ? 'border-red-500 bg-red-50/20' : ''
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
                  {errors.password && (
                    <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Keep Me Signed In */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-[#059669] focus:ring-[#059669] accent-[#059669]" />
                    <span className="text-xs font-semibold text-slate-600">Keep me signed in</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 sm:h-11 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/15 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <LogIn size={15} />
                    </>
                  )}
                </Button>
              </form>

              {/* Don't Have an Account? */}
              <div className="mt-4 text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  Don't have an account yet?{' '}
                  <Link href="/register" className="text-[#059669] font-bold hover:underline">
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Employer Registration Action */}
              <div className="mt-3">
                <Link href="/register?type=employer" className="block">
                  <button className="w-full h-10 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200/60">
                    <Building2 size={14} className="text-[#059669]" />
                    <span>Recruiter / Employer Sign Up</span>
                  </button>
                </Link>
              </div>
            </div>

            <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-4">
              By signing in you agree to GetJobsCanada's{' '}
              <a href="/terms" className="hover:text-[#059669] underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="hover:text-[#059669] underline">Privacy Policy</a>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-16 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}