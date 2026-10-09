"use client";

import { useState } from "react";
import { Link } from "@/router";
import { usePathname } from "next/navigation";
import { Menu, Shield, CalendarDays, ChevronRight } from "lucide-react";
import AdminProfileModal from "./AdminProfileModal";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
  adminEmail: string;
  onLogout: () => void;
  onProfileUpdate?: (newEmail: string) => void;
}

export default function AdminTopbar({
  onToggleSidebar,
  adminEmail,
  onProfileUpdate,
}: AdminTopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  let title = "Admin Portal";
  let currentLink = "/admin";

  if (pathname?.startsWith("/admin/packages")) {
    title = "Package Management";
    currentLink = "/admin/packages";
  } else if (pathname?.startsWith("/admin/coupons")) {
    title = "Coupon Management";
    currentLink = "/admin/coupons";
  } else if (pathname?.startsWith("/admin/employers")) {
    title = "Employer Management";
    currentLink = "/admin/employers";
  } else if (pathname?.startsWith("/admin/payments")) {
    title = "Payment Management";
    currentLink = "/admin/payments";
  }

  const currentDate = new Date().toLocaleDateString("en-CA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* LEFT SECTION: Context & Mobile Triggers */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
        >
          <Menu size={18} />
        </button>

        {/* Mobile Logo Branding */}
        <div className="flex md:hidden items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shield size={15} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-blue-600 font-extrabold">
              Admin
            </p>
            <p
              className="text-xs font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Youth Employment
            </p>
          </div>
        </div>

        {/* Desktop Breadcrumb Navigation */}
        <div className="hidden md:flex items-center gap-3 text-[13px] font-bold tracking-wide text-slate-400">
          <Link
            to={currentLink}
            className="hover:text-slate-900 transition-colors duration-200 flex items-center gap-1.5 opacity-80 hover:opacity-100"
          >
            Portal
          </Link>

          <ChevronRight size={14} className="text-slate-300 stroke-[3]" />

          <span className="text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl font-extrabold tracking-normal text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-slate-200/40">
            {title}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: Info Badges & User Profile */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Clean Date Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/60">
          <CalendarDays size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 tracking-wide">
            {currentDate}
          </span>
        </div>

        {/* Crisp Active Session Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">
            Active
          </span>
        </div>

        {/* User Profile Component */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 pl-4 border-l border-slate-200 h-9 hover:opacity-85 text-left transition-opacity focus:outline-none"
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-600/10">
              {(adminEmail?.charAt(0) || "A").toUpperCase()}
            </div>
            {/* Realignment of Online Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              Admin Status
            </p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate max-w-[140px]">
              {adminEmail || "admin@youthemployment.ca"}
            </p>
          </div>
        </button>
      </div>

      <AdminProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSuccess={onProfileUpdate}
      />
    </header>
  );
}
