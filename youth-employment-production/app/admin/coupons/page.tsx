"use client";

import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import {
  Ticket,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
  CheckCircle,
  Clock,
  RefreshCw,
  FileDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PackageStat {
  packageName: string;
  total: number;
  used: number;
  unused: number;
  assigned: number;
  unassigned: number;
}

interface Coupon {
  id: string;
  code: string;
  packageName: string;
  status: "Unused" | "Used";
  assignedName: string | null;
  assignedEmail: string | null;
  assignedAt: string | null;
  redeemedName: string | null;
  redeemedEmail: string | null;
  redeemedAt: string | null;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Package Config ─────────────────────────────────────────────────────────

const PACKAGES = [
  { name: "Starter", color: "#2563EB", bg: "#2563EB15", prefix: "ST" },
  { name: "Deluxe", color: "#EF4444", bg: "#EF444415", prefix: "DE" },
  { name: "Ultimate", color: "#8B5CF6", bg: "#8B5CF615", prefix: "UL" },
  { name: "Pro Plan", color: "#1E1B18", bg: "#1E1B1810", prefix: "PP" },
  { name: "Unlimited", color: "#10B981", bg: "#10B98115", prefix: "UN" },
];

// ─── Format date helper ───────────────────────────────────────────────────────

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-CA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CouponManagementPage() {
  const [stats, setStats] = useState<PackageStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  // const [seeding, setSeeding] = useState(false);
  // const [seedDone, setSeedDone] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [tableLoading, setTableLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "Unused" | "Used"
  const [assignedFilter, setAssignedFilter] = useState(""); // "" | "true" | "false"
  const [page, setPage] = useState(1);

  // Assign modal
  const [assigningCoupon, setAssigningCoupon] = useState<Coupon | null>(null);
  const [assignName, setAssignName] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  // ─── Fetch Stats ───────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
      else toast.error("Failed to load stats.");
    } catch (e) {
      console.error(e);
      toast.error("Network error loading stats.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ─── Seed Coupons ──────────────────────────────────────────────────────────

  // const handleSeed = async () => {
  //   setSeeding(true);
  //   try {
  //     const res = await fetch("/api/admin/coupons/seed", { method: "POST" });
  //     const data = await res.json();
  //     if (data.success) {
  //       setSeedDone(true);
  //       await fetchStats();
  //       toast.success("Coupons generated successfully!");
  //     } else {
  //       toast.error(data.error || "Failed to generate coupons.");
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     toast.error("Network error. Please try again.");
  //   } finally {
  //     setSeeding(false);
  //   }
  // };

  // ─── Fetch Coupons (Table) ─────────────────────────────────────────────────

  const fetchCoupons = useCallback(async () => {
    if (!selectedPackage) return;
    setTableLoading(true);
    try {
      const params = new URLSearchParams({
        packageName: selectedPackage,
        page: String(page),
        ...(statusFilter && { status: statusFilter }),
        ...(assignedFilter && { assigned: assignedFilter }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/coupons?${params}`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTableLoading(false);
    }
  }, [selectedPackage, page, statusFilter, assignedFilter, search]);

  useEffect(() => {
    if (selectedPackage) {
      fetchCoupons();
    }
  }, [fetchCoupons, selectedPackage]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, assignedFilter, search, selectedPackage]);

  // ─── Select Package ────────────────────────────────────────────────────────

  const handleSelectPackage = (pkgName: string) => {
    setSelectedPackage(pkgName);
    setSearch("");
    setStatusFilter("");
    setAssignedFilter("");
    setPage(1);
    setTimeout(() => {
      document.getElementById("coupon-table-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ─── Assign Coupon ─────────────────────────────────────────────────────────

  const handleAssign = async () => {
    if (!assigningCoupon || !assignName.trim() || !assignEmail.trim()) return;
    setAssignLoading(true);
    setAssignError("");
    try {
      const res = await fetch(
        `/api/admin/coupons/${assigningCoupon.id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignedName: assignName.trim(),
            assignedEmail: assignEmail.trim(),
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assignment failed");

      setAssigningCoupon(null);
      setAssignName("");
      setAssignEmail("");
      await fetchCoupons();
      await fetchStats();
      toast.success(`Coupon assigned to ${assignName.trim()} successfully!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Assignment failed";
      setAssignError(msg);
      toast.error(msg);
    } finally {
      setAssignLoading(false);
    }
  };

  // ─── Export to Excel ───────────────────────────────────────────────────────

  const handleExport = async () => {
    if (!selectedPackage) return;
    setExportLoading(true);
    const toastId = toast.loading(`Exporting ${selectedPackage} coupons...`);
    try {
      // Fetch ALL coupons for the selected package
      const params = new URLSearchParams({
        packageName: selectedPackage,
        page: "1",
        pageSize: "9999",
      });
      const res = await fetch(`/api/admin/coupons?${params}`);
      const data = await res.json();

      if (!data.success || !data.coupons) {
        toast.error("Failed to fetch coupons for export.", { id: toastId });
        return;
      }

      const rows = data.coupons.map((c: Coupon) => ({
        "Coupon Code": c.code,
        Package: c.packageName,
        Status: c.status,
        "Assigned Name": c.assignedName || "",
        "Assigned Email": c.assignedEmail || "",
        "Assigned At": c.assignedAt ? fmtDate(c.assignedAt) : "",
        "Redeemed Name": c.redeemedName || "",
        "Redeemed Email": c.redeemedEmail || "",
        "Redeemed At": c.redeemedAt ? fmtDate(c.redeemedAt) : "",
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, selectedPackage);

      // Column widths
      ws["!cols"] = [
        { wch: 18 }, // Coupon Code
        { wch: 12 }, // Package
        { wch: 10 }, // Status
        { wch: 20 }, // Assigned Name
        { wch: 28 }, // Assigned Email
        { wch: 22 }, // Assigned At
        { wch: 20 }, // Redeemed Name
        { wch: 28 }, // Redeemed Email
        { wch: 22 }, // Redeemed At
      ];

      const fileName = `${selectedPackage.replace(" ", "_")}_Coupons_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Exported ${rows.length} coupons successfully!`, {
        id: toastId,
      });
    } catch (e) {
      console.error("Export failed:", e);
      toast.error("Export failed. Please try again.", { id: toastId });
    } finally {
      setExportLoading(false);
    }
  };

  const selectedPkgConfig = PACKAGES.find((p) => p.name === selectedPackage);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Coupon Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            Manage coupon codes for all packages
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
            title="Refresh Stats"
          >
            <RefreshCw size={16} />
          </button>

          {/* Export Button — visible only when a package is selected */}
          {selectedPackage && (
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="flex items-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-60 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              {exportLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown size={15} />
                  Export Excel
                </>
              )}
            </button>
          )}

          {/* generate codes */}
          {/* <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-blue-600/10"
          >
            {seeding ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Ticket size={15} />
                {seedDone ? "Re-Generate Coupons" : "Generate Coupons"}
              </>
            )}
          </button> */}
        </div>
      </div>

      {/* ─── Package Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {PACKAGES.map((pkg) => {
          const stat = stats.find((s) => s.packageName === pkg.name);
          const isSelected = selectedPackage === pkg.name;
          const usedPct = stat
            ? Math.round((stat.used / (stat.total || 100)) * 100)
            : 0;

          return (
            <div
              key={pkg.name}
              onClick={() => handleSelectPackage(pkg.name)}
              className={`bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                isSelected
                  ? "border-blue-600 shadow-lg ring-1 ring-blue-600/10"
                  : "border-transparent hover:border-blue-100"
              }`}
            >
              {/* Icon + Name */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: pkg.bg }}
                >
                  <Ticket size={18} style={{ color: pkg.color }} />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
                    Viewing
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-800 text-sm">{pkg.name}</h3>

              {statsLoading ? (
                <div className="mt-3 space-y-1.5">
                  <div className="h-3 bg-slate-50 rounded animate-pulse" />
                  <div className="h-2 bg-slate-50 rounded animate-pulse w-3/4" />
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Used{" "}
                    <span className="font-extrabold text-slate-800">
                      {stat?.used ?? 0}
                    </span>{" "}
                    / {stat?.total ?? 100}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usedPct}%`,
                        background: pkg.color,
                      }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold tracking-wide">
                    <span>
                      <span className="font-extrabold text-emerald-600">
                        {stat?.assigned ?? 0}
                      </span>{" "}
                      assigned
                    </span>
                    <span>
                      <span className="font-extrabold text-slate-600">
                        {stat?.unassigned ?? 0}
                      </span>{" "}
                      unassigned
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPackage(pkg.name);
                    }}
                    className="mt-4 w-full text-xs font-semibold py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    View Coupons
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Coupon Table / Placeholder ───────────────────────────────────────── */}
      {selectedPackage ? (
        <div
          id="coupon-table-section"
          className="bg-white rounded-2xl border border-blue-50 overflow-hidden shadow-sm"
        >
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-blue-50 flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: selectedPkgConfig?.bg }}
              >
                <Ticket size={15} style={{ color: selectedPkgConfig?.color }} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {selectedPackage} — Coupons
                </h3>
                {pagination && (
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {pagination.total} results
                  </p>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="sm:ml-auto flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value.toUpperCase())}
                  className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white w-40 font-medium"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-600 font-semibold"
              >
                <option value="">All Status</option>
                <option value="Unused">Unused</option>
                <option value="Used">Used</option>
              </select>

              {/* Assignment Filter */}
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-600 font-semibold"
              >
                <option value="">All Assignment</option>
                <option value="true">Assigned</option>
                <option value="false">Unassigned</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-blue-50">
                  {[
                    "Coupon Code",
                    "Assigned User",
                    "Assigned At",
                    "Redeemed User",
                    "Redeemed At",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tableLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <div className="h-3.5 bg-slate-50 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : coupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-slate-400 font-semibold"
                    >
                      No coupons found. Try adjusting filters or generate
                      coupons first.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isUsed = coupon.status === "Used";
                    const isAssigned = !!coupon.assignedName;
                    const canAssign = !isUsed && !isAssigned;

                    return (
                      <tr
                        key={coupon.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Coupon Code */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-blue-600 text-xs bg-blue-50/70 border border-blue-100/50 px-2.5 py-1 rounded-lg tracking-wider">
                            {coupon.code}
                          </span>
                        </td>

                        {/* Assigned User */}
                        <td className="px-4 py-3.5">
                          {coupon.assignedName || coupon.assignedEmail ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-900">
                                {coupon.assignedName || "—"}
                              </span>

                              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                {coupon.assignedEmail || "—"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs font-medium">
                              —
                            </span>
                          )}
                        </td>

                        {/* Assigned At */}
                        <td className="px-4 py-3.5 text-xs text-slate-500 font-medium whitespace-nowrap">
                          {coupon.assignedAt ? (
                            <span className="flex items-center gap-1.5">
                              <Clock size={11} className="text-amber-500" />
                              {fmtDate(coupon.assignedAt)}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Redeemed User */}
                        <td className="px-4 py-3.5">
                          {coupon.redeemedName || coupon.redeemedEmail ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-900">
                                {coupon.redeemedName || "—"}
                              </span>

                              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                {coupon.redeemedEmail || "—"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs font-medium">
                              —
                            </span>
                          )}
                        </td>

                        {/* Redeemed At */}
                        <td className="px-4 py-3.5 text-xs text-slate-500 font-medium whitespace-nowrap">
                          {coupon.redeemedAt ? (
                            <span className="flex items-center gap-1.5">
                              <CheckCircle
                                size={11}
                                className="text-emerald-500"
                              />
                              {fmtDate(coupon.redeemedAt)}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isUsed
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {coupon.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5">
                          {canAssign ? (
                            <button
                              onClick={() => {
                                setAssigningCoupon(coupon);
                                setAssignName("");
                                setAssignEmail("");
                                setAssignError("");
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm bg-white"
                            >
                              <UserPlus size={12} />
                              Assign
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                              {isUsed ? "Redeemed" : "Assigned"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-semibold">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total)
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pg: number;
                    if (pagination.totalPages <= 5) {
                      pg = i + 1;
                    } else if (pagination.page <= 3) {
                      pg = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pg = pagination.totalPages - 4 + i;
                    } else {
                      pg = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          pg === pagination.page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  },
                )}

                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200/50 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50/80 flex items-center justify-center text-blue-600 shadow-sm animate-bounce">
            <Ticket size={28} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3
              className="text-base font-bold text-slate-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Select a Package Card
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Click on the "View Coupons" button or select any of the package
              cards above to load, assign, and export the coupon codes list.
            </p>
          </div>
        </div>
      )}

      {/* ─── Assign Modal ────────────────────────────────────────────────────── */}
      {assigningCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setAssigningCoupon(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-md animate-in fade-in">
            {/* Close */}
            <button
              onClick={() => setAssigningCoupon(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-all"
            >
              <X size={17} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <UserPlus size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Assign Coupon</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Code:{" "}
                  <span className="font-mono font-bold text-blue-600">
                    {assigningCoupon.code}
                  </span>
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={assignName}
                  onChange={(e) => setAssignName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              {assignError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 font-semibold">
                  {assignError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAssigningCoupon(null)}
                  disabled={assignLoading}
                  className="flex-1 py-3 text-sm font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={
                    assignLoading || !assignName.trim() || !assignEmail.trim()
                  }
                  className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-blue-600/10"
                >
                  {assignLoading ? "Saving..." : "Assign Coupon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
