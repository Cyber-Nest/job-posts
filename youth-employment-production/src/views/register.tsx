import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from '@/router';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, CheckCircle, AlertCircle, ChevronRight, ArrowLeft, Mail, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* ── Types ──────────────────────────────────────────────────────────── */
interface FormData {
  // Step 1 — personal / org
  firstName: string;
  lastName: string;
  businessName: string;
  province: string;
  phoneNumber: string;
  // Step 2 — credentials
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  // Step 3 — OTP
  otp: string;
}

type StepErrors = Partial<Record<keyof FormData, string>>;

/* ── Constants ──────────────────────────────────────────────────────── */
const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland & Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Québec',
  'Saskatchewan', 'Yukon',
];

const STEP_LABELS = ['Your Details', 'Create Account', 'Verify Email'];

/* ── Helpers ────────────────────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
      <AlertCircle size={12} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

function LogoMark() {
  return (
    <Link to="/" className="inline-flex items-center group mb-6">
      <span
        className="flex flex-col leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-none">Youth Employment</span>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-blue-600 uppercase mt-0.5">Canada</span>
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
                  ? 'bg-green-500 text-white'
                  : active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? <CheckCircle size={14} /> : step}
            </div>
            {i < total - 1 && (
              <div
                className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
                  done ? 'bg-green-500' : 'bg-gray-200'
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
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  }),
};

/* ── Validation per step ────────────────────────────────────────────── */
function validateStep1(data: FormData): StepErrors {
  const errs: StepErrors = {};
  if (!data.firstName.trim()) errs.firstName = 'First name is required.';
  if (!data.lastName.trim()) errs.lastName = 'Last name is required.';
  if (!data.businessName.trim()) errs.businessName = 'Business name is required.';
  if (!data.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required.';
  if (!data.province) errs.province = 'Please select your province or territory.';
  return errs;
}

function validateStep2(data: FormData): StepErrors {
  const errs: StepErrors = {};
  if (!data.email) errs.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errs.email = 'Enter a valid email address.';
  if (!data.username.trim()) errs.username = 'Username is required.';
  if (!data.password) errs.password = 'Password is required.';
  else if (data.password.length < 8)
    errs.password = 'Password must be at least 8 characters.';
  else if (!/[a-z]/.test(data.password))
    errs.password = 'Password must include at least one lowercase letter.';
  else if (!/[A-Z]/.test(data.password))
    errs.password = 'Password must include at least one uppercase letter.';
  else if (!/[0-9]/.test(data.password))
    errs.password = 'Password must include at least one number.';
  if (!data.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
  else if (data.password !== data.confirmPassword)
    errs.confirmPassword = 'Passwords do not match.';
  if (!data.agreeTerms) errs.agreeTerms = 'You must agree to the terms to continue.';
  return errs;
}

function validateStep3(data: FormData): StepErrors {
  const errs: StepErrors = {};
  if (!data.otp || data.otp.length !== 6) {
    errs.otp = 'Please enter the 6-digit verification code.';
  }
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
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  const textColors = ['', 'text-red-500', 'text-yellow-600', 'text-blue-600', 'text-green-600'];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

/* ── OTP Timer ──────────────────────────────────────────────────────── */
function OTPTimer({ expiryTime, onResend }: { expiryTime: number | null; onResend: () => void }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiryTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft > 0) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return (
      <p className="text-xs text-gray-500 mt-2">
        Resend code in {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onResend}
      className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 flex items-center gap-1"
    >
      <RefreshCw size={12} />
      Resend verification code
    </button>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<StepErrors>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  // const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    businessName: '',
    province: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    otp: '',
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Send OTP to email
  const sendOTP = async () => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, purpose: 'registration' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      toast.success('Verification code sent to your email!');
      return true;
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message || 'Failed to send verification code.');
      return false;
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setServerError('');
    setLoading(true);
    const success = await sendOTP();
    setLoading(false);
    if (success) {
      setForm((prev) => ({ ...prev, otp: '' }));
    }
  };

  // Step 1 → Step 2
  const goToStep2 = async () => {
    const errs = validateStep1(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setDirection(1);
    setStep(2);
  };

  // Step 2 → Send OTP → Step 3
  const goToStep3 = async () => {
    const errs = validateStep2(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError('');
    
    // Send OTP
    const success = await sendOTP();
    if (success) {
      setDirection(1);
      setStep(3);
    }
    setLoading(false);
  };

  // Verify OTP and complete registration
  const verifyOTPAndRegister = async () => {
    const errs = validateStep3(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      // Verify OTP first
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp, purpose: 'registration' }),
      });
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setServerError(verifyData.error || 'Invalid verification code.');
        setLoading(false);
        return;
      }

      // If OTP verified, proceed with registration
      const registerResponse = await fetch('/api/auth/register/employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          password: form.password,
          businessName: form.businessName,
          phoneNumber: form.phoneNumber,
          province: form.province,
        }),
      });
      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        const errMsg = registerData.error || 'Registration failed.';
        setServerError(errMsg);
        toast.error(errMsg);
        setLoading(false);
        return;
      }

      setSubmitted(true);
      toast.success('Account created successfully! You can now log in.');
    } catch {
      const errMsg = 'Something went wrong. Please try again.';
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
    setErrors({});
    setServerError('');
  };

  /* ── Success ─────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <>
        <Helmet><title>Account Created — Youth Employment Canada</title></Helmet>
        <section className="bg-gradient-to-b from-blue-50 to-white min-h-[85vh] flex items-center justify-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h1
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Account Created Successfully!
              </h1>
              <p className="text-gray-600 text-sm mb-2">
                Thank you for registering with Youth Employment Canada.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Your employer account has been created. You can now log in and start posting jobs.
              </p>

              <div className="flex flex-col gap-3">
                <Link to="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Login to Your Account
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-blue-500 font-medium">
                    Go to Home
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────── */
  return (
    <>
      <Helmet>
        <title>Create Account — Youth Employment Canada</title>
        <meta
          name="description"
          content="Create your free Youth Employment Canada employer account. Post jobs and connect with youth talent across Canada."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-2">
            <LogoMark />
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Create Your Account
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Join Canada's youth employment platform — free to get started
            </p>
          </div>

          <div className="mt-7">
            <StepIndicator current={step} total={3} />
          </div>

          <p className="text-center text-xs font-semibold text-blue-600 uppercase tracking-widest mb-5">
            Step {step} of 3 — {STEP_LABELS[step - 1]}
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8"
              >
                {/* ── STEP 1: Your Details ──────────────────────────── */}
                {step === 1 && (
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-first" className="text-gray-700 font-medium text-sm">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-first"
                          value={form.firstName}
                          onChange={(e) => set('firstName', e.target.value)}
                          placeholder="First name"
                          className={`border-gray-200 focus-visible:ring-blue-300 ${errors.firstName ? 'border-red-400' : ''}`}
                        />
                        <FieldError msg={errors.firstName} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-last" className="text-gray-700 font-medium text-sm">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-last"
                          value={form.lastName}
                          onChange={(e) => set('lastName', e.target.value)}
                          placeholder="Last name"
                          className={`border-gray-200 focus-visible:ring-blue-300 ${errors.lastName ? 'border-red-400' : ''}`}
                        />
                        <FieldError msg={errors.lastName} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-org" className="text-gray-700 font-medium text-sm">
                        Business Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reg-org"
                        value={form.businessName}
                        onChange={(e) => set('businessName', e.target.value)}
                        placeholder="Your business or company name"
                        className={`border-gray-200 focus-visible:ring-blue-300 ${errors.businessName ? 'border-red-400' : ''}`}
                      />
                      <FieldError msg={errors.businessName} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-phone" className="text-gray-700 font-medium text-sm">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reg-phone"
                        value={form.phoneNumber}
                        onChange={(e) => set('phoneNumber', e.target.value)}
                        placeholder="Business phone number"
                        className={`border-gray-200 focus-visible:ring-blue-300 ${errors.phoneNumber ? 'border-red-400' : ''}`}
                      />
                      <FieldError msg={errors.phoneNumber} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-province" className="text-gray-700 font-medium text-sm">
                        Province / Territory <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="reg-province"
                        value={form.province}
                        onChange={(e) => set('province', e.target.value)}
                        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.province ? 'border-red-400' : 'border-gray-200'}`}
                      >
                        <option value="">Select province / territory</option>
                        {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                      </select>
                      <FieldError msg={errors.province} />
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Create Account ───────────────────────── */}
                {step === 2 && (
                  <div className="flex flex-col gap-5">
                    {serverError && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {serverError}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-username" className="text-gray-700 font-medium text-sm">
                        Username <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reg-username"
                        type="text"
                        value={form.username}
                        onChange={(e) => set('username', e.target.value)}
                        placeholder="Choose a username"
                        className={`border-gray-200 focus-visible:ring-blue-300 ${errors.username ? 'border-red-400' : ''}`}
                      />
                      <FieldError msg={errors.username} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-email" className="text-gray-700 font-medium text-sm">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="your@email.com"
                        className={`border-gray-200 focus-visible:ring-blue-300 ${errors.email ? 'border-red-400' : ''}`}
                      />
                      <FieldError msg={errors.email} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-password" className="text-gray-700 font-medium text-sm">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showPw ? 'text' : 'password'}
                          value={form.password}
                          onChange={(e) => set('password', e.target.value)}
                          placeholder="Create a strong password"
                          className={`border-gray-200 focus-visible:ring-blue-300 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <PasswordStrength password={form.password} />
                      <FieldError msg={errors.password} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-confirm" className="text-gray-700 font-medium text-sm">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-confirm"
                          type={showConfirmPw ? 'text' : 'password'}
                          value={form.confirmPassword}
                          onChange={(e) => set('confirmPassword', e.target.value)}
                          placeholder="Repeat your password"
                          className={`border-gray-200 focus-visible:ring-blue-300 pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <FieldError msg={errors.confirmPassword} />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreeTerms}
                          onChange={(e) => set('agreeTerms', e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-600 leading-relaxed">
                          I agree to Youth Employment Canada's{' '}
                          <a href="/terms-of-use" className="text-blue-600 hover:underline font-medium">Terms of Use</a>
                          {' '}and{' '}
                          <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
                        </span>
                      </label>
                      <FieldError msg={errors.agreeTerms} />
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Verify Email ─────────────────────────── */}
                {step === 3 && (
                  <div className="flex flex-col gap-5">
                    {serverError && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {serverError}
                      </div>
                    )}

                    <div className="text-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Mail size={28} className="text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Verify Your Email</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        We've sent a verification code to<br />
                        <span className="font-medium text-gray-700">{form.email}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-otp" className="text-gray-700 font-medium text-sm text-center">
                        Verification Code
                      </Label>
                      <Input
                        id="reg-otp"
                        type="text"
                        maxLength={6}
                        value={form.otp}
                        onChange={(e) => set('otp', e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest border-gray-200 focus-visible:ring-blue-300"
                      />
                      <FieldError msg={errors.otp} />
                    </div>

                    <OTPTimer expiryTime={otpExpiry} onResend={handleResendOTP} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className={`flex gap-3 px-6 sm:px-8 pb-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={loading}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                >
                  <ArrowLeft size={15} className="mr-1.5" /> Back
                </Button>
              )}
              <Button
                type="button"
                onClick={step === 1 ? goToStep2 : step === 2 ? goToStep3 : verifyOTPAndRegister}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {step === 3 ? 'Verifying...' : 'Processing...'}
                  </span>
                ) : step === 3 ? (
                  <span className="flex items-center gap-1.5">
                    Verify & Create Account <CheckCircle size={15} />
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Continue <ChevronRight size={15} />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </section>
    </>
  );
}