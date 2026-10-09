"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  Ticket,
  LogOut,
  Shield,
  Users,
  Package,
  Receipt,
  BarChart3,
  Building2,
  CreditCard,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Coupon Management",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    label: "Packages",
    href: "/admin/packages",
    icon: Package,
  },
  {
    label: "Employers",
    href: "/admin/employers",
    icon: Building2,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  //   {
  //     label: "Users",
  //     href: "#",
  //     icon: Users,
  //   },
  //   {
  //     label: "Transactions",
  //     href: "#",
  //     icon: Receipt,
  //   },
  //   {
  //     label: "Reports",
  //     href: "#",
  //     icon: BarChart3,
  //   },
];

interface AdminSidebarProps {
  adminEmail: string;
  onLogout: () => void;
  onClose?: () => void;
}

export default function AdminSidebar({
  adminEmail,
  onLogout,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Real stats from backend
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [usedCoupons, setUsedCoupons] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/coupons/stats")
      .then((d) => {
        if (d.success && d.stats) {
          const statsArray: Array<{ total: number; used: number }> = Array.isArray(d.stats)
            ? d.stats
            : Object.values(d.stats);
          const total = statsArray.reduce(
            (sum: number, s: { total: number }) => sum + (s.total || 0),
            0
          );
          const used = statsArray.reduce(
            (sum: number, s: { used: number }) => sum + (s.used || 0),
            0
          );
          setTotalCoupons(total);
          setUsedCoupons(used);
        }
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const usagePercentage =
    totalCoupons > 0 ? Math.round((usedCoupons / totalCoupons) * 100) : 0;


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="h-20 px-5 border-b border-slate-200/80 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center shadow-sm">
            <Shield size={17} className="text-white" />
          </div>

          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-[#059669] uppercase">
              Admin
            </p>

            <p
              className="text-base font-extrabold text-slate-900 leading-none mt-0.5"
            >
              GetJobsCanada
            </p>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-700/70">
                Coupons Overview
              </p>
              {statsLoading ? (
                <div className="h-4 w-20 bg-emerald-200/60 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                  Total — {totalCoupons}
                </h3>
              )}
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#059669]/10 flex items-center justify-center">
              <Ticket size={15} className="text-[#059669]" />
            </div>
          </div>

          {/* Used / Unused row */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
              {statsLoading ? (
                <div className="h-5 w-8 bg-slate-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-lg font-extrabold text-[#059669]">{usedCoupons}</p>
              )}
              <p className="text-[10px] text-slate-500 font-medium">Used</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
              {statsLoading ? (
                <div className="h-5 w-8 bg-slate-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-lg font-extrabold text-slate-900">
                  {totalCoupons - usedCoupons}
                </p>
              )}
              <p className="text-[10px] text-slate-500 font-medium">Unused</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span>Usage</span>
              <span>{statsLoading ? "..." : `${usagePercentage}%`}</span>
            </div>
            <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] rounded-full transition-all duration-700"
                style={{ width: statsLoading ? "0%" : `${usagePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <p className="px-3 mb-3 text-[10px] font-black tracking-[0.18em] uppercase text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href !== "#" && pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#059669]"
                }`}
              >
                <item.icon size={17} />

                <span>{item.label}</span>

                {item.href === "#" && (
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200/80">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
            {(adminEmail?.charAt(0) || "A").toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Logged In As
            </p>

            <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
              {adminEmail || "admin@getjobscanada.ca"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all text-sm font-bold"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}
