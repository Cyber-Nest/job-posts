import React from "react";
import { CheckCircle2, ShieldCheck, MapPin, DollarSign, Briefcase, Calendar, Building2, HelpCircle } from "lucide-react";

interface JobAiSummaryProps {
  job: {
    _id?: string;
    id?: string;
    title: string;
    company: string;
    city?: string;
    province?: string;
    location?: string;
    salary?: string;
    salaryType?: string;
    employmentType?: string;
    nocCode?: string;
    category?: string;
    experience?: string;
    vacancies?: number;
    indigenousOwned?: boolean;
    indigenousPreference?: boolean;
    remote?: boolean;
    contactEmail?: string;
    website?: string;
    expiresAt?: string | Date;
  };
}

export default function JobAiSummary({ job }: JobAiSummaryProps) {
  if (!job) return null;

  const locationStr =
    job.location || [job.city, job.province].filter(Boolean).join(", ") || "Canada";

  // AI-Targeted Q&A for Google AI Overviews (SGE) & Search Assist
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the salary for ${job.title} at ${job.company}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: job.salary
            ? `The salary for ${job.title} at ${job.company} is ${job.salary} CAD${job.salaryType ? ` per ${job.salaryType}` : ""}, located in ${locationStr}.`
            : `The salary for ${job.title} at ${job.company} is competitive and open for discussion based on experience.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the National Occupational Classification (NOC) code for ${job.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: job.nocCode
            ? `This position is classified under Canada's National Occupational Classification as NOC ${job.nocCode} (${job.category || "General Classification"}).`
            : `This position falls under the ${job.category || "Professional"} category in Canadian employment classification.`,
        },
      },
      {
        "@type": "Question",
        name: `Is there Indigenous hiring preference for this position?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, Aboriginal Jobs Canada partners with inclusive employers. Under Section 16(1) of the Canadian Human Rights Act and Truth and Reconciliation Call to Action #92, First Nations, Métis, and Inuit candidates are strongly encouraged and welcomed to apply.`,
        },
      },
      {
        "@type": "Question",
        name: `Where is this position located and is remote work available?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: job.remote
            ? `This position offers remote/hybrid work options across Canada, allowing candidates to work from their home community.`
            : `This position is located in ${locationStr}, Canada.`,
        },
      },
    ],
  };

  return (
    <>
      {/* FAQ Schema for AI Search Engines & Google AI Overview */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />

      {/* Structured Fact Box for Googlebot & Users */}
      {/* <section className="bg-white rounded-2xl border border-[#C8782A]/20 p-6 shadow-sm my-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#C8782A]/15">
          <ShieldCheck className="text-[#C8782A]" size={20} />
          <h2
            className="text-lg font-bold text-[#1C1C1C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Role Overview & Verified Facts
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#FAF5EE] rounded-xl p-3 border border-[#C8782A]/10">
            <span className="text-[#6B3A2A]/70 uppercase tracking-wider text-[10px] font-semibold block mb-1">
              Position
            </span>
            <span className="font-bold text-[#1C1C1C] text-sm block truncate">
              {job.title}
            </span>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl p-3 border border-[#C8782A]/10">
            <span className="text-[#6B3A2A]/70 uppercase tracking-wider text-[10px] font-semibold block mb-1">
              Compensation
            </span>
            <span className="font-bold text-[#C8782A] text-sm block">
              {job.salary || "Competitive"} CAD
            </span>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl p-3 border border-[#C8782A]/10">
            <span className="text-[#6B3A2A]/70 uppercase tracking-wider text-[10px] font-semibold block mb-1">
              Location / Territory
            </span>
            <span className="font-bold text-[#1C1C1C] text-sm block truncate">
              {locationStr}
            </span>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl p-3 border border-[#C8782A]/10">
            <span className="text-[#6B3A2A]/70 uppercase tracking-wider text-[10px] font-semibold block mb-1">
              NOC Code
            </span>
            <span className="font-bold text-[#1C1C1C] text-sm block font-mono">
              {job.nocCode ? `NOC ${job.nocCode}` : job.category || "General"}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#C8782A]/10 flex items-start gap-2 text-xs text-[#2A442E] bg-[#7A9E7E]/10 rounded-xl p-3">
          <CheckCircle2 size={16} className="text-[#4a7a4e] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Indigenous Employment Equity:</strong> This posting aligns with{" "}
            <em>Truth and Reconciliation Call to Action #92</em> and Section 16(1) of the{" "}
            <em>Canadian Human Rights Act</em>, supporting equitable career access for First Nations,
            Inuit, and Métis candidates.
          </p>
        </div>
      </section> */}
    </>
  );
}
