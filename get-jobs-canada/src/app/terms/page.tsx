"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Users,
  Briefcase,
  Shield,
  Eye,
  FileCheck,
  RefreshCw,
  Mail,
  AlertCircle,
  Scale,
  CreditCard,
  XCircle,
  Lock,
  CheckCircle2,
  HelpCircle,
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

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("1.-definitions");

  const sections = [
    {
      id: "1.-definitions",
      icon: FileText,
      title: "1. Definitions",
      content: [
        "“Platform” refers to the GetJobsCanada website, employer portal, job search index, and associated career services.",
        "“User” refers to anyone accessing GetJobsCanada, including job seekers, recruiters, and employer organizations.",
        "“Employer” refers to verified entities or organizations utilizing the platform to post career opportunities across Canada.",
        "“Candidate” refers to individuals browsing, saving, or applying for employment opportunities.",
      ],
    },
    {
      id: "2.-purpose",
      icon: Eye,
      title: "2. Purpose of Platform",
      content: [
        "GetJobsCanada is a nationwide career network connecting job seekers across Canada with verified employers.",
        "• Connect qualified candidates with inclusive Canadian employers nationwide",
        "• Support transparent recruitment across Ontario, BC, Alberta, Quebec, and all provinces & territories",
        "• Provide 100% free career search tools for job seekers",
      ],
    },
    {
      id: "3.-eligibility",
      icon: Users,
      title: "3. User Eligibility",
      subSections: [
        {
          subTitle: "For Job Seekers:",
          points: [
            "The platform is accessible to all individuals legally authorized to work in Canada",
            "Users must be at least 18 years old to register and create candidate profiles",
            "Job seekers must provide accurate, truthful employment details in applications",
          ],
        },
        {
          subTitle: "For Employers & Recruiters:",
          points: [
            "Employers must comply with all applicable Canadian federal and provincial labor laws",
            "Job listings must represent authentic, legal employment opportunities",
            "Employers must not engage in discriminatory, deceptive, or exploitative hiring practices",
          ],
        },
      ],
    },
    {
      id: "4.-acceptable-use",
      icon: Shield,
      title: "4. Acceptable Use Guidelines",
      content: [
        "All platform users agree to adhere to the following standards:",
        "• Use the platform responsibly solely for genuine employment and recruitment purposes",
        "• Ensure all profile information, job postings, and communications are truthful and complete",
        "• Refrain from uploading fraudulent, misleading, offensive, or unlawful content",
        "• Never attempt unauthorized access to platform servers, databases, or third-party accounts",
      ],
    },
    {
      id: "5.-job-postings",
      icon: Briefcase,
      title: "5. Job Posting Standards",
      subSections: [
        {
          subTitle: "Employer Responsibilities:",
          points: [
            "Postings must clearly state job responsibilities, qualifications, location, and compensation structure",
            "Postings must not violate Canadian Employment Standards or human rights codes",
          ],
        },
        {
          subTitle: "Moderation & Verification:",
          points: [
            "GetJobsCanada reserves the right to review, edit, or remove postings containing misleading details",
            "Flagged or reported postings will be subject to immediate administrative investigation",
          ],
        },
      ],
    },
    {
      id: "6.-privacy-data",
      icon: Lock,
      title: "6. Privacy & Data Security",
      content: [
        "GetJobsCanada collects and manages personal data strictly in accordance with our Privacy Policy.",
        "Candidate data is never sold or rented to unauthorized third parties.",
        "Users are responsible for maintaining the confidentiality of their account login credentials.",
      ],
    },
    {
      id: "7.-refund-policy",
      icon: CreditCard,
      title: "7. Employer Refund Policy",
      subSections: [
        {
          subTitle: "Service Guarantees:",
          points: [
            "Refunds are processed if a technical malfunction prevents a paid job listing from publishing",
            "Refund requests must be submitted to support@getjobscanada.ca within 7 business days",
            "Approved refunds will be credited back to the original payment method within 14 business days",
          ],
        },
        {
          subTitle: "Free for Job Seekers:",
          points: [
            "GetJobsCanada is 100% free for candidate job searches and application submissions",
          ],
        },
      ],
    },
    {
      id: "8.-disclaimers",
      icon: AlertCircle,
      title: "8. Disclaimers & Liability",
      content: [
        "GetJobsCanada operates as an online job platform connecting candidates and employers. We do not:",
        "• Guarantee job placements or interview invitations for candidates",
        "• Endorse individual employment offers or candidate background claims",
        "GetJobsCanada is not liable for direct or indirect losses arising from user interactions.",
      ],
    },
    {
      id: "9.-governing-law",
      icon: Scale,
      title: "9. Governing Law",
      content: [
        "These Terms of Service are governed by the laws of Canada and the applicable provincial laws. Any disputes will be subject to Canadian jurisdiction.",
      ],
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 pb-20">
      {/* Light Hero Banner (Left-aligned & Fresh Mint Background) */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 py-12 lg:py-16 overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl text-left">
            {/* Dual-Pill Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4">
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                LEGAL
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                Terms & Conditions Agreement
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              Terms of <span className="text-[#059669]">Service</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Please read these terms and conditions carefully before using the GetJobsCanada platform. By accessing our platform, you agree to these legal terms.
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
                <span>Document Status</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Current Agreement</h3>
              <p className="text-xs text-slate-500 mt-1">
                Effective Date: <span className="font-semibold text-slate-800">May 22, 2026</span>
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

            {/* Support Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-lg text-left relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Mail size={18} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Legal Support Questions?</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Have questions regarding our terms or legal compliance? Reach out to our legal team.
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

          {/* Right Structured Content Articles (8 cols on Desktop) */}
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

                <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                  {section.content &&
                    section.content.map((para, idx) => (
                      <p key={idx} className="text-slate-700">
                        {para}
                      </p>
                    ))}

                  {section.subSections &&
                    section.subSections.map((sub, idx) => (
                      <div key={idx} className="pt-2">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">
                          {sub.subTitle}
                        </h4>
                        <ul className="space-y-2 pl-2">
                          {sub.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-2 flex-shrink-0" />
                              <span className="text-slate-600">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}

            {/* Bottom Disclaimer Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck size={16} />
                <span>Canadian Jurisdiction</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Notice of Compliance</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                By using GetJobsCanada, all users agree to adhere to these terms. GetJobsCanada reserves the right to update terms at any time. Continued use of the platform after updates constitutes binding acceptance.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
