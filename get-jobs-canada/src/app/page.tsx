"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  ShieldCheck,
  Award,
  Loader2,
  DollarSign,
  Code2,
  Calendar,
  Layers,
  HeartHandshake,
  Users,
  ChevronRight,
  Star,
  Compass,
  Filter,
  ArrowUpRight,
  Check,
  Flame,
  HelpCircle,
  ChevronDown,
  Building,
  GraduationCap,
  Hammer,
  Truck,
  LineChart,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Counter Component ────────────────────────────────────────────────────────
function Counter({
  target,
  duration = 900,
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

// ─── Job Card Component ───────────────────────────────────────────────────────
interface JobCardProps {
  _id: string;
  title: string;
  company: string;
  city?: string;
  province?: string;
  location?: string;
  employmentType: string;
  salary?: string;
  salaryType?: string;
  remote?: boolean;
  jobId?: string;
  experience?: string;
  startDate?: string;
  postedAt?: string | Date;
}

function NewJobCard({ job }: { job: JobCardProps }) {
  const router = useRouter();

  const formatSalary = (salary?: string, salaryType?: string) => {
    if (!salary) return null;
    const typeMap: Record<string, string> = {
      hour: "/hr",
      week: "/wk",
      month: "/mo",
      year: "/yr",
    };
    return `${salary}${typeMap[salaryType || "hour"] || ""}`;
  };

  const jobLocation =
    job.location ||
    (job.city && job.province ? `${job.city}, ${job.province}` : "Canada Wide");

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }}>
      <div
        onClick={() => window.open(`/jobs/${job._id}`, "_blank")}
        className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-300 p-6 cursor-pointer flex flex-col justify-between h-full overflow-hidden"
      >
        <div>
          {/* Header Row: Company Badge & Work Type */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-800">
                {job.company ? job.company.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <p className="text-xs font-bold text-[#059669] tracking-wide flex items-center gap-1">
                  <span>{job.company}</span>
                  <BadgeCheck size={14} className="text-[#059669]" />
                </p>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate max-w-[140px]">{jobLocation}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 justify-end">
              {job.remote && (
                <span className="text-[10px] font-extrabold bg-emerald-50 text-[#059669] border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Remote
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-slate-900 text-lg leading-snug mb-3 group-hover:text-[#059669] transition-colors line-clamp-2">
            {job.title}
          </h3>

          {/* Details Pill Row */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-semibold text-slate-600">
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
              {job.employmentType || "Full-Time"}
            </span>

            {formatSalary(job.salary, job.salaryType) && (
              <span className="bg-emerald-50/80 text-[#059669] border border-emerald-200/60 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                <DollarSign size={13} />
                {formatSalary(job.salary, job.salaryType)}
              </span>
            )}

            {job.experience && (
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl">
                {job.experience}
              </span>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-[#059669] transition-colors">
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-[#059669]" />
            Quick Apply Available
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#059669] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sector Matrix Data ───────────────────────────────────────────────────────
const sectorsData = [
  {
    id: "tech",
    name: "Tech & Software",
    icon: Code2,
    count: "15,800+ Jobs",
    avgSalary: "$85,000 - $145,000 / yr",
    topHub: "Toronto & Vancouver",
    trendingRoles: ["Full Stack Developer", "Cloud Engineer", "Data Analyst", "Cybersecurity Specialist"],
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: HeartHandshake,
    count: "11,400+ Jobs",
    avgSalary: "$65,000 - $120,000 / yr",
    topHub: "Calgary & Montreal",
    trendingRoles: ["Registered Nurse", "Medical Assistant", "Pharmacist", "Healthcare Admin"],
  },
  {
    id: "trades",
    name: "Skilled Trades & Construction",
    icon: Hammer,
    count: "18,200+ Jobs",
    avgSalary: "$32 - $58 / hr",
    topHub: "Edmonton & GTA",
    trendingRoles: ["Certified Electrician", "HVAC Technician", "Heavy Equipment Operator", "Site Supervisor"],
  },
  {
    id: "finance",
    name: "Finance, Banking & Accounting",
    icon: LineChart,
    count: "8,900+ Jobs",
    avgSalary: "$70,000 - $130,000 / yr",
    topHub: "Toronto & Ottawa",
    trendingRoles: ["Financial Analyst", "Staff Accountant", "Commercial Banker", "Compliance Manager"],
  },
  {
    id: "logistics",
    name: "Logistics, Supply & Transport",
    icon: Truck,
    count: "10,500+ Jobs",
    avgSalary: "$26 - $45 / hr",
    topHub: "Winnipeg & Halifax",
    trendingRoles: ["Logistics Coordinator", "AZ/Class 1 Driver", "Warehouse Manager", "Supply Chain Planner"],
  },
  // {
  //   id: "sales",
  //   name: "Sales, Retail & Customer Experience",
  //   icon: Users,
  //   count: "12,100+ Jobs",
  //   avgSalary: "$50,000 - $95,000 / yr",
  //   topHub: "Vancouver & Toronto",
  //   trendingRoles: ["Account Executive", "Customer Success Lead", "Regional Sales Rep", "Store Operations"],
  // },
];

// ─── FAQ Items Data ──────────────────────────────────────────────────────────
const faqData = [
  {
    q: "Is GetJobsCanada completely free for job seekers?",
    a: "Yes! GetJobsCanada is 100% free for all candidates nationwide across Canada. You can search, filter, setup job alerts, and apply directly to verified Canadian employers without any hidden fees, subscriptions, or paywalls.",
  },
  {
    q: "Does GetJobsCanada focus on candidates from all provinces across Canada?",
    a: "Absolutely. GetJobsCanada is an all-inclusive nationwide career hub designed for all Canadians, permanent residents, skilled workers, and international candidates across all 10 Canadian provinces and 3 territories.",
  },
  {
    q: "How do employers post jobs and do posting credits expire?",
    a: "Employers can choose from non-expiring credit packages (Starter, Deluxe, Ultimate) or sign up for Unlimited Job Postings. Purchased posting credits never expire, giving businesses total flexibility to hire whenever positions open up.",
  },
  {
    q: "Are the job listings on GetJobsCanada verified?",
    a: "Yes. Every employer account and job listing undergoes platform verification to ensure job seekers receive legitimate, high-quality Canadian employment opportunities.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSector, setSelectedSector] = useState(sectorsData[0].id);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"all" | "remote" | "fulltime">("all");

  // Fetch featured jobs from backend
  const { data: jobsResponse, isLoading: jobsLoading } = useQuery({
    queryKey: ["home-jobs"],
    queryFn: () => apiClient.get("/jobs", { params: { limit: 6 } }),
  });

  // Search jobs
  const {
    data: searchResults,
    refetch: searchJobs,
    isFetching: isSearching,
  } = useQuery({
    queryKey: ["search-jobs", searchQuery, searchLocation],
    queryFn: () =>
      apiClient.get("/jobs", {
        params: {
          search: searchQuery || undefined,
          province: searchLocation || undefined,
          limit: 8,
        },
      }),
    enabled: false,
  });

  const featuredJobs = jobsResponse?.data || [];
  const searchResultsList = searchResults?.data || [];

  const activeSectorObj =
    sectorsData.find((s) => s.id === selectedSector) || sectorsData[0];

  const handleSearch = async () => {
    if (!searchQuery && !searchLocation) return;
    setShowSearchResults(true);
    await searchJobs();
    setTimeout(() => {
      const resultsSection = document.getElementById("search-results");
      resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchLocation("");
    setShowSearchResults(false);
  };

  // Filtered jobs by active tab
  const filteredJobsList = featuredJobs.filter((j: any) => {
    if (activeTab === "remote") return j.remote === true;
    if (activeTab === "fulltime")
      return j.employmentType?.toLowerCase().includes("full");
    return true;
  });

  return (
    <div className="bg-slate-50/60 min-h-screen font-sans text-slate-900 pb-20">
      
      {/* ── 1. ULTRA-MODERN HERO SECTION (SPLIT DASHBOARD CONCEPT) ───────── */}
      <section className="relative bg-white border-b border-slate-200/80 pt-12 pb-16 lg:pt-20 lg:pb-28 overflow-hidden text-left">
        {/* Subtle Decorative Ambient Background Spheres */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Content & Search Console */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 max-w-3xl"
            >
              {/* Dual-Pill Executive Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-900 text-white shadow-md mb-6"
              >
                <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider leading-none">
                  CANADA NATIONWIDE
                </span>
                <span className="text-xs font-semibold text-slate-200 leading-none">
                  All-Inclusive Job & Employer Hub
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6"
              >
                Connecting Canada&apos;s Workforce with <span className="text-[#059669]">Nationwide Opportunities</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-medium"
              >
                From Toronto to Vancouver, Calgary to Halifax — GetJobsCanada connects job seekers with verified Canadian employers across all 10 provinces & territories.
              </motion.p>

              {/* Sleek Floating Search Console */}
              <motion.div
                variants={fadeUp}
                className="bg-slate-900/95 p-3.5 sm:p-4 rounded-3xl border border-slate-800/90 shadow-2xl mb-8 backdrop-blur-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  
                  {/* Job Search Input */}
                  <div className="sm:col-span-5 flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/20 transition-all">
                    <Search size={20} className="text-[#059669] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Title, skill, or employer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-0 outline-none border-none"
                    />
                  </div>

                  {/* Location Input */}
                  <div className="sm:col-span-4 flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/20 transition-all">
                    <MapPin size={20} className="text-[#059669] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Province or City..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-0 outline-none border-none"
                    />
                  </div>

                  {/* Search CTA */}
                  <div className="sm:col-span-3">
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
                    >
                      {isSearching ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Search size={16} />
                          <span>Find Jobs</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Popular Keywords Row */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider mr-1">
                    Hot Roles:
                  </span>
                  {[
                    { label: "Remote Jobs", href: "/jobs?type=remote" },
                    { label: "Software Developer", href: "/jobs?search=Developer" },
                    { label: "Registered Nurse", href: "/jobs?search=Nurse" },
                    { label: "Electrician", href: "/jobs?search=Electrician" },
                    { label: "Accounting", href: "/jobs?search=Accounting" },
                  ].map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Trust Indicators Bar */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#059669]" />
                  <span>100% Free for Job Seekers</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#059669]" />
                  <span>Verified Canadian Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#059669]" />
                  <span>All 10 Provinces Coverage</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column: Live Interactive Desk Widget (Brand New Visual element!) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                {/* Main Dark Slate Console Box */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#059669]/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Widget Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">
                        Live Canadian Jobs Hub
                      </span>
                    </div>

                    <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Feed
                    </span>
                  </div>

                  {/* Stats Counter Bar Inside Console */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left">
                      <p className="text-2xl font-black text-white tracking-tight">
                        <Counter target={50000} />+
                      </p>
                      <p className="text-slate-400 text-xs font-semibold mt-0.5">
                        Active Job Openings
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left">
                      <p className="text-2xl font-black text-emerald-400 tracking-tight">
                        <Counter target={1200} />+
                      </p>
                      <p className="text-slate-400 text-xs font-semibold mt-0.5">
                        Verified Employers
                      </p>
                    </div>
                  </div>

                  {/* Live Featured Snapshot Card */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left mb-6 relative hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#059669]">
                          FEATURED OPENING
                        </span>
                        <h4 className="font-extrabold text-white text-base leading-snug">
                          Senior Cloud Systems Architect
                        </h4>
                        <p className="text-slate-400 text-xs font-medium">
                          Canadian Tech Enterprises • Toronto, ON (Hybrid)
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-[#059669]/20 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        CT
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80 font-semibold">
                      <span className="text-emerald-400 font-extrabold">$125,000 - $155,000 / yr</span>
                      <span className="text-slate-400">Full-Time</span>
                    </div>
                  </div>

                  {/* Candidate Quick Portal Link */}
                  <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/20 rounded-2xl p-4">
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-white">
                        Are you hiring in Canada?
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Post listings to thousands of nationwide applicants.
                      </p>
                    </div>

                    <Link href="/pricing" className="flex-shrink-0">
                      <Button className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold px-4 py-2 rounded-xl">
                        Post Job
                      </Button>
                    </Link>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── SEARCH RESULTS SECTION ────────────────────────────────────────── */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.section
            id="search-results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Search Results{" "}
                {searchResultsList.length > 0 && (
                  <span className="text-[#059669]">({searchResultsList.length})</span>
                )}
              </h2>

              <button
                onClick={clearSearch}
                className="text-xs font-bold text-[#059669] hover:underline"
              >
                Clear Search
              </button>
            </div>

            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-3xl bg-white border border-slate-200 p-6 h-56 animate-pulse" />
                ))}
              </div>
            ) : searchResultsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResultsList.map((job: any) => (
                  <NewJobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-600 text-sm font-medium">
                  No jobs found matching your search criteria.
                </p>
                <Link href="/jobs" className="mt-4 inline-block">
                  <Button className="bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs">
                    Browse All Jobs
                  </Button>
                </Link>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── 2. INTERACTIVE SECTOR DIRECTORY MATRIX (BRAND NEW LAYOUT) ──────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-left mb-12 max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs mb-3"
          >
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
              SECTOR MATRIX
            </span>
            <span className="text-xs font-semibold text-slate-700 leading-none">
              High-Demand Canadian Industries
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Explore Careers Across Top Sectors
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed"
          >
            Select an industry sector to view active job volume, average Canadian salary expectations, and top hiring hubs.
          </motion.p>
        </motion.div>

        {/* Tabbed Sector Directory Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Vertical Sector Selector Buttons */}
          <div className="lg:col-span-5 space-y-3">
            {sectorsData.map((sec) => {
              const Icon = sec.icon;
              const isSelected = selectedSector === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`w-full p-4 rounded-2xl transition-all duration-200 flex items-center justify-between text-left border ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                      : "bg-white text-slate-800 border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-[#059669] text-white"
                          : "bg-emerald-50 text-[#059669]"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm">{sec.name}</h3>
                      <p
                        className={`text-xs font-medium ${
                          isSelected ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {sec.count}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`transition-transform ${
                      isSelected ? "text-emerald-400 translate-x-1" : "text-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Sector Preview Display Box */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeSectorObj.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border border-emerald-200/90 rounded-3xl p-8 shadow-md text-left"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#059669]">
                    ACTIVE SECTOR OVERVIEW
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    {activeSectorObj.name}
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-lg shadow-emerald-950/20">
                  <activeSectorObj.icon size={28} />
                </div>
              </div>

              {/* Data Highlights Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Average Salary Range
                  </p>
                  <p className="text-lg font-extrabold text-[#059669] mt-1">
                    {activeSectorObj.avgSalary}
                  </p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Top Canadian Hubs
                  </p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">
                    {activeSectorObj.topHub}
                  </p>
                </div>
              </div>

              {/* Trending Job Roles List */}
              <div className="mb-8">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  High-Demand Roles Right Now:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSectorObj.trendingRoles.map((role) => (
                    <div
                      key={role}
                      className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-800"
                    >
                      <CheckCircle2 size={14} className="text-[#059669] flex-shrink-0" />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector CTA */}
              <Link href={`/jobs?search=${encodeURIComponent(activeSectorObj.name.split(" ")[0])}`}>
                <Button className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2">
                  <span>Explore All {activeSectorObj.name} Jobs</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>

            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 3. FEATURED LATEST OPPORTUNITIES (TABBED FILTER GRID) ───────── */}
      <section className="bg-white py-16 lg:py-24 border-y border-slate-200/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-left max-w-2xl">
              <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs mb-3">
                <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                  FEATURED JOBS
                </span>
                <span className="text-xs font-semibold text-slate-700 leading-none">
                  Verified Opportunities Across Canada
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Latest Nationwide Openings
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
              {[
                { id: "all", label: "All Jobs" },
                { id: "remote", label: "Remote Only" },
                { id: "fulltime", label: "Full-Time" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-[#059669] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Grid */}
          {jobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-6 h-56 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : filteredJobsList.length > 0 ? (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredJobsList.slice(0, 6).map((job: any) => (
                <NewJobCard key={job._id} job={job} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-3xl border border-slate-200">
              No jobs matching this filter currently.
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/jobs">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg">
                <span>View All Jobs Across Canada</span>
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── 4. THE 4 PILLARS OF GETJOBS CANADA (NATIONWIDE ADVANTAGE) ────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-left mb-14 max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-900 text-white shadow-xs mb-3"
          >
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
              OUR ADVANTAGE
            </span>
            <span className="text-xs font-semibold text-slate-300 leading-none">
              Built for All Canadians & Canadian Businesses
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Why Canadians Choose GetJobsCanada
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            {
              icon: Globe,
              title: "Coast-to-Coast Reach",
              desc: "Covering all 10 provinces & 3 territories with top employment listings from metropolitan centers to regional hubs.",
            },
            {
              icon: ShieldCheck,
              title: "Verified Canadian Employers",
              desc: "Every employer listing is vetted to maintain high platform standards and eliminate spam or fake recruitment listings.",
            },
            {
              icon: DollarSign,
              title: "Upfront Compensation Clarity",
              desc: "Clear pay scales, salary bounds, and NOC employment details to help job seekers make informed career decisions.",
            },
            {
              icon: Zap,
              title: "Direct Application Channels",
              desc: "No unnecessary recruiter middlemen — connect directly with hiring managers and corporate recruiters across Canada.",
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center font-bold mb-6">
                    <Icon size={22} />
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 5. PROVINCIAL & REGIONAL HIRING HUBS (VISUAL CARDS) ──────────── */}
      {/*  */}

      {/* ── 6. DUAL COMMUNITY PORTAL (FOR CANDIDATES & EMPLOYERS) ─────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Candidate Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 border border-emerald-200/90 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between text-left">
            <div>
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                FOR ALL JOB SEEKERS
              </span>

              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Ready to Find Your Next Career Step in Canada?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Whether you are looking for remote work, full-time positions, or skilled trade roles, GetJobsCanada gives you direct access to top employers across Canada.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Search & filter active jobs across all 10 provinces & territories",
                  "100% free candidate profile and direct employer applications",
                  "Transparent salary details & employment terms upfront",
                  "Personalized job alerts matching your skills & target location",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-bold">
                    <CheckCircle2 size={18} className="text-[#059669] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href="/jobs">
                <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl shadow-md flex items-center gap-2">
                  <span>Browse All Jobs Now</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Employer Card */}
          <div className="lg:col-span-6 bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                FOR CANADIAN EMPLOYERS
              </span>

              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                Looking to Hire Qualified Canadian Talent?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Reach active job seekers nationwide. Post jobs with non-expiring credit packages or unlimited posting subscriptions.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Direct exposure to qualified candidates coast to coast",
                  "Non-expiring job credit packages for absolute flexibility",
                  "Verified employer badge & full candidate management portal",
                  "Fast posting process with immediate live indexing",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-bold">
                    <CheckCircle2 size={18} className="text-[#059669] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href="/pricing">
                <Button className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm px-7 py-3.5 rounded-2xl shadow-md flex items-center gap-2">
                  <Building2 size={16} className="text-[#059669]" />
                  <span>View Employer Pricing & Post Job</span>
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FREQUENTLY ASKED QUESTIONS (ACCORDION SECTION) ───────────── */}
      <section className="bg-white py-16 lg:py-24 border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs mb-3">
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                FAQ
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                Got Questions? We Have Answers.
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 text-left">
            {faqData.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={faq.q}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-extrabold text-slate-900 text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#059669] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm font-medium leading-relaxed border-t border-slate-200/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. BOTTOM CTA BANNER ──────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />

          <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            START TODAY
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto">
            Take the Next Step in Your Canadian Career Journey
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-medium">
            Join thousands of job seekers and verified Canadian employers connecting nationwide every day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jobs">
              <Button className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl">
                Explore Job Listings
              </Button>
            </Link>

            <Link href="/pricing">
              <Button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-extrabold text-sm px-8 py-4 rounded-2xl">
                Employer Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
