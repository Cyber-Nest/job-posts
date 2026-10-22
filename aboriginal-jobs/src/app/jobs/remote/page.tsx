import { Metadata } from "next";
import Link from "next/link";
import { Wifi, MapPin, ChevronRight, Briefcase, Building2, Leaf, ArrowRight, CheckCircle } from "lucide-react";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { fetchServerActiveJobs } from "@/lib/server-jobs";

export const metadata: Metadata = {
  title: "Remote Indigenous & Aboriginal Jobs Across Canada — Work from Home",
  description:
    "Find remote and work-from-home job opportunities for First Nations, Métis, and Inuit professionals across Canada. Work from your home community in tech, admin, health, and education.",
  alternates: {
    canonical: "/jobs/remote",
  },
  openGraph: {
    title: "Remote Indigenous Jobs Across Canada | Aboriginal Jobs Canada",
    description:
      "Work from your home community. Explore verified remote jobs for Indigenous talent across Canada.",
    url: "https://aboriginal-jobs.ca/jobs/remote",
    type: "website",
  },
  keywords: [
    "Indigenous remote jobs Canada",
    "Aboriginal work from home",
    "First Nations remote careers",
    "Métis remote employment",
    "Inuit remote work",
    "Remote band jobs Canada",
    "Work from community Canada",
  ],
};

export default async function RemoteJobsPage() {
  const allJobs = await fetchServerActiveJobs(200);
  const remoteJobs = allJobs.filter((j) => Boolean(j.remote));

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Jobs", url: "/jobs" },
    { name: "Remote", url: "/jobs/remote" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#1C1C1C] to-[#1E2638] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#1a64c4]/30">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
            <ChevronRight size={12} />
            <span className="text-[#64A3E8] font-medium">Remote Jobs</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a64c4]/20 border border-[#1a64c4]/40 text-[#64A3E8] text-xs font-semibold mb-4">
            <Wifi size={13} />
            <span>Telecommute & Hybrid • Canada-Wide</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Remote Indigenous Jobs in Canada
          </h1>

          <p className="text-white/80 text-base sm:text-lg max-w-3xl leading-relaxed mb-6">
            Stay connected to your home nation, family, and community while advancing your professional career. Browse verified remote and hybrid positions from employers committed to inclusive Indigenous employment across Canada.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/70">
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <strong>{remoteJobs.length}</strong> Remote Roles Available
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Open to All Canadian Provinces & Territories
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C8782A]/15">
              <h2 className="text-xl font-bold text-[#1C1C1C]">
                Active Remote Opportunities
              </h2>
              <span className="text-xs text-[#6B3A2A]/70 font-medium">
                {remoteJobs.length} positions
              </span>
            </div>

            {remoteJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#C8782A]/15">
                <Wifi size={40} className="mx-auto text-[#1a64c4]/50 mb-3" />
                <h3 className="text-lg font-bold text-[#1C1C1C] mb-1">
                  New Remote Opportunities Coming Soon
                </h3>
                <p className="text-sm text-[#6B3A2A]/70 max-w-md mx-auto mb-6">
                  Check all active opportunities or sign up to receive alerts when new remote roles are posted.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8782A] text-white font-medium text-sm hover:bg-[#B06820] transition-colors"
                >
                  View All Jobs <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {remoteJobs.map((job) => (
                  <Link
                    key={job._id}
                    href={`/jobs/${job._id}`}
                    className="block bg-white rounded-2xl p-5 border border-[#C8782A]/15 hover:border-[#1a64c4]/50 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a64c4] bg-[#1a64c4]/10 px-2.5 py-0.5 rounded-full">
                            <Wifi size={10} /> 100% Remote / Hybrid
                          </span>
                          <span className="text-xs font-semibold text-[#C8782A] bg-[#FAF5EE] px-2.5 py-0.5 rounded-full border border-[#C8782A]/15">
                            {job.category || "General"}
                          </span>
                          {job.indigenousOwned && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4a7a4e] bg-[#7A9E7E]/10 px-2 py-0.5 rounded-full">
                              <Leaf size={10} /> Indigenous-owned
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#1C1C1C] group-hover:text-[#1a64c4] transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-sm font-medium text-[#6B3A2A]/80">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B3A2A]/60 pt-1">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-[#C8782A]" />
                            Anywhere in Canada ({job.province || "Remote"})
                          </span>
                          {job.salary && (
                            <span className="font-semibold text-[#1C1C1C]">
                              {job.salary}
                            </span>
                          )}
                          <span>•</span>
                          <span>{job.employmentType}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 self-center">
                        <div className="w-9 h-9 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#1a64c4] group-hover:bg-[#1a64c4] group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#C8782A]/15">
              <Building2 className="text-[#C8782A] mb-3" size={28} />
              <h3 className="text-base font-bold text-[#1C1C1C] mb-2">
                Hiring Remote Indigenous Talent?
              </h3>
              <p className="text-xs text-[#6B3A2A]/80 leading-relaxed mb-4">
                Reach Indigenous professionals across all 13 Canadian provinces and territories without geographical limitations.
              </p>
              <Link
                href="/post-a-job"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#C8782A] text-white text-xs font-semibold hover:bg-[#B06820] transition-colors"
              >
                Post a Remote Opportunity
              </Link>
            </div>

            <div className="bg-[#7A9E7E]/10 rounded-2xl p-5 border border-[#7A9E7E]/20 text-xs text-[#2A442E] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <CheckCircle size={16} className="text-[#4a7a4e]" />
                Community Retention
              </div>
              <p className="leading-relaxed text-[#2A442E]/80">
                Remote positions allow Indigenous youth and skilled professionals to build meaningful careers while remaining grounded in their home territories and cultural traditions.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
