import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/router";
import { Helmet } from "@dr.pogodin/react-helmet";
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Loader2,
  X,
  CrownIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Job Card Component for Search Results ────────────────────────────────────
function JobSearchCard({ job, onClick }: { job: any; onClick: () => void }) {
  const formatSalary = (salary?: string, salaryPeriod?: string) => {
    if (!salary) return null;
    return `$${salary}${salaryPeriod ? ` / ${salaryPeriod}` : ""}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div variants={fadeUp}>
      <div
        onClick={onClick}
        className="group block bg-white rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-5 cursor-pointer"
      >
        {/* Top: Logo + Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-blue-600" />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {job.remote && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                Remote
              </span>
            )}
            {/* {job.indigenousPreference && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                Indigenous
              </span>
            )} */}
            <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full">
              {job.employmentType}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-0.5 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {job.title}
        </h3>

        {/* Company */}
        <p className="text-sm text-blue-600 font-semibold mb-3">
          {job.company}
        </p>

        {/* Location + Salary */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <MapPin size={11} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {job.location || `${job.city || ""}, ${job.province || ""}`}
            </span>
          </span>
          {formatSalary(job.salary, job.salaryPeriod) && (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
              <Star size={11} className="text-green-500" />
              {formatSalary(job.salary, job.salaryPeriod)}
            </span>
          )}
        </div>

        {/* Footer: Posted Date */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-100">
          {job.postedAt && (
            <span className="text-xs text-gray-400">
              Posted {formatDate(job.postedAt)}
            </span>
          )}
          <span className="text-xs text-blue-600 font-semibold group-hover:gap-2 transition-all duration-200 inline-flex items-center gap-1">
            View Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "3,200+", label: "Jobs Posted" },
  { value: "1,150+", label: "Employers" },
  { value: "18,000+", label: "Youth Job Seekers" },
  { value: "All", label: "Provinces & Territories" },
];

const DEFAULT_STATIC_PACKAGES = [
  {
    icon: Star,
    name: "Starter",
    originalPrice: 25,
    discountedPrice: 12.5,
    tagline: "FEATURES OF STARTER PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "1 Job Posting",
    ],
    cta: "View Package",
    highlight: false,
    badge: "50% OFF",
  },
  {
    icon: Zap,
    name: "Deluxe",
    originalPrice: 95,
    discountedPrice: 47.5,
    tagline: "FEATURES OF DELUXE PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "5 Job Posting",
    ],
    cta: "View Package",
    highlight: true, // Marked as premium highlight variant
    badge: "Most Popular • 50% OFF",
  },
  {
    icon: Building2,
    name: "Ultimate",
    originalPrice: 195,
    discountedPrice: 97.5,
    tagline: "FEATURES OF ULTIMATE PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "10 Job Posting",
    ],
    cta: "View Package",
    highlight: false,
    badge: "50% OFF",
  },
  {
    icon: ShieldCheck,
    name: "Pro Plan",
    originalPrice: 380,
    discountedPrice: 190,
    tagline: "FEATURES OF PRO PLAN PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "20 Job Posting",
    ],
    cta: "View Package",
    highlight: false,
    badge: "Best Value • 50% OFF",
  },
  {
    icon: CrownIcon,
    name: "Unlimited",
    originalPrice: 1350,
    discountedPrice: 675,
    tagline: "FEATURES OF UNLIMITED PLAN",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Expire 1 Year",
      "Unlimited Jobs Posting",
    ],
    cta: "View Package",
    highlight: false,
    darkVariant: true, // Custom premium dark look like the image
    badge: "Mega Deal • 50% OFF",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Starter: Star,
  Deluxe: Zap,
  Ultimate: Building2,
  "Pro Plan": ShieldCheck,
  Unlimited: CrownIcon,
};


const testimonials = [
  {
    quote:
      "Youth Employment Canada helped me find a role that matched my skills and values. The platform made it easy to connect with employers who support young Canadians.",
    name: "Aaliyah M.",
    role: "Student Intern",
    location: "Ontario",
  },
  {
    quote:
      "Our local team filled a youth position quickly and with confidence. The process was simple and the candidates were ready to contribute.",
    name: "Daniel K.",
    role: "Program Manager",
    location: "British Columbia",
  },
  {
    quote:
      "I found a flexible, meaningful job through Youth Employment Canada and felt supported every step of the way.",
    name: "Mia R.",
    role: "Customer Service Associate",
    location: "Alberta",
  },
];

// ─── Decorative SVG ───────────────────────────────────────────────────────────

function OrganicShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
      />
      <circle
        cx="200"
        cy="200"
        r="130"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.12"
      />
      <circle
        cx="200"
        cy="200"
        r="80"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([] as any[]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState("");
  const [heroLocation, setHeroLocation] = useState("");

  // Search results state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [packagesList, setPackagesList] = useState<any[]>(DEFAULT_STATIC_PACKAGES);

  useEffect(() => {
    let active = true;
    fetch(`/api/packages?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && data.packages && data.packages.length > 0) {
          const mapped = data.packages.map((pkg: any) => ({
            ...pkg,
            icon: ICON_MAP[pkg.name] || Star,
            cta: "View Package",
          }));
          setPackagesList(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch packages:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (!res.ok) {
          if (mounted) setJobs([]);
        } else {
          if (mounted) setJobs(Array.isArray(data.jobs) ? data.jobs : []);
        }
      } catch (err) {
        if (mounted) setJobs([]);
      } finally {
        if (mounted) setJobsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Search function
  const handleSearch = async () => {
    if (!heroSearch.trim() && !heroLocation.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setShowResults(true);

    try {
      const params = new URLSearchParams();
      if (heroSearch.trim()) params.append("search", heroSearch.trim());
      if (heroLocation.trim()) params.append("province", heroLocation.trim());
      params.append("limit", "8");

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to search jobs");
      }

      const allJobs = Array.isArray(data.jobs) ? data.jobs : [];

      const keyword = heroSearch.toLowerCase().trim();
      const locationKeyword = heroLocation.toLowerCase().trim();

      const filteredJobs = allJobs.filter((job: any) => {
        const matchesKeyword =
          !keyword ||
          job.title?.toLowerCase().includes(keyword) ||
          job.company?.toLowerCase().includes(keyword) ||
          job.description?.toLowerCase().includes(keyword) ||
          job.category?.toLowerCase().includes(keyword);

        const matchesLocation =
          !locationKeyword ||
          job.location?.toLowerCase().includes(locationKeyword) ||
          job.province?.toLowerCase().includes(locationKeyword);

        return matchesKeyword && matchesLocation;
      });

      setSearchResults(filteredJobs);
    } catch (err: any) {
      setSearchError(err.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }

    // Smooth scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("search-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setHeroSearch("");
    setHeroLocation("");
    setShowResults(false);
    setSearchResults([]);
    setSearchError("");
  };

  return (
    <>
      <Helmet>
        <title>
          Youth Employment Canada — Canada's Youth Employment Network
        </title>
        <meta
          name="description"
          content="Youth Employment Canada connects young Canadians with inclusive employers nationwide. Find jobs, post opportunities, and launch your next career."
        />
      </Helmet>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-gradient-to-b from-blue-50 to-white">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_25%),linear-gradient(180deg,_rgba(37,99,235,0.04),_rgba(248,250,252,0.0))]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-5"
            >
              Youth Employment Across Canada
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Launch Your Next
              <br />
              <span className="text-blue-600">Career with Confidence.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl"
            >
              Bringing young Canadians and inclusive employers together across
              every province and territory. Search jobs, connect with employers,
              and grow your career.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mb-8"
            >
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-blue-600 flex-shrink-0" />
                <Input
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Job title, keyword, or company"
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="w-px bg-blue-200 hidden sm:block" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                <Input
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="City, province, or territory"
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-xl shrink-0 disabled:opacity-80"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Searching...
                  </span>
                ) : (
                  "Search Jobs"
                )}
              </Button>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link to="/jobs">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Find Jobs
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/post-a-job">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 transition-all duration-200 hover:-translate-y-0.5 bg-transparent"
                >
                  Post a Job
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-left"
              >
                <p
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SEARCH RESULTS SECTION (INLINE) ──────────────────────────────────── */}
      {showResults && (
        <motion.section
          id="search-results"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-10 border-b border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Search Results
                  {!isSearching && searchResults.length > 0 && (
                    <span className="text-blue-600 text-lg ml-2">
                      ({searchResults.length})
                    </span>
                  )}
                </h2>
                {(heroSearch || heroLocation) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {heroSearch && (
                      <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 mr-2">
                        {heroSearch}
                      </span>
                    )}
                    {heroLocation && (
                      <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5">
                        {heroLocation}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={clearSearch}
                className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
              >
                <X size={14} />
                Clear Search
              </button>
            </div>

            {isSearching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-200" />
                      <div className="w-16 h-5 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : searchError ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-2">{searchError}</p>
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  className="mt-2 border-blue-300 text-blue-600"
                >
                  Try Again
                </Button>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map((job, index) => (
                  <JobSearchCard
                    key={job.id || index}
                    job={job}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No jobs found</p>
                <p className="text-sm text-gray-400 mb-4">
                  Try adjusting your search terms or browse all jobs.
                </p>
                <Link to="/jobs">
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-600"
                  >
                    Browse All Jobs
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* ── 2. DUAL CTA SPLIT ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job Seekers Card — larger */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 40px rgba(37,99,235,0.08)",
              }}
              className="lg:col-span-3 bg-[#2563EB] rounded-3xl p-10 lg:p-12 relative overflow-hidden cursor-pointer"
            >
              <OrganicShape className="absolute -right-16 -bottom-16 w-72 h-72 text-white pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Users size={14} className="text-white" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">
                    For Job Seekers
                  </span>
                </div>
                <h2
                  className="text-3xl lg:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  I'm Looking for Work
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed max-w-md">
                  Find paid opportunities, internships, and entry-level roles
                  designed for young Canadians ready to grow their skills and
                  build confidence.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    {
                      text: "Search jobs",
                      desc: "Browse current job opportunities across Canada and view employer-provided application instructions.",
                    },
                    {
                      text: "Apply directly",
                      desc: "Apply outside our website using the email, phone, mail, or in-person method provided by the employer.",
                    },
                    {
                      text: "Connect with employers",
                      desc: "Contact employers directly using the application method listed on each job posting.",
                    },
                  ].map((item, idx) => (
                    <li
                      key={item.text}
                      className="flex items-start gap-3 text-white/90 text-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{`0${idx + 1}`}</div>
                      <div>
                        <div className="font-semibold mb-1">{item.text}</div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="/jobs">
                  <Button
                    size="lg"
                    className="bg-white text-[#2563EB] hover:bg-[#F8FAFC] font-semibold px-8 shadow-md"
                  >
                    Browse Jobs
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Employers Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 40px rgba(15,23,42,0.06)",
              }}
              className="lg:col-span-2 bg-[#0F172A] rounded-3xl p-10 lg:p-12 relative overflow-hidden cursor-pointer"
            >
              <OrganicShape className="absolute -right-16 -bottom-16 w-64 h-64 text-white pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Building2 size={14} className="text-white" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">
                    For Employers
                  </span>
                </div>
                <h2
                  className="text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  I'm Hiring Youth Talent
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Reach motivated young Canadians who bring fresh energy, strong
                  potential, and a desire to learn and grow.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    "Post jobs to a youth-focused audience",
                    "Manage applicants in one place",
                    "Boost visibility with featured listings",
                    "Access hiring support for young talent",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-white/90 text-sm"
                    >
                      <CheckCircle
                        size={16}
                        className="text-white flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/post-a-job">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#2563EB] font-semibold px-8 transition-all duration-200"
                  >
                    Post a Job
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED JOBS ────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Opportunities Await
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Latest Opportunities
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* Loading Skeletons */}
            {jobsLoading && (
              <>
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    variants={fadeUp}
                    className="bg-white rounded-2xl p-6 border border-[#2563EB]/10 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg mb-3 w-1/2"></div>
                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="h-3 w-3 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                  </motion.div>
                ))}
              </>
            )}

            {/* No Jobs Message */}
            {!jobsLoading && jobs.length === 0 && (
              <div className="col-span-full text-center text-sm text-[#475569]">
                No jobs posted yet. Please check back soon.
              </div>
            )}

            {/* Jobs List */}
            {!jobsLoading &&
              jobs.slice(0, 6).map((job) => (
                <motion.div
                  key={(job.id || job.title) + (job.location || "")}
                  variants={fadeUp}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 30px rgba(107,58,42,0.12)",
                  }}
                  className="bg-white rounded-2xl p-6 border border-[#2563EB]/10 cursor-pointer transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-[#2563EB]" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB]`}
                    >
                      {job.employmentType || job.type || "Full-time"}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1C1C1C] text-lg mb-1 leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-[#2563EB] text-sm font-medium mb-2">
                    {job.company}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#1C1C1C]/50 text-sm mb-5">
                    <MapPin size={13} />
                    <span>{job.location}</span>
                  </div>
                  <Link
                    to={`/jobs/${job.id || ""}`}
                    className="inline-flex items-center gap-1.5 text-[#2563EB] text-sm font-semibold hover:gap-2.5 transition-all duration-200"
                  >
                    View Job <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link to="/jobs">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold px-10 transition-all duration-200"
              >
                View All Jobs
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#7A9E7E] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Simple. Respectful. Effective.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Job Seekers Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="bg-[#F8FAFC] rounded-3xl p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 flex items-center justify-center">
                  <Users size={18} className="text-[#2563EB]" />
                </div>
                <h3
                  className="text-xl font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  For Job Seekers
                </h3>
              </div>
              <div className="flex flex-col gap-7">
                {[
                  {
                    step: "01",
                    title: "Search jobs",
                    desc: "Browse current job opportunities across Canada and review the application instructions provided by each employer.",
                  },
                  {
                    step: "02",
                    title: "Apply directly",
                    desc: "Apply outside our website using the email, phone, mail, or in-person method provided by the employer.",
                  },
                  {
                    step: "03",
                    title: "Connect with employers",
                    desc: "Contact employers directly using the application method listed on each job posting.",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    variants={fadeUp}
                    className="flex gap-5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1C1C1C] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#475569]/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/jobs">
                  <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Employers Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="bg-[#F8FAFC] rounded-3xl p-8 lg:p-10 border border-[#E6EEF8]"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A]/5 flex items-center justify-center">
                  <Building2 size={18} className="text-[#0F172A]" />
                </div>
                <h3
                  className="text-xl font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  For Employers
                </h3>
              </div>
              <div className="flex flex-col gap-7">
                {[
                  {
                    step: "01",
                    title: "Choose your package",
                    desc: "Select from flexible packages designed to fit your hiring needs — from a single posting to full monthly support.",
                  },
                  {
                    step: "02",
                    title: "Post your job listing",
                    desc: "Create a compelling listing that reaches thousands of qualified youth candidates across Canada.",
                  },
                  {
                    step: "03",
                    title: "Review applications and hire",
                    desc: "Manage applicants through your dashboard, connect with candidates, and build your inclusive team.",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    variants={fadeUp}
                    className="flex gap-5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1C1C1C] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#475569]/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/post-a-job">
                  <Button className="bg-[#0F172A] hover:bg-[#0b1220] text-white font-semibold">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. PACKAGES PREVIEW ─────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 lg:py-24 relative overflow-hidden">
        {/* Modern ambient accent background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-blue-500/5 via-red-500/5 to-transparent blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16 space-y-3"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-1.5 bg-[#EF4444]/10 text-[#EF4444] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#EF4444]/20 shadow-sm mb-1"
            >
              <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse" />
              Limited Time: Flat 50% Off On All Plans
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#0F172A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Packages for Every Hiring Need
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#475569]/70 max-w-2xl mx-auto text-base font-medium"
            >
              Whether you're posting your first youth opportunity or building a
              long-term hiring strategy, we have a tier designed for you. All
              discounts are pre-applied below.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch"
          >
            {packagesList.map((pkg) => {
              // Match the layout variations decided in the core pricing view
              const isDark = pkg.darkVariant;
              const isHigh = pkg.highlight;

              let cardStyles =
                "bg-[#F8FAFC] border border-[#2563EB]/10 hover:shadow-xl";
              if (isHigh) {
                cardStyles =
                  "bg-white border-2 border-[#EF4444] shadow-2xl xl:-mt-4 xl:mb-4 transform scale-[1.01]";
              } else if (isDark) {
                cardStyles =
                  "bg-[#1E1B18] text-[#F5EBE6] border border-[#3A3530] shadow-xl";
              }

              return (
                <motion.div
                  key={pkg.name}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 ${cardStyles}`}
                >
                  {/* Conditional Top Floating Badges */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md whitespace-nowrap uppercase tracking-wider ${
                          isHigh
                            ? "bg-[#EF4444] text-white"
                            : isDark
                              ? "bg-[#E6A15C] text-[#1E1B18]"
                              : "bg-[#2563EB] text-white"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Card Title & Rendered Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`font-bold text-lg ${isDark ? "text-[#E6A15C]" : "text-[#0F172A]"}`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {pkg.name}
                      </h3>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "bg-[#E6A15C]/10" : isHigh ? "bg-[#EF4444]/10" : "bg-[#2563EB]/10"}`}
                      >
                        <pkg.icon
                          size={16}
                          className={
                            isDark
                              ? "text-[#E6A15C]"
                              : isHigh
                                ? "text-[#EF4444]"
                                : "text-[#2563EB]"
                          }
                        />
                      </div>
                    </div>

                    {/* Dynamic Price Display Layer */}
                    <div className="mb-5 border-b border-dashed pb-4 opacity-95">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-[#F5EBE6]" : "text-[#0F172A]"}`}
                        >
                          ${pkg.discountedPrice}
                        </span>
                        <span
                          className={`text-xs line-through ${isDark ? "text-white/40" : "text-[#475569]/50"}`}
                        >
                          ${pkg.originalPrice}
                        </span>
                      </div>
                      <p
                        className={`text-[9px] font-bold tracking-widest mt-0.5 uppercase ${isDark ? "text-white/50" : "text-[#475569]/60"}`}
                      >
                        CAD • One-Time
                      </p>
                    </div>

                    {/* Tagline Section */}
                    <p
                      className={`text-[10px] font-bold tracking-wider mb-4 uppercase ${isDark ? "text-[#E6A15C]/80" : "text-[#2563EB]"}`}
                    >
                      {pkg.tagline}
                    </p>

                    {/* Functional Feature Mapping */}
                    <ul className="flex flex-col gap-2.5 mb-8">
                      {pkg.features.map((f: string) => (
                        <li
                          key={f}
                          className={`flex items-start gap-2.5 text-xs font-medium ${isDark ? "text-white/80" : "text-[#0F172A]/80"}`}
                        >
                          <CheckCircle
                            size={14}
                            className={`flex-shrink-0 mt-0.5 ${isDark ? "text-[#E6A15C]" : isHigh ? "text-[#EF4444]" : "text-[#2563EB]"}`}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Direct Routing Button Action */}
                  <div className="mt-auto">
                    <Link to="/pricing" className="w-full">
                      <Button
                        className={`w-full font-semibold text-xs py-4.5 rounded-xl ${
                          isDark
                            ? "bg-[#E6A15C] text-[#1E1B18] hover:bg-[#d4904b]"
                            : isHigh
                              ? "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                              : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                        }`}
                      >
                        {pkg.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Section Footnote Navigation Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold px-10 transition-all duration-200"
              >
                Compare Full Enterprise Features
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 6. WHY CYBERNEST ────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 text-[#2563EB] pointer-events-none" />
        <OrganicShape className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 text-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Why Youth Employment Canada
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#FAF5EE]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built for Young Talent Across Canada
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {[
              {
                num: "01",
                title: "Dedicated Platform",
                desc: "The only job board built for young Canadians and employers who want to hire the next generation of talent — not an afterthought, but a purpose-built community.",
              },
              {
                num: "02",
                title: "Culturally Respectful",
                desc: "Every feature is designed to support youth careers, education pathways, and meaningful early-stage work experiences from coast to coast.",
              },
              {
                num: "03",
                title: "Canada-Wide Reach",
                desc: "Connecting talent and opportunity from coast to coast to coast — in every province and territory, from urban centres to remote and northern communities.",
              },
            ].map((item) => (
              <motion.div
                key={item.num}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white/8 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
              >
                <p
                  className="text-[#2563EB] text-5xl font-bold mb-5 opacity-60"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.num}
                </p>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/65 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#7A9E7E] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Community Stories
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Voices from Our Community
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(15,23,42,0.04)",
                }}
                className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#2563EB]/10 transition-shadow duration-200"
              >
                <Quote size={32} className="text-[#2563EB] mb-5 opacity-60" />
                <p className="text-[#0F172A]/80 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2563EB] font-bold text-sm">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {t.name}
                    </p>
                    <p className="text-[#475569]/60 text-xs">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 8. FINAL CTA BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#2563EB] py-16 lg:py-20 relative overflow-hidden">
        <OrganicShape className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 text-white pointer-events-none" />
        <OrganicShape className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 text-[#6B3A2A] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Take the Next Step?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Whether you're searching for your next opportunity or hiring young
              talent — Youth Employment Canada is here to support your next
              move.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/jobs">
                <Button
                  size="lg"
                  className="bg-white text-[#2563EB] hover:bg-[#F8FAFC] font-semibold px-10 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  Find Jobs
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/post-a-job">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#2563EB] font-semibold px-10 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Post a Job
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/15 font-semibold px-8 transition-all duration-200"
                >
                  Contact Youth Employment Canada
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
