"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronRight, Shield, Eye, Cookie, Server, Lock, ExternalLink, Users, RefreshCw, Mail } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Information Collection & Use",
      content: "While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information (\"Personal Information\") may include, but is not limited to: Name, Email address, Telephone number, Address."
    },
    {
      icon: Eye,
      title: "Log Data",
      content: "We collect information that your browser sends whenever you visit our Service (\"Log Data\"). This Log Data may include information such as your computer's Internet Protocol (\"IP\") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics."
    },
    {
      icon: Cookie,
      title: "Cookies",
      content: "Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive. We use \"cookies\" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service."
    },
    {
      icon: Server,
      title: "Service Providers",
      content: "We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."
    },
    {
      icon: Lock,
      title: "Security",
      content: "The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security."
    },
    {
      icon: ExternalLink,
      title: "Links To Other Sites",
      content: "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services."
    },
    {
      icon: Users,
      title: "Children's Privacy",
      content: "Our Service does not address anyone under the age of 18 (\"Children\"). We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us. If we discover that a child under 18 has provided us with Personal Information, we will delete such information from our servers immediately."
    },
    {
      icon: RefreshCw,
      title: "Changes To This Privacy Policy",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
    }
  ];

  return (
    <>
      {/* Breadcrumb + Hero */}
      <section className="bg-[#FAF5EE] py-12 lg:py-16 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-[#6B3A2A]/60 mb-4">
              <Link href="/" className="hover:text-[#C8782A] transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-[#C8782A] font-medium">Privacy Policy</span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Legal
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Privacy Policy
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#6B3A2A]/70 text-base max-w-2xl leading-relaxed">
              Aboriginal Hire (“us”, “we”, or “our”) operates the Aboriginal Job Hire Canada website (the “Service”). 
              This page informs you of our policies regarding the collection, use and disclosure of Personal Information 
              when you use our Service.
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
              <span className="font-semibold text-[#C8782A]">Effective Date:</span> May 22, 2026
            </p>
          </motion.div>

          {/* Agreement Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-[#1C1C1C]/75 leading-relaxed mb-4">
              We will not use or share your information with anyone except as described in this Privacy Policy. 
              We use your Personal Information for providing and improving the Service. By using the Service, 
              you agree to the collection and use of information in accordance with this policy.
            </p>
            <p className="text-[#1C1C1C]/75 leading-relaxed">
              Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same 
              meanings as in our{" "}
              <Link href="/terms" className="text-[#C8782A] hover:underline font-medium">
                Terms and Conditions
              </Link>.
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
                transition={{ delay: index * 0.05 }}
                className="border-b border-[#C8782A]/10 pb-7 last:border-0"
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
                <p className="text-[#1C1C1C]/75 leading-relaxed pl-12">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Compliance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 pt-6 border-t border-[#C8782A]/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-[#C8782A]" />
              </div>
              <h2
                className="text-xl font-bold text-[#1C1C1C]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Compliance With Laws
              </h2>
            </div>
            <p className="text-[#1C1C1C]/75 leading-relaxed pl-12">
              We will disclose your Personal Information where required to do so by law or subpoena.
            </p>
          </motion.div>

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
                Contact Us
              </h2>
            </div>
            <p className="text-[#1C1C1C]/75 leading-relaxed pl-12 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="pl-12">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-[#C8782A] font-semibold hover:underline"
              >
                Contact Us <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}