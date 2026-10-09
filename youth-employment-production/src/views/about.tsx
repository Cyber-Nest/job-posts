import { Helmet } from "@dr.pogodin/react-helmet";
import { Link } from "@/router";
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
    title: "Respect & Opportunity",
    desc: "We support young people across Canada by promoting respectful, inclusive, and meaningful employment opportunities.",
  },
  {
    icon: Globe,
    title: "Canada-Wide Access",
    desc: "From major cities to small communities, we help connect youth with jobs and employers from coast to coast.",
  },
  {
    icon: Users,
    title: "Youth First",
    desc: "Youth Employment Canada is built to support young job seekers and the employers who want to hire and develop young talent.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "We operate with integrity, ensuring job listings, employer information, and platform interactions remain clear and reliable.",
  },
];

const team = [
  {
    name: "Nikunj Desai",
    role: "Co-Founder & CEO",
    nation: "Youth Employment Canada",
    bio: "Nikunj leads the company’s vision, strategy, and growth, with a focus on building strong employer partnerships and expanding opportunities for youth across Canada.",
    initials: "ND",
  },
  {
    name: "Sanket Kasvala",
    role: "Co-Founder & CTO",
    nation: "Youth Employment Canada",
    bio: "Sanket leads the platform’s technology and product development, ensuring a reliable, user-friendly experience for both employers and youth job seekers.",
    initials: "SK",
  },
];

const commitments = [
  {
    icon: Handshake,
    title: "Youth Employment Support",
    desc: "Our platform supports youth employment across Canada by helping connect young people with meaningful job opportunities and helping employers reach emerging talent.",
  },
  {
    icon: BookOpen,
    title: "Employer Education",
    desc: "We provide employers with resources, guides, and consultation to create youth-friendly job postings and build inclusive, supportive workplaces for young talent.",
  },
  {
    icon: TrendingUp,
    title: "Career Advancement Support",
    desc: "Beyond job listings, we support youth with access to career development opportunities, practical guidance, and pathways that help them grow professionally.",
  },
  {
    icon: MapPin,
    title: "Remote & Northern Access",
    desc: "We work to include opportunities in remote and northern communities, helping ensure geography is never a barrier to youth employment.",
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
      <Helmet>
        <title>
          About Youth Employment Canada — Canada's Youth Employment Network
        </title>
        <meta
          name="description"
          content="Learn about Youth Employment Canada — our mission, team, values, and commitment to connecting young Canadians with inclusive employers across Canada."
        />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-20 lg:py-28 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] text-[#2563EB] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-4"
            >
              About Youth Employment Canada
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built with Purpose.{" "}
              <span className="text-[#2563EB]">Built for People.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#475569]/75 text-lg leading-relaxed mb-8"
            >
              Youth Employment Canada is Canada's dedicated job platform
              connecting young Canadians with employers across the country. We
              believe meaningful employment builds confidence, skills, and
              economic opportunity for young people starting their careers.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/jobs">
                <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold px-7">
                  Find Jobs
                </Button>
              </Link>
              <Link to="/employers">
                <Button
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 font-semibold px-7"
                >
                  Hire with Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#2563EB] py-10">
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
      <section className="bg-[#0F172A] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 text-[#2563EB] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-4">
                Our Mission
              </p>
              <h2
                className="text-4xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Connecting Young Talent Across Canada
              </h2>
              <p className="text-white/70 leading-relaxed mb-5">
                Youth Employment Canada was created to address a clear need: a
                dedicated space where young Canadians can find meaningful
                employment and where employers can connect with motivated
                early-career talent.
              </p>
              <p className="text-white/70 leading-relaxed">
                We are committed to supporting inclusive employment pathways and
                building features that help young people access opportunities
                across Canada. Our platform is designed to support diverse
                experiences and regional needs for youth employment.
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
                    "Meaningful support for youth across Canada from diverse backgrounds",
                    "A safe, welcoming platform free from discrimination",
                    "Ongoing listening to youth needs, employers, and communities",
                    "Support for youth-friendly employers and organizations",
                    "Continuous improvement guided by user feedback",
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
              className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-3"
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
                className="bg-[#F8FAFC] rounded-2xl p-7 border border-[#2563EB]/10 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-[#2563EB]" />
                </div>
                <h3
                  className="font-bold text-[#1C1C1C] text-lg mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-[#475569]/70 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="bg-blue-50 py-16 lg:py-24">
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
              className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Our Team
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The People Behind Youth Employment Canada
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Our team is focused on helping youth access better employment
              opportunities across Canada while supporting employers in finding
              and developing young talent.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-[700px] grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-7 border border-blue-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-5 flex-shrink-0 shadow-md">
                  <span
                    className="text-white font-bold text-xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {member.initials}
                  </span>
                </div>
                <h3
                  className="font-bold text-gray-900 text-lg mb-0.5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {member.name}
                </h3>
                <p className="text-blue-600 text-sm font-semibold mb-1">
                  {member.role}
                </p>
                <p className="text-gray-400 text-xs mb-4 italic">
                  {member.nation}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
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
              className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Youth Employment
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold text-[#0F172A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Commitment to Meaningful Employment
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#475569]/70 max-w-2xl mx-auto leading-relaxed"
            >
              We go beyond job listings. Youth Employment Canada actively works
              to remove barriers, educate employers, and create pathways to
              lasting, dignified employment for youth across Canada.
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
                className="flex gap-5 bg-[#F8FAFC] rounded-2xl p-7 border border-[#2563EB]/10 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                  <c.icon size={22} className="text-[#2563EB]" />
                </div>
                <div>
                  <h3
                    className="font-bold text-[#0F172A] text-lg mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-[#475569]/70 text-sm leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LAND ACKNOWLEDGEMENT ─────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              className="w-16 h-16 rounded-full bg-[#2563EB]/15 flex items-center justify-center mx-auto mb-6"
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
                  stroke="#2563EB"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="10"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="18" cy="18" r="4" fill="#2563EB" />
                <path
                  d="M18 2 Q26 10 18 18 Q10 10 18 2Z"
                  fill="#2563EB"
                  opacity="0.25"
                />
              </svg>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-[#2563EB] font-semibold text-sm uppercase tracking-widest mb-4"
            >
              Land Acknowledgement
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold text-[#0F172A] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Honouring the Land
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#475569]/75 leading-relaxed text-lg"
            >
              Youth Employment Canada is committed to supporting young people
              across Canada by helping them access meaningful employment
              opportunities, career growth, and strong employer connections. We
              work to create a respectful, inclusive, and supportive platform
              that helps youth build a brighter future with confidence and
              purpose.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#2563EB] py-16 relative overflow-hidden">
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
              Join the Youth Employment Canada Community
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 mb-8 text-lg">
              Whether you're looking for work or looking to hire — Youth
              Employment Canada is here for you.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-[#2563EB] hover:bg-[#F8FAFC] font-semibold px-10"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#2563EB] font-semibold px-10"
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
