"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { Building2, Users, Star, BarChart3, CheckCircle, ArrowRight, Briefcase, Globe, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function OrganicShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

const features = [
  { icon: Briefcase, title: 'Post Job Listings', desc: 'Reach thousands of qualified Indigenous job seekers across Canada with targeted, effective job postings.' },
  { icon: Users, title: 'Manage Applicants', desc: 'Review, organize, and communicate with applicants through your dedicated employer dashboard.' },
  { icon: Star, title: 'Featured Listings', desc: 'Boost your visibility with featured placements that appear at the top of search results.' },
  { icon: Building2, title: 'Company Profile', desc: 'Showcase your organization\'s commitment to Indigenous hiring with a dedicated company profile page.' },
  { icon: HeartHandshake, title: 'Hiring Support', desc: 'Access resources, guidance, and best practices for respectful and effective Indigenous recruitment.' },
  { icon: BarChart3, title: 'Performance Insights', desc: 'Track your listing views, applications received, and hiring outcomes with clear reporting tools.' },
];

export default function EmployersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#6B3A2A] py-20 lg:py-28 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[480px] h-[480px] text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-[60vh]">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-6">
              <Building2 size={14} className="text-[#C8782A]" />
              <span className="text-[#FAF5EE] text-xs font-semibold uppercase tracking-wider">For Employers</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold text-[#FAF5EE] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hire Indigenous Talent <span className="text-[#C8782A]">Across Canada</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#FAF5EE]/75 text-lg leading-relaxed mb-8">
              Aboriginal Jobs Canada connects your organization with skilled First Nations, Métis, and Inuit professionals. Build a workforce that reflects the richness and diversity of Canada.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link href="/post-a-job">
                <Button size="lg" className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8">
                  Post a Job <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#6B3A2A] font-semibold px-8">
                  View Packages
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">Employer Tools</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything You Need to Hire Well
            </motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-7 border border-[#C8782A]/10 transition-shadow duration-200 hover:shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-[#C8782A]/10 flex items-center justify-center mb-5">
                  <f.icon size={20} className="text-[#C8782A]" />
                </div>
                <h3 className="font-bold text-[#1C1C1C] text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{f.title}</h3>
                <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Indigenous Hiring */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">Indigenous Hiring Support</p>
              <h2 className="text-4xl font-bold text-[#1C1C1C] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                Committed to Reconciliation Through Employment
              </h2>
              <p className="text-[#6B3A2A]/75 leading-relaxed mb-6">
                Hiring Indigenous talent is not just good business — it's a meaningful step toward reconciliation. Aboriginal Jobs Canada supports your organization with the tools, resources, and connections to make inclusive hiring a reality.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Access to a dedicated pool of Indigenous job seekers',
                  'Guidance on respectful and inclusive job postings',
                  'Resources for Indigenous workplace inclusion',
                  'Support for Truth and Reconciliation commitments',
                  'Connection to Indigenous communities and organizations',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#1C1C1C]/75">
                    <CheckCircle size={16} className="text-[#7A9E7E] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold">
                  Contact Aboriginal Jobs Canada <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-[#6B3A2A] rounded-3xl p-10 text-[#FAF5EE] relative overflow-hidden">
                <OrganicShape className="absolute -right-16 -bottom-16 w-64 h-64 text-[#C8782A] pointer-events-none" />
                <div className="relative z-10">
                  <Globe size={32} className="text-[#C8782A] mb-5" />
                  <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Canada-Wide Reach</h3>
                  <p className="text-[#FAF5EE]/70 leading-relaxed mb-6">Your job postings reach Indigenous job seekers in every province and territory — from major urban centres to remote and northern communities.</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ v: '15,000+', l: 'Active Job Seekers' }, { v: '850+', l: 'Employers' }, { v: '13', l: 'Provinces & Territories' }, { v: '2,400+', l: 'Jobs Posted' }].map((s) => (
                      <div key={s.l}>
                        <p className="text-2xl font-bold text-[#C8782A]" style={{ fontFamily: "'Playfair Display', serif" }}>{s.v}</p>
                        <p className="text-[#FAF5EE]/60 text-xs mt-0.5">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8782A] py-16 relative overflow-hidden">
        <OrganicShape className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 text-white pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to Find Your Next Great Hire?</motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 mb-8 text-lg">Post your first job today and connect with Indigenous talent across Canada.</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/post-a-job"><Button size="lg" className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-10">Post a Job</Button></Link>
              <Link href="/pricing"><Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#C8782A] font-semibold px-10">View Packages</Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
