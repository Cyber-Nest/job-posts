"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  CheckCircle,
  Info,
  AlertCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Building2,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/RichTextEditor";
import JobPostingPreview, {
  type JobPostingData,
} from "@/components/JobPostingPreview";
import { useSession } from "@/lib/auth/auth-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

/* ── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ── Types for Apply Methods ────────────────────────────────────────── */
interface ApplyMethod {
  method: "email" | "phone" | "mail" | "inPerson";
  email?: string;
  phone?: string;
  mailAddress?: string;
  inPersonAddress?: string;
  inPersonTiming?: string;
}

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Casual / Seasonal",
  "Volunteer",
];

const jobCategories = [
  "Administration & Office",
  "Arts, Culture & Heritage",
  "Community & Social Services",
  "Construction & Trades",
  "Education & Training",
  "Environment & Natural Resources",
  "Finance & Accounting",
  "Government & Public Administration",
  "Health & Medical",
  "Hospitality & Tourism",
  "Information Technology",
  "Legal & Justice",
  "Management & Executive",
  "Marketing & Communications",
  "Natural Resources & Forestry",
  "Nursing & Allied Health",
  "Oil, Gas & Mining",
  "Other",
  "Sales & Customer Service",
  "Science & Research",
  "Security & Law Enforcement",
  "Transportation & Logistics",
  "Restaurant & Food Service",
];

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland & Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Québec",
  "Saskatchewan",
  "Yukon",
];

/* ── Validation Helpers ─────────────────────────────────────────────── */

// Only letters, spaces, hyphens, apostrophes (for names)
const validateName = (name: string): boolean => {
  return /^[A-Za-z\s\-'.]+$/.test(name);
};

// Only letters, spaces, hyphens (for city)
const validateCity = (city: string): boolean => {
  return /^[A-Za-z\s\-]+$/.test(city);
};

// Company name: letters, numbers, spaces, &, ., -, ' (most common in company names)
const validateCompany = (company: string): boolean => {
  return /^[A-Za-z0-9\s\&\.\-\'\(\)]+$/.test(company);
};

// Job title: letters, numbers, spaces, common punctuation
const validateTitle = (title: string): boolean => {
  return /^[A-Za-z0-9\s\-\,\'\(\)\/]+$/.test(title);
};

// NOC code: exactly 5 digits
const validateNocCode = (code: string): boolean => {
  return /^\d{5}$/.test(code);
};

// Salary: number or range (e.g., 20 or 20-35)
const validateSalary = (salary: string): boolean => {
  if (!salary) return true;
  return /^\d+(\.\d+)?(\s*-\s*\d+(\.\d+)?)?$/.test(salary);
};

// Website URL validation
const validateWebsite = (url: string): boolean => {
  if (!url) return true;
  const pattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(url);
};

// Email validation
const validateEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// Phone validation (minimum 10 digits)
const validatePhone = (phone: string): boolean => {
  return /^[\+\d\s\-\(\)]{10,}$/.test(phone);
};

/* ── Post Job Skeleton ──────────────────────────────────────────────── */
function PostJobSkeleton() {
  return (
    <section className="bg-slate-50 min-h-[85vh] py-12 lg:py-20 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-3 w-3 bg-slate-200 rounded-full" />
            <div className="h-4 w-24 bg-slate-300 rounded" />
          </div>

          <div className="h-4 w-28 bg-emerald-200 rounded mb-3" />
          <div className="h-10 w-64 bg-slate-300 rounded mb-8 sm:mb-10" />

          <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
            <div className="flex-1 max-w-4xl bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
              {[1, 2, 3].map((section) => (
                <div key={section} className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-full bg-emerald-200" />
                    <div className="h-6 w-48 bg-slate-200 rounded" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                      <div className="h-11 w-full bg-slate-100 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-11 w-full bg-slate-100 rounded-xl" />
                    </div>
                    {section === 2 && (
                      <div className="space-y-2 md:col-span-2 mt-4">
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                        <div className="h-32 w-full bg-slate-100 rounded-xl" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <div className="h-11 w-32 bg-emerald-600/20 rounded-xl" />
                <div className="h-11 w-24 bg-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="xl:w-[380px] flex-shrink-0 space-y-5 hidden xl:block">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 h-[400px]">
                <div className="h-6 w-32 bg-slate-200 rounded mb-6" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-slate-100 rounded" />
                  <div className="h-4 w-5/6 bg-slate-100 rounded" />
                  <div className="h-4 w-4/6 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Tip box ────────────────────────────────────────────────────────── */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-4 py-3">
      <Info size={16} className="text-[#059669] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-slate-700 leading-relaxed font-medium">{children}</p>
    </div>
  );
}

/* ── Section heading ────────────────────────────────────────────────── */
function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0 shadow-xs">
        <span className="text-white text-xs font-black">{step}</span>
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

/* ── Apply Method Card Component ────────────────────────────────────── */
function ApplyMethodCard({
  method,
  data,
  onChange,
  onRemove,
  isRemovable,
  errors,
}: {
  method: string;
  data: ApplyMethod;
  onChange: (field: string, value: string) => void;
  onRemove?: () => void;
  isRemovable: boolean;
  errors?: Record<string, string>;
}) {
  const getIcon = () => {
    switch (method) {
      case "email":
        return <Mail size={16} className="text-[#059669]" />;
      case "phone":
        return <Phone size={16} className="text-[#059669]" />;
      case "mail":
        return <MapPin size={16} className="text-[#059669]" />;
      case "inPerson":
        return <Building2 size={16} className="text-[#059669]" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (method) {
      case "email":
        return "Apply by Email";
      case "phone":
        return "Apply by Phone";
      case "mail":
        return "Apply by Mail";
      case "inPerson":
        return "Apply in Person";
      default:
        return method;
    }
  };

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4.5 border border-slate-200/80 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-extrabold text-sm text-slate-900">{getTitle()}</h3>
        </div>
        {isRemovable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-rose-500 hover:text-rose-700 transition-colors p-1"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {method === "email" && (
          <div>
            <Label className="text-xs text-slate-900 font-extrabold mb-1 block">
              Email Address <span className="text-rose-500 font-bold">*</span>
            </Label>
            <Input
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="jobs@company.com"
              className="mt-1 border-slate-200 placeholder:text-slate-400 text-slate-900 font-medium focus-visible:border-[#059669] focus-visible:ring-[#059669]/20"
            />
            {errors?.email && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>
            )}
          </div>
        )}

        {method === "phone" && (
          <div>
            <Label className="text-xs text-slate-900 font-extrabold mb-1 block">
              Phone Number <span className="text-rose-500 font-bold">*</span>
            </Label>
            <Input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1 border-slate-200 placeholder:text-slate-400 text-slate-900 font-medium focus-visible:border-[#059669] focus-visible:ring-[#059669]/20"
            />
            {errors?.phone && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.phone}</p>
            )}
          </div>
        )}

        {method === "mail" && (
          <div>
            <Label className="text-xs text-slate-900 font-extrabold mb-1 block">
              Mailing Address <span className="text-rose-500 font-bold">*</span>
            </Label>
            <Input
              value={data.mailAddress || ""}
              onChange={(e) => onChange("mailAddress", e.target.value)}
              placeholder="123 Street Name, City, Province, Postal Code"
              className="mt-1 border-slate-200 placeholder:text-slate-400 text-slate-900 font-medium focus-visible:border-[#059669] focus-visible:ring-[#059669]/20"
            />
            {errors?.mailAddress && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.mailAddress}</p>
            )}
          </div>
        )}

        {method === "inPerson" && (
          <>
            <div>
              <Label className="text-xs text-slate-900 font-extrabold mb-1 block">
                Office Address <span className="text-rose-500 font-bold">*</span>
              </Label>
              <Input
                value={data.inPersonAddress || ""}
                onChange={(e) => onChange("inPersonAddress", e.target.value)}
                placeholder="123 Business Ave, Suite 100, City, Province"
                className="mt-1 border-slate-200 placeholder:text-slate-400 text-slate-900 font-medium focus-visible:border-[#059669] focus-visible:ring-[#059669]/20"
              />
              {errors?.inPersonAddress && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.inPersonAddress}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs text-slate-900 font-extrabold mb-1 block">
                Available Hours / Time Slots <span className="text-rose-500 font-bold">*</span>
              </Label>
              <Input
                value={data.inPersonTiming || ""}
                onChange={(e) => onChange("inPersonTiming", e.target.value)}
                placeholder="Monday-Friday, 9AM to 5PM"
                className="mt-1 border-slate-200 placeholder:text-slate-400 text-slate-900 font-medium focus-visible:border-[#059669] focus-visible:ring-[#059669]/20"
              />
              {errors?.inPersonTiming && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.inPersonTiming}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Helper to format date for input ───────────────────────────────── */
function formatDateForInput(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

/* ── Main page ──────────────────────────────────────────────────────── */
function PostAJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams?.get("id");
  const isEditMode = !!jobIdParam;

  const { session } = useSession();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ── Form State ───────────────────────────────────────────────────── */
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [displayJobId, setDisplayJobId] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryType, setSalaryType] = useState("hour");
  const [nocCode, setNocCode] = useState("");
  const [runDays, setRunDays] = useState("30");
  const [vacancies, setVacancies] = useState<number | "">(1);
  const [experience, setExperience] = useState("");
  const [startDate, setStartDate] = useState("");
  const [website, setWebsite] = useState("");
  const [descHtml, setDescHtml] = useState("");
  const [reqHtml, setReqHtml] = useState("");
  const [indigenous, setIndigenous] = useState(false);
  const [remote, setRemote] = useState(false);
  const [applyMethods, setApplyMethods] = useState<ApplyMethod[]>([]);
  const [selectedMethodToAdd, setSelectedMethodToAdd] = useState<string>("");
  const [postDate, setPostDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [applyMethodErrors, setApplyMethodErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch job data if in edit mode
  useEffect(() => {
    if (isEditMode && jobIdParam) {
      setLoadingData(true);
      fetch(`/api/jobs/${jobIdParam}`)
        .then((res) => res.json())
        .then((data) => {
          const job = data.data;
          if (job) {
            setTitle(job.title || "");
            setCompany(job.company || "");
            setContactName(job.contactName || "");
            setDisplayJobId(job.jobId || "");
            setCity(job.city || "");
            setProvince(job.province || "");
            setEmploymentType(job.employmentType || "");
            setCategory(job.category || "");
            setSalary(job.salary || "");
            setSalaryType(job.salaryType || "hour");
            setNocCode(job.nocCode || "");
            setRunDays(job.runDays || "30");
            setVacancies(job.vacancies || "1");
            setExperience(job.experience || "");
            setStartDate(job.startDate || "");
            setWebsite(job.website || "");
            setDescHtml(job.descriptionHtml || "");
            setReqHtml(job.requirementsHtml || "");
            setIndigenous(job.indigenousOwned || false);
            setRemote(job.remote || false);
            setApplyMethods(job.applyMethods || []);
            setPostDate(job.postDate ? formatDateForInput(job.postDate) : "");
          }
        })
        .catch((err) => {
          console.error("Error fetching job:", err);
          toast.error("Failed to load job data");
        })
        .finally(() => setLoadingData(false));
    }
  }, [isEditMode, jobIdParam]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const addApplyMethod = () => {
    if (!selectedMethodToAdd) return;
    if (applyMethods.some((m) => m.method === selectedMethodToAdd)) {
      toast.error(`Already added ${selectedMethodToAdd} method`);
      return;
    }
    setApplyMethods([
      ...applyMethods,
      { method: selectedMethodToAdd as ApplyMethod["method"] },
    ]);
    setSelectedMethodToAdd("");
  };

  const removeApplyMethod = (index: number) => {
    setApplyMethods(applyMethods.filter((_, i) => i !== index));
    // Clear errors for removed method
    const newErrors = { ...applyMethodErrors };
    delete newErrors[index];
    setApplyMethodErrors(newErrors);
  };

  const updateApplyMethod = (index: number, field: string, value: string) => {
    const updated = [...applyMethods];
    updated[index] = { ...updated[index], [field]: value };
    setApplyMethods(updated);

    // Clear error for this field if it exists
    if (applyMethodErrors[index]?.[field]) {
      const newErrors = { ...applyMethodErrors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setApplyMethodErrors(newErrors);
    }
  };

  const validateApplyMethod = (method: ApplyMethod, index: number): boolean => {
    const errors: Record<string, string> = {};

    if (method.method === "email") {
      if (!method.email?.trim()) {
        errors.email = "Email address is required";
      } else if (!validateEmail(method.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (method.method === "phone") {
      if (!method.phone?.trim()) {
        errors.phone = "Phone number is required";
      } else if (!validatePhone(method.phone)) {
        errors.phone = "Please enter a valid phone number (minimum 10 digits)";
      }
    }

    if (method.method === "mail") {
      if (!method.mailAddress?.trim()) {
        errors.mailAddress = "Mailing address is required";
      }
    }

    if (method.method === "inPerson") {
      if (!method.inPersonAddress?.trim()) {
        errors.inPersonAddress = "Office address is required";
      }
      if (!method.inPersonTiming?.trim()) {
        errors.inPersonTiming = "Time schedule is required";
      }
    }

    if (Object.keys(errors).length > 0) {
      setApplyMethodErrors((prev) => ({ ...prev, [index]: errors }));
      return false;
    }
    return true;
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Job title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    } else if (!validateTitle(title.trim())) {
      newErrors.title =
        "Job title can only contain letters, numbers, spaces, and basic punctuation (-, ', /, ,)";
    }

    // Company validation
    if (!company.trim()) {
      newErrors.company = "Company name is required";
    } else if (!validateCompany(company.trim())) {
      newErrors.company =
        "Company name can only contain letters, numbers, spaces, and & . - ' ( )";
    }

    // Contact Name validation
    if (!contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    } else if (contactName.trim().length < 2) {
      newErrors.contactName = "Contact name must be at least 2 characters";
    } else if (!validateName(contactName)) {
      newErrors.contactName =
        "Contact name should only contain letters, spaces, hyphens, and apostrophes (no numbers)";
    }

    if (!vacancies || vacancies < 1) {
      newErrors.vacancies = "Vacancies must be at least 1";
    }

    // City validation
    if (!city.trim()) {
      newErrors.city = "City is required";
    } else if (!validateCity(city)) {
      newErrors.city =
        "City should only contain letters, spaces, and hyphens (no numbers or special characters)";
    }

    // Province validation
    if (!province) {
      newErrors.province = "Province is required";
    }

    // Employment Type validation
    if (!employmentType) {
      newErrors.employmentType = "Employment type is required";
    }

    // Category validation
    if (!category) {
      newErrors.category = "Job category is required";
    }

    // NOC Code validation
    if (!nocCode.trim()) {
      newErrors.nocCode = "NOC code is required";
    } else if (!validateNocCode(nocCode)) {
      newErrors.nocCode = "NOC code must be exactly 5 digits (e.g., 21231)";
    }

    // Salary validation (optional but if provided, validate format)
    if (salary && !validateSalary(salary)) {
      newErrors.salary = "Salary must be a number or range (e.g., 20 or 20-35)";
    }

    // Website validation (optional)
    if (website && !validateWebsite(website)) {
      newErrors.website =
        "Please enter a valid website URL (e.g., https://example.com)";
    }

    // Description validation
    if (
      !descHtml.trim() ||
      descHtml === "<p></p>" ||
      descHtml === "<p><br></p>"
    ) {
      newErrors.description = "Job description is required";
    } else if (descHtml.length > 5000) {
      newErrors.description =
        "Job description must be less than 5000 characters";
    }

    // Requirements validation
    if (!reqHtml.trim() || reqHtml === "<p></p>" || reqHtml === "<p><br></p>") {
      newErrors.requirements = "Qualifications & requirements are required";
    } else if (reqHtml.length > 4000) {
      newErrors.requirements = "Requirements must be less than 4000 characters";
    }

    // Apply Methods validation
    if (applyMethods.length === 0) {
      newErrors.applyMethods = "At least one application method is required";
    } else {
      let hasApplyMethodError = false;
      for (let i = 0; i < applyMethods.length; i++) {
        if (!validateApplyMethod(applyMethods[i], i)) {
          hasApplyMethodError = true;
        }
      }
      if (hasApplyMethodError) {
        newErrors.applyMethods =
          "Please fill in all required fields for application methods";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    title,
    company,
    contactName,
    city,
    province,
    employmentType,
    category,
    nocCode,
    salary,
    website,
    descHtml,
    reqHtml,
    applyMethods,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = [
      "title",
      "company",
      "contactName",
      "city",
      "province",
      "employmentType",
      "category",
      "nocCode",
      "description",
      "requirements",
      "applyMethods",
    ];
    const touchedObj: Record<string, boolean> = {};
    allFields.forEach((field) => {
      touchedObj[field] = true;
    });
    setTouched(touchedObj);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please fill the required fields before submitting");
      return;
    }

    setServerError("");
    setLoading(true);

    try {
      const url = isEditMode ? `/api/jobs/${jobIdParam}` : "/api/jobs";
      const method = isEditMode ? "PUT" : "POST";

      const requestBody: any = {
        title: title.trim(),
        company: company.trim(),
        contactName: contactName.trim(),
        city: city.trim(),
        province,
        employmentType,
        salary: salary.trim(),
        salaryType,
        category,
        nocCode: nocCode.trim(),
        runDays,
        vacancies,
        experience: experience.trim(),
        startDate,
        descriptionHtml: descHtml,
        requirementsHtml: reqHtml,
        indigenousOwned: indigenous,
        remote,
        website: website.trim(),
        applyMethods,
      };

      // Add postDate only in edit mode
      if (isEditMode && postDate) {
        requestBody.postDate = new Date(postDate).toISOString();
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data.error ||
          `Failed to ${isEditMode ? "update" : "submit"} job posting.`;
        setServerError(errMsg);
        toast.error(errMsg);
        return;
      }

      toast.success(
        isEditMode ? "Job updated successfully!" : "Job posted successfully!",
      );

      // Invalidate queries so the dashboard refetches the fresh data
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["employer-stats"] });

      if (!isEditMode) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSubmitted(true);
      } else {
        router.push("/employers/dashboard");
      }
    } catch {
      setServerError(
        "Network error. Please check your connection and try again.",
      );
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const location = [city, province].filter(Boolean).join(", ");
  const previewData: JobPostingData = {
    title,
    company,
    location,
    employmentType,
    salary,
    salaryType,
    descriptionHtml: descHtml,
    requirementsHtml: reqHtml,
    indigenous,
    remote,
    packageName: "Job Posting",
    featured: false,
    nocCode,
    runDays,
    vacancies: vacancies === "" ? undefined : vacancies,
    experience,
    startDate,
    category,
    website,
    applyMethods,
  };

  if (loadingData) {
    return <PostJobSkeleton />;
  }

  if (submitted) {
    return (
      <section className="bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 min-h-[85vh] flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 text-center shadow-xl mx-4 relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#059669] border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle size={32} className="text-[#059669]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Posting Submitted!
          </h1>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base font-medium">
            Thank you, <strong className="text-slate-900 font-bold">{contactName}</strong> from{" "}
            <strong className="text-slate-900 font-bold">{company}</strong>. Your job posting for{" "}
            <strong className="text-[#059669] font-bold">{title}</strong> has been received.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/employers/dashboard" className="w-full sm:w-auto">
              <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold px-8 rounded-2xl h-11 shadow-md w-full sm:w-auto">
                Employer Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-[#059669] hover:border-emerald-200 font-bold rounded-2xl h-11 w-full sm:w-auto"
              onClick={() => {
                setSubmitted(false);
                setServerError("");
                setTitle("");
                setCompany("");
                setContactName("");
                setCity("");
                setProvince("");
                setEmploymentType("");
                setSalary("");
                setNocCode("");
                setDescHtml("");
                setReqHtml("");
                setVacancies("");
                setApplyMethods([]);
                setPostDate("");
              }}
            >
              Post Another Job
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 py-10 lg:py-16 relative overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-4 inline-flex">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
                <span className="bg-[#059669] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                  EMPLOYERS HUB
                </span>
                <span className="text-xs font-bold text-slate-700 pr-1">
                  Canada Nationwide Hiring Portal
                </span>
              </div>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-slate-900 mb-3 leading-tight tracking-tight"
            >
              {isEditMode ? "Edit Job Posting" : "Post a Job Opening"}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed font-medium"
            >
              {isEditMode
                ? "Update your job posting details to attract the right candidates."
                : "Reach thousands of qualified job seekers across Canada."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50/50 py-10 lg:py-14 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col xl:flex-row gap-8">
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col gap-8"
              noValidate
            >
              {/* Job Details */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-slate-200/80 shadow-xs">
                <SectionHeading step={1} title="Job Details" />
                <div className="flex flex-col gap-5">
                  {/* Job ID - Display only in edit mode */}
                  {isEditMode && displayJobId && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
                      <Label className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
                        <Info size={15} className="text-[#059669]" />
                        Job ID
                      </Label>
                      <p className="font-mono text-base font-bold text-slate-900 mt-1">
                        {displayJobId}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        This ID is auto-generated and cannot be changed
                      </p>
                    </div>
                  )}

                  {/* Job Title */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-900 font-extrabold text-sm">
                      Job Title <span className="text-rose-500 font-bold">*</span>
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTitle(value);

                        // Real-time validation
                        if (value.trim()) {
                          if (!validateTitle(value)) {
                            setErrors((prev) => ({
                              ...prev,
                              title:
                                "Job title can only contain letters, numbers, spaces, and basic punctuation (-, ', /, ,)",
                            }));
                          } else if (value.trim().length < 3) {
                            setErrors((prev) => ({
                              ...prev,
                              title: "Job title must be at least 3 characters",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, title: "" }));
                          }
                        } else {
                          setErrors((prev) => ({ ...prev, title: "" }));
                        }
                      }}
                      onBlur={() => markTouched("title")}
                      placeholder="e.g. Community Health Worker"
                      className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                    />
                    {errors.title && touched.title && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                        <XCircle size={12} /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Company + Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Company / Organization{" "}
                        <span className="text-rose-500 font-bold">*</span>
                      </Label>
                      <Input
                        value={company}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCompany(value);

                          // Real-time validation
                          if (value.trim()) {
                            if (!validateCompany(value)) {
                              setErrors((prev) => ({
                                ...prev,
                                company:
                                  "Company name can only contain letters, numbers, spaces, and & . - ' ( )",
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, company: "" }));
                            }
                          } else {
                            setErrors((prev) => ({ ...prev, company: "" }));
                          }
                        }}
                        onBlur={() => markTouched("company")}
                        placeholder="Your organization name"
                        className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                      />
                      {errors.company && touched.company && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.company}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Website (optional)
                      </Label>
                      <Input
                        value={website}
                        onChange={(e) => {
                          const value = e.target.value;
                          setWebsite(value);

                          // Real-time validation
                          if (value && !validateWebsite(value)) {
                            setErrors((prev) => ({
                              ...prev,
                              website:
                                "Please enter a valid website URL (e.g., https://example.com)",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, website: "" }));
                          }
                        }}
                        onBlur={() => markTouched("website")}
                        placeholder="https://yourorganization.ca"
                        className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                      />
                      {errors.website && touched.website && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.website}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        City / Community{" "}
                        <span className="text-rose-500 font-bold">*</span>
                      </Label>
                      <Input
                        value={city}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCity(value);

                          // Real-time validation
                          if (value.trim()) {
                            if (!validateCity(value)) {
                              setErrors((prev) => ({
                                ...prev,
                                city: "City should only contain letters, spaces, and hyphens (no numbers or special characters)",
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, city: "" }));
                            }
                          } else {
                            setErrors((prev) => ({ ...prev, city: "" }));
                          }
                        }}
                        onBlur={() => markTouched("city")}
                        placeholder="e.g. Edmonton"
                        className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                      />
                      {errors.city && touched.city && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Province / Territory{" "}
                        <span className="text-rose-500 font-bold">*</span>
                      </Label>
                      <select
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          if (errors.province)
                            setErrors((prev) => ({ ...prev, province: "" }));
                        }}
                        onBlur={() => markTouched("province")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                      >
                        <option value="">Select province</option>
                        {provinces.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                      {errors.province && touched.province && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.province}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Type + Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Employment Type{" "}
                        <span className="text-rose-500 font-bold">*</span>
                      </Label>
                      <select
                        value={employmentType}
                        onChange={(e) => {
                          setEmploymentType(e.target.value);
                          if (errors.employmentType)
                            setErrors((prev) => ({
                              ...prev,
                              employmentType: "",
                            }));
                        }}
                        onBlur={() => markTouched("employmentType")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                      >
                        <option value="">Select type</option>
                        {employmentTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      {errors.employmentType && touched.employmentType && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.employmentType}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Salary (CAD)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={salary}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSalary(value);

                            // Real-time validation
                            if (value && !validateSalary(value)) {
                              setErrors((prev) => ({
                                ...prev,
                                salary:
                                  "Salary must be a number or range (e.g., 20 or 20-35)",
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, salary: "" }));
                            }
                          }}
                          onBlur={() => markTouched("salary")}
                          placeholder="e.g. 20 - 35"
                          className="flex-1 border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                        />
                        <select
                          value={salaryType}
                          onChange={(e) => setSalaryType(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                        >
                          <option value="hour">Per Hour</option>
                          <option value="week">Per Week</option>
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                        </select>
                      </div>
                      {errors.salary && touched.salary && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.salary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* NOC Code + Run Days */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        NOC Code <span className="text-rose-500 font-bold">*</span>
                      </Label>
                      <Input
                        value={nocCode}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 5);
                          setNocCode(value);

                          // Real-time validation
                          if (value && !validateNocCode(value)) {
                            setErrors((prev) => ({
                              ...prev,
                              nocCode:
                                "NOC code must be exactly 5 digits (e.g., 21231)",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, nocCode: "" }));
                          }
                        }}
                        onBlur={() => markTouched("nocCode")}
                        placeholder="e.g. 21231"
                        maxLength={5}
                        className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                      />
                      {errors.nocCode && touched.nocCode && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <XCircle size={12} /> {errors.nocCode}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Run Ad For
                      </Label>
                      <select
                        value={runDays}
                        onChange={(e) => setRunDays(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                      >
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="120">120 Days</option>
                        <option value="150">150 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Experience + Start Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Experience Required
                      </Label>
                      <Input
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 2+ years"
                        className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Expected Start Date
                      </Label>
                      <select
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                      >
                        <option value="">Select start date</option>
                        <option value="asap">As Soon As Possible</option>
                        <option value="immediate">Immediate Joining</option>
                        <option value="1week">Within 1 Week</option>
                        <option value="2weeks">Within 2 Weeks</option>
                        <option value="1month">Within 1 Month</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-900 font-extrabold text-sm">
                      Vacancies Available{" "}
                      <span className="text-rose-500 font-bold">*</span>
                    </Label>

                    <Input
                      type="number"
                      value={vacancies}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numVal = val === "" ? "" : Number(val);
                        setVacancies(numVal);
                        
                        if (val !== "" && Number(val) < 1) {
                          setErrors((prev) => ({ ...prev, vacancies: "Vacancies must be at least 1" }));
                        } else {
                          setErrors((prev) => ({ ...prev, vacancies: "" }));
                        }
                      }}
                      placeholder="e.g. 5"
                      className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                    />

                    {errors.vacancies && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <XCircle size={12} /> {errors.vacancies}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-900 font-extrabold text-sm">
                      Job Category <span className="text-rose-500 font-bold">*</span>
                    </Label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category)
                          setErrors((prev) => ({ ...prev, category: "" }));
                      }}
                      onBlur={() => markTouched("category")}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && touched.category && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                        <XCircle size={12} /> {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Employer Contact Name */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-900 font-extrabold text-sm">
                      Employer Contact Name{" "}
                      <span className="text-rose-500 font-bold">*</span>
                    </Label>
                    <Input
                      value={contactName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setContactName(value);
                        if (value.trim()) {
                          if (!validateName(value)) {
                            setErrors((prev) => ({
                              ...prev,
                              contactName:
                                "Contact name should only contain letters, spaces, hyphens, and apostrophes (no numbers)",
                            }));
                          } else if (value.trim().length < 2) {
                            setErrors((prev) => ({
                              ...prev,
                              contactName:
                                "Contact name must be at least 2 characters",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, contactName: "" }));
                          }
                        } else {
                          setErrors((prev) => ({ ...prev, contactName: "" }));
                        }
                      }}
                      onBlur={() => markTouched("contactName")}
                      placeholder="e.g. Sarah Johnson"
                      className="border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 font-medium text-slate-900 placeholder:text-slate-400"
                    />
                    {errors.contactName && touched.contactName && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                        <XCircle size={12} /> {errors.contactName}
                      </p>
                    )}
                  </div>

                  {/* Post Date - Only in Edit Mode */}
                  {isEditMode && (
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-slate-900 font-extrabold text-sm">
                        Post Date (Display Date)
                      </Label>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <Input
                          type="date"
                          value={postDate}
                          onChange={(e) => setPostDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                          className="pl-9 border-slate-200 focus-visible:border-[#059669] focus-visible:ring-[#059669]/20 text-slate-900 font-medium"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Only today&apos;s date can be selected.
                      </p>
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-5 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch
                        checked={remote}
                        onCheckedChange={setRemote}
                        className="data-[state=checked]:bg-[#059669]"
                      />
                      <span className="text-sm text-slate-800 font-extrabold">
                        Remote / Hybrid available
                      </span>
                    </label>
                    {/* <label className="flex items-center gap-3 cursor-pointer">
                      <Switch
                        checked={indigenous}
                        onCheckedChange={setIndigenous}
                        className="data-[state=checked]:bg-[#059669]"
                      />
                      <span className="text-sm text-slate-800 font-extrabold">
                        Indigenous-owned organization
                      </span>
                    </label> */}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-slate-200/80 shadow-xs">
                <SectionHeading step={2} title="Job Description" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Use plain, welcoming language.{" "}
                    <strong>Maximum 5000 characters per field.</strong>
                  </Tip>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-900 font-extrabold text-sm">
                      About the Role <span className="text-rose-500 font-bold">*</span>
                    </Label>
                    <RichTextEditor
                      value={descHtml}
                      onHtmlChange={(html) => {
                        setDescHtml(html);
                        if (errors.description)
                          setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      minHeight={200}
                      maxLength={5000}
                    />
                    {errors.description && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <XCircle size={12} /> {errors.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-900 font-extrabold text-sm">
                      Qualifications & Requirements{" "}
                      <span className="text-rose-500 font-bold">*</span>
                    </Label>
                    <RichTextEditor
                      value={reqHtml}
                      onHtmlChange={(html) => {
                        setReqHtml(html);
                        if (errors.requirements)
                          setErrors((prev) => ({ ...prev, requirements: "" }));
                      }}
                      minHeight={160}
                      maxLength={4000}
                    />
                    {errors.requirements && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <XCircle size={12} /> {errors.requirements}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* How to Apply */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-slate-200/80 shadow-xs">
                <SectionHeading step={3} title="How to Apply" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Select one or more methods. At least one method is required.
                  </Tip>

                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <Label className="text-xs text-slate-900 font-extrabold mb-1 block">
                        Add Application Method
                      </Label>
                      <select
                        value={selectedMethodToAdd}
                        onChange={(e) => setSelectedMethodToAdd(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                      >
                        <option value="">Select a method</option>
                        <option value="email">Apply by Email</option>
                        <option value="phone">Apply by Phone</option>
                        <option value="mail">Apply by Mail</option>
                        <option value="inPerson">Apply in Person</option>
                      </select>
                    </div>
                    <Button
                      type="button"
                      onClick={addApplyMethod}
                      disabled={!selectedMethodToAdd}
                      className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold shadow-sm rounded-xl h-10 px-5"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </Button>
                  </div>

                  {applyMethods.length > 0 && (
                    <div className="space-y-3">
                      {applyMethods.map((method, index) => (
                        <ApplyMethodCard
                          key={index}
                          method={method.method}
                          data={method}
                          onChange={(field, value) =>
                            updateApplyMethod(index, field, value)
                          }
                          onRemove={() => removeApplyMethod(index)}
                          isRemovable={applyMethods.length > 1}
                          errors={applyMethodErrors[index]}
                        />
                      ))}
                    </div>
                  )}

                  {errors.applyMethods && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.applyMethods}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4">
                {serverError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} /> {serverError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold px-10 h-12 rounded-2xl shadow-lg shadow-emerald-950/40"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />{" "}
                        Processing...
                      </span>
                    ) : isEditMode ? (
                      "Update Job"
                    ) : (
                      "Post Job Now"
                    )}
                  </Button>
                  <Link href="/employers/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 text-slate-700 font-bold h-12 rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.form>

            {/* Preview Sidebar */}
            <div className="xl:w-[380px] flex-shrink-0">
              <div className="flex flex-col gap-5 xl:sticky xl:top-24">
                <JobPostingPreview data={previewData} />
                <div className="bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 rounded-3xl p-6 border border-emerald-200/80 shadow-xs text-left">
                  <h4 className="font-extrabold text-slate-900 text-lg mb-4">
                    Why Post with Us?
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {[
                      "50,000+ active job seekers nationwide",
                      "Coast-to-coast Canadian reach",
                      "Direct candidate applications & messaging",
                      "Dedicated employer support team",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-bold"
                      >
                        <CheckCircle
                          size={16}
                          className="text-[#059669] flex-shrink-0 mt-0.5"
                        />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PostAJobPage() {
  return (
    <Suspense fallback={<PostJobSkeleton />}>
      <PostAJobContent />
    </Suspense>
  );
}
