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
        return <Mail size={14} className="text-[#059669]" />;
      case "phone":
        return <Phone size={14} className="text-[#059669]" />;
      case "mail":
        return <MapPin size={14} className="text-[#059669]" />;
      case "inPerson":
        return <Building2 size={14} className="text-[#059669]" />;
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
            <p className="text-xs font-semibold text-slate-800">{method.inPersonAddress}</p>
            {method.inPersonTiming && (
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
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
    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
      <div className="flex items-center gap-2 mb-1.5">
        {getMethodIcon()}
        <h6 className="font-extrabold text-xs text-slate-900">
          {getMethodTitle()}
        </h6>
      </div>
      <div className="text-xs font-semibold text-slate-700 break-words">
        {getMethodDetails()}
      </div>
    </div>
  );
}

export default function JobPostingPreview({ data }: JobPostingPreviewProps) {
  const hasContent = data.title || data.company || data.descriptionHtml;

  if (!hasContent) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800">
          <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
            <Briefcase size={16} className="text-[#059669]" />
            Live Preview
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Briefcase size={24} className="text-[#059669]" />
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Start filling the form to see your job posting preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
      <div className="bg-slate-900 px-5 py-3.5 flex justify-between items-center border-b border-slate-800">
        <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
          <Briefcase size={16} className="text-[#059669]" />
          Live Preview
        </h3>
        {data.featured && (
          <span className="bg-[#059669] text-white text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
            Featured
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 mb-4">
          <h4 className="text-xl font-extrabold text-slate-900 mb-2 line-clamp-2">
            {data.title || "Job Title"}
          </h4>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="text-[#059669] flex-shrink-0" />
              <span className="truncate">{data.company || "Company Name"}</span>
            </span>
            {data.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#059669] flex-shrink-0" />
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#059669] border border-emerald-200/80 uppercase tracking-wider">
              <Globe size={11} className="flex-shrink-0" />
              Remote / Hybrid
            </span>
          )}
          {data.category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <Tag size={11} className="flex-shrink-0" />
              <span className="truncate">{data.category}</span>
            </span>
          )}
          {data.nocCode && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
              <Code2 size={11} className="flex-shrink-0" />
              NOC: {data.nocCode}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {data.employmentType && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                <Clock size={12} className="flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Employment Type</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 break-words">
                {data.employmentType}
              </p>
            </div>
          )}

          {data.salary && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                <DollarSign size={12} className="flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Salary</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 break-words">
                {getSalaryDisplay(data.salary, data.salaryType)}
              </p>
            </div>
          )}

          {data.vacancies && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                <Briefcase size={12} className="flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vacancies</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                {data.vacancies}{" "}
                {data.vacancies > 1 ? "Open Positions" : "Open Position"}
              </p>
            </div>
          )}

          {data.runDays && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                <CalendarDays size={12} className="flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Posted for</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                {data.runDays} days
              </p>
            </div>
          )}

          {data.experience && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                <GraduationCap size={12} className="flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                {data.experience}{" "}
                {parseInt(data.experience) > 1 ? "years" : "year"}
              </p>
            </div>
          )}

          {data.startDate && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                <Calendar size={12} className="flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Date</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                {getStartDateDisplay(data.startDate)}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {data.descriptionHtml && (
          <div className="mb-4">
            <h5 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Briefcase size={14} className="text-[#059669] flex-shrink-0" />
              About the Role
            </h5>
            <div
              className="text-xs sm:text-sm text-slate-600 prose prose-slate max-w-none line-clamp-6 break-words font-medium"
              dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
            />
          </div>
        )}

        {/* Requirements */}
        {data.requirementsHtml && (
          <div className="mb-4">
            <h5 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <BadgeCheck size={14} className="text-[#059669] flex-shrink-0" />
              Qualifications & Requirements
            </h5>
            <div
              className="text-xs sm:text-sm text-slate-600 prose prose-slate max-w-none line-clamp-4 break-words font-medium"
              dangerouslySetInnerHTML={{ __html: data.requirementsHtml }}
            />
          </div>
        )}

        {/* How to Apply Methods */}
        {data.applyMethods && data.applyMethods.length > 0 && (
          <div className="mb-4">
            <h5 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Mail size={14} className="text-[#059669] flex-shrink-0" />
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
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-[#059669] flex-shrink-0" />
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Company Website</p>
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#059669] hover:underline break-all"
                >
                  {data.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 pt-3 mt-3">
          <p className="text-xs text-slate-400 font-medium text-center">
            {data.packageName || "Job Posting"} • Live on GetJobsCanada
          </p>
        </div>
      </div>
    </div>
  );
}
