"use client";

import { useState } from "react";
import { Menu, CalendarDays } from "lucide-react";
import AdminProfileModal from "./AdminProfileModal";

interface AdminTopbarProps {
  title: string;
  onMenuClick: () => void;
  onProfileUpdate?: (newEmail: string) => void;
}

export default function AdminTopbar({
  title,
  onMenuClick,
  onProfileUpdate,
}: AdminTopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-CA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-6 lg:px-8 h-20 flex items-center justify-between shadow-xs">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-extrabold text-slate-900 leading-none">
            {title}
          </h2>

          <p className="hidden sm:block text-xs text-slate-400 font-medium mt-1">
            Admin / {title}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 h-full">
        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <CalendarDays size={16} className="text-[#059669]" />
          <span>{currentDate}</span>
        </div>

        {/* Session Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200/80">
          <div className="w-2.5 h-2.5 bg-[#059669] rounded-full animate-pulse" />

          <span className="text-sm font-bold text-emerald-700">
            Session Active
          </span>
        </div>

        {/* Admin clickable button */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 pl-4 border-l border-slate-200 text-left hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-[#059669] text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
            AD
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-extrabold text-slate-900 leading-none">
              Admin
            </p>

            <p className="text-xs text-slate-400 font-medium mt-1">Super Admin</p>
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

