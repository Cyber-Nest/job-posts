"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Lock, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

import { apiClient } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setError("");

      await apiClient.post("/admin/auth/login", { email, password });

      router.push("/admin/coupons");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Lighting Decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#059669]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#059669] to-emerald-400 mb-4 shadow-lg shadow-emerald-950/50">
            <ShieldCheck size={28} className="text-white" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            GetJobs<span className="text-[#059669] font-bold">Canada</span> Executive System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Administrator Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized credentials required for access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@getjobscanada.ca"
                  required
                  className="w-full h-11 bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-11 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-950/60 border border-red-800 rounded-2xl p-4 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#059669] hover:bg-[#047857] disabled:opacity-60 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In to Admin Portal"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Admin system access — strictly authorized personnel only.
        </p>
      </div>
    </div>
  );
}
