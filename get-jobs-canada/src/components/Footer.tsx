import Link from "next/link";
import {
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  Globe,
  Building2,
  Briefcase,
  Search,
  Plus,
} from "lucide-react";

const footerLinks = {
  jobSeekers: [
    { label: "Search Jobs", href: "/jobs" },
    { label: "Browse Categories", href: "/jobs" },
    { label: "Remote Jobs", href: "/jobs?type=remote" },
    { label: "Pricing & Plans", href: "/pricing" },
  ],
  employers: [
    { label: "Post a Job", href: "/post-a-job" },
    { label: "Pricing & Packages", href: "/pricing" },
    { label: "Employer Dashboard", href: "/employers/dashboard" },
    { label: "For Employers", href: "/employers" },
  ],
  locations: [
    { label: "Jobs in Toronto", href: "/jobs?search=Toronto" },
    { label: "Jobs in Vancouver", href: "/jobs?search=Vancouver" },
    { label: "Jobs in Montreal", href: "/jobs?search=Montreal" },
    { label: "Jobs in Calgary", href: "/jobs?search=Calgary" },
  ],
  company: [
    { label: "About GetJobsCanada", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-300 font-sans border-t border-slate-800/80 overflow-hidden">
      {/* Background Subtle Gradient Highlights */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#059669]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-emerald-600/5 blur-[120px] pointer-events-none" />

      {/* Top Action CTA Banner (Replaces email subscription form) */}
      <div className="border-b border-slate-800/70 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-sm shadow-xl">
            <div className="max-w-2xl text-center lg:text-left">
              {/* Dual-Pill Badge */}
              <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-slate-950 border border-slate-800/80 shadow-xs mb-3">
                <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                  PORTAL
                </span>
                <span className="text-xs font-semibold text-slate-300 leading-none">
                  Canada Wide Career Network
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Ready to take your next step or hire top Canadian talent?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                Connect directly with 100% verified Canadian employers or discover high-paying jobs across all provinces.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/jobs"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition-all duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <Search size={15} />
                <span>Explore All Jobs</span>
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/post-a-job"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <Plus size={15} className="text-[#059669]" />
                <span>Post a Job</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Info Column (Spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 group mb-4"
              >
                <img
                  src="/logo.svg"
                  alt="GetJobsCanada Logo"
                  className="w-8 h-8 rounded-xl shadow-xs"
                />
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  GetJobs
                  <span className="text-[#059669] font-black">Canada</span>
                </span>
              </Link>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Canada&apos;s leading modern career platform connecting top
                talent with inclusive employers from coast to coast.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <ShieldCheck size={14} className="text-[#059669]" />
                  <span>100% Verified Employers</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Globe size={14} className="text-[#059669]" />
                  <span>Canada Wide</span>
                </div>
              </div>
            </div>

            {/* Contact Email */}
            <div className="pt-4 border-t border-slate-800/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Need Support?
              </span>
              <a
                href="mailto:inquiries@getjobscanada.ca"
                className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-2"
              >
                <Mail size={15} />
                <span>inquiries@getjobscanada.ca</span>
              </a>
            </div>
          </div>

          {/* Column 1: For Job Seekers */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <Briefcase size={16} className="text-[#059669]" />
              <span>Job Seekers</span>
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <Building2 size={16} className="text-[#059669]" />
              <span>Employers</span>
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.employers.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Locations (Top Hubs) - Commented Out */}
          {/* <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <MapPin size={16} className="text-[#059669]" />
              <span>Top Hubs</span>
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.locations.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Column 4: Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nationwide Platform Feature Card */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#059669] flex items-center justify-center flex-shrink-0 font-bold text-lg">
                🇨🇦
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Canada&apos;s Premier Job & Career Network
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connecting job seekers and top employers across Ontario,
                  British Columbia, Alberta, Quebec, and all provinces
                  nationwide.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl whitespace-nowrap">
              <span> 100% Free for Job Seekers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-slate-900 bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400 font-semibold">GetJobsCanada</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-800">|</span>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
