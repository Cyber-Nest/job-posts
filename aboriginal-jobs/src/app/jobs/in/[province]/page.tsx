import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, ChevronRight, Building2, Wifi, Leaf, CheckCircle, ArrowRight } from "lucide-react";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { fetchServerActiveJobs } from "@/lib/server-jobs";
import { getJobUrl } from "@/lib/slug";

interface ProvinceConfig {
  name: string;
  slug: string;
  capital: string;
  majorCities: string[];
  description: string;
  tribalRegions: string;
}

const PROVINCE_DATA: Record<string, ProvinceConfig> = {
  "british-columbia": {
    name: "British Columbia",
    slug: "british-columbia",
    capital: "Victoria",
    majorCities: ["Vancouver", "Victoria", "Surrey", "Prince George", "Kamloops", "Kelowna", "Nanaimo"],
    description:
      "British Columbia is home to over 200 distinct First Nations and vibrant Métis communities. Major employment sectors include healthcare, natural resource management, education, indigenous tourism, and public administration.",
    tribalRegions: "Coast Salish, Nuu-chah-nulth, Kwakwaka'wakw, Haida, Gitxsan, Carrier, and Secwepemc territories.",
  },
  "ontario": {
    name: "Ontario",
    slug: "ontario",
    capital: "Toronto",
    majorCities: ["Toronto", "Ottawa", "Thunder Bay", "Sudbury", "Hamilton", "London", "Kenora"],
    description:
      "Ontario boasts significant Indigenous populations across urban centres, northern fly-in communities, and First Nations territories. High-demand career fields include healthcare, social services, skilled trades, and policy advocacy.",
    tribalRegions: "Anishinaabe, Haudenosaunee, Mushkegowuk (Cree), and Métis community lands.",
  },
  "alberta": {
    name: "Alberta",
    slug: "alberta",
    capital: "Edmonton",
    majorCities: ["Edmonton", "Calgary", "Red Deer", "Fort McMurray", "Lethbridge", "Grande Prairie"],
    description:
      "Alberta encompasses Treaty 6, Treaty 7, and Treaty 8 territories, as well as 8 Métis Settlements. Key opportunities span energy stewardship, healthcare, community development, trades, and education.",
    tribalRegions: "Treaty 6, 7, and 8 First Nations and the Métis Nation of Alberta.",
  },
  "saskatchewan": {
    name: "Saskatchewan",
    slug: "saskatchewan",
    capital: "Regina",
    majorCities: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "North Battleford", "La Ronge"],
    description:
      "Saskatchewan is home to rich Cree, Saulteaux, Dakota, Lakota, Nakota, and Métis traditions with expanding Indigenous-owned economic development corporations, healthcare organizations, and government services.",
    tribalRegions: "Treaty 4, 6, 8, and 10 territories and Métis Nation—Saskatchewan regions.",
  },
  "manitoba": {
    name: "Manitoba",
    slug: "manitoba",
    capital: "Winnipeg",
    majorCities: ["Winnipeg", "Brandon", "Thompson", "Steinbach", "Portage la Prairie", "The Pas"],
    description:
      "Manitoba has one of the highest proportions of Indigenous residents in Canada. Winnipeg serves as a cultural hub for First Nations, Inuit, and Red River Métis professionals across healthcare, government, and education.",
    tribalRegions: "Treaties 1 through 5 territories and the National Homeland of the Red River Métis.",
  },
  "quebec": {
    name: "Quebec",
    slug: "quebec",
    capital: "Quebec City",
    majorCities: ["Montreal", "Quebec City", "Gatineau", "Val-d'Or", "Sept-Îles", "Kuujjuaq"],
    description:
      "Quebec features 11 recognized Indigenous Nations (10 First Nations and the Inuit of Nunavik). Major employers seek bilingual professionals in governance, environmental conservation, education, and health.",
    tribalRegions: "Cree, Innu, Inuit (Nunavik), Mi'kmaq, Atikamekw, Anishinaabe, Mohawk, Huron-Wendat, Abenaki, Maliseet, and Naskapi.",
  },
  "northwest-territories": {
    name: "Northwest Territories",
    slug: "northwest-territories",
    capital: "Yellowknife",
    majorCities: ["Yellowknife", "Inuvik", "Hay River", "Fort Smith", "Behchokǫ̀"],
    description:
      "In the Northwest Territories, Indigenous peoples represent approximately half of the population. Career opportunities offer competitive northern allowances in healthcare, mining, governance, and infrastructure.",
    tribalRegions: "Dene, Inuvialuit, and Métis ancestral territories.",
  },
  "yukon": {
    name: "Yukon",
    slug: "yukon",
    capital: "Whitehorse",
    majorCities: ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction"],
    description:
      "With 11 self-governing First Nations, Yukon is a trailblazer in Indigenous self-determination. Opportunities are available in land stewardship, heritage preservation, government, and community wellness.",
    tribalRegions: "Yukon First Nations traditional territories.",
  },
  "nunavut": {
    name: "Nunavut",
    slug: "nunavut",
    capital: "Iqaluit",
    majorCities: ["Iqaluit", "Rankin Inlet", "Arviat", "Cambridge Bay", "Baker Lake"],
    description:
      "Nunavut is guided by Inuit Qaujimajatuqangit (traditional knowledge). Employment through territorial government and Inuit organizations prioritizes Inuit beneficiaries under Article 23 of the Nunavut Agreement.",
    tribalRegions: "Inuit Nunangat across Qikiqtaaluk, Kivalliq, and Kitikmeot regions.",
  },
  "nova-scotia": {
    name: "Nova Scotia",
    slug: "nova-scotia",
    capital: "Halifax",
    majorCities: ["Halifax", "Sydney", "Truro", "Dartmouth", "Cape Breton"],
    description:
      "Nova Scotia is situated within unceded Mi'kma'ki. The 13 Mi'kmaw communities foster active employment in education, fisheries management, band governance, and community health.",
    tribalRegions: "Mi'kma'ki unceded territory.",
  },
  "new-brunswick": {
    name: "New Brunswick",
    slug: "new-brunswick",
    capital: "Fredericton",
    majorCities: ["Moncton", "Saint John", "Fredericton", "Miramichi", "Bathurst"],
    description:
      "New Brunswick is traditional territory of the Wolastoqey, Mi'gmaq, and Peskotomuhkati peoples, offering careers in band administration, forestry, natural resources, and social advocacy.",
    tribalRegions: "Peace and Friendship Treaties territories.",
  },
  "newfoundland-and-labrador": {
    name: "Newfoundland and Labrador",
    slug: "newfoundland-and-labrador",
    capital: "St. John's",
    majorCities: ["St. John's", "Corner Brook", "Happy Valley-Goose Bay", "Labrador City"],
    description:
      "Employment opportunities across Newfoundland and Labrador connect with Innu, Inuit (Nunatsiavut), Southern Inuit (NunatuKavut), and Mi'kmaq communities in natural resources, health, and heritage.",
    tribalRegions: "Innu, Inuit, and Mi'kmaq territories.",
  },
};

interface PageProps {
  params: Promise<{ province: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PROVINCE_DATA).map((slug) => ({ province: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { province } = await params;
  const pData = PROVINCE_DATA[province.toLowerCase()];

  if (!pData) {
    return {
      title: "Indigenous Jobs in Canada | Aboriginal Jobs Canada",
      description: "Browse inclusive Indigenous employment opportunities across Canadian provinces.",
    };
  }

  const title = `Indigenous & Aboriginal Jobs in ${pData.name} — Apply Now`;
  const description = `Find active First Nations, Métis, and Inuit job postings in ${pData.name}. Browse careers in ${pData.majorCities.slice(0, 4).join(", ")}, healthcare, trades, administration, and remote positions.`;
  const canonicalUrl = `https://aboriginal-jobs.ca/jobs/in/${pData.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Aboriginal Jobs Canada`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Indigenous Jobs in ${pData.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Aboriginal Jobs Canada`,
      description,
    },
    keywords: [
      `Indigenous jobs ${pData.name}`,
      `Aboriginal jobs ${pData.name}`,
      `First Nations careers ${pData.name}`,
      `Jobs in ${pData.capital}`,
      `Band council jobs ${pData.name}`,
      ...pData.majorCities.map((c) => `Indigenous jobs ${c}`),
    ],
  };
}

export default async function ProvinceJobsPage({ params }: PageProps) {
  const { province } = await params;
  const pData = PROVINCE_DATA[province.toLowerCase()];

  if (!pData) {
    notFound();
  }

  // Fetch jobs for this province from server
  const allJobs = await fetchServerActiveJobs(200);
  const provinceJobs = allJobs.filter((j) => {
    const jobProvince = (j.province || "").toLowerCase();
    const target = pData.name.toLowerCase();
    return jobProvince.includes(target) || target.includes(jobProvince);
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Jobs", url: "/jobs" },
    { name: pData.name, url: `/jobs/in/${pData.slug}` },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What types of Indigenous jobs are available in ${pData.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Opportunities in ${pData.name} range across health and social services, education, band administration, environmental monitoring, trades, and remote digital roles. Employers include First Nations band councils, tribal councils, provincial ministries, and inclusive corporate employers.`,
        },
      },
      {
        "@type": "Question",
        name: `Are these positions open to First Nations, Métis, and Inuit job seekers?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. Under Section 16(1) of the Canadian Human Rights Act, employers in ${pData.name} are permitted to implement employment equity programs giving preference to Indigenous candidates to advance reconciliation and inclusive workplaces.`,
        },
      },
      {
        "@type": "Question",
        name: `How can employers post job openings targeting ${pData.name} Indigenous talent?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Employers can post opportunities directly through the Aboriginal Jobs Canada platform by selecting ${pData.name} as the location to reach candidates throughout the province and its northern communities.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Structured Data */}
      <BreadcrumbSchema items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#1C1C1C] to-[#2B231D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#C8782A]/20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Visual Trail */}
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
            <ChevronRight size={12} />
            <span className="text-[#C8782A] font-medium">{pData.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8782A]/20 border border-[#C8782A]/40 text-[#E8984A] text-xs font-semibold mb-4">
            <MapPin size={13} />
            <span>Regional Career Hub • {pData.name}</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Indigenous & Aboriginal Jobs in {pData.name}
          </h1>

          <p className="text-white/80 text-base sm:text-lg max-w-3xl leading-relaxed mb-6">
            {pData.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/70">
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <strong>{provinceJobs.length}</strong> Active Positions Listed
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Capital: <strong>{pData.capital}</strong>
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Traditional Lands: <strong>{pData.tribalRegions}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* City Filters Bar */}
      <section className="bg-white border-b border-[#C8782A]/10 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B3A2A]/70 mb-2.5">
            Explore Opportunities by City in {pData.name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {pData.majorCities.map((city) => (
              <Link
                key={city}
                href={`/jobs?province=${encodeURIComponent(pData.name)}&search=${encodeURIComponent(city)}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#FAF5EE] text-[#1C1C1C] border border-[#C8782A]/15 hover:bg-[#C8782A] hover:text-white hover:border-[#C8782A] transition-all duration-200"
              >
                <MapPin size={11} className="text-[#C8782A] group-hover:text-white" />
                {city}
              </Link>
            ))}
            <Link
              href={`/jobs?province=${encodeURIComponent(pData.name)}&remote=true`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#1a64c4]/10 text-[#1a64c4] border border-[#1a64c4]/20 hover:bg-[#1a64c4] hover:text-white transition-all duration-200"
            >
              <Wifi size={11} />
              Remote Jobs in {pData.name}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C8782A]/15">
              <h2 className="text-xl font-bold text-[#1C1C1C]">
                Current Openings in {pData.name}
              </h2>
              <span className="text-xs text-[#6B3A2A]/70 font-medium">
                Showing {provinceJobs.length} opportunities
              </span>
            </div>

            {provinceJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#C8782A]/15">
                <Briefcase size={40} className="mx-auto text-[#C8782A]/50 mb-3" />
                <h3 className="text-lg font-bold text-[#1C1C1C] mb-1">
                  New Positions in {pData.name} Coming Soon
                </h3>
                <p className="text-sm text-[#6B3A2A]/70 max-w-md mx-auto mb-6">
                  Check all active jobs across Canada or subscribe to job alerts for {pData.name}.
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8782A] text-white font-medium text-sm hover:bg-[#B06820] transition-colors"
                  >
                    View All Canada Jobs <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/post-a-job"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C8782A]/30 text-[#6B3A2A] font-medium text-sm hover:bg-[#FAF5EE] transition-colors"
                  >
                    Post an Opening
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {provinceJobs.map((job) => (
                  <Link
                    key={job._id}
                    href={getJobUrl(job)}
                    className="block bg-white rounded-2xl p-5 border border-[#C8782A]/15 hover:border-[#C8782A]/50 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[#C8782A] bg-[#FAF5EE] px-2.5 py-0.5 rounded-full border border-[#C8782A]/15">
                            {job.category || "General"}
                          </span>
                          {job.remote && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1a64c4] bg-[#1a64c4]/10 px-2 py-0.5 rounded-full">
                              <Wifi size={10} /> Remote
                            </span>
                          )}
                          {job.indigenousOwned && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4a7a4e] bg-[#7A9E7E]/10 px-2 py-0.5 rounded-full">
                              <Leaf size={10} /> Indigenous-owned
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#1C1C1C] group-hover:text-[#C8782A] transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-sm font-medium text-[#6B3A2A]/80">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B3A2A]/60 pt-1">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-[#C8782A]" />
                            {job.location || pData.name}
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
                        <div className="w-9 h-9 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#C8782A] group-hover:bg-[#C8782A] group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Info Column (1 Col) */}
          <aside className="space-y-6">
            {/* Employer Callout */}
            <div className="bg-gradient-to-br from-[#FAF5EE] to-[#F3ECE1] rounded-2xl p-6 border border-[#C8782A]/20">
              <Building2 className="text-[#C8782A] mb-3" size={28} />
              <h3 className="text-base font-bold text-[#1C1C1C] mb-2">
                Hiring in {pData.name}?
              </h3>
              <p className="text-xs text-[#6B3A2A]/80 leading-relaxed mb-4">
                Connect your organization with qualified First Nations, Métis, and Inuit professionals throughout {pData.name}.
              </p>
              <Link
                href="/post-a-job"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#C8782A] text-white text-xs font-semibold hover:bg-[#B06820] transition-colors shadow-sm"
              >
                Post a Job in {pData.name}
              </Link>
            </div>

            {/* Other Provinces Navigation */}
            <div className="bg-white rounded-2xl p-6 border border-[#C8782A]/15">
              <h3 className="text-sm font-bold text-[#1C1C1C] mb-3 uppercase tracking-wider">
                Jobs by Other Provinces
              </h3>
              <div className="flex flex-col gap-1.5 text-xs">
                {Object.values(PROVINCE_DATA)
                  .filter((p) => p.slug !== pData.slug)
                  .slice(0, 8)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/jobs/in/${p.slug}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[#6B3A2A] hover:bg-[#FAF5EE] hover:text-[#C8782A] transition-colors"
                    >
                      <span>{p.name}</span>
                      <ChevronRight size={12} className="text-[#C8782A]/50" />
                    </Link>
                  ))}
              </div>
            </div>

            {/* Reconciliation Note */}
            <div className="bg-[#7A9E7E]/10 rounded-2xl p-5 border border-[#7A9E7E]/20 text-xs text-[#2A442E] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <CheckCircle size={16} className="text-[#4a7a4e]" />
                TRC Call to Action #92
              </div>
              <p className="leading-relaxed text-[#2A442E]/80">
                Aboriginal Jobs Canada supports business sector reconciliation by ensuring equitable employment pathways for Indigenous peoples across {pData.name}.
              </p>
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 pt-10 border-t border-[#C8782A]/15">
          <h2
            className="text-2xl font-bold text-[#1C1C1C] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked Questions — {pData.name} Careers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {faqSchema.mainEntity.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#C8782A]/15 space-y-2"
              >
                <h3 className="font-bold text-sm text-[#1C1C1C]">
                  {faq.name}
                </h3>
                <p className="text-xs text-[#6B3A2A]/70 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
