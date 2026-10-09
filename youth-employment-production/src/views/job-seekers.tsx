import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from '@/router';
import { motion } from 'motion/react';
import { Search, User, FileText, Bell, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  { icon: Search, title: 'Search Jobs', desc: 'Browse thousands of opportunities from inclusive employers across every province and territory in Canada.' },
  { icon: User, title: 'Apply directly', desc: 'Use employer-provided email, phone, mail, or in-person instructions to apply for jobs outside this website.' },
  { icon: FileText, title: 'Review employer instructions', desc: 'Follow the application details provided with each job posting to connect with the right hiring contact.' },
  { icon: Bell, title: 'Stay informed', desc: 'Check back regularly for newly posted roles and the latest employer opportunities.' },
];

const sampleJobs = [
  { title: 'Project Manager', company: 'Infrastructure Canada', location: 'Ottawa, ON', type: 'Full-time' },
  { title: 'Community Health Worker', company: 'First Nations Health Authority', location: 'Winnipeg, MB', type: 'Full-time' },
  { title: 'Environmental Technician', company: 'NWT Environment Dept.', location: 'Yellowknife, NT', type: 'Contract' },
  { title: 'IT Support Specialist', company: "Tsuut'ina Nation", location: 'Calgary, AB', type: 'Full-time' },
  { title: 'Social Services Coordinator', company: 'Urban Native Youth Assoc.', location: 'Vancouver, BC', type: 'Part-time' },
  { title: 'Administrative Assistant', company: 'Métis Nation of Ontario', location: 'Toronto, ON', type: 'Full-time' },
];

export default function JobSeekersPage() {
  return (
    <>
      <Helmet>
        <title>For Job Seekers — Youth Employment Canada</title>
        <meta name="description" content="Find meaningful employment with inclusive employers across Canada. Browse jobs and apply using the contact methods listed on each employer's posting." />
      </Helmet>

      {/* Hero */}
      <section className="bg-[#C8782A] py-20 lg:py-28 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[480px] h-[480px] text-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
              <Search size={14} className="text-white" />
              <span className="text-white text-xs font-semibold uppercase tracking-wider">For Job Seekers</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Find Work That <span className="text-[#FAF5EE]">Respects You</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/80 text-lg leading-relaxed mb-8">
              Discover opportunities with employers who value Indigenous talent and are committed to inclusive, respectful workplaces across Canada.
            </motion.p>
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mb-6">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-[#C8782A] flex-shrink-0" />
                <Input placeholder="Job title or keyword" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
              </div>
              <div className="w-px bg-[#C8782A]/10 hidden sm:block" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-[#C8782A] flex-shrink-0" />
                <Input placeholder="City or province" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
              </div>
              <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-6 rounded-xl shrink-0">Search</Button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link to="/jobs"><Button size="lg" className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-8">Browse Jobs <ArrowRight size={16} className="ml-2" /></Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">Your Tools</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything You Need to Succeed
            </motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-7 border border-[#C8782A]/10 hover:shadow-lg transition-shadow duration-200">
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

      {/* Job Listings */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>Current Opportunities</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleJobs.map((job) => (
              <motion.div key={job.title} variants={fadeUp} whileHover={{ y: -4 }} className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8782A]/10 flex items-center justify-center">
                    <Briefcase size={18} className="text-[#C8782A]" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#7A9E7E]/20 text-[#4A7A4E]">{job.type}</span>
                </div>
                <h3 className="font-bold text-[#1C1C1C] text-lg mb-1">{job.title}</h3>
                <p className="text-[#6B3A2A] text-sm font-medium mb-2">{job.company}</p>
                <div className="flex items-center gap-1.5 text-[#1C1C1C]/50 text-sm mb-5">
                  <MapPin size={13} /><span>{job.location}</span>
                </div>
                <Link to="/jobs" className="inline-flex items-center gap-1.5 text-[#C8782A] text-sm font-semibold hover:gap-2.5 transition-all duration-200">
                  Browse Jobs <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>Get Started in 3 Simple Steps</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-6">
            {[
              { step: '01', title: 'Search jobs', desc: 'Browse current job opportunities across Canada and review the application instructions provided by each employer.' },
              { step: '02', title: 'Apply directly', desc: 'Apply outside our website using the email, phone, mail, or in-person method provided by the employer.' },
              { step: '03', title: 'Connect with employers', desc: 'Contact employers directly using the application method listed on each job posting.' },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="flex gap-6 bg-white rounded-2xl p-7 border border-[#C8782A]/10">
                <div className="w-12 h-12 rounded-full bg-[#C8782A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-[#1C1C1C] text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                  <p className="text-[#6B3A2A]/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-10">
            <Link to="/jobs"><Button size="lg" className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-10">Browse Jobs <ArrowRight size={16} className="ml-2" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
