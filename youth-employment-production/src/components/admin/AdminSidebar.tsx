"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  LogOut,
  Shield,
  Package,
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
    label: "Package Management",
    href: "/admin/packages",
    icon: Package,
  },
  {
    label: "Employer Management",
    href: "/admin/employers",
    icon: Building2,
  },
  {
    label: "Payment Management",
    href: "/admin/payments",
    icon: CreditCard,
  },
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
    fetch("/api/admin/coupons/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.stats) {
          const total = d.stats.reduce(
            (sum: number, s: { total: number }) => sum + s.total,
            0,
          );
          const used = d.stats.reduce(
            (sum: number, s: { used: number }) => sum + s.used,
            0,
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
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Brand */}
      <div className="h-20 px-5 border-b border-blue-100 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Shield size={17} className="text-white" />
          </div>

          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-blue-600 uppercase">
              Admin Portal
            </p>

            <p
              className="text-base font-bold text-slate-900 leading-none mt-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Youth Employment
            </p>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-blue-50 bg-[#EFF6FF]/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600">
                Coupons Overview
              </p>
              {statsLoading ? (
                <div className="h-4 w-20 bg-blue-100/50 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-sm font-semibold text-slate-900 mt-1">
                  Total — {totalCoupons}
                </h3>
              )}
            </div>

            <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center">
              <Ticket size={15} className="text-blue-600" />
            </div>
          </div>

          {/* Used / Unused row */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white rounded-xl p-2.5 border border-blue-100/30">
              {statsLoading ? (
                <div className="h-5 w-8 bg-slate-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-lg font-bold text-blue-600">{usedCoupons}</p>
              )}
              <p className="text-[10px] text-slate-500 font-medium">Used</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-blue-100/30">
              {statsLoading ? (
                <div className="h-5 w-8 bg-slate-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-lg font-bold text-slate-800">
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
            <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: statsLoading ? "0%" : `${usagePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {(adminEmail?.charAt(0) || "A").toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Logged In As
            </p>

            <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              {adminEmail || "admin@youthemployment.ca"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all text-sm font-semibold"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}
