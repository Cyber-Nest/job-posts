"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2,
  Users,
  Star,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: Briefcase,
    title: "Post Job Listings",
    desc: "Reach thousands of qualified job seekers across Canada with targeted, effective job postings.",
  },
  {
    icon: Users,
    title: "Manage Applicants",
    desc: "Review, organize, and communicate with applicants through your dedicated employer dashboard.",
  },
  {
    icon: Star,
    title: "Featured Listings",
    desc: "Boost your visibility with featured placements that appear at the top of search results.",
  },
  {
    icon: Building2,
    title: "Company Profile",
    desc: "Showcase your organization's brand and career culture with a dedicated employer dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Hiring",
    desc: "Access verified Canadian candidate pools with direct application management.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    desc: "Track your listing views, applications received, and hiring outcomes with clear reporting tools.",
  },
];

export default function EmployersPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 pb-20">
      
      {/* ── 1. HERO SECTION ───────────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] text-white border-b border-slate-800 py-16 sm:py-20 lg:py-28 overflow-hidden text-left">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#059669]/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Dual-Pill Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-900 border border-slate-800 shadow-xs mb-6"
            >
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider leading-none">
                FOR EMPLOYERS
              </span>
              <span className="text-xs font-semibold text-slate-300 leading-none">
                Nationwide Hiring & Recruitment Solutions
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6"
            >
              Hire Qualified Talent <span className="text-[#059669]">Across Canada</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl font-medium"
            >
              GetJobsCanada connects your business with qualified professionals nationwide across all 10 provinces & territories. Post jobs with zero expiration dates on credits.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/post-a-job">
                <Button
                  size="lg"
                  className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold px-8 h-12 rounded-2xl shadow-lg shadow-emerald-950/50"
                >
                  Post a Job Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 font-extrabold px-8 h-12 rounded-2xl"
                >
                  View Credit Packages
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. FEATURES GRID ──────────────────────────────────────────────── */}
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
              EMPLOYER SUITE
            </span>
            <span className="text-xs font-semibold text-slate-700 leading-none">
              Modern Recruitment Tools
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Everything You Need to Hire Top Talent
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center font-bold mb-5">
                  <f.icon size={22} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. NATIONWIDE ADVANTAGE SHOWCASE ─────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24 border-y border-slate-200/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                CANADA-WIDE IMPACT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-5">
                Streamlined Recruitment Engineered for Canada
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium text-sm sm:text-base">
                Finding qualified candidates in Canada shouldn&apos;t require navigating outdated, noisy job boards filled with spam. GetJobsCanada delivers a clean, modern hiring experience with direct candidate messaging and non-expiring posting credits.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Access to qualified professionals across all 10 provinces & territories",
                  "Non-expiring job posting credits for flexible hiring schedules",
                  "Transparent salary ranges, employment types, and NOC classifications",
                  "Direct applications without recruiter middleman delays",
                  "Full control over job status (Active, Closed, Expired) from dashboard",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 font-bold">
                    <CheckCircle size={18} className="text-[#059669] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact">
                <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl shadow-md flex items-center gap-2">
                  <span>Contact Employer Support</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <Globe size={36} className="text-[#059669] mb-5" />
                  <h3 className="text-2xl font-black mb-3 text-white">
                    Nationwide Coverage
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-8 text-sm font-medium">
                    Your job postings reach candidates from Toronto to Vancouver, Calgary to Halifax, and across all northern territories.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { v: "50,000+", l: "Active Job Seekers" },
                      { v: "1,200+", l: "Verified Employers" },
                      { v: "13", l: "Provinces & Territories" },
                      { v: "100%", l: "Non-Expiring Credits" },
                    ].map((s) => (
                      <div key={s.l} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                        <p className="text-2xl font-extrabold text-[#059669]">
                          {s.v}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">
                          {s.l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />

          <span className="bg-[#059669] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            START HIRING TODAY
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto">
            Ready to Find Your Next Great Canadian Hire?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-medium">
            Post your first job listing today and connect with qualified talent across Canada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/post-a-job">
              <Button className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl">
                Post a Job Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-extrabold text-sm px-8 py-4 rounded-2xl">
                View Pricing & Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
