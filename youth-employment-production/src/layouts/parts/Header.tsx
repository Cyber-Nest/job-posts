import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@/router";
import { Menu, X, ChevronDown, LogOut, User, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth/auth-client";

// Click outside hook
function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  enabled: boolean = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler, enabled]);

  return ref;
}

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Browse Jobs",
    href: "/jobs",
  },
  {
    label: "For Employers",
    href: "/employers",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  { label: "About", href: "/about" },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [packageData, setPackageData] = useState<any>(null);

  const [packageLoading, setPackageLoading] = useState(true);

  const location = useLocation();

  const { user, isAuthenticated, isPending } = useSession();

  const hasUnlimitedJobs = packageData?.unlimitedJobs;

  const remainingCredits = packageData?.remainingCredits ?? 0;

  const canPostJob = hasUnlimitedJobs || remainingCredits > 0;

  // Close user menu when clicking outside
  const userMenuRef = useClickOutside<HTMLDivElement>(() => {
    setUserMenuOpen(false);
  }, userMenuOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // FETCH PACKAGE
  useEffect(() => {
    const fetchPackage = async () => {
      if (!isAuthenticated) {
        setPackageLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/employer/package", {
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          setPackageData(data.package);
        }
      } catch (error) {
        console.error("Failed to fetch package:", error);
      } finally {
        setPackageLoading(false);
      }
    };

    fetchPackage();
  }, [isAuthenticated]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100"
          : "bg-white",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <span
              className="flex flex-col leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-none">
                Youth Employment
              </span>

              <span className="text-[10px] font-semibold tracking-[0.25em] text-blue-600 uppercase mt-0.5">
                Canada
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md group",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600",
                  )}
                >
                  {link.label}

                  <span
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full transition-all duration-300 origin-left",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {packageLoading ? (
              <div className="w-32 h-10 rounded-lg bg-blue-100 animate-pulse" />
            ) : !isAuthenticated ? (
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                  <Briefcase size={15} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            ) : canPostJob ? (
              <Link to="/post-a-job">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                  <Briefcase size={15} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            ) : (
              <Link to="/pricing">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                  Upgrade Plan
                </Button>
              </Link>
            )}

            {isPending ? (
              <div className="w-20 h-8 bg-blue-100 rounded-md animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={14} className="text-blue-600" />
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
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-blue-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-blue-50">
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link to="/dashboard">
                      <button
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Briefcase size={14} />
                        Dashboard
                      </button>
                    </Link>

                    <button
                      onClick={async () => {
                        await signOut();

                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-blue-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isAuthenticated ? (
              <Link to="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2">
                  <Briefcase size={15} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            ) : canPostJob ? (
              <Link to="/post-a-job">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2">
                  <Briefcase size={15} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            ) : (
              <Link to="/pricing">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold mt-2">
                  Upgrade Plan
                </Button>
              </Link>
            )}

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-blue-100">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 truncate">
                    {user.email}
                  </div>

                  <Link to="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-blue-500 hover:border-blue-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Briefcase size={14} className="mr-2" />
                      Dashboard
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-blue-500 hover:border-blue-300"
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
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-blue-500 hover:border-blue-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
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
