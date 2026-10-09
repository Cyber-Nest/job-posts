"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  CheckCircle,
  ChevronRight,
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
    <section className="bg-[#FAF5EE] min-h-[85vh] py-12 lg:py-20 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-20 bg-[#C8782A]/10 rounded" />
            <div className="h-3 w-3 bg-[#C8782A]/10 rounded-full" />
            <div className="h-4 w-24 bg-[#C8782A]/20 rounded" />
          </div>

          <div className="h-4 w-28 bg-[#C8782A]/15 rounded mb-3" />
          <div className="h-10 w-64 bg-[#C8782A]/15 rounded mb-8 sm:mb-10" />

          <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
            <div className="flex-1 max-w-4xl bg-white rounded-3xl p-6 sm:p-10 border border-[#C8782A]/10 shadow-sm">
              {[1, 2, 3].map((section) => (
                <div key={section} className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-full bg-[#C8782A]/20" />
                    <div className="h-6 w-48 bg-neutral-200 rounded" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-neutral-200 rounded" />
                      <div className="h-11 w-full bg-neutral-100 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-neutral-200 rounded" />
                      <div className="h-11 w-full bg-neutral-100 rounded-xl" />
                    </div>
                    {section === 2 && (
                      <div className="space-y-2 md:col-span-2 mt-4">
                        <div className="h-4 w-32 bg-neutral-200 rounded" />
                        <div className="h-32 w-full bg-neutral-100 rounded-xl" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4 border-t border-[#C8782A]/10">
                <div className="h-11 w-32 bg-[#C8782A]/20 rounded-xl" />
                <div className="h-11 w-24 bg-neutral-200 rounded-xl" />
              </div>
            </div>

            <div className="xl:w-[380px] flex-shrink-0 space-y-5 hidden xl:block">
              <div className="bg-white rounded-2xl p-6 border border-[#C8782A]/10 h-[400px]">
                <div className="h-6 w-32 bg-neutral-200 rounded mb-6" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-neutral-100 rounded" />
                  <div className="h-4 w-5/6 bg-neutral-100 rounded" />
                  <div className="h-4 w-4/6 bg-neutral-100 rounded" />
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
    <div className="flex gap-2.5 bg-[#1a64c4]/6 border border-[#1a64c4]/15 rounded-xl px-4 py-3">
      <Info size={14} className="text-[#1a64c4] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[#1a64c4]/80 leading-relaxed">{children}</p>
    </div>
  );
}

/* ── Section heading ────────────────────────────────────────────────── */
function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-7 h-7 rounded-full bg-[#C8782A] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{step}</span>
      </div>
      <h2
        className="text-xl font-bold text-[#1C1C1C]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
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
        return <Mail size={16} className="text-[#C8782A]" />;
      case "phone":
        return <Phone size={16} className="text-[#C8782A]" />;
      case "mail":
        return <MapPin size={16} className="text-[#C8782A]" />;
      case "inPerson":
        return <Building2 size={16} className="text-[#C8782A]" />;
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
    <div className="bg-[#FAF5EE] rounded-xl p-4 border border-[#C8782A]/15 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-sm text-[#1C1C1C]">{getTitle()}</h3>
        </div>
        {isRemovable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {method === "email" && (
          <div>
            <Label className="text-xs text-[#6B3A2A] font-medium">
              Email Address *
            </Label>
            <Input
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="jobs@company.com"
              className="mt-1 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30"
            />
            {errors?.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        )}

        {method === "phone" && (
          <div>
            <Label className="text-xs text-[#6B3A2A] font-medium">
              Phone Number *
            </Label>
            <Input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30"
            />
            {errors?.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        )}

        {method === "mail" && (
          <div>
            <Label className="text-xs text-[#6B3A2A] font-medium">
              Mailing Address *
            </Label>
            <Input
              value={data.mailAddress || ""}
              onChange={(e) => onChange("mailAddress", e.target.value)}
              placeholder="123 Street Name, City, Province, Postal Code"
              className="mt-1 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30"
            />
            {errors?.mailAddress && (
              <p className="text-xs text-red-500 mt-1">{errors.mailAddress}</p>
            )}
          </div>
        )}

        {method === "inPerson" && (
          <>
            <div>
              <Label className="text-xs text-[#6B3A2A] font-medium">
                Office Address *
              </Label>
              <Input
                value={data.inPersonAddress || ""}
                onChange={(e) => onChange("inPersonAddress", e.target.value)}
                placeholder="123 Business Ave, Suite 100, City, Province"
                className="mt-1 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30"
              />
              {errors?.inPersonAddress && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.inPersonAddress}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs text-[#6B3A2A] font-medium">
                Available Hours / Time Slots *
              </Label>
              <Input
                value={data.inPersonTiming || ""}
                onChange={(e) => onChange("inPersonTiming", e.target.value)}
                placeholder="Monday-Friday, 9AM to 5PM"
                className="mt-1 border-[#C8782A]/20 placeholder:text-[#1C1C1C]/30"
              />
              {errors?.inPersonTiming && (
                <p className="text-xs text-red-500 mt-1">
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
      <section className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#C8782A]/10 text-center shadow-lg mx-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#7A9E7E]/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-[#7A9E7E]" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Posting Submitted!
          </h1>
          <p className="text-[#6B3A2A]/70 leading-relaxed mb-2">
            Thank you, <strong>{contactName}</strong> from{" "}
            <strong>{company}</strong>. Your job posting for{" "}
            <strong>{title}</strong> has been received.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/employers/dashboard" className="w-full sm:w-auto">
              <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8 w-full sm:w-auto">
                Employer Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-[#C8782A]/30 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black w-full sm:w-auto"
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
      <section className="bg-[#FAF5EE] py-12 lg:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 text-sm text-[#6B3A2A]/60 mb-4 flex-wrap"
            >
              <Link
                href="/employers/dashboard"
                className="hover:text-[#C8782A] transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight size={14} />
              <span className="text-[#C8782A] font-medium">
                {isEditMode ? "Edit Job" : "Post a Job"}
              </span>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Employers
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isEditMode ? "Edit Job Posting" : "Post a Job"}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 text-base sm:text-lg max-w-xl leading-relaxed"
            >
              {isEditMode
                ? "Update your job posting to attract the right candidates."
                : "Reach thousands of qualified Indigenous job seekers across Canada."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={1} title="Job Details" />
                <div className="flex flex-col gap-5">
                  {/* Job ID - Display only in edit mode */}
                  {isEditMode && displayJobId && (
                    <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#C8782A]/15 mb-2">
                      <Label className="text-[#6B3A2A] font-medium text-sm flex items-center gap-2">
                        <Info size={14} className="text-[#C8782A]" />
                        Job ID
                      </Label>
                      <p className="font-mono text-base font-semibold text-[#1C1C1C] mt-1">
                        {displayJobId}
                      </p>
                      <p className="text-xs text-[#6B3A2A]/50 mt-1">
                        This ID is auto-generated and cannot be changed
                      </p>
                    </div>
                  )}

                  {/* Job Title */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Job Title <span className="text-[#C8782A]">*</span>
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
                      className="placeholder:text-[#1C1C1C]/30"
                    />
                    {errors.title && touched.title && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle size={12} /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Company + Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Company / Organization{" "}
                        <span className="text-[#C8782A]">*</span>
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
                        className="placeholder:text-[#1C1C1C]/30"
                      />
                      {errors.company && touched.company && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.company}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
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
                        className="placeholder:text-[#1C1C1C]/30"
                      />
                      {errors.website && touched.website && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.website}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        City / Community{" "}
                        <span className="text-[#C8782A]">*</span>
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
                        className="placeholder:text-[#1C1C1C]/30"
                      />
                      {errors.city && touched.city && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Province / Territory{" "}
                        <span className="text-[#C8782A]">*</span>
                      </Label>
                      <select
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          if (errors.province)
                            setErrors((prev) => ({ ...prev, province: "" }));
                        }}
                        onBlur={() => markTouched("province")}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5"
                      >
                        <option value="">Select province</option>
                        {provinces.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                      {errors.province && touched.province && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.province}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Type + Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Employment Type{" "}
                        <span className="text-[#C8782A]">*</span>
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
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5"
                      >
                        <option value="">Select type</option>
                        {employmentTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      {errors.employmentType && touched.employmentType && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.employmentType}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Salary (CAD){" "}
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
                          className="flex-1 placeholder:text-[#1C1C1C]/30"
                        />
                        <select
                          value={salaryType}
                          onChange={(e) => setSalaryType(e.target.value)}
                          className="rounded-md border border-[#C8782A]/20 bg-white px-3"
                        >
                          <option value="hour">Per Hour</option>
                          <option value="week">Per Week</option>
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                        </select>
                      </div>
                      {errors.salary && touched.salary && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.salary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* NOC Code + Run Days */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        NOC Code <span className="text-[#C8782A]">*</span>
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
                        className="placeholder:text-[#1C1C1C]/30"
                      />
                      {errors.nocCode && touched.nocCode && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle size={12} /> {errors.nocCode}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Run Ad For
                      </Label>
                      <select
                        value={runDays}
                        onChange={(e) => setRunDays(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5"
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
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Experience Required
                      </Label>
                      <Input
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 2+ years"
                        className="placeholder:text-[#1C1C1C]/30"
                      />
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Expected Start Date
                      </Label>
                      <select
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5"
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

                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Vacancies Available{" "}
                      <span className="text-[#C8782A]">*</span>
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
                      className="placeholder:text-[#1C1C1C]/30"
                    />

                    {errors.vacancies && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <XCircle size={12} /> {errors.vacancies}
                      </p>
                    )}
                  </div>
                  {/* Category */}
                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Job Category <span className="text-[#C8782A]">*</span>
                    </Label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category)
                          setErrors((prev) => ({ ...prev, category: "" }));
                      }}
                      onBlur={() => markTouched("category")}
                      className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5"
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && touched.category && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle size={12} /> {errors.category}
                      </p>
                    )}
                  </div>
                  {/* Employer Contact Name */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Employer Contact Name{" "}
                      <span className="text-[#C8782A]">*</span>
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
                      className="placeholder:text-[#1C1C1C]/30"
                    />
                    {errors.contactName && touched.contactName && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle size={12} /> {errors.contactName}
                      </p>
                    )}
                  </div>

                  {/* Post Date - Only in Edit Mode */}
                  {isEditMode && (
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">
                        Post Date (Display Date)
                      </Label>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40"
                        />
                        <Input
                          type="date"
                          value={postDate}
                          onChange={(e) => setPostDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                          className="pl-9 border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                        />
                      </div>
                      <p className="text-xs text-[#6B3A2A]/50 mt-1">
                        Only today&apos;s date can be selected.
                      </p>
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch
                        checked={remote}
                        onCheckedChange={setRemote}
                        className="data-[state=checked]:bg-[#C8782A]"
                      />
                      <span className="text-sm text-[#6B3A2A] font-medium">
                        Remote / Hybrid available
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch
                        checked={indigenous}
                        onCheckedChange={setIndigenous}
                        className="data-[state=checked]:bg-[#7A9E7E]"
                      />
                      <span className="text-sm text-[#6B3A2A] font-medium">
                        Indigenous-owned organization
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={2} title="Job Description" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Use plain, welcoming language.{" "}
                    <strong>Maximum 5000 characters per field.</strong>
                  </Tip>
                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      About the Role <span className="text-[#C8782A]">*</span>
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
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <XCircle size={12} /> {errors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Qualifications & Requirements{" "}
                      <span className="text-[#C8782A]">*</span>
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
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <XCircle size={12} /> {errors.requirements}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* How to Apply */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={3} title="How to Apply" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Select one or more methods. At least one method is required.
                  </Tip>

                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <Label className="text-xs text-[#6B3A2A] font-medium">
                        Add Application Method
                      </Label>
                      <select
                        value={selectedMethodToAdd}
                        onChange={(e) => setSelectedMethodToAdd(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 mt-1"
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
                      className="bg-[#C8782A] hover:bg-[#B06820] text-white"
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
                    className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-10"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />{" "}
                        Processing...
                      </span>
                    ) : isEditMode ? (
                      "Update Job"
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                  <Link href="/employers/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#C8782A]/25"
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
                <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10">
                  <h4
                    className="font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Why Post with Us?
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {[
                      "15,000+ active Indigenous job seekers",
                      "Canada-wide reach",
                      "Culturally respectful platform",
                      "Dedicated employer support",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#6B3A2A]/75"
                      >
                        <CheckCircle
                          size={14}
                          className="text-[#7A9E7E] flex-shrink-0 mt-0.5"
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
