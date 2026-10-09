"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="h-20 px-5 border-b border-[#C8782A]/10 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8782A] flex items-center justify-center">
            <Shield size={17} className="text-white" />
          </div>

          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-[#C8782A] uppercase">
              Admin
            </p>

            <p
              className="text-base font-bold text-[#1C1C1C] leading-none mt-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Aboriginal Jobs
            </p>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-[#C8782A]/10 bg-[#FAF5EE] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C8782A]/60">
                Coupons Overview
              </p>
              {statsLoading ? (
                <div className="h-4 w-20 bg-[#EADFD2] rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-sm font-semibold text-[#1C1C1C] mt-1">
                  Total — {totalCoupons}
                </h3>
              )}
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#C8782A]/10 flex items-center justify-center">
              <Ticket size={15} className="text-[#C8782A]" />
            </div>
          </div>

          {/* Used / Unused row */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white rounded-xl p-2.5">
              {statsLoading ? (
                <div className="h-5 w-8 bg-[#EADFD2] rounded animate-pulse mb-1" />
              ) : (
                <p className="text-lg font-bold text-[#C8782A]">{usedCoupons}</p>
              )}
              <p className="text-[10px] text-[#6B3A2A]/60">Used</p>
            </div>
            <div className="bg-white rounded-xl p-2.5">
              {statsLoading ? (
                <div className="h-5 w-8 bg-[#EADFD2] rounded animate-pulse mb-1" />
              ) : (
                <p className="text-lg font-bold text-[#1C1C1C]">
                  {totalCoupons - usedCoupons}
                </p>
              )}
              <p className="text-[10px] text-[#6B3A2A]/60">Unused</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#6B3A2A]/60 mb-1">
              <span>Usage</span>
              <span>{statsLoading ? "..." : `${usagePercentage}%`}</span>
            </div>
            <div className="h-1.5 bg-[#EADFD2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C8782A] rounded-full transition-all duration-700"
                style={{ width: statsLoading ? "0%" : `${usagePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.18em] uppercase text-[#C8782A]/50">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#C8782A] text-white"
                    : "text-[#6B3A2A]/75 hover:bg-[#FAF5EE] hover:text-[#C8782A]"
                }`}
              >
                <item.icon size={17} />

                <span>{item.label}</span>

                {item.href === "#" && (
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#C8782A] font-semibold">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#C8782A]/10">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF5EE] mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8782A] flex items-center justify-center text-white text-sm font-bold">
            {(adminEmail?.charAt(0) || "A").toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C8782A]/60">
              Logged In As
            </p>

            <p className="text-xs font-medium text-[#1C1C1C] truncate mt-0.5">
              {adminEmail || "admin@aboriginaljobs.ca"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}
