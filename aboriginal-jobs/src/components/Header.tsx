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
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useSession, signOut } from "@/lib/auth/auth-client";

const navLinks = [
  { label: "Home", href: "/" },

  { label: "Browse Jobs", href: "/jobs" },

  {
    label: "For Employers",
    href: "/employers",
  },

  { label: "Pricing", href: "/pricing" },

  { label: "About", href: "/about" },

  { label: "Contact", href: "/contact" },
];

// Employer dashboard link
const employerLinks = [
  {
    label: "Dashboard",

    href: "/employer/dashboard",

    icon: <LayoutDashboard size={16} />,
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  const { user, isAuthenticated, isPending } = useSession();

  const [isEmployer, setIsEmployer] = useState(false);

  // NEW
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

  // NEW
  const remainingCredits = packageData?.remainingCredits || 0;

  const unlimitedJobs = packageData?.unlimitedJobs || false;

  const canPostJob = unlimitedJobs || remainingCredits > 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",

        scrolled
          ? "bg-[#FAF5EE]/95 backdrop-blur-md shadow-sm border-b border-[#C8782A]/10"
          : "bg-[#FAF5EE]",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span
              className="flex flex-col leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              <span className="font-bold text-2xl tracking-tight text-[#6B3A2A] group-hover:text-[#C8782A] transition-colors duration-200 leading-none">
                Aboriginal Jobs
              </span>

              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C8782A] uppercase mt-0.5">
                Canada
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md group",

                    isActive
                      ? "text-[#C8782A]"
                      : "text-[#6B3A2A] hover:text-[#C8782A]",
                  )}
                >
                  {link.label}

                  <span
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.5 bg-[#C8782A] rounded-full transition-all duration-300 origin-left",

                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isPending ? (
              <div className="w-20 h-8 bg-[#C8782A]/10 rounded-md animate-pulse" />
            ) : isAuthenticated && user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#6B3A2A] hover:bg-[#C8782A]/10 transition-colors text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C8782A]/15 flex items-center justify-center">
                    <User size={14} className="text-[#C8782A]" />
                  </div>

                  <span className="max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>

                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200",

                      userMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#C8782A]/10 py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#C8782A]/10">
                      <p className="text-xs text-[#6B3A2A]/50 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Dashboard Link */}
                    {isEmployer && (
                      <Link
                        href="/employers/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-[#C8782A] transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={async () => {
                        await signOut();

                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-[#C8782A] transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-[#6B3A2A] hover:text-[#C8782A] hover:bg-[#C8782A]/10 font-medium"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* POST JOB BUTTON */}

            {isPending ? (
              <div className="w-[140px] h-10 rounded-md bg-[#C8782A]/10 animate-pulse" />
            ) : !isAuthenticated ? (
              <Link href="/login">
                <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-5 shadow-sm hover:shadow-md transition-all duration-200">
                  Post a Job
                </Button>
              </Link>
            ) : packageLoading ? (
              <div className="w-[140px] h-10 rounded-md bg-[#C8782A]/10 animate-pulse" />
            ) : isEmployer && !canPostJob ? (
              <Link href="/pricing">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 shadow-sm hover:shadow-md transition-all duration-200">
                  Upgrade Plan
                </Button>
              </Link>
            ) : (
              <Link href="/post-a-job" prefetch={false}>
                <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-5 shadow-sm hover:shadow-md transition-all duration-200">
                  Post a Job
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-[#6B3A2A] hover:text-[#C8782A] hover:bg-[#C8782A]/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#FAF5EE] border-t border-[#C8782A]/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",

                    isActive
                      ? "bg-[#C8782A]/10 text-[#C8782A]"
                      : "text-[#6B3A2A] hover:bg-[#C8782A]/10 hover:text-[#C8782A]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Dashboard Link */}
            {isAuthenticated && isEmployer && (
              <Link
                href="/employers/dashboard"
                prefetch={false}
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#6B3A2A] hover:bg-[#C8782A]/10 hover:text-[#C8782A] flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#C8782A]/10">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2 text-sm text-[#6B3A2A]/60 truncate">
                    {user.email}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-[#6B3A2A] text-[#6B3A2A] hover:bg-[#6B3A2A] hover:text-white"
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
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-[#6B3A2A] text-[#6B3A2A] hover:bg-[#6B3A2A] hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
              )}

              {/* MOBILE POST JOB BUTTON */}

              {isPending ? (
                <div className="w-full h-10 rounded-md bg-[#C8782A]/10 animate-pulse" />
              ) : !isAuthenticated ? (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold">
                    Post a Job
                  </Button>
                </Link>
              ) : packageLoading ? (
                <div className="w-full h-10 rounded-md bg-[#C8782A]/10 animate-pulse" />
              ) : isEmployer && !canPostJob ? (
                <Link href="/pricing">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold">
                    Upgrade Plan
                  </Button>
                </Link>
              ) : (
                <Link href="/post-a-job" onClick={() => setMenuOpen(false)} prefetch={false}>
                  <Button className="w-full bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold">
                    Post a Job
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
