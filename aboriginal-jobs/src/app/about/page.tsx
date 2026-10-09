"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Heart,
  Globe,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Handshake,
  BookOpen,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  visible: { transition: { staggerChildren: 0.11 } },
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

const values = [
  {
    icon: Heart,
    title: "Respect & Dignity",
    desc: "We honour the cultures, traditions, and sovereignty of all Indigenous Peoples across Canada in everything we do.",
  },
  {
    icon: Globe,
    title: "Canada-Wide Inclusion",
    desc: "From urban centres to remote northern communities, we connect talent and opportunity coast to coast to coast.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Aboriginal Jobs Canada is built around community — the job seekers, employers, and Indigenous organizations that make up our network.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "We operate with integrity, ensuring every interaction on our platform is honest, respectful, and purposeful.",
  },
];

const team = [
  {
    name: "Nikunj Desai",
    role: "Co-Founder & CEO",
    nation: "Cree Nation, Treaty 6",
    bio: "Nikunj brings 15 years of experience in Indigenous economic development and workforce strategy across Western Canada.",
    initials: "ND",
  },
  {
    name: "Sanket Kasvala",
    role: "Co-Founder & CTO",
    nation: "Métis Nation of Alberta",
    bio: "Sanket leads our technology vision, building platforms that centre Indigenous user experience and cultural safety.",
    initials: "SK",
  },
  // {
  //   name: 'Diane Okalik',
  //   role: 'Director of Community Relations',
  //   nation: 'Inuit Tapiriit Kanatami',
  //   bio: 'Diane ensures Aboriginal Jobs Canada remains grounded in community needs, maintaining relationships with nations and organizations across Canada.',
  //   initials: 'DO',
  // },
  // {
  //   name: 'Jordan Swifthawk',
  //   role: 'Head of Employer Partnerships',
  //   nation: 'Anishinaabe, Treaty 3',
  //   bio: 'Jordan works directly with employers to build meaningful Indigenous hiring strategies and long-term partnerships.',
  //   initials: 'JS',
  // },
];

const commitments = [
  {
    icon: Handshake,
    title: "Truth & Reconciliation Alignment",
    desc: "Our platform directly supports the TRC's Calls to Action on economic development and employment, providing a dedicated space for Indigenous economic participation.",
  },
  {
    icon: BookOpen,
    title: "Employer Education",
    desc: "We provide employers with resources, guides, and consultation to write culturally respectful job postings and build genuinely inclusive workplaces.",
  },
  {
    icon: TrendingUp,
    title: "Career Advancement Support",
    desc: "Beyond job listings, we offer resume guidance, interview preparation, and career development resources tailored for Indigenous professionals.",
  },
  {
    icon: MapPin,
    title: "Remote & Northern Access",
    desc: "We actively work to include opportunities in remote and northern communities, ensuring geography is never a barrier to meaningful employment.",
  },
];

const stats = [
  { value: "60+", label: "Nations & Communities Served" },
  { value: "500+", label: "Employers on Platform" },
  { value: "12,000+", label: "Job Seekers Registered" },
  { value: "10", label: "Provinces & Territories" },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-20 lg:py-28 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-[60vh]">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-4"
            >
              About Aboriginal Jobs Canada
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built with Purpose.{" "}
              <span className="text-[#C8782A]">Built for People.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/75 text-lg leading-relaxed mb-8"
            >
              Aboriginal Jobs Canada is Canada's dedicated job platform
              connecting First Nations, Métis, and Inuit job seekers with
              employers who are committed to inclusive, respectful hiring. We
              believe meaningful employment is a cornerstone of community
              wellbeing and reconciliation.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/jobs">
                <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-7">
                  Search Job
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="border-[#C8782A] text-[#C8782A] hover:bg-[#C8782A]/10 hover:text-black font-semibold px-7"
                >
                  Hire with Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#C8782A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <p
                  className="text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.value}
                </p>
                <p className="text-white/75 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <section className="bg-[#6B3A2A] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-4">
                Our Mission
              </p>
              <h2
                className="text-4xl font-bold text-[#FAF5EE] mb-5 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Connecting Indigenous Talent Across Canada
              </h2>
              <p className="text-[#FAF5EE]/70 leading-relaxed mb-5">
                Aboriginal Jobs Canada was created to address a clear need: a
                dedicated, respectful space where Indigenous job seekers can
                find meaningful employment and where employers can connect with
                talented Indigenous professionals.
              </p>
              <p className="text-[#FAF5EE]/70 leading-relaxed">
                We are committed to supporting the Truth and Reconciliation
                Commission's Calls to Action related to economic development and
                employment. Every feature of our platform is designed with
                cultural sensitivity and genuine respect for the diversity of
                Indigenous Peoples across Turtle Island.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/8 border border-white/10 rounded-3xl p-10">
                <h3
                  className="text-2xl font-bold text-[#FAF5EE] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Our Commitment
                </h3>
                <ul className="flex flex-col gap-4">
                  {[
                    "Respectful representation of all Indigenous Peoples — First Nations, Métis, and Inuit",
                    "A safe, welcoming platform free from discrimination",
                    "Ongoing consultation with Indigenous communities",
                    "Support for Indigenous-owned businesses and organizations",
                    "Continuous improvement guided by community feedback",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[#FAF5EE]/75 text-sm leading-relaxed"
                    >
                      <CheckCircle
                        size={15}
                        className="text-[#C8782A] flex-shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-[60vh]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Our Values
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What Guides Us
            </motion.h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-[#FAF5EE] rounded-2xl p-7 border border-[#C8782A]/10 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#C8782A]/10 flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-[#C8782A]" />
                </div>
                <h3
                  className="font-bold text-[#1C1C1C] text-lg mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Our Team
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-[#1C1C1C] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The People Behind Aboriginal Jobs Canada
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 max-w-2xl mx-auto leading-relaxed"
            >
              Our team is Indigenous-led and community-driven. We bring lived
              experience, professional expertise, and deep commitment to every
              aspect of the platform.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-7 border border-[#C8782A]/10 hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#C8782A] flex items-center justify-center mb-5 flex-shrink-0">
                  <span
                    className="text-white font-bold text-xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {member.initials}
                  </span>
                </div>
                <h3
                  className="font-bold text-[#1C1C1C] text-lg mb-0.5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {member.name}
                </h3>
                <p className="text-[#C8782A] text-sm font-semibold mb-1">
                  {member.role}
                </p>
                <p className="text-[#6B3A2A]/50 text-xs mb-4 italic">
                  {member.nation}
                </p>
                <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INDIGENOUS HIRING COMMITMENT ─────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Indigenous Hiring
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-[#1C1C1C] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Commitment to Meaningful Employment
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 max-w-2xl mx-auto leading-relaxed"
            >
              We go beyond job listings. Aboriginal Jobs Canada actively works
              to remove barriers, educate employers, and create pathways to
              lasting, dignified employment for Indigenous Peoples.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {commitments.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="flex gap-5 bg-[#FAF5EE] rounded-2xl p-7 border border-[#C8782A]/10 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
                  <c.icon size={22} className="text-[#C8782A]" />
                </div>
                <div>
                  <h3
                    className="font-bold text-[#1C1C1C] text-lg mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LAND ACKNOWLEDGEMENT ─────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              className="w-16 h-16 rounded-full bg-[#C8782A]/15 flex items-center justify-center mx-auto mb-6"
            >
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                aria-hidden="true"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  stroke="#C8782A"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="10"
                  stroke="#C8782A"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="18" cy="18" r="4" fill="#C8782A" />
                <path
                  d="M18 2 Q26 10 18 18 Q10 10 18 2Z"
                  fill="#C8782A"
                  opacity="0.25"
                />
              </svg>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-4"
            >
              Land Acknowledgement
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold text-[#1C1C1C] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Honouring the Land
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/75 leading-relaxed text-lg"
            >
              Aboriginal Jobs Canada respectfully acknowledges the Indigenous
              Peoples of Canada on whose traditional, ancestral, and unceded
              territories we work and live. We recognize the enduring presence
              of First Nations, Métis, and Inuit Peoples across Turtle Island
              and are committed to walking the path of reconciliation with
              humility, respect, and purpose.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#C8782A] py-16 relative overflow-hidden">
        <OrganicShape className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 text-white pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Join the Aboriginal Jobs Community
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 mb-8 text-lg">
              Whether you're looking for work or looking to hire — Aboriginal
              Jobs is here for you.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/jobs">
                <Button
                  size="lg"
                  className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-10"
                >
                  Search Jobs
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#C8782A] font-semibold px-10"
                >
                  Contact Us <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
