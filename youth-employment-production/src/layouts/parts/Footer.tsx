import { Link } from '@/router';

const footerLinks = {
  jobs: [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Employer Login', href: '/login' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
  employers: [
    { label: 'Post a Job', href: '/post-a-job' },
    { label: 'Pricing & Packages', href: '/pricing' },
    { label: 'Employer Dashboard', href: '/login' },
    { label: 'Youth Hiring Support', href: '/employers' },
    { label: 'Company Profile', href: '/employers' },
  ],
  company: [
    { label: 'About Youth Employment Canada', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-[#FFFFFF]">
      {/* Acknowledgement Banner */}
      <div className="bg-[#15306a] px-4 py-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-white/80 leading-relaxed">
            Youth Employment Canada is committed to supporting young Canadians and employers building an inclusive, equitable future of work across Canada.
            We believe meaningful employment is a foundation for growth and opportunity for all.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4 group">
              <span className="flex flex-col leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="font-bold text-2xl tracking-tight text-white group-hover:text-[#2563EB] transition-colors duration-200 leading-none">Youth Employment</span>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#2563EB] uppercase mt-0.5">Canada</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-xs">
              Connecting Young Talent Across Canada. Canada's job platform for young Canadians and inclusive employers building the workforce of tomorrow.
            </p>
            <p className="text-[#2563EB] text-sm font-semibold">
              Opportunity for Youth. Growth for Canada.
            </p>
          </div>

          {/* Job Board */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Job Board
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.jobs.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    to={link.href}
                    className="text-white/65 hover:text-[#2563EB] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              For Employers
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.employers.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    to={link.href}
                    className="text-white/65 hover:text-[#2563EB] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    to={link.href}
                    className="text-white/65 hover:text-[#2563EB] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                Contact
              </h4>
              <a
                href="mailto:info.youthemployment@cyber-nest.ca"
                className="text-white/65 hover:text-[#2563EB] text-sm transition-colors duration-200 block mb-1"
              >
                info.youthemployment@cyber-nest.ca
              </a>
              <p className="text-white/65 text-sm">Canada-Wide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            © 2026 Youth Employment Canada. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-white/50 hover:text-[#2563EB] text-xs transition-colors duration-200">
              Privacy Policy
            </Link>
            <span className="text-[#FAF5EE]/20">|</span>
            <Link to="/terms-of-use" className="text-white/50 hover:text-[#2563EB] text-xs transition-colors duration-200">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
