"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import {
  Package,
  Star,
  Zap,
  Building2,
  HeartHandshake,
  Crown,
  Lock,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Edit3,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface PkgData {
  _id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  tagline: string;
  badge: string;
  features: string[];
  highlight: boolean;
  darkVariant: boolean;
  order: number;
  credits: number;
  expiryDays: number;
  unlimitedJobs: boolean;
  active?: boolean;
}

// ─── Package icon map ──────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Starter: Star,
  Deluxe: Zap,
  Ultimate: Building2,
  "Pro Plan": HeartHandshake,
  Unlimited: Crown,
};

// ─── Color map matching GetJobsCanada theme ─────────────────────────────

const COLOR_MAP: Record<string, { accent: string; bg: string; ring: string }> = {
  Starter:   { accent: "#059669", bg: "#ECFDF5", ring: "#10B98140" },
  Deluxe:    { accent: "#0284C7", bg: "#F0F9FF", ring: "#0284C740" },
  Ultimate:  { accent: "#7C3AED", bg: "#F5F3FF", ring: "#7C3AED40" },
  "Pro Plan":{ accent: "#0F172A", bg: "#F8FAFC", ring: "#33415530" },
  Unlimited: { accent: "#D97706", bg: "#FFFBEB", ring: "#D9770640" },
};

// ─── Single Package Card ───────────────────────────────────────────────────

function PackageCard({
  pkg,
  onSaved,
}: {
  pkg: PkgData;
  onSaved: (updated: PkgData) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Local editable state
  const [originalPrice, setOriginalPrice] = useState(pkg.originalPrice);
  const [discountedPrice, setDiscountedPrice] = useState(pkg.discountedPrice);
  const [tagline, setTagline] = useState(pkg.tagline);
  const [badge, setBadge] = useState(pkg.badge);
  const [credits, setCredits] = useState(pkg.credits || 0);
  const [expiryDays, setExpiryDays] = useState(pkg.expiryDays || 180);
  const [unlimitedJobs, setUnlimitedJobs] = useState(!!pkg.unlimitedJobs);
  const [active, setActive] = useState(pkg.active !== false);
  const [features, setFeatures] = useState<string[]>(pkg.features);

  const Icon = ICON_MAP[pkg.name] || Package;
  const colors = COLOR_MAP[pkg.name] || COLOR_MAP["Starter"];

  const isDirty =
    originalPrice !== pkg.originalPrice ||
    discountedPrice !== pkg.discountedPrice ||
    tagline !== pkg.tagline ||
    badge !== pkg.badge ||
    credits !== (pkg.credits || 0) ||
    expiryDays !== (pkg.expiryDays || 180) ||
    unlimitedJobs !== !!pkg.unlimitedJobs ||
    active !== (pkg.active !== false) ||
    JSON.stringify(features) !== JSON.stringify(pkg.features);

  const handleAddFeature = () => setFeatures((f) => [...f, ""]);

  const handleRemoveFeature = (idx: number) =>
    setFeatures((f) => f.filter((_, i) => i !== idx));

  const handleFeatureChange = (idx: number, val: string) =>
    setFeatures((f) => f.map((v, i) => (i === idx ? val : v)));

  const handleReset = () => {
    setOriginalPrice(pkg.originalPrice);
    setDiscountedPrice(pkg.discountedPrice);
    setTagline(pkg.tagline);
    setBadge(pkg.badge);
    setCredits(pkg.credits || 0);
    setExpiryDays(pkg.expiryDays || 180);
    setUnlimitedJobs(!!pkg.unlimitedJobs);
    setActive(pkg.active !== false);
    setFeatures(pkg.features);
    setEditing(false);
  };

  const handleSave = async () => {
    const cleanedFeatures = features.map((f) => f.trim()).filter(Boolean);
    if (cleanedFeatures.length === 0) {
      toast.error("At least one feature is required.");
      return;
    }
    if (discountedPrice > originalPrice) {
      toast.error("Discounted price cannot be greater than original price.");
      return;
    }

    setSaving(true);
    try {
      const data = await apiClient.put("/admin/packages", {
        name: pkg.name,
        originalPrice,
        discountedPrice,
        tagline: tagline.trim(),
        badge: badge.trim(),
        features: cleanedFeatures,
        credits,
        expiryDays,
        unlimitedJobs,
        active,
      });
      toast.success(`${pkg.name} package updated!`);
      setFeatures(cleanedFeatures);
      setEditing(false);
      onSaved({
        ...pkg,
        originalPrice,
        discountedPrice,
        tagline,
        badge,
        features: cleanedFeatures,
        credits,
        expiryDays,
        unlimitedJobs,
        active,
      });
    } catch (e: any) {
      toast.error(e.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
      style={{
        borderColor: colors.ring,
        boxShadow: editing ? `0 0 0 2px ${colors.ring}` : undefined,
      }}
    >
      <div>
        {/* Card Header */}
        <div
          className="px-5 py-4 flex items-center justify-between border-b border-slate-100"
          style={{ background: colors.bg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: `${colors.accent}18` }}
            >
              <Icon size={18} style={{ color: colors.accent }} />
            </div>
            <div>
              <p
                className="font-extrabold text-base tracking-tight"
                style={{ color: colors.accent }}
              >
                {pkg.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Lock size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  Fixed Name
                </span>
                <span className="text-slate-300">•</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${pkg.active !== false ? "text-emerald-600" : "text-rose-500"}`}>
                  {pkg.active !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => (editing ? handleReset() : setEditing(true))}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
            style={{
              color: editing ? "#ef4444" : colors.accent,
              background: editing ? "#fef2f2" : "#ffffff",
              border: `1px solid ${colors.ring}`,
            }}
          >
            {editing ? (
              <>Cancel</>
            ) : (
              <>
                <Edit3 size={13} /> Edit
              </>
            )}
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Original Price (CAD)
              </label>
              {editing ? (
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-500 bg-slate-50">
                  <span className="px-3 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="flex-1 py-2 pr-3 text-sm font-semibold text-slate-900 bg-transparent outline-none"
                  />
                </div>
              ) : (
                <p className="text-xl font-black text-slate-900">${originalPrice}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Sale Price (CAD)
              </label>
              {editing ? (
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-500 bg-slate-50">
                  <span className="px-3 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="flex-1 py-2 pr-3 text-sm font-semibold text-slate-900 bg-transparent outline-none"
                  />
                </div>
              ) : (
                <p className="text-xl font-black" style={{ color: colors.accent }}>
                  ${discountedPrice}
                </p>
              )}
            </div>
          </div>

          {/* Credits and Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Credits (Job Postings)
              </label>
              {editing ? (
                <input
                  type="number"
                  min={0}
                  value={credits}
                  disabled={unlimitedJobs}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              ) : (
                <p className="text-sm font-bold text-slate-800">
                  {unlimitedJobs ? "Unlimited" : `${credits} Job Posting(s)`}
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Validity (Days)
              </label>
              {editing ? (
                <input
                  type="number"
                  min={1}
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-sm font-bold text-slate-800">
                  {expiryDays} Days
                </p>
              )}
            </div>
          </div>

          {/* Unlimited & Active Toggle */}
          {editing ? (
            <div className="flex flex-col gap-2.5 py-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`unlimited-${pkg.name}`}
                  checked={unlimitedJobs}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUnlimitedJobs(checked);
                    if (checked) {
                      setCredits(0);
                    }
                  }}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor={`unlimited-${pkg.name}`} className="text-xs font-semibold text-slate-800">
                  Unlimited Job Postings
                </label>
              </div>

              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
                <span className="text-xs font-semibold text-slate-800">
                  Active (Visible to public)
                </span>
                <button
                  type="button"
                  id={`active-toggle-${pkg.name}`}
                  onClick={() => setActive(!active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    active ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            unlimitedJobs && (
              <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block uppercase tracking-wider">
                Unlimited Jobs Activated
              </div>
            )
          )}

          {/* Badge */}
          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
              Badge Text
            </label>
            {editing ? (
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Most Popular • 50% OFF"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 outline-none focus:border-emerald-500"
              />
            ) : (
              <span
                className="inline-block text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200/60"
                style={{ background: `${colors.accent}12`, color: colors.accent }}
              >
                {badge || "—"}
              </span>
            )}
          </div>

          {/* Tagline */}
          {editing && (
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. FEATURES OF STARTER PLAN"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Features ({features.length})
              </label>
              {editing && (
                <button
                  onClick={handleAddFeature}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                  style={{ color: colors.accent }}
                >
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {features.map((feature, idx) =>
                editing ? (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-emerald-500">
                      <span className="px-2.5 text-xs font-bold" style={{ color: colors.accent }}>
                        ✓
                      </span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder="Feature description"
                        className="flex-1 py-2 pr-3 text-xs sm:text-sm text-slate-900 bg-transparent outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                      disabled={features.length <= 1}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="mt-0.5 font-bold text-xs" style={{ color: colors.accent }}>
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save / Reset Footer */}
      {editing && (
        <div className="px-5 pb-5 pt-3 flex gap-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={13} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl text-white transition-all disabled:opacity-50 shadow-sm"
            style={{ background: isDirty ? colors.accent : "#cbd5e1" }}
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <Save size={14} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PkgData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const handleSeedPackages = async () => {
    setSeeding(true);
    try {
      const data = await apiClient.post("/admin/packages/seed");
      if (data.success) {
        toast.success("Default packages seeded successfully!");
        fetchPackages();
      } else {
        toast.error(data.error || "Failed to seed packages.");
      }
    } catch {
      toast.error("Network error seeding packages.");
    } finally {
      setSeeding(false);
    }
  };

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/admin/packages");
      if (data.success) setPackages(data.data || data.packages);
      else toast.error("Failed to load packages.");
    } catch {
      toast.error("Network error loading packages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleSaved = (updated: PkgData) => {
    setPackages((prev) =>
      prev.map((p) => (p.name === updated.name ? updated : p)),
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Package Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update pricing, features, and badge text for each package. Package names are fixed.
          </p>
        </div>

        <button
          onClick={fetchPackages}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
          Refresh
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200/80 animate-pulse h-72" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-white text-center">
          <Package className="w-16 h-16 text-slate-300 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-900">
            No Packages Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-6">
            Database does not have any packages configured yet. Click below to seed the 5 standard hiring packages.
          </p>
          <button
            onClick={handleSeedPackages}
            disabled={seeding}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Seed Default Packages"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
