import { MapPin, Clock, DollarSign, Building2, Eye, Calendar, Briefcase, GraduationCap, Plane, Umbrella, Hash, Mail, Phone, MapPin as MapPinIcon, Users } from "lucide-react";

export interface JobPostingData {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary: string;
  descriptionHtml: string;
  requirementsHtml: string;
  indigenous: boolean;
  remote: boolean;
  packageName: string;
  featured: boolean;
  // New fields
  category?: string;
  startDate?: string;
  positionType?: string;
  experience?: string;
  education?: string;
  travel?: string;
  vacation?: string;
  nocCode?: string;
  howToApply?: {
    byEmail?: boolean;
    email?: string | null;
    byMail?: boolean;
    mailingAddress?: string | null;
    byPhone?: boolean;
    phone?: string | null;
    inPerson?: boolean;
    inPersonAddress?: string | null;
    inPersonFromTime?: string | null;
    inPersonToTime?: string | null;
  };
}

interface JobPostingPreviewProps {
  data: JobPostingData;
}

export default function JobPostingPreview({ data }: JobPostingPreviewProps) {
  const isEmpty =
    !data.title && !data.company && !data.location && !data.descriptionHtml;

  const hasHowToApply = data.howToApply && (
    data.howToApply.byEmail || 
    data.howToApply.byMail || 
    data.howToApply.byPhone || 
    data.howToApply.inPerson
  );

  return (
    <div className="bg-white rounded-3xl border border-blue-200/60 overflow-hidden shadow-sm">
      {/* Preview header bar */}
      <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 border-b border-blue-100">
        <Eye size={14} className="text-blue-600" />
        <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
          Live Preview
        </span>
        {data.featured && (
          <span className="ml-auto text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
            Featured
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Building2 size={24} className="text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your job posting preview will appear here as you fill in the form.
          </p>
          <p className="text-gray-300 text-xs mt-2">
            Start typing in the form →
          </p>
        </div>
      ) : (
        <div className="p-6 max-h-[600px] overflow-y-auto">
          {/* Title + company */}
          <div className="mb-4">
            <h3
              className="text-xl font-bold text-gray-900 leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.title || (
                <span className="text-gray-300 italic">Job Title</span>
              )}
            </h3>
            <p className="text-blue-600 font-semibold text-sm">
              {data.company || (
                <span className="text-gray-300 italic">Company Name</span>
              )}
            </p>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {data.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-blue-200 rounded-full px-3 py-1">
                <MapPin size={11} className="text-blue-500" />
                {data.location}
              </span>
            )}
            {data.employmentType && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-blue-200 rounded-full px-3 py-1">
                <Clock size={11} className="text-blue-500" />
                {data.employmentType}
              </span>
            )}
            {data.salary && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-blue-200 rounded-full px-3 py-1">
                <DollarSign size={11} className="text-blue-500" />
                {data.salary}
              </span>
            )}
            {data.category && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-blue-200 rounded-full px-3 py-1">
                <Briefcase size={11} className="text-blue-500" />
                {data.category}
              </span>
            )}
            {data.remote && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-blue-600 rounded-full px-3 py-1">
                Remote / Hybrid
              </span>
            )}
            {data.indigenous && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-emerald-600 rounded-full px-3 py-1">
                Indigenous-owned
              </span>
            )}
          </div>

          {/* Job Criteria Section */}
          {(data.startDate || data.positionType || data.experience || data.education || data.travel || data.vacation || data.nocCode) && (
            <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Job Criteria
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {data.startDate && (
                  <div className="flex items-start gap-1.5">
                    <Calendar size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">Start Date</p>
                      <p className="text-gray-700 font-medium">{data.startDate}</p>
                    </div>
                  </div>
                )}
                {data.positionType && (
                  <div className="flex items-start gap-1.5">
                    <Briefcase size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">Position Type</p>
                      <p className="text-gray-700 font-medium">{data.positionType}</p>
                    </div>
                  </div>
                )}
                {data.experience && (
                  <div className="flex items-start gap-1.5">
                    <Users size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">Experience</p>
                      <p className="text-gray-700 font-medium">{data.experience}</p>
                    </div>
                  </div>
                )}
                {data.education && (
                  <div className="flex items-start gap-1.5">
                    <GraduationCap size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">Education</p>
                      <p className="text-gray-700 font-medium">{data.education}</p>
                    </div>
                  </div>
                )}
                {data.travel && (
                  <div className="flex items-start gap-1.5">
                    <Plane size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">Travel</p>
                      <p className="text-gray-700 font-medium">{data.travel}</p>
                    </div>
                  </div>
                )}
                {data.vacation && (
                  <div className="flex items-start gap-1.5">
                    <Umbrella size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">Vacation</p>
                      <p className="text-gray-700 font-medium">{data.vacation}</p>
                    </div>
                  </div>
                )}
                {data.nocCode && (
                  <div className="flex items-start gap-1.5">
                    <Hash size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400">NOC Code</p>
                      <p className="text-gray-700 font-medium">{data.nocCode}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {data.descriptionHtml && data.descriptionHtml !== "<p><br></p>" && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                About the Role
              </p>
              <div
                className="text-sm text-gray-700 leading-relaxed prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-0.5"
                dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
              />
            </div>
          )}

          {/* Requirements */}
          {data.requirementsHtml && data.requirementsHtml !== "<p><br></p>" && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Qualifications & Requirements
              </p>
              <div
                className="text-sm text-gray-700 leading-relaxed prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-0.5"
                dangerouslySetInnerHTML={{ __html: data.requirementsHtml }}
              />
            </div>
          )}

          {/* How to Apply Section */}
          {hasHowToApply && (
            <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                How to Apply
              </p>
              <div className="space-y-3">
                {data.howToApply?.byEmail && data.howToApply.email && (
                  <div className="flex items-start gap-2 text-sm">
                    <Mail size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="text-blue-600 font-medium break-words">{data.howToApply.email}</p>
                    </div>
                  </div>
                )}
                {data.howToApply?.byMail && data.howToApply.mailingAddress && (
                  <div className="flex items-start gap-2 text-sm">
                    <Mail size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Mail</p>
                      <p className="text-gray-700 break-words">{data.howToApply.mailingAddress}</p>
                    </div>
                  </div>
                )}
                {data.howToApply?.byPhone && data.howToApply.phone && (
                  <div className="flex items-start gap-2 text-sm">
                    <Phone size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Phone</p>
                      <p className="text-gray-700">{data.howToApply.phone}</p>
                    </div>
                  </div>
                )}
                {data.howToApply?.inPerson && data.howToApply.inPersonAddress && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPinIcon size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">In Person</p>
                      <p className="text-gray-700 break-words">{data.howToApply.inPersonAddress}</p>
                      {data.howToApply.inPersonFromTime && data.howToApply.inPersonToTime && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          {data.howToApply.inPersonFromTime} - {data.howToApply.inPersonToTime}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Package badge */}
          {data.packageName && (
            <div className="mt-4 pt-4 border-t border-blue-100">
              <p className="text-xs text-gray-400">
                Package:{" "}
                <span className="font-medium text-gray-500">
                  {data.packageName}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}