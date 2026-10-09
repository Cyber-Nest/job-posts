"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/coupons");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C8782A]/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C8782A]/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C8782A] mb-4 shadow-lg">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-[#1C1C1C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admin Panel
          </h1>
          <p className="text-sm text-[#6B3A2A]/60 mt-1">
            Aboriginal Jobs Canada
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#C8782A]/10 p-8">
          <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#6B3A2A]/60 uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aboriginaljobs.ca"
                required
                className="w-full border border-[#C8782A]/20 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 focus:border-[#C8782A]/40 transition-all bg-[#FAF5EE]/50 placeholder:text-[#6B3A2A]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-[#6B3A2A]/60 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-[#C8782A]/20 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 focus:border-[#C8782A]/40 transition-all bg-[#FAF5EE]/50 placeholder:text-[#6B3A2A]/30"
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8782A] hover:bg-[#B06820] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B3A2A]/40 mt-6">
          Admin access only — unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
