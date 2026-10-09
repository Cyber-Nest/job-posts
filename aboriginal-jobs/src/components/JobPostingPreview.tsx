import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Globe,
  BadgeCheck,
  Calendar,
  Code2,
  GraduationCap,
  Tag,
  CalendarDays,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

export type ApplyMethod = {
  method: "email" | "phone" | "mail" | "inPerson";
  email?: string;
  phone?: string;
  mailAddress?: string;
  inPersonAddress?: string;
  inPersonTiming?: string;
};

export type JobPostingData = {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary: string;
  salaryType?: string;
  descriptionHtml: string;
  requirementsHtml: string;
  indigenous: boolean;
  remote: boolean;
  vacancies?: number;
  packageName: string;
  featured: boolean;
  nocCode?: string;
  runDays?: string;
  experience?: string;
  startDate?: string;
  category?: string;
  website?: string;
  applyMethods?: ApplyMethod[];
};

interface JobPostingPreviewProps {
  data: JobPostingData;
}

const getSalaryDisplay = (salary: string, salaryType?: string): string => {
  if (!salary) return "Salary not specified";
  const typeMap: Record<string, string> = {
    hour: "/hour",
    week: "/week",
    month: "/month",
    year: "/year",
  };
  const suffix = salaryType && typeMap[salaryType] ? typeMap[salaryType] : "";
  return `${salary} CAD${suffix}`;
};

const getStartDateDisplay = (startDate: string): string => {
  const dateMap: Record<string, string> = {
    asap: "As Soon As Possible",
    immediate: "Immediate Joining",
    "1week": "Within 1 Week",
    "2weeks": "Within 2 Weeks",
    "1month": "Within 1 Month",
  };
  return dateMap[startDate] || "To be determined";
};

// Helper to format location without duplicate
const getLocationDisplay = (location: string): string => {
  if (!location) return "";
  const parts = location.split(",").map((p) => p.trim());
  const uniqueParts = [...new Set(parts)];
  return uniqueParts.join(", ");
};

// Apply Method Card Component for Preview
function ApplyMethodPreview({ method }: { method: ApplyMethod }) {
  const getMethodIcon = () => {
    switch (method.method) {
      case "email":
        return <Mail size={14} className="text-[#C8782A]" />;
      case "phone":
        return <Phone size={14} className="text-[#C8782A]" />;
      case "mail":
        return <MapPin size={14} className="text-[#C8782A]" />;
      case "inPerson":
        return <Building2 size={14} className="text-[#C8782A]" />;
      default:
        return null;
    }
  };

  const getMethodTitle = () => {
    switch (method.method) {
      case "email":
        return "Apply by Email";
      case "phone":
        return "Apply by Phone";
      case "mail":
        return "Apply by Mail";
      case "inPerson":
        return "Apply in Person";
      default:
        return "";
    }
  };

  const getMethodDetails = () => {
    switch (method.method) {
      case "email":
        return method.email;
      case "phone":
        return method.phone;
      case "mail":
        return method.mailAddress;
      case "inPerson":
        return (
          <div className="space-y-1">
            <p className="text-xs">{method.inPersonAddress}</p>
            {method.inPersonTiming && (
              <p className="text-xs text-[#6B3A2A]/60 flex items-center gap-1">
                <Clock size={10} /> {method.inPersonTiming}
              </p>
            )}
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <div className="bg-[#FAF5EE] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        {getMethodIcon()}
        <h6 className="font-semibold text-xs text-[#1C1C1C]">
          {getMethodTitle()}
        </h6>
      </div>
      <div className="text-sm text-[#6B3A2A]/75 break-words">
        {getMethodDetails()}
      </div>
    </div>
  );
}

export default function JobPostingPreview({ data }: JobPostingPreviewProps) {
  const hasContent = data.title || data.company || data.descriptionHtml;

  if (!hasContent) {
    return (
      <div className="bg-white rounded-2xl border border-[#C8782A]/15 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#C8782A] to-[#B06820] px-4 sm:px-5 py-3">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Briefcase size={16} />
            Live Preview
          </h3>
        </div>
        <div className="p-4 sm:p-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FAF5EE] rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase size={24} className="text-[#C8782A]/40" />
          </div>
          <p className="text-[#6B3A2A]/50 text-xs sm:text-sm">
            Start filling the form to see your job posting preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#C8782A]/15 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-[#C8782A] to-[#B06820] px-4 sm:px-5 py-3 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Briefcase size={16} />
          Live Preview
        </h3>
        {data.featured && (
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            Featured
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="border-b border-[#C8782A]/10 pb-3 sm:pb-4 mb-3 sm:mb-4">
          <h4
            className="text-lg sm:text-xl font-bold text-[#1C1C1C] mb-2 line-clamp-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {data.title || "Job Title"}
          </h4>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-[#6B3A2A]/70">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="flex-shrink-0" />
              <span className="truncate">{data.company || "Company Name"}</span>
            </span>
            {data.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate">
                  {getLocationDisplay(data.location)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {data.remote && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <Globe size={11} className="flex-shrink-0" />
              Remote / Hybrid
            </span>
          )}
          {data.indigenous && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-[#7A9E7E]/10 text-[#7A9E7E] border border-[#7A9E7E]/20">
              <BadgeCheck size={11} className="flex-shrink-0" />
              Indigenous-owned
            </span>
          )}
          {data.category && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <Tag size={11} className="flex-shrink-0" />
              <span className="truncate">{data.category}</span>
            </span>
          )}
          {data.nocCode && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
              <Code2 size={11} className="flex-shrink-0" />
              NOC: {data.nocCode}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {data.employmentType && (
            <div className="bg-[#FAF5EE] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[#C8782A] mb-1">
                <Clock size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium">Employment Type</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] break-words">
                {data.employmentType}
              </p>
            </div>
          )}

          {data.salary && (
            <div className="bg-[#FAF5EE] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[#C8782A] mb-1">
                <DollarSign size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium">Salary</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] break-words">
                {getSalaryDisplay(data.salary, data.salaryType)}
              </p>
            </div>
          )}

          {data.vacancies && (
            <div className="bg-[#FAF5EE] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[#C8782A] mb-1">
                <Briefcase size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium">Vacancies</span>
              </div>

              <p className="text-sm font-semibold text-[#1C1C1C]">
                {data.vacancies}{" "}
                {data.vacancies > 1 ? "Open Positions" : "Open Position"}
              </p>
            </div>
          )}
          {data.runDays && (
            <div className="bg-[#FAF5EE] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[#C8782A] mb-1">
                <CalendarDays size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium">Posted for</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C]">
                {data.runDays} days
              </p>
            </div>
          )}

          {data.experience && (
            <div className="bg-[#FAF5EE] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[#C8782A] mb-1">
                <GraduationCap size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium">Experience</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C]">
                {data.experience}{" "}
                {parseInt(data.experience) > 1 ? "years" : "year"}
              </p>
            </div>
          )}

          {data.startDate && (
            <div className="bg-[#FAF5EE] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[#C8782A] mb-1">
                <Calendar size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium">Start Date</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C]">
                {getStartDateDisplay(data.startDate)}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {data.descriptionHtml && (
          <div className="mb-4">
            <h5 className="font-semibold text-[#1C1C1C] text-sm mb-2 flex items-center gap-2">
              <Briefcase size={14} className="text-[#C8782A] flex-shrink-0" />
              About the Role
            </h5>
            <div
              className="text-sm text-[#6B3A2A]/80 prose prose-sm max-w-none line-clamp-6 break-words"
              dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
            />
            {data.descriptionHtml.length > 500 && (
              <button className="text-xs text-[#C8782A] mt-2 hover:underline inline-flex items-center gap-1">
                Read more <ChevronRight size={10} />
              </button>
            )}
          </div>
        )}

        {/* Requirements */}
        {data.requirementsHtml && (
          <div className="mb-4">
            <h5 className="font-semibold text-[#1C1C1C] text-sm mb-2 flex items-center gap-2">
              <BadgeCheck size={14} className="text-[#C8782A] flex-shrink-0" />
              Qualifications & Requirements
            </h5>
            <div
              className="text-sm text-[#6B3A2A]/80 prose prose-sm max-w-none line-clamp-4 break-words"
              dangerouslySetInnerHTML={{ __html: data.requirementsHtml }}
            />
            {data.requirementsHtml.length > 400 && (
              <button className="text-xs text-[#C8782A] mt-2 hover:underline inline-flex items-center gap-1">
                Read more <ChevronRight size={10} />
              </button>
            )}
          </div>
        )}

        {/* How to Apply Methods */}
        {data.applyMethods && data.applyMethods.length > 0 && (
          <div className="mb-4">
            <h5 className="font-semibold text-[#1C1C1C] text-sm mb-2 flex items-center gap-2">
              <Mail size={14} className="text-[#C8782A] flex-shrink-0" />
              How to Apply
            </h5>
            <div className="space-y-2">
              {data.applyMethods.map((method, idx) => (
                <ApplyMethodPreview key={idx} method={method} />
              ))}
            </div>
          </div>
        )}

        {/* Website Link */}
        {data.website && (
          <div className="mb-4 p-3 bg-[#FAF5EE] rounded-lg">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-[#C8782A] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#6B3A2A]/50">Company Website</p>
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1a64c4] hover:underline break-all"
                >
                  {data.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#C8782A]/10 pt-3 mt-3">
          <p className="text-xs text-[#6B3A2A]/50 text-center">
            {data.packageName || "Job Posting"} • Live on Aboriginal Jobs Canada
          </p>
        </div>
      </div>
    </div>
  );
}
