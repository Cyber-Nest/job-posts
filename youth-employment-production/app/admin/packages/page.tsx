"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Star,
  Zap,
  Building2,
  ShieldCheck,
  Crown,
  Lock,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Edit3,
  Package,
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
  "Pro Plan": ShieldCheck,
  Unlimited: Crown,
};

// ─── Color map matching Youth Employment Canada theme ──────────────────────

const COLOR_MAP: Record<string, { accent: string; bg: string; ring: string }> = {
  Starter:   { accent: "#2563EB", bg: "#2563EB10", ring: "#2563EB30" },
  Deluxe:    { accent: "#EF4444", bg: "#EF444410", ring: "#EF444430" },
  Ultimate:  { accent: "#8B5CF6", bg: "#8B5CF610", ring: "#8B5CF630" },
  "Pro Plan":{ accent: "#1E1B18", bg: "#1E1B1808", ring: "#1E1B1820" },
  Unlimited: { accent: "#10B981", bg: "#10B98110", ring: "#10B98130" },
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
  const colors = COLOR_MAP[pkg.name] || COLOR_MAP["Deluxe"];

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
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
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
      className="rounded-2xl border bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between"
      style={{
        borderColor: colors.ring,
        boxShadow: editing ? `0 0 0 2px ${colors.ring}` : undefined,
      }}
    >
      <div>
        {/* Card Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: colors.bg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${colors.accent}18` }}
            >
              <Icon size={18} style={{ color: colors.accent }} />
            </div>
            <div>
              <p
                className="font-bold text-base text-slate-900"
              >
                {pkg.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Lock size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Name is fixed
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
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: editing ? "#ef4444" : colors.accent,
              background: editing ? "#fef2f2" : colors.bg,
            }}
          >
            {editing ? (
              <>Cancel</>
            ) : (
              <>
                <Edit3 size={12} /> Edit
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
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
                  <span className="px-3 text-sm text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="flex-1 py-2 pr-3 text-sm text-slate-950 bg-transparent outline-none"
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
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
                  <span className="px-3 text-sm text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="flex-1 py-2 pr-3 text-sm text-slate-950 bg-transparent outline-none"
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
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-950 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />
              ) : (
                <p className="text-base font-semibold text-slate-900">
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
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-950 bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              ) : (
                <p className="text-base font-semibold text-slate-900">
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
                  className="rounded border-slate-200 text-blue-600 focus:ring-blue-500/20"
                />
                <label htmlFor={`unlimited-${pkg.name}`} className="text-xs font-semibold text-slate-900">
                  Unlimited Job Postings
                </label>
              </div>

              <div className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-2 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-700">
                  Active (Visible to public)
                </span>
                <button
                  type="button"
                  id={`active-toggle-${pkg.name}`}
                  onClick={() => setActive(!active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${
                    active ? "bg-emerald-500" : "bg-slate-300"
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
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block uppercase tracking-wider">
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
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-950 bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            ) : (
              <span
                className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ background: `${colors.accent}18`, color: colors.accent }}
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
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-950 bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
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
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg"
                  style={{ color: colors.accent, background: colors.bg }}
                >
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {features.map((feature, idx) =>
                editing ? (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
                      <span className="px-2.5 text-[10px]" style={{ color: colors.accent }}>
                        ✓
                      </span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder="Feature description"
                        className="flex-1 py-2 pr-3 text-sm text-slate-950 bg-transparent outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      disabled={features.length <= 1}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
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
        <div
          className="px-5 pb-5 pt-3 flex gap-2 border-t border-slate-100 bg-slate-50/50"
        >
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-xl text-white transition-all disabled:opacity-50"
            style={{ background: isDirty ? colors.accent : "#ccc" }}
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

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (data.success) setPackages(data.packages);
      else toast.error("Failed to load packages.");
    } catch {
      toast.error("Network error loading packages.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSeedPackages = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/packages/seed", {
        method: "POST",
      });
      const data = await res.json();
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

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleSaved = (updated: PkgData) => {
    setPackages((prev) =>
      prev.map((p) => (p.name === updated.name ? updated : p)),
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
          >
            Package Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update pricing, features and badge text for each package. Package names are fixed.
          </p>
        </div>

        <button
          onClick={fetchPackages}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Info Banner */}
      {/* <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
        <Lock size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Package names are permanently fixed
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Coupon codes are generated per package name (Starter, Deluxe, Ultimate, Pro Plan, Unlimited).
            Changing names would break existing coupons, so only price, features and badge are editable.
          </p>
        </div>
      </div> */}

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-100 animate-pulse h-72" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 bg-white text-center">
          <Package className="w-16 h-16 text-slate-300 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-900">
            No Packages Found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
            Database does not have any packages configured yet. Click below to seed the 5 standard hiring packages.
          </p>
          <button
            onClick={handleSeedPackages}
            disabled={seeding}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
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
