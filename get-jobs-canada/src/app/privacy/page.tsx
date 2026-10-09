"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Shield,
  Eye,
  Cookie,
  Server,
  Lock,
  ExternalLink,
  Users,
  RefreshCw,
  Mail,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState("info-collection");

  const sections = [
    {
      id: "info-collection",
      icon: Shield,
      title: "1. Information Collection & Use",
      content:
        "When using GetJobsCanada, we may ask you to provide certain personally identifiable information to enable candidate application processing, employer verification, or support communications. Personal information may include your name, email address, telephone number, location, and account credentials.",
    },
    {
      id: "log-data",
      icon: Eye,
      title: "2. Log Data & Analytics",
      content:
        "We collect information that your browser sends whenever you visit our platform (“Log Data”). This may include your IP address, browser type and version, platform pages visited, time and date of visits, and duration of activity to optimize system performance.",
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "3. Cookie & Tracking Policy",
      content:
        "Cookies are small data files stored on your device. We utilize session cookies and security cookies to authenticate users, remember preferences, and maintain seamless navigation across sessions. You can configure your browser to reject cookies, though some platform features may require cookies to function correctly.",
    },
    {
      id: "service-providers",
      icon: Server,
      title: "4. Third-Party Service Providers",
      content:
        "We may employ vetted third-party infrastructure partners (such as database hosting, email notification systems, and payment gateways) to facilitate our services. These third parties have access to necessary personal information solely to perform designated technical tasks on our behalf and are bound by strict confidentiality agreements.",
    },
    {
      id: "security",
      icon: Lock,
      title: "5. Data Security Standards",
      content:
        "The security of your personal data is paramount. We employ industry-standard encryption protocols (SSL/TLS), secure access controls, and regular database audits. While no internet transmission method is 100% immune, we enforce rigorous commercial safeguards to protect user information.",
    },
    {
      id: "external-links",
      icon: ExternalLink,
      title: "6. External Links & Applications",
      content:
        "Our platform may contain links to external employer portals or third-party web sites. If you click on a third-party link, you will be directed to that site. We strongly advise reviewing the privacy policy of any site you visit, as GetJobsCanada does not control third-party privacy practices.",
    },
    {
      id: "children-privacy",
      icon: Users,
      title: "7. Age Requirement & Youth Privacy",
      content:
        "GetJobsCanada is intended for individuals aged 18 and older. We do not knowingly collect personal data from minors. If a parent or guardian becomes aware that a minor has submitted personal information, please contact us immediately for prompt record removal.",
    },
    {
      id: "policy-updates",
      icon: RefreshCw,
      title: "8. Policy Updates & Notifications",
      content:
        "We may update our Privacy Policy periodically to reflect technological or legal updates. All revisions will be posted on this page with an updated effective date. Continued use of GetJobsCanada following updates constitutes acceptance.",
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 pb-20">
      {/* Hero Banner (Left-aligned & Fresh Mint Background) */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 py-12 lg:py-16 overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl text-left">
            {/* Dual-Pill Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4">
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                PRIVACY
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                Data Protection & Privacy Statement
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              Privacy <span className="text-[#059669]">Policy</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-600 text-base sm:text-lg leading-relaxed">
              GetJobsCanada is committed to protecting your personal information and maintaining full transparency regarding data collection, storage, and privacy rights across Canada.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area: Split Sidebar + Structured Articles */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Table of Contents Sidebar (4 cols on Desktop, Sticky) */}
          <div className="lg:col-span-4 sticky top-24 space-y-5">
            {/* Effective Date Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-left">
              <div className="flex items-center gap-2 text-[#059669] font-bold text-xs uppercase tracking-wider mb-1">
                <CheckCircle2 size={16} />
                <span>Privacy Status</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Effective Date</h3>
              <p className="text-xs text-slate-500 mt-1">
                Last Updated: <span className="font-semibold text-slate-800">May 22, 2026</span>
              </p>
            </div>

            {/* Quick Navigation Menu */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveTab(sec.id)}
                    className={`block px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === sec.id
                        ? "bg-emerald-50 text-[#059669] font-bold border-l-4 border-[#059669]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Privacy Support Contact Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-lg text-left relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Mail size={18} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Data Officer Inquiries</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Have questions or requests regarding your personal data deletion or privacy preferences?
              </p>
              <a
                href="mailto:support@getjobscanada.ca"
                className="text-xs font-bold text-[#059669] hover:underline inline-flex items-center gap-1.5"
              >
                <span>support@getjobscanada.ca</span>
                <ChevronRight size={13} />
              </a>
            </div>
          </div>

          {/* Right Structured Articles (8 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-left scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center flex-shrink-0">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}

            {/* Bottom Compliance Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck size={16} />
                <span>Canadian PIPEDA Compliance</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Privacy & Compliance Assurance</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                GetJobsCanada operates under strict compliance with Canadian Personal Information Protection and Electronic Documents Act (PIPEDA) standards. Your candidate or recruiter data is managed with maximum security protocols.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}