"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth/auth-client";

const navLinks = [
  { label: "Find jobs", href: "/jobs", icon: Rocket },
  // { label: "GetJobs Direct", href: "/jobs", icon: Rocket },
  { label: "Pricing & Alerts", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { user, isAuthenticated, isPending } = useSession();
  const [isEmployer, setIsEmployer] = useState(false);
  const [packageData, setPackageData] = useState<any>(null);
  const [packageLoading, setPackageLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // CHECK EMPLOYER
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetch(`/api/employer/check?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setIsEmployer(data.isEmployer))
        .catch(() => setIsEmployer(false));
    }
  }, [isAuthenticated, user]);

  // FETCH PACKAGE
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setPackageLoading(true);
        const res = await fetch("/api/employer/package");
        const data = await res.json();
        if (data.success) {
          setPackageData(data.package);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setPackageLoading(false);
      }
    };

    if (isAuthenticated && isEmployer) {
      fetchPackage();
    }
  }, [isAuthenticated, isEmployer]);

  const remainingCredits = packageData?.remainingCredits || 0;
  const unlimitedJobs = packageData?.unlimitedJobs || false;
  const canPostJob = unlimitedJobs || remainingCredits > 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-all duration-200",
        scrolled
          ? "shadow-sm border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
          : "border-b border-slate-100",
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo & Left Nav Group */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              {/* <img
                src="/logo.svg"
                alt="GetJobsCanada Logo"
                className="w-8 h-8 rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-200"
              /> */}
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-[#059669] transition-colors duration-200">
                GetJobs<span className="text-[#059669] font-black">Canada</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 py-1",
                      isActive
                        ? "text-[#059669]"
                        : "text-slate-700 hover:text-[#059669]",
                    )}
                  >
                    {Icon && <Icon size={15} className="text-[#059669]" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            {/* For Employers link */}
            <Link
              href="/employers"
              className="text-sm font-semibold text-slate-700 hover:text-[#059669] transition-colors"
            >
              For employers
            </Link>

            {/* Auth / User Section */}
            {isPending ? (
              <div className="w-20 h-9 bg-slate-100 rounded-full animate-pulse" />
            ) : isAuthenticated && user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition-colors text-sm font-semibold border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center font-bold text-xs">
                    {user.name?.charAt(0) || user.email?.charAt(0) || (
                      <User size={14} />
                    )}
                  </div>

                  <span className="max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>

                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200 text-slate-500",
                      userMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium truncate">
                        {user.email}
                      </p>
                    </div>

                    {isEmployer && (
                      <Link
                        href="/employers/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#059669] transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        Employer Dashboard
                      </Link>
                    )}

                    <button
                      onClick={async () => {
                        await signOut();
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="text-sm font-semibold text-slate-800 hover:text-[#059669] px-4 py-1.5 rounded-full border border-slate-300 hover:border-slate-400 transition-all">
                  Sign in
                </button>
              </Link>
            )}

            {/* Post Job / Primary Pill Button */}
            {isPending ? (
              <div className="w-28 h-9 rounded-full bg-slate-100 animate-pulse" />
            ) : !isAuthenticated ? (
              <Link href="/login">
                <button className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                  Post a job
                </button>
              </Link>
            ) : packageLoading ? (
              <div className="w-28 h-9 rounded-full bg-slate-100 animate-pulse" />
            ) : isEmployer && !canPostJob ? (
              <Link href="/pricing">
                <button className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                  Upgrade Plan
                </button>
              </Link>
            ) : (
              <Link href="/post-a-job" prefetch={false}>
                <button className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                  Post a job
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#059669] hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center justify-between",
                    isActive
                      ? "bg-emerald-50 text-[#059669]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#059669]",
                  )}
                >
                  <span>{link.label}</span>
                  {link.icon && (
                    <link.icon size={16} className="text-[#059669]" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/employers"
              className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              For employers
            </Link>

            {isAuthenticated && isEmployer && (
              <Link
                href="/employers/dashboard"
                prefetch={false}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#059669] flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Employer Dashboard
              </Link>
            )}

            <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-slate-100">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-1 text-xs text-slate-400 font-medium truncate">
                    {user.email}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-full border-slate-300 text-slate-700 font-semibold"
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/";
                    }}
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-slate-300 text-slate-700 font-semibold"
                  >
                    Sign in
                  </Button>
                </Link>
              )}

              {/* MOBILE POST JOB BUTTON */}
              {isPending ? (
                <div className="w-full h-10 rounded-full bg-slate-100 animate-pulse" />
              ) : !isAuthenticated ? (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-2.5 rounded-full shadow-sm">
                    Post a job
                  </button>
                </Link>
              ) : packageLoading ? (
                <div className="w-full h-10 rounded-full bg-slate-100 animate-pulse" />
              ) : isEmployer && !canPostJob ? (
                <Link href="/pricing">
                  <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-full shadow-sm">
                    Upgrade Plan
                  </button>
                </Link>
              ) : (
                <Link
                  href="/post-a-job"
                  onClick={() => setMenuOpen(false)}
                  prefetch={false}
                >
                  <button className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-2.5 rounded-full shadow-sm">
                    Post a job
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
