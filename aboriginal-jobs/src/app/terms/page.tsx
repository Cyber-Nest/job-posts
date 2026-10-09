"use client";

import { motion } from "motion/react";
import Link from "next/link";
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
} from "lucide-react";

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
  visible: { transition: { staggerChildren: 0.08 } },
};

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

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Definitions",
      content: [
        "“Platform” refers to the Aboriginal Jobs Canada website and associated services.",
        "“User” refers to anyone accessing Aboriginal Jobs Canada, including job seekers and employers.",
        "“Indigenous Peoples” refers to First Nations, Métis, and Inuit communities in Canada.",
        "“Employer” refers to individuals or organizations using the platform to post job opportunities.",
      ],
    },
    {
      icon: Eye,
      title: "2. Purpose",
      content: [
        "Aboriginal Jobs Canada is a platform designed exclusively to connect Indigenous job seekers in Canada with employment opportunities. The platform is intended to:",
        "• Promote equitable employment for Indigenous Peoples",
        "• Support diversity and inclusion in workplaces across Canada",
        "• Provide resources and opportunities tailored to Indigenous job seekers",
      ],
    },
    {
      icon: Users,
      title: "3. Eligibility",
      subSections: [
        {
          subTitle: "For Job Seekers:",
          points: [
            "The platform is intended for Indigenous Peoples in Canada, including First Nations, Métis, and Inuit",
            "Users must be at least 18 years old to register and use the platform",
            "Job seekers must provide accurate and truthful information when creating a profile",
          ],
        },
        {
          subTitle: "For Employers:",
          points: [
            "Employers must comply with all applicable Canadian labor laws",
            "Job postings must reflect genuine and lawful job opportunities",
            "Employers must not engage in discriminatory or exploitative practices",
          ],
        },
      ],
    },
    {
      icon: Shield,
      title: "4. Acceptable Use",
      content: [
        "All users agree to:",
        "• Use the platform responsibly and for its intended purpose of job search and recruitment",
        "• Provide accurate, truthful, and complete information when registering or posting jobs",
        "• Refrain from posting or sharing content that is false, misleading, offensive, defamatory, or discriminatory",
        "• Avoid attempts to gain unauthorized access to the platform or its data",
      ],
    },
    {
      icon: Briefcase,
      title: "5. Job Posting Policy",
      subSections: [
        {
          subTitle: "Requirements for Employers:",
          points: [
            "Job postings must include detailed and accurate information about the role, including job title, description, qualifications, location, and compensation",
            "Employers must not post roles that are discriminatory, exploitative, or otherwise violate Canadian labor laws",
          ],
        },
        {
          subTitle: "Review and Removal:",
          points: [
            "Aboriginal Jobs Canada reserves the right to review and remove job postings that contain inappropriate or false information",
            "Postings that violate platform policies or applicable laws may be removed",
            "Postings flagged as suspicious or fraudulent by users will be investigated",
          ],
        },
      ],
    },
    {
      icon: Lock,
      title: "6. Privacy and Data Protection",
      content: [
        "Aboriginal Jobs Canada collects and processes personal data in accordance with its Privacy Policy.",
        "User data will not be shared, sold, or disclosed to third parties except as required by law or necessary to provide platform services.",
        "Users are responsible for safeguarding their account credentials and must notify Aboriginal Jobs Canada immediately of any unauthorized access.",
      ],
    },
    {
      icon: AlertCircle,
      title: "7. Non-Manipulation Policy",
      content: [
        "Aboriginal Jobs Canada is committed to maintaining the integrity of the platform.",
        "Users must not attempt to manipulate data, job postings, or application statistics.",
        "Any user who engages in data manipulation may have their account terminated without notice and may be reported to relevant authorities.",
      ],
    },
    {
      icon: CreditCard,
      title: "8. Refund Policy",
      subSections: [
        {
          subTitle: "For Employers:",
          points: [
            "Refunds are only issued in cases where a technical error or platform malfunction prevents a job posting from being published",
            "Refund requests must be submitted in writing to customercare@aboriginaljobs.ca within 7 days of the issue",
            "Refunds will not be provided for dissatisfaction with the number of applications or for violations of these terms",
            "Approved refunds will be processed within 14 business days",
          ],
        },
        {
          subTitle: "For Job Seekers:",
          points: [
            "Aboriginal Jobs Canada is completely free for job seekers — no fees are charged",
          ],
        },
        {
          subTitle: "Non-Refundable Fees:",
          points: [
            "Fees for premium services, such as featured job postings, are non-refundable unless a platform error occurs",
          ],
        },
        {
          subTitle: "Platform Credit Option:",
          points: [
            "Employers may opt for platform credit instead of a refund, which can be applied to future job postings",
          ],
        },
      ],
    },
    {
      icon: FileCheck,
      title: "9. Intellectual Property",
      content: [
        "All content on the platform, including text, images, logos, and software, is the property of Aboriginal Jobs Canada or its licensors and is protected by copyright laws.",
        "Users may not copy, modify, distribute, or use any platform content without prior written permission.",
      ],
    },
    {
      icon: AlertCircle,
      title: "10. Disclaimers",
      content: [
        "Aboriginal Jobs Canada acts as a medium to connect job seekers and employers. It does not:",
        "• Guarantee employment for job seekers",
        "• Endorse or verify the legitimacy of employers or job postings",
        "Aboriginal Jobs Canada is not liable for disputes, damages, or losses arising from interactions between users.",
      ],
    },
    {
      icon: Scale,
      title: "11. Limitation of Liability",
      content: [
        "To the fullest extent permitted by law:",
        "• Aboriginal Jobs Canada is not responsible for any direct, indirect, incidental, or consequential damages resulting from the use of the platform",
        "• Users agree to indemnify Aboriginal Jobs Canada from claims, losses, or damages arising from their platform use",
      ],
    },
    {
      icon: XCircle,
      title: "12. Termination of Services",
      content: [
        "Aboriginal Jobs Canada reserves the right to suspend or terminate user accounts for:",
        "• Violations of these terms and conditions",
        "• Engaging in fraudulent, illegal, or harmful activities",
        "Users may terminate their accounts at any time by contacting customercare@aboriginaljobs.ca",
      ],
    },
    {
      icon: RefreshCw,
      title: "13. Modifications to Terms",
      content: [
        "Aboriginal Jobs Canada reserves the right to update or modify these terms without prior notice.",
        "Continued use of the platform after changes constitutes acceptance of the updated terms.",
      ],
    },
    {
      icon: Scale,
      title: "14. Governing Law",
      content: [
        "These terms and conditions are governed by the laws of Canada. Any disputes will be resolved under Canadian jurisdiction.",
      ],
    },
  ];

  return (
    <>
      {/* Breadcrumb + Hero */}
      <section className="bg-[#FAF5EE] py-12 lg:py-16 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 text-sm text-[#6B3A2A]/60 mb-4"
            >
              <Link href="/" className="hover:text-[#C8782A] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-[#C8782A] font-medium">
                Terms & Conditions
              </span>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Legal Agreement
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Terms & Conditions
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 text-base max-w-2xl leading-relaxed"
            >
              Welcome to Aboriginal Jobs Canada. By accessing or using our
              platform, you agree to comply with and be bound by the following
              terms and conditions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#FAF5EE] rounded-2xl p-4 mb-8 text-center border border-[#C8782A]/10"
          >
            <p className="text-sm text-[#6B3A2A]/60">
              <span className="font-semibold text-[#C8782A]">
                Effective Date:
              </span>{" "}
              May 22, 2026
            </p>
          </motion.div>

          {/* Agreement Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 p-5 bg-[#FAF5EE]/50 rounded-xl border border-[#C8782A]/10"
          >
            <p className="text-[#1C1C1C]/75 leading-relaxed">
              If you do not agree to these terms, please refrain from using the
              platform. By using Aboriginal Jobs Canada, you agree to these
              terms and conditions. Thank you for trusting us to support your
              employment journey and promote equity for Indigenous Peoples in
              Canada.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-[#C8782A]/10 pb-6 last:border-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
                    <section.icon size={16} className="text-[#C8782A]" />
                  </div>
                  <h2
                    className="text-xl font-bold text-[#1C1C1C]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="pl-12">
                  {section.content && (
                    <div className="space-y-2">
                      {section.content.map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-[#1C1C1C]/75 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {section.subSections && (
                    <div className="space-y-4">
                      {section.subSections.map((sub, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-[#1C1C1C] mb-2">
                            {sub.subTitle}
                          </h3>
                          <ul className="space-y-1 pl-4">
                            {sub.points.map((point, j) => (
                              <li
                                key={j}
                                className="text-[#1C1C1C]/75 leading-relaxed"
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#C8782A]/15 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-[#C8782A]" />
              </div>
              <h2
                className="text-xl font-bold text-[#1C1C1C]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                15. Contact Information
              </h2>
            </div>
            <div className="pl-12">
              <p className="text-[#1C1C1C]/75 leading-relaxed mb-3">
                For any questions, concerns, or refund requests, please contact
                us:
              </p>
              <div className="space-y-1">
                <p className="text-[#1C1C1C] font-medium">
                  Aboriginal Jobs Canada
                </p>
                <p className="text-[#1C1C1C]/75">
                  Email:{" "}
                  <a
                    href="mailto:info.aboriginal@cyber-nest.ca"
                    className="text-[#C8782A] hover:underline"
                  >
                    info.aboriginal@cyber-nest.ca{" "}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
