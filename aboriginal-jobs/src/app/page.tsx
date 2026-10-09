"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
  Code2,
  Calendar,
  Loader2,
  DollarSign,
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

// ─── Counter Component ────────────────────────────────────────────────────────
function Counter({
  target,
  duration = 500,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// ─── Stats Data ───────────────────────────────────────────────────────────────
const statsData = [
  { value: 2400, label: "Jobs Posted", suffix: "+" },
  { value: 850, label: "Employers", suffix: "+" },
  { value: 15000, label: "Job Seekers", suffix: "+" },
  { value: 13, label: "Provinces & Territories", suffix: "" },
];

// ─── Job Card Component for Search Results ────────────────────────────────────
interface JobCardProps {
  location: ReactNode;
  _id: string;
  title: string;
  company: string;
  city: string;
  province: string;
  employmentType: string;
  salary?: string;
  salaryType?: string;
  remote?: boolean;
  indigenousOwned?: boolean;
  jobId?: string;
  experience?: string;
  startDate?: string;
  nocCode?: string;
  postedAt?: string | Date;
}

function JobSearchCard({ job }: { job: JobCardProps }) {
  const router = useRouter();

  const formatSalary = (salary?: string, salaryType?: string) => {
    if (!salary) return "Salary not specified";
    const typeMap: Record<string, string> = {
      hour: "/hr",
      week: "/wk",
      month: "/mo",
      year: "/yr",
    };
    return `${salary}${typeMap[salaryType || "hour"] || ""}`;
  };

  const getStartDateLabel = (startDate?: string) => {
    if (!startDate) return null;
    const dateMap: Record<string, string> = {
      asap: "ASAP",
      immediate: "Immediate",
      "1week": "Within 1 week",
      "2weeks": "Within 2 weeks",
      "1month": "Within 1 month",
    };
    return dateMap[startDate] || startDate;
  };

  const formatPostedDate = (date?: string | Date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div variants={fadeUp}>
      <div
        onClick={() => router.push(`/jobs/${job._id}`)}
        className="group block bg-white rounded-2xl border border-[#C8782A]/10 hover:border-[#C8782A]/35 hover:shadow-md transition-all duration-200 p-5 cursor-pointer"
      >
        {/* Top: Logo + Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-[#C8782A]" />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {job.remote && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#1a64c4]/10 text-[#1a64c4] px-2.5 py-0.5 rounded-full font-medium">
                Remote
              </span>
            )}
            {job.indigenousOwned && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#7A9E7E]/15 text-[#4a7a4e] px-2.5 py-0.5 rounded-full font-medium">
                Indigenous
              </span>
            )}
            {job.jobId && (
              <span className="text-xs bg-neutral-100 text-neutral-500 border border-neutral-200 px-2.5 py-0.5 rounded-full font-mono">
                {job.jobId}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#1C1C1C] text-base leading-snug mb-0.5 group-hover:text-[#C8782A] transition-colors duration-200 line-clamp-2">
          {job.title}
        </h3>

        {/* Company */}
        <p className="text-sm text-[#C8782A] font-semibold mb-3">
          {job.company}
        </p>

        {/* Location + Employment Type + Salary */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65 min-w-0">
            <MapPin size={11} className="text-[#C8782A] flex-shrink-0" />
            <span className="truncate">
              {job.location}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65">
            <Briefcase size={11} className="text-[#C8782A]" />
            {job.employmentType}
          </span>
          {formatSalary(job.salary, job.salaryType) !==
            "Salary not specified" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65">
              <DollarSign size={11} className="text-[#C8782A]" />
              {formatSalary(job.salary, job.salaryType)}
            </span>
          )}
          {job.nocCode && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65">
              <Code2 size={11} className="text-[#C8782A]" />
              NOC: {job.nocCode}
            </span>
          )}
        </div>

        {/* Experience + Start Date Row */}
        {(job.experience || job.startDate) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.experience && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                <Briefcase size={10} /> {job.experience}{" "}
                {parseInt(job.experience) > 1 ? "years" : "year"}
              </span>
            )}
            {job.startDate && getStartDateLabel(job.startDate) && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                <Calendar size={10} /> Start: {getStartDateLabel(job.startDate)}
              </span>
            )}
          </div>
        )}

        {/* Footer: Posted Date + View Details */}
        <div className="flex items-center justify-between pt-3 border-t border-[#C8782A]/8">
          {formatPostedDate(job.postedAt) && (
            <span className="text-xs text-[#6B3A2A]/45">
              {formatPostedDate(job.postedAt)}
            </span>
          )}
          <span className="text-xs text-[#C8782A] font-semibold group-hover:gap-2 transition-all duration-200 inline-flex items-center gap-1">
            View Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

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
      <path
        d="M200 20 Q280 100 200 200 Q120 100 200 20Z"
        fill="currentColor"
        opacity="0.06"
      />
      <path
        d="M380 200 Q300 280 200 200 Q300 120 380 200Z"
        fill="currentColor"
        opacity="0.06"
      />
      <path
        d="M200 380 Q120 300 200 200 Q280 300 200 380Z"
        fill="currentColor"
        opacity="0.06"
      />
      <path
        d="M20 200 Q100 120 200 200 Q100 280 20 200Z"
        fill="currentColor"
        opacity="0.06"
      />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch featured jobs from backend
  const { data: jobsResponse, isLoading: jobsLoading } = useQuery({
    queryKey: ["home-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs?limit=6");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  // Search jobs
  const {
    data: searchResults,
    refetch: searchJobs,
    isFetching: isSearching,
  } = useQuery({
    queryKey: ["search-jobs", searchQuery, searchLocation],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (searchLocation) params.append("province", searchLocation);
      params.append("limit", "8");
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to search jobs");
      return res.json();
    },
    enabled: false,
  });

  const featuredJobs = jobsResponse?.data || [];
  const searchResultsList = searchResults?.data || [];

  const handleSearch = async () => {
    if (!searchQuery && !searchLocation) return;

    setShowSearchResults(true);

    await searchJobs();

    // smooth scroll after results render
    setTimeout(() => {
      const resultsSection = document.getElementById("search-results");
      resultsSection?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchLocation("");
    setShowSearchResults(false);
  };

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-[#1C1C1C]">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1630673470267-417e4d361129?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Gradient Overlay for Text Readability on Mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-22">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl text-left"
          >
            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-2"
            >
              Canada's Indigenous Job Platform
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Career
              <br />
              <span className="text-[#C8782A]">Starts Here.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-xl"
            >
              Connecting First Nations, Métis, and Inuit job seekers with
              inclusive employers across every province and territory in Canada.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mb-8"
            >
              <div className="flex items-center gap-2 flex-1 px-3 py-1.5 sm:py-0">
                <Search size={18} className="text-[#C8782A] flex-shrink-0" />
                <Input
                  placeholder="Job title, keyword, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[#1C1C1C] placeholder:text-[#1C1C1C]/50 w-full h-9 sm:h-10"
                />
              </div>

              {/* Divider - Hidden on Mobile */}
              <div className="h-px bg-[#C8782A]/20 mx-3 sm:hidden" />
              <div className="w-px bg-[#C8782A]/20 hidden sm:block" />

              <div className="flex items-center gap-2 flex-1 px-3 py-1.5 sm:py-0">
                <MapPin size={18} className="text-[#C8782A] flex-shrink-0" />
                <Input
                  placeholder="City, province, or territory"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[#1C1C1C] placeholder:text-[#1C1C1C]/50 w-full h-9 sm:h-10"
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-6 py-2.5 sm:py-0 rounded-lg sm:rounded-xl shrink-0 w-full sm:w-auto transition-all duration-300 disabled:opacity-80"
              >
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Searching...
                  </span>
                ) : (
                  "Search Jobs"
                )}
              </Button>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8 py-6 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 w-full flex justify-center items-center"
                >
                  Find Jobs
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/post-a-job" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#6B3A2A] font-semibold px-8 py-6 sm:py-3 transition-all duration-200 hover:-translate-y-0.5 bg-transparent w-full flex justify-center items-center"
                >
                  Post a Job
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row with Counter Animation */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl"
          >
            {statsData.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-left bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-xl backdrop-blur-sm sm:backdrop-blur-none"
              >
                <p
                  className="text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <Counter target={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-xs sm:text-sm text-white/70 mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Search Results Section ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.section
            id="search-results"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="bg-white py-10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Search Results
                  {searchResultsList.length > 0 && (
                    <span className="text-[#C8782A] text-lg ml-2">
                      ({searchResultsList.length})
                    </span>
                  )}
                </h2>

                <button
                  onClick={clearSearch}
                  className="text-sm text-[#C8782A] hover:underline font-medium"
                >
                  Clear Search
                </button>
              </div>

              {isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border border-[#C8782A]/10 bg-white p-5 animate-pulse"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-[#FAF5EE]" />
                        <div className="w-16 h-5 bg-[#FAF5EE] rounded-full" />
                      </div>

                      <div className="h-5 w-3/4 bg-[#FAF5EE] rounded mb-2" />
                      <div className="h-4 w-1/3 bg-[#FAF5EE] rounded mb-3" />

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="h-4 w-full bg-[#FAF5EE] rounded" />
                        <div className="h-4 w-full bg-[#FAF5EE] rounded" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : searchResultsList.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                >
                  {searchResultsList.map((job: any, index: number) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.05,
                      }}
                    >
                      <JobSearchCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-[#6B3A2A]/60">
                    No jobs found matching your search.
                  </p>

                  <Link href="/jobs">
                    <Button
                      variant="outline"
                      className="mt-4 border-[#C8782A]/30 text-[#C8782A]"
                    >
                      Browse All Jobs
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── DUAL CTA SPLIT ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job Seekers Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 40px rgba(200,120,42,0.2)",
              }}
              className="lg:col-span-3 bg-[#C8782A] rounded-3xl p-10 lg:p-12 relative overflow-hidden cursor-pointer"
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
                  Discover opportunities with employers who value Indigenous
                  talent and are committed to inclusive, respectful workplaces.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    Browse hundreds of jobs from inclusive employers across
                    Canada
                  </li>
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    Click any job card to see full details at a glance
                  </li>
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    Choose how to apply — email, phone, mail, or in person
                  </li>
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    No account needed to browse and apply
                  </li>
                </ul>
                <Link href="/jobs">
                  <Button
                    size="lg"
                    className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-8 shadow-md"
                  >
                    Search Jobs
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
                boxShadow: "0 20px 40px rgba(107,58,42,0.25)",
              }}
              className="lg:col-span-2 bg-[#6B3A2A] rounded-3xl p-10 lg:p-12 relative overflow-hidden cursor-pointer"
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
                  I'm Hiring Indigenous Talent
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Connect with skilled Indigenous job seekers and build a
                  workforce that reflects the richness of Canada.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    Post jobs to a targeted Indigenous audience
                  </li>
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    Featured listings for better visibility
                  </li>
                  <li className="flex items-start gap-3 text-white/90 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-white flex-shrink-0 mt-0.5"
                    />
                    Reach candidates across every province
                  </li>
                </ul>
                <Link href="/post-a-job">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#6B3A2A] font-semibold px-8 transition-all duration-200"
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
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
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
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
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

          {jobsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#C8782A]/10 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EE]" />
                    <div className="w-16 h-5 bg-[#FAF5EE] rounded-full" />
                  </div>
                  <div className="h-5 w-3/4 bg-[#FAF5EE] rounded mb-1" />
                  <div className="h-4 w-1/3 bg-[#FAF5EE] rounded mb-2" />
                  <div className="h-4 w-1/2 bg-[#FAF5EE] rounded mb-5" />
                  <div className="h-4 w-20 bg-[#FAF5EE] rounded" />
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {featuredJobs.slice(0, 6).map((job: any) => (
                <motion.div
                  key={job._id}
                  variants={fadeUp}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 30px rgba(107,58,42,0.12)",
                  }}
                  className="bg-white rounded-2xl p-6 border border-[#C8782A]/10 cursor-pointer transition-shadow duration-200"
                  onClick={() => router.push(`/jobs/${job._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-[#C8782A]" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {job.remote && (
                        <span className="text-xs bg-[#1a64c4]/10 text-[#1a64c4] px-2.5 py-0.5 rounded-full font-medium">
                          Remote
                        </span>
                      )}
                      {job.jobId && (
                        <span className="text-xs bg-neutral-100 text-neutral-500 border border-neutral-200 px-2.5 py-0.5 rounded-full font-mono">
                          {job.jobId}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#1C1C1C] text-lg mb-1 leading-snug line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-[#6B3A2A] text-sm font-medium mb-2">
                    {job.company}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#1C1C1C]/50 text-sm mb-5">
                    <MapPin size={13} />
                    <span>
                      {job.location}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[#C8782A] text-sm font-semibold group-hover:gap-2 transition-all duration-200">
                    View Details <ArrowRight size={14} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6B3A2A]/60">
                No jobs available at the moment. Please check back later.
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link href="/jobs">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#C8782A] text-[#C8782A] hover:bg-[#C8782A] hover:text-white font-semibold px-10 transition-all duration-200"
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
              className="bg-[#FAF5EE] rounded-3xl p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#C8782A]/15 flex items-center justify-center">
                  <Users size={18} className="text-[#C8782A]" />
                </div>
                <h3
                  className="text-xl font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  For Job Seekers
                </h3>
              </div>
              <div className="flex flex-col gap-7">
                <motion.div variants={fadeUp} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#C8782A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C] mb-1">
                      Browse Jobs
                    </h4>
                    <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                      Search and filter through hundreds of job opportunities
                      from inclusive employers across Canada.
                    </p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#C8782A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C] mb-1">
                      View Job Details
                    </h4>
                    <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                      Click any job card to see full description, requirements,
                      salary, and location — all in one place.
                    </p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#C8782A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C] mb-1">
                      Apply Your Way
                    </h4>
                    <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                      Follow the application method listed — email, phone, mail,
                      or in person — based on employer preference.
                    </p>
                  </div>
                </motion.div>
              </div>
              <div className="mt-8">
                <Link href="/jobs">
                  <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold">
                    Search Jobs
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
              className="bg-[#6B3A2A]/5 rounded-3xl p-8 lg:p-10 border border-[#6B3A2A]/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#6B3A2A]/15 flex items-center justify-center">
                  <Building2 size={18} className="text-[#6B3A2A]" />
                </div>
                <h3
                  className="text-xl font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  For Employers
                </h3>
              </div>
              <div className="flex flex-col gap-7">
                <motion.div variants={fadeUp} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#6B3A2A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C] mb-1">
                      Choose Your Package
                    </h4>
                    <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                      Select from flexible packages designed to fit your hiring
                      needs.
                    </p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#6B3A2A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C] mb-1">
                      Post Your Job
                    </h4>
                    <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                      Create a compelling job listing that reaches thousands of
                      qualified Indigenous job seekers.
                    </p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#6B3A2A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C] mb-1">
                      Review & Hire
                    </h4>
                    <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">
                      Manage applicants through your dashboard and build your
                      inclusive team.
                    </p>
                  </div>
                </motion.div>
              </div>
              <div className="mt-8">
                <Link href="/post-a-job">
                  <Button className="bg-[#6B3A2A] hover:bg-[#5A2F1F] text-white font-semibold">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ── 5. PACKAGES PREVIEW ─────────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-bold text-xs uppercase tracking-widest mb-3"
            >
              Employer Packages
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Packages for Every Hiring Need
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed"
            >
              Whether you're hiring for one position or building a long-term
              Indigenous workforce strategy, we have the perfect package for
              your organization.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-stretch"
          >
            {[
              {
                name: "Starter",
                tagline: "Perfect for first-time hiring",
                features: [
                  "Job Post Expiry - 180 Days",
                  "Credit Never Expire",
                  "1 Job Posting",
                ],
                cta: "View Package",
                highlight: false,
              },
              {
                name: "Deluxe",
                tagline: "Boost visibility & attract more applicants",
                features: [
                  "Job Post Expiry - 180 Days",
                  "Credit Never Expire",
                  "5 Job Posting",
                ],
                cta: "View Package",
                highlight: true,
                badge: "Most Popular",
              },
              {
                name: "Ultimate",
                tagline: "Build trust with Indigenous communities",
                features: [
                  "Job Post Expiry - 180 Days",
                  "Credit Never Expire",
                  "10 Job Posting",
                ],
                cta: "View Package",
                highlight: false,
              },
              {
                name: "Unlimited",
                tagline: "Unlimited hiring with dedicated support",
                features: [
                  "Job Post Expiry - 365 Days",
                  "Unlimited Job Posting",
                  "Priority Employer Support",
                ],
                cta: "View Package",
                highlight: false,
              },
            ].map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  boxShadow: pkg.highlight
                    ? "0 20px 40px rgba(200,120,42,0.25)"
                    : "0 12px 24px rgba(107,58,42,0.08)",
                }}
                className={`rounded-2xl p-6 sm:p-7 relative transition-all duration-200 flex flex-col h-full ${
                  pkg.highlight
                    ? "bg-[#C8782A] text-white ring-2 ring-[#C8782A] shadow-xl lg:-mt-2 lg:mb-2"
                    : "bg-white border border-[#C8782A]/10 hover:shadow-md"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#6B3A2A] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap uppercase tracking-wider">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="flex-grow">
                  <div
                    className={`w-10 h-10 rounded-xl mb-5 flex items-center justify-center ${
                      pkg.highlight ? "bg-white/20" : "bg-[#C8782A]/10"
                    }`}
                  >
                    <Star
                      size={18}
                      className={
                        pkg.highlight ? "text-white" : "text-[#C8782A]"
                      }
                    />
                  </div>

                  <h3
                    className={`font-bold text-lg mb-1 leading-snug ${
                      pkg.highlight ? "text-white" : "text-[#1C1C1C]"
                    }`}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {pkg.name}
                  </h3>

                  <p
                    className={`text-xs mb-5 font-medium ${
                      pkg.highlight ? "text-white/75" : "text-[#6B3A2A]/60"
                    }`}
                  >
                    {pkg.tagline}
                  </p>

                  <ul className="flex flex-col gap-3 mb-8">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2.5 text-sm leading-snug ${
                          pkg.highlight ? "text-white/90" : "text-[#1C1C1C]/70"
                        }`}
                      >
                        <CheckCircle
                          size={15}
                          className={`flex-shrink-0 mt-0.5 ${
                            pkg.highlight ? "text-white" : "text-[#7A9E7E]"
                          }`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/pricing" className="mt-auto pt-2 block w-full">
                  <Button
                    className={`w-full font-semibold rounded-xl py-5 ${
                      pkg.highlight
                        ? "bg-white text-[#C8782A] hover:bg-[#FAF5EE]"
                        : "bg-[#C8782A] hover:bg-[#B06820] text-white"
                    }`}
                  >
                    {pkg.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.3,
            }}
            className="text-center mt-14"
          >
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#C8782A] text-[#C8782A] hover:bg-[#C8782A] hover:text-white font-semibold px-10 rounded-xl transition-all duration-200 gap-2"
              >
                View All Packages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 6. WHY CYBERNEST ────────────────────────────────────────────────── */}
      <section className="bg-[#6B3A2A] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 text-[#C8782A] pointer-events-none" />
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
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Why Aboriginal Jobs Canada
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#FAF5EE]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built for Indigenous Canada
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
                desc: "The only job board built exclusively for Indigenous job seekers and inclusive employers across Canada — not an afterthought, but a purpose-built community.",
              },
              {
                num: "02",
                title: "Culturally Respectful",
                desc: "Every feature is designed with sensitivity to the diverse cultures, traditions, and communities of First Nations, Métis, and Inuit Peoples across Turtle Island.",
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
                className="bg-white/8 border border-white/10 rounded-2xl p-8 backdrop-blur-sm h-full"
              >
                <p
                  className="text-[#C8782A] text-5xl font-bold mb-5 opacity-60"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.num}
                </p>
                <h3
                  className="text-xl font-bold text-[#FAF5EE] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#FAF5EE]/65 leading-relaxed text-sm">
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
            {[
              {
                quote:
                  "Aboriginal Jobs Canada helped me find a meaningful career close to home. The platform truly understands what Indigenous job seekers need.",
                name: "Sarah T.",
                role: "Community Health Worker",
                location: "Saskatchewan",
              },
              {
                quote:
                  "As an employer committed to reconciliation, Aboriginal Jobs Canada connected us with incredible Indigenous talent we wouldn't have found anywhere else.",
                name: "Marcus L.",
                role: "HR Director",
                location: "British Columbia",
              },
              {
                quote:
                  "Finally, a job board that feels like it was built for us. The process was simple, respectful, and I landed a great opportunity.",
                name: "Jordan B.",
                role: "Environmental Technician",
                location: "Northwest Territories",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(107,58,42,0.1)",
                }}
                className="bg-[#FAF5EE] rounded-2xl p-8 border border-[#C8782A]/10 transition-shadow duration-200 h-full"
              >
                <Quote size={32} className="text-[#C8782A] mb-5 opacity-60" />
                <p className="text-[#1C1C1C]/80 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C8782A]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C8782A] font-bold text-sm">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1C1C] text-sm">
                      {t.name}
                    </p>
                    <p className="text-[#6B3A2A]/60 text-xs">
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
      <section className="bg-[#C8782A] py-16 lg:py-20 relative overflow-hidden">
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
              Whether you're searching for your next opportunity or building an
              inclusive team — Aboriginal Jobs Canada is here for you.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/jobs">
                <Button
                  size="lg"
                  className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-10 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  Find Jobs
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/post-a-job">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#C8782A] font-semibold px-10 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Post a Job
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/15 font-semibold px-8 transition-all duration-200"
                >
                  Contact Aboriginal Jobs Canada
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
