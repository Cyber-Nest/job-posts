import Link from "next/link";

const footerLinks = {
  jobSeekers: [
    { label: "Search Jobs", href: "/jobs" },
    // { label: "Create Profile", href: "/register" },
    // { label: "Upload Resume", href: "/register" },
    // { label: "Job Alerts", href: "/register" },
    // { label: "Apply Online", href: "/job-seekers" },
  ],
  employers: [
    { label: "Post a Job", href: "/post-a-job" },
    { label: "Pricing & Packages", href: "/pricing" },
    { label: "Employer Dashboard", href: "/employers/dashboard" },
    // { label: "Indigenous Hiring Support", href: "/employers" },
    // { label: "Company Profile", href: "/employers" },
  ],
  company: [
    { label: "About Aboriginal Jobs Canada", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#6B3A2A] text-[#FAF5EE]">
      {/* Acknowledgement Banner */}
      <div className="bg-[#5A2F1F] px-4 py-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#FAF5EE]/80 leading-relaxed">
            Aboriginal Jobs Canada respectfully acknowledges the Indigenous
            Peoples of Canada on whose traditional territories we work and live.
            We are committed to reconciliation and to building meaningful,
            lasting relationships with Indigenous communities across Turtle
            Island.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4 group">
              <span
                className="flex flex-col leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className="font-bold text-2xl tracking-tight text-[#FAF5EE] group-hover:text-[#C8782A] transition-colors duration-200 leading-none">
                  Aboriginal Jobs
                </span>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C8782A] uppercase mt-0.5">
                  Canada
                </span>
              </span>
            </Link>
            <p className="text-[#FAF5EE]/70 text-sm leading-relaxed mb-5 max-w-xs">
              Connecting Indigenous Talent Across Canada. Canada&apos;s
              dedicated job platform for First Nations, Métis, and Inuit job
              seekers and inclusive employers.
            </p>
            <p className="text-[#C8782A] text-sm font-semibold">
              Connecting Indigenous Talent Across Canada
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold text-[#FAF5EE] mb-4 text-sm uppercase tracking-wider">
              For Job Seekers
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[#FAF5EE]/65 hover:text-[#C8782A] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-[#FAF5EE] mb-4 text-sm uppercase tracking-wider">
              For Employers
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.employers.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[#FAF5EE]/65 hover:text-[#C8782A] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-[#FAF5EE] mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[#FAF5EE]/65 hover:text-[#C8782A] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-[#FAF5EE] mb-3 text-sm uppercase tracking-wider">
                Contact
              </h4>
              <a
                href="mailto:info.aboriginal@cyber-nest.ca"
                className="text-[#FAF5EE]/65 hover:text-[#C8782A] text-sm transition-colors duration-200 block mb-1"
              >
                info.aboriginal@cyber-nest.ca
              </a>
              <p className="text-[#FAF5EE]/65 text-sm">Canada-Wide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#FAF5EE]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#FAF5EE]/50 text-xs">
            © 2026 Aboriginal Jobs Canada. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-[#FAF5EE]/50 hover:text-[#C8782A] text-xs transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-[#FAF5EE]/20">|</span>
            <Link
              href="/terms"
              className="text-[#FAF5EE]/50 hover:text-[#C8782A] text-xs transition-colors duration-200"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
