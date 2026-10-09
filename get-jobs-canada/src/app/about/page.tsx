"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Globe,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Briefcase,
  Zap,
  Building2,
  Award,
  Mail,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const stats = [
  { value: "50,000+", label: "Active Canadian Listings", icon: Briefcase },
  { value: "1,200+", label: "Verified Hiring Employers", icon: Building2 },
  { value: "100%", label: "Coast-to-Coast Coverage", icon: MapPin },
  { value: "98%", label: "Job Seeker Satisfaction", icon: Award },
];

const values = [
  {
    icon: Globe,
    title: "Coast-to-Coast Inclusion",
    desc: "Connecting job seekers and employers from major metropolitan cities like Toronto, Vancouver, and Montreal to every province nationwide.",
  },
  {
    icon: ShieldCheck,
    title: "100% Employer Verification",
    desc: "Every company on GetJobsCanada undergoes rigorous administrative screening to ensure legitimate, safe, and high-quality job postings.",
  },
  {
    icon: Zap,
    title: "Direct & Fast Applications",
    desc: "No complicated barriers or redundant forms. Candidates connect directly with decision-makers for faster hiring cycles.",
  },
  {
    icon: TrendingUp,
    title: "Transparent Opportunity",
    desc: "We promote clear salary ranges, honest role expectations, and equal access to career advancement for all Canadians.",
  },
];

const team = [
  {
    name: "Nikunj Desai",
    role: "Co-Founder & CEO",
    bio: "Nikunj leads GetJobsCanada's strategic vision and nationwide growth, building high-trust partnerships with top employers and empowering job seekers across Canada.",
    initials: "ND",
    expertise: ["Executive Leadership", "Workforce Strategy", "Business Growth"],
    email: "support@getjobscanada.ca",
  },
  {
    name: "Sanket Kasvala",
    role: "Co-Founder & CTO",
    bio: "Sanket drives our engineering and technology roadmap, engineering high-speed matching systems, intuitive UI experiences, and robust platform security.",
    initials: "SK",
    expertise: ["Platform Architecture", "Full-Stack Tech", "Data Privacy"],
    email: "support@getjobscanada.ca",
  },
];

const provinces = [
  "Ontario",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Nova Scotia",
  "Manitoba",
  "Saskatchewan",
  "New Brunswick",
  "Newfoundland & Labrador",
  "Prince Edward Island",
  "Territories (Yukon, NWT, Nunavut)",
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 pb-20">
      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 pt-8 pb-12 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl text-left"
          >
            {/* Dual-Pill Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4"
            >
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                ABOUT US
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                Empowering Canada&apos;s Modern Workforce
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Connecting Canadian Talent with{" "}
              <span className="text-[#059669]">Exceptional Jobs</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8"
            >
              GetJobsCanada is Canada&apos;s premier modern career network — built specifically to connect ambitious job seekers, skilled professionals, and verified employers across all 10 provinces and territories.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Link
                href="/jobs"
                className="px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-2 group"
              >
                <span>Explore Opportunities</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/register"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-2xl border border-slate-200 shadow-xs transition-all flex items-center gap-2"
              >
                <Building2 size={16} className="text-[#059669]" />
                <span>Post a Job as Employer</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS COUNTER BAR ───────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 -mt-8 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#059669] flex items-center justify-center flex-shrink-0">
                <s.icon size={22} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {s.value}
                </p>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── OUR MISSION & VALUES GRID ───────────────────────────────────── */}
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
            className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-3"
          >
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
              OUR MISSION
            </span>
            <span className="text-xs font-semibold text-slate-700 leading-none">
              Driving Employment Growth Across Canada
            </span>
          </motion.div>
          
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Built for Job Seekers & Top Employers Nationwide
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed"
          >
            Our core mission is simple: eliminate hiring friction, ensure candidate dignity, and give every Canadian easy access to meaningful career advancement.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((v) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-5 border border-emerald-100">
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WHY GETJOBSCANADA (SPLIT HIGHLIGHT SECTION) ─────────────────── */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 text-left"
            >
              <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-800 border border-slate-700 shadow-xs mb-4">
                <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                  WHY US
                </span>
                <span className="text-xs font-semibold text-slate-300 leading-none">
                  The Preferred Platform for Canadians
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Modern Recruitment Engineered for the Canadian Market
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Finding the right job or hiring qualified candidates in Canada shouldn&apos;t require navigating outdated job boards filled with spam. GetJobsCanada delivers a streamlined, modern experience.
              </p>

              <div className="space-y-3">
                {[
                  "Direct connection between verified employers and candidates",
                  "Comprehensive support across IT, Healthcare, Skilled Trades, Finance & Remote roles",
                  "Full compliance with Canadian Labour Standards and Employment Privacy",
                  "Fast application submission with no hidden platform fees for job seekers",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#059669] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 font-medium leading-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Interactive Card Box */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      Nationwide Hub
                    </span>
                    <h4 className="text-lg font-bold text-white">Canada Wide Coverage</h4>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#059669] flex items-center justify-center font-bold text-base">
                    🇨🇦
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Whether you are seeking remote work in Toronto, engineering positions in Calgary, tech roles in Vancouver, or municipal jobs in Atlantic Canada, our platform aggregates top hiring companies nationwide.
                </p>

                <div className="flex flex-wrap gap-2">
                  {provinces.map((prov) => (
                    <span
                      key={prov}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
                    >
                      {prov}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR TEAM SECTION ("The People Behind GetJobsCanada") ─────────── */}
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
            className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-3"
          >
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
              OUR TEAM
            </span>
            <span className="text-xs font-semibold text-slate-700 leading-none">
              The People Behind GetJobsCanada
            </span>
          </motion.div>
          
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            The Leadership Team
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Our founders bring deep expertise in workforce technology, business innovation, and digital platform development to serve job seekers and employers across Canada.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Avatar Initials Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-emerald-700 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-950/20">
                    {member.initials}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200/60">
                    Executive
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">
                  {member.name}
                </h3>
                <p className="text-sm font-bold text-[#059669] mb-4">
                  {member.role}
                </p>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mb-4">
                  {member.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600"
                    >
                      {exp}
                    </span>
                  ))}
                </div>

                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#059669] transition-colors"
                >
                  <Mail size={14} />
                  <span>Contact Executive Team</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CUSTOM ADVISORY & SUPPORT CALLOUT (Light Theme - Avoids Footer Duplication) ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-9 shadow-sm relative overflow-hidden text-left flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Dual-Pill Badge */}
            <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-100/60 border border-emerald-200 shadow-xs mb-3">
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                SUPPORT & INQUIRIES
              </span>
              <span className="text-xs font-semibold text-slate-800 leading-none">
                Direct Canadian Platform Assistance
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Have questions or need custom employer hiring solutions?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Our Canadian team is here to assist job seekers with candidate profiles and provide employers with tailored hiring and job posting packages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Mail size={15} />
              <span>Contact Support Team</span>
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Building2 size={15} className="text-[#059669]" />
              <span>View Employer Packages</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
