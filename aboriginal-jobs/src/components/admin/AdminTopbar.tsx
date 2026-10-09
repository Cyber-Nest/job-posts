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
    <header className="sticky top-0 z-20 bg-white border-b border-[#C8782A]/10 px-6 lg:px-8 h-20 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#FAF5EE] text-[#6B3A2A] transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-bold text-[#1C1C1C] leading-none">
            {title}
          </h2>

          <p className="hidden sm:block text-xs text-[#6B3A2A]/50 mt-1">
            Admin / {title}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 h-full">
        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-sm text-[#6B3A2A]/70 bg-[#FAF5EE] px-4 py-2.5 rounded-2xl border border-[#C8782A]/10">
          <CalendarDays size={16} />
          <span>{currentDate}</span>
        </div>

        {/* Session Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />

          <span className="text-sm font-medium text-emerald-700">
            Session Active
          </span>
        </div>

        {/* Admin clickable button */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 pl-4 border-l border-[#C8782A]/10 text-left hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-[#C8782A] text-white flex items-center justify-center text-sm font-bold shadow-sm">
            AD
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-[#1C1C1C] leading-none">
              Admin
            </p>

            <p className="text-xs text-[#6B3A2A]/50 mt-1">Super Admin</p>
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

