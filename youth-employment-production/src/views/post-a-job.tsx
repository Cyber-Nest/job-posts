"use client";

import { useState, useCallback, useEffect } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Link, useNavigate } from "@/router";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  ChevronRight,
  Send,
  Info,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/RichTextEditor";
import JobPostingPreview, {
  type JobPostingData,
} from "@/components/JobPostingPreview";

/* ── Validation Functions ─────────────────────────────────────────────── */
const validations = {
  name: (value: string): string | null => {
    if (!value.trim()) return null;
    const nameRegex = /^[A-Za-z\s\-\'À-ÿ]+$/;
    if (!nameRegex.test(value)) {
      return "Only letters, spaces, hyphens, and apostrophes allowed";
    }
    if (value.length < 2) return "Must be at least 2 characters";
    if (value.length > 100) return "Must be less than 100 characters";
    return null;
  },
  company: (value: string): string | null => {
    if (!value.trim()) return null;
    const companyRegex = /^[A-Za-z0-9\s\&\-\.\']+$/;
    if (!companyRegex.test(value)) {
      return "Only letters, numbers, spaces, &, ., - allowed";
    }
    if (value.length < 2) return "Must be at least 2 characters";
    if (value.length > 100) return "Must be less than 100 characters";
    return null;
  },
  city: (value: string): string | null => {
    if (!value.trim()) return null;
    const cityRegex = /^[A-Za-z\s\-\.\']+$/;
    if (!cityRegex.test(value)) {
      return "Only letters, spaces, hyphens, periods, and apostrophes allowed";
    }
    if (value.length < 2) return "Must be at least 2 characters";
    return null;
  },
  email: (value: string): string | null => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Enter a valid email address (e.g., name@company.com)";
    }
    return null;
  },
  phone: (value: string): string | null => {
    if (!value.trim()) return null;
    const phoneRegex = /^[\+\s\-\(\)0-9]{10,20}$/;
    if (!phoneRegex.test(value)) {
      return "Enter a valid phone number (e.g., 403-555-1234)";
    }
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) return "Phone number must have at least 10 digits";
    if (digits.length > 15) return "Phone number is too long";
    return null;
  },
  website: (value: string): string | null => {
    if (!value.trim()) return null;
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlRegex.test(value)) {
      return "Enter a valid website URL (e.g., https://example.com)";
    }
    return null;
  },
  salary: (value: string): string | null => {
    if (!value.trim()) return null;
    const salaryRegex = /^[\d,.]+$/;
    if (!salaryRegex.test(value)) {
      return "Salary should contain only numbers, commas, and decimals";
    }
    return null;
  },
  jobTitle: (value: string): string | null => {
    if (!value.trim()) return "Job title is required";
    if (value.length < 5) return "Job title must be at least 5 characters";
    if (value.length > 150) return "Job title must be less than 150 characters";
    return null;
  },
  description: (value: string): string | null => {
    if (!value.trim()) return "Job description is required";
    const textOnly = value.replace(/<[^>]*>/g, "");
    if (textOnly.length < 20) {
      return "Description must be at least 20 characters (without HTML tags)";
    }
    if (textOnly.length > 5000)
      return "Description is too long (max 5000 characters)";
    return null;
  },
  required: (value: string): string | null => {
    if (!value.trim()) return "This field is required";
    return null;
  },
};

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
  "Restaurant and Food Service",
  "Sales & Customer Service",
  "Science & Research",
  "Security & Law Enforcement",
  "Transportation & Logistics",
];

const positionTypes = [
  "Full-Time Permanent",
  "Full-Time Temporary",
  "Part-Time Permanent",
  "Part-Time Temporary",
];

const travelOptions = ["None", "Occasionally", "Frequently", "Required"];

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

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
      <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-800 leading-relaxed">{children}</p>
    </div>
  );
}

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{step}</span>
      </div>
      <h2
        className="text-xl font-bold text-gray-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-xs">
      <XCircle size={12} />
      <span>{message}</span>
    </div>
  );
}

/* ── Main Page with Edit Mode Support ────────────────────────────────── */
interface PostAJobPageProps {
  editMode?: boolean;
  initialData?: any;
}

export default function PostAJobPage({
  editMode = false,
  initialData = null,
}: PostAJobPageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedJob, setSubmittedJob] = useState<null | {
    id: string;
    jobUniqueId: string;
    title: string;
    company: string;
  }>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [company, setCompany] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [province, setProvince] = useState("");
  const [provinceError, setProvinceError] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [employmentTypeError, setEmploymentTypeError] = useState("");
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("");
  const [salaryPeriodError, setSalaryPeriodError] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [adDurationDays, setAdDurationDays] = useState("90");
  const [startDate, setStartDate] = useState("");
  const [positionType, setPositionType] = useState("Full-Time Permanent");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [travel, setTravel] = useState("None");
  const [vacation, setVacation] = useState("");
  const [nocCode, setNocCode] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNameError, setContactNameError] = useState("");
  const [contactType, setContactType] = useState("Employer");
  const [companyName, setCompanyName] = useState("");
  const [applicationEmail, setApplicationEmail] = useState("");
  const [applicationEmailError, setApplicationEmailError] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [inPersonAddress, setInPersonAddress] = useState("");
  const [inPersonFromTime, setInPersonFromTime] = useState("");
  const [inPersonToTime, setInPersonToTime] = useState("");
  const [byEmail, setByEmail] = useState(false);
  const [byMail, setByMail] = useState(false);
  const [byPhone, setByPhone] = useState(false);
  const [inPerson, setInPerson] = useState(false);
  const [website, setWebsite] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [descHtml, setDescHtml] = useState("");
  const [descHtmlError, setDescHtmlError] = useState("");
  const [reqHtml, setReqHtml] = useState("");
  const [indigenous, setIndigenous] = useState(false);
  const [remote, setRemote] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load initial data for edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setTitle(initialData.title || "");
      setCompany(initialData.company || "");
      setCity(initialData.location?.split(",")[0]?.trim() || "");
      setProvince(initialData.province || "");
      setEmploymentType(initialData.employmentType || "");
      setCategory(initialData.category || "");
      setSalary(initialData.salary || "");
      setSalaryPeriod(initialData.salaryPeriod || "");
      setVacancies(initialData.vacancies || "");
      setAdDurationDays(String(initialData.adDurationDays || "90"));
      setStartDate(initialData.startDate || "");
      setPositionType(initialData.positionType || "Full-Time Permanent");
      setExperience(initialData.experience || "");
      setEducation(initialData.education || "");
      setTravel(initialData.travel || "None");
      setVacation(initialData.vacation || "");
      setNocCode(initialData.nocCode || "");
      setContactName(initialData.contactName || "");
      setContactType(initialData.contactType || "Employer");
      setCompanyName(initialData.companyName || "");
      setWebsite(initialData.website || "");
      setDescHtml(initialData.descriptionHtml || "");
      setReqHtml(initialData.requirementsHtml || "");
      setRemote(initialData.remote || false);
      setIndigenous(initialData.indigenous || false);
      // Application methods
      const howToApply = initialData.howToApply || {};
      setByEmail(howToApply.byEmail || false);
      setApplicationEmail(howToApply.email || "");
      setByMail(howToApply.byMail || false);
      setMailingAddress(howToApply.mailingAddress || "");
      setByPhone(howToApply.byPhone || false);
      setPhone(howToApply.phone || "");
      setInPerson(howToApply.inPerson || false);
      setInPersonAddress(howToApply.inPersonAddress || "");
      setInPersonFromTime(howToApply.inPersonFromTime || "");
      setInPersonToTime(howToApply.inPersonToTime || "");
    }
  }, [editMode, initialData]);

  // Validation functions
  const validateTitle = useCallback((value: string) => {
    const error = validations.jobTitle(value);
    setTitleError(error || "");
    return !error;
  }, []);

  const validateCompany = useCallback((value: string) => {
    const error = validations.company(value);
    setCompanyError(error || "");
    return !error;
  }, []);

  const validateCity = useCallback((value: string) => {
    const error = validations.city(value);
    setCityError(error || "");
    return !error;
  }, []);

  const validateProvince = useCallback((value: string) => {
    const error = validations.required(value);
    setProvinceError(error || "");
    return !error;
  }, []);

  const validateEmploymentType = useCallback((value: string) => {
    const error = validations.required(value);
    setEmploymentTypeError(error || "");
    return !error;
  }, []);

  const validateCategory = useCallback((value: string) => {
    const error = validations.required(value);
    setCategoryError(error || "");
    return !error;
  }, []);

  const validateSalary = useCallback((value: string) => {
    const error = validations.salary(value);
    setSalaryError(error || "");
    return !error;
  }, []);

  const validateSalaryPeriod = useCallback(
    (value: string, salaryVal: string) => {
      if (salaryVal.trim() && !value.trim()) {
        setSalaryPeriodError("Salary period is required when salary is provided");
        return false;
      }
      setSalaryPeriodError("");
      return true;
    },
    [],
  );

  const validateContactName = useCallback((value: string) => {
    const error = validations.name(value);
    setContactNameError(error || "");
    return !error;
  }, []);

  const validateWebsite = useCallback((value: string) => {
    const error = validations.website(value);
    setWebsiteError(error || "");
    return !error;
  }, []);

  const validateDescription = useCallback((value: string) => {
    const error = validations.description(value);
    setDescHtmlError(error || "");
    return !error;
  }, []);

  const validateApplicationEmail = useCallback(
    (value: string) => {
      if (byEmail && !value.trim()) {
        setApplicationEmailError("Email is required when By Email is selected");
        return false;
      }
      if (byEmail && value.trim()) {
        const error = validations.email(value);
        setApplicationEmailError(error || "");
        return !error;
      }
      setApplicationEmailError("");
      return true;
    },
    [byEmail],
  );

  const validatePhone = useCallback(
    (value: string) => {
      if (byPhone && !value.trim()) {
        setPhoneError("Phone number is required when By Phone is selected");
        return false;
      }
      if (byPhone && value.trim()) {
        const error = validations.phone(value);
        setPhoneError(error || "");
        return !error;
      }
      setPhoneError("");
      return true;
    },
    [byPhone],
  );

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Auto-validation on change
  useEffect(() => {
    if (touched.title) validateTitle(title);
  }, [title, touched.title, validateTitle]);

  useEffect(() => {
    if (touched.company) validateCompany(company);
  }, [company, touched.company, validateCompany]);

  useEffect(() => {
    if (touched.city) validateCity(city);
  }, [city, touched.city, validateCity]);

  useEffect(() => {
    if (touched.province) validateProvince(province);
  }, [province, touched.province, validateProvince]);

  useEffect(() => {
    if (touched.employmentType) validateEmploymentType(employmentType);
  }, [employmentType, touched.employmentType, validateEmploymentType]);

  useEffect(() => {
    if (touched.category) validateCategory(category);
  }, [category, touched.category, validateCategory]);

  useEffect(() => {
    if (touched.salary) validateSalary(salary);
  }, [salary, touched.salary, validateSalary]);

  useEffect(() => {
    if (touched.salaryPeriod || touched.salary) {
      validateSalaryPeriod(salaryPeriod, salary);
    }
  }, [salaryPeriod, salary, touched.salaryPeriod, touched.salary, validateSalaryPeriod]);

  useEffect(() => {
    if (touched.contactName) validateContactName(contactName);
  }, [contactName, touched.contactName, validateContactName]);

  useEffect(() => {
    if (touched.website) validateWebsite(website);
  }, [website, touched.website, validateWebsite]);

  useEffect(() => {
    if (touched.descHtml) validateDescription(descHtml);
  }, [descHtml, touched.descHtml, validateDescription]);

  useEffect(() => {
    if (touched.applicationEmail) validateApplicationEmail(applicationEmail);
  }, [applicationEmail, touched.applicationEmail, validateApplicationEmail]);

  useEffect(() => {
    if (touched.phone) validatePhone(phone);
  }, [phone, touched.phone, validatePhone]);

  const formattedSalary = salary
    ? `${salary}${salaryPeriod ? ` / ${salaryPeriod}` : ""}`
    : "";
  const location = [city, province].filter(Boolean).join(", ");

  const previewData: JobPostingData = {
    title,
    company,
    location,
    employmentType,
    salary: formattedSalary,
    descriptionHtml: descHtml,
    requirementsHtml: reqHtml,
    indigenous,
    remote,
    packageName: "",
    featured: false,
    category,
    startDate,
    positionType,
    experience,
    education,
    travel,
    vacation,
    nocCode,
    howToApply: {
      byEmail,
      email: byEmail ? applicationEmail : null,
      byMail,
      mailingAddress: byMail ? mailingAddress : null,
      byPhone,
      phone: byPhone ? phone : null,
      inPerson,
      inPersonAddress: inPerson ? inPersonAddress : null,
      inPersonFromTime: inPerson ? inPersonFromTime : null,
      inPersonToTime: inPerson ? inPersonToTime : null,
    },
  };

  const handleDescHtml = useCallback(
    (html: string) => {
      setDescHtml(html);
      if (touched.descHtml) validateDescription(html);
    },
    [touched.descHtml, validateDescription],
  );

  const handleReqHtml = useCallback((html: string) => setReqHtml(html), []);

  const validateForm = (): boolean => {
    const fieldsToValidate = [
      { value: title, validator: () => validateTitle(title), field: "title" },
      {
        value: company,
        validator: () => validateCompany(company),
        field: "company",
      },
      { value: city, validator: () => validateCity(city), field: "city" },
      {
        value: province,
        validator: () => validateProvince(province),
        field: "province",
      },
      {
        value: employmentType,
        validator: () => validateEmploymentType(employmentType),
        field: "employmentType",
      },
      {
        value: category,
        validator: () => validateCategory(category),
        field: "category",
      },
      {
        value: descHtml,
        validator: () => validateDescription(descHtml),
        field: "descHtml",
      },
      {
        value: salaryPeriod,
        validator: () => validateSalaryPeriod(salaryPeriod, salary),
        field: "salaryPeriod",
      },
    ];

    fieldsToValidate.forEach((f) =>
      setTouched((prev) => ({ ...prev, [f.field]: true })),
    );
    setTouched((prev) => ({
      ...prev,
      applicationEmail: true,
      phone: true,
      contactName: true,
      website: true,
      salary: true,
      salaryPeriod: true,
    }));

    let isValid = true;
    for (const field of fieldsToValidate) {
      if (!field.validator()) isValid = false;
    }

    if (byEmail && !validateApplicationEmail(applicationEmail)) isValid = false;
    if (byPhone && !validatePhone(phone)) isValid = false;
    if (contactName && !validateContactName(contactName)) isValid = false;
    if (website && !validateWebsite(website)) isValid = false;

    if (!byEmail && !byMail && !byPhone && !inPerson) {
      setServerError("Select at least one application method.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      toast.error("Please fix the errors above before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const url = editMode ? `/api/jobs/${initialData?.id}` : "/api/jobs";
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          city,
          province,
          employmentType,
          salary: salary.replace(/,/g, ""),
          salaryPeriod,
          vacancies: vacancies ? Number(vacancies) : null,
          adDurationDays,
          category,
          startDate: startDate.trim() || null,
          positionType: positionType.trim() || null,
          experience: experience.trim() || null,
          education: education.trim() || null,
          travel: travel.trim() || null,
          vacation: vacation.trim() || null,
          nocCode: nocCode.trim() || null,
          contactName: contactName.trim() || null,
          contactType: contactType.trim() || null,
          companyName: companyName.trim() || null,
          descriptionHtml: descHtml,
          requirementsHtml: reqHtml,
          indigenousOwned: indigenous,
          website: website.trim() || null,
          remote: remote,
          howToApply: {
            byEmail,
            email: byEmail ? applicationEmail : null,
            byMail,
            mailingAddress: byMail ? mailingAddress : null,
            byPhone,
            phone: byPhone ? phone : null,
            inPerson,
            inPersonAddress: inPerson ? inPersonAddress : null,
            inPersonFromTime: inPerson ? inPersonFromTime : null,
            inPersonToTime: inPerson ? inPersonToTime : null,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || "Failed to save job posting.";
        setServerError(errMsg);
        toast.error(errMsg);
        setLoading(false);
        return;
      }

      if (editMode) {
        toast.success("Job posting updated successfully!");
        navigate("/dashboard");
      } else {
        setSubmittedJob(data.job ?? null);
        setSubmitted(true);
        toast.success("Job posting published successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      const errMsg =
        "Network error. Please check your connection and try again.";
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Success state (only for create mode)
  if (submitted && !editMode) {
    return (
      <>
        <Helmet>
          <title>Job Submitted — Youth Employment Canada</title>
        </Helmet>
        <section className="bg-blue-50 min-h-[70vh] flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full bg-white rounded-3xl p-10 border border-blue-200 text-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-blue-600" />
            </div>
            <h1
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Posting Submitted!
            </h1>
            <p className="text-gray-600 leading-relaxed mb-2">
              Thank you, <strong>{submittedJob?.company || company}</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed mb-2">
              Your job posting for{" "}
              <strong>{submittedJob?.title || title}</strong> has been
              published.
            </p>
            {submittedJob?.jobUniqueId && (
              <p className="text-gray-500 text-sm mb-2">
                <strong>Job ID:</strong> {submittedJob.jobUniqueId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link to={`/jobs/${submittedJob?.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                  View Job
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-500"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  // Main form
  return (
    <>
      <Helmet>
        <title>
          {editMode
            ? "Edit Job — Youth Employment Canada"
            : "Post a Job — Youth Employment Canada"}
        </title>
        <meta
          name="description"
          content={
            editMode
              ? "Edit your job posting on Youth Employment Canada."
              : "Post a job on Youth Employment Canada and connect with skilled youth job seekers across Canada."
          }
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-blue-50 py-14 lg:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 text-sm text-gray-500 mb-4"
            >
              <Link
                to="/employers"
                className="hover:text-blue-600 transition-colors"
              >
                Employers
              </Link>
              <ChevronRight size={14} />
              <span className="text-blue-600 font-medium">
                {editMode ? "Edit Job" : "Post a Job"}
              </span>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Employers
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {editMode ? "Edit Job" : "Post a Job"}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 text-lg max-w-xl leading-relaxed"
            >
              {editMode
                ? "Update your job posting details below."
                : "Reach thousands of qualified Youth across Canada."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-white py-10 lg:py-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
            {/* LEFT: Form */}
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              {/* Step 1 — Job Details */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-blue-100">
                <SectionHeading step={1} title="Job Details" />
                <div className="flex flex-col gap-5">
                  {/* Job Title */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Job Title <span className="text-blue-600">*</span>
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => handleBlur("title")}
                      placeholder="e.g. Community Health Worker"
                      className={`border ${titleError && touched.title ? "border-red-500 focus-visible:ring-red-300" : "border-blue-200 focus-visible:ring-blue-300"}`}
                    />
                    <ErrorMessage
                      message={touched.title ? titleError : undefined}
                    />
                  </div>

                  {/* Company & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Company / Organization{" "}
                        <span className="text-blue-600">*</span>
                      </Label>
                      <Input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        onBlur={() => handleBlur("company")}
                        placeholder="Your organization name"
                        className={`border ${companyError && touched.company ? "border-red-500" : "border-blue-200"}`}
                      />
                      <ErrorMessage
                        message={touched.company ? companyError : undefined}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Website
                      </Label>
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        onBlur={() => handleBlur("website")}
                        placeholder="https://yourorganization.ca"
                        className={`border ${websiteError && touched.website ? "border-red-500" : "border-blue-200"}`}
                      />
                      <ErrorMessage
                        message={touched.website ? websiteError : undefined}
                      />
                    </div>
                  </div>

                  {/* City & Province */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        City / Community{" "}
                        <span className="text-blue-600">*</span>
                      </Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => handleBlur("city")}
                        placeholder="e.g. Edmonton"
                        className={`border ${cityError && touched.city ? "border-red-500" : "border-blue-200"}`}
                      />
                      <ErrorMessage
                        message={touched.city ? cityError : undefined}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Province / Territory{" "}
                        <span className="text-blue-600">*</span>
                      </Label>
                      <select
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setTouched((prev) => ({ ...prev, province: true }));
                        }}
                        onBlur={() => handleBlur("province")}
                        className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                          provinceError && touched.province
                            ? "border-red-500 focus:ring-red-300"
                            : "border-blue-200 focus:ring-blue-300"
                        }`}
                      >
                        <option value="">Select province / territory</option>
                        {provinces.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                      <ErrorMessage
                        message={touched.province ? provinceError : undefined}
                      />
                    </div>
                  </div>

                  {/* Employment Type & Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Employment Type <span className="text-blue-600">*</span>
                      </Label>
                      <select
                        value={employmentType}
                        onChange={(e) => {
                          setEmploymentType(e.target.value);
                          setTouched((prev) => ({ ...prev, employmentType: true }));
                        }}
                        onBlur={() => handleBlur("employmentType")}
                        className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                          employmentTypeError && touched.employmentType
                            ? "border-red-500 focus:ring-red-300"
                            : "border-blue-200 focus:ring-blue-300"
                        }`}
                      >
                        <option value="">Select type</option>
                        {employmentTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <ErrorMessage
                        message={
                          touched.employmentType
                            ? employmentTypeError
                            : undefined
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-2">
                        <Label className="text-gray-700 font-medium text-sm">
                          Salary (CAD)
                        </Label>
                        <Input
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          onBlur={() => handleBlur("salary")}
                          placeholder="e.g. 55,000"
                          className={`border ${salaryError && touched.salary ? "border-red-500" : "border-blue-200"}`}
                        />
                        <ErrorMessage
                          message={touched.salary ? salaryError : undefined}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-gray-700 font-medium text-sm">
                          Per
                        </Label>
                        <select
                          value={salaryPeriod}
                          onChange={(e) => {
                            setSalaryPeriod(e.target.value);
                            setTouched((prev) => ({ ...prev, salaryPeriod: true }));
                          }}
                          onBlur={() => handleBlur("salaryPeriod")}
                          className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            salaryPeriodError && touched.salaryPeriod
                              ? "border-red-500 focus:ring-red-300"
                              : "border-blue-200 focus:ring-blue-300"
                          }`}
                        >
                          <option value="">Select</option>
                          <option value="Year">Year</option>
                          <option value="Month">Month</option>
                          <option value="Week">Week</option>
                          <option value="Day">Day</option>
                          <option value="Hour">Hour</option>
                        </select>
                        <ErrorMessage
                          message={touched.salaryPeriod ? salaryPeriodError : undefined}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ad Duration */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Ad Duration <span className="text-blue-600">*</span>
                    </Label>
                    <select
                      value={adDurationDays}
                      onChange={(e) => setAdDurationDays(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="90">90 days</option>
                      <option value="120">120 days</option>
                      <option value="150">150 days</option>
                      <option value="180">180 days</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Job Category <span className="text-blue-600">*</span>
                    </Label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setTouched((prev) => ({ ...prev, category: true }));
                      }}
                      onBlur={() => handleBlur("category")}
                      className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        categoryError && touched.category
                          ? "border-red-500 focus:ring-red-300"
                          : "border-blue-200 focus:ring-blue-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ErrorMessage
                      message={touched.category ? categoryError : undefined}
                    />
                  </div>

                  {/* Remote Switch */}
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={remote}
                      onCheckedChange={setRemote}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Remote / Hybrid available
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 — Job Criteria */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-blue-100">
                <SectionHeading step={2} title="Job Criteria" />
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Start Date
                      </Label>
                      <Input
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="e.g. Immediate, June 2026"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Vacancies
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={vacancies}
                        onChange={(e) => setVacancies(e.target.value)}
                        placeholder="e.g. 2, 4, 5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Position Type
                      </Label>
                      <select
                        value={positionType}
                        onChange={(e) => setPositionType(e.target.value)}
                        className="w-full rounded-md border border-blue-200 bg-white px-3 py-2"
                      >
                        {positionTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Experience
                      </Label>
                      <Input
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 2+ years"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Education
                      </Label>
                      <Input
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. Diploma, degree"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Travel Expectations
                      </Label>
                      <select
                        value={travel}
                        onChange={(e) => setTravel(e.target.value)}
                        className="w-full rounded-md border border-blue-200 bg-white px-3 py-2"
                      >
                        {travelOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Vacation
                      </Label>
                      <Input
                        value={vacation}
                        onChange={(e) => setVacation(e.target.value)}
                        placeholder="e.g. 2 weeks"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        NOC Code
                      </Label>
                      <Input
                        value={nocCode}
                        onChange={(e) => setNocCode(e.target.value)}
                        placeholder="e.g. 32100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 — Description */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-blue-100">
                <SectionHeading step={3} title="Job Description" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Use plain, welcoming language. Describe the role, team, and
                    what makes your organization great.
                  </Tip>
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      About the Role <span className="text-blue-600">*</span>
                    </Label>
                    <RichTextEditor
                      value={descHtml}
                      placeholder="Describe the role, responsibilities, and what makes your organization a great place to work…"
                      onHtmlChange={handleDescHtml}
                      minHeight={180}
                    />
                    <ErrorMessage
                      message={touched.descHtml ? descHtmlError : undefined}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Qualifications & Requirements
                    </Label>
                    <RichTextEditor
                      value={reqHtml}
                      placeholder="List required skills, education, experience, and any preferred qualifications…"
                      onHtmlChange={handleReqHtml}
                      minHeight={140}
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 — Application Instructions */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-blue-100">
                <SectionHeading step={4} title="Application Instructions" />
                <div className="flex flex-col gap-5">
                  <div className="grid gap-3">
                    {/* By Email */}
                    <label
                      className={`rounded-3xl border p-4 cursor-pointer transition-all ${byEmail ? "border-blue-400 bg-blue-50" : "border-blue-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={byEmail}
                          onChange={(e) => setByEmail(e.target.checked)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="font-semibold">By E-mail</span>
                      </div>
                      {byEmail && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium">
                            Application Email{" "}
                            <span className="text-blue-600">*</span>
                          </Label>
                          <Input
                            type="email"
                            value={applicationEmail}
                            onChange={(e) =>
                              setApplicationEmail(e.target.value)
                            }
                            onBlur={() => handleBlur("applicationEmail")}
                            placeholder="hr@company.ca"
                            className={`mt-1 ${applicationEmailError && touched.applicationEmail ? "border-red-500" : "border-blue-200"}`}
                          />
                          <ErrorMessage
                            message={
                              touched.applicationEmail
                                ? applicationEmailError
                                : undefined
                            }
                          />
                        </div>
                      )}
                    </label>

                    {/* By Mail */}
                    <label
                      className={`rounded-3xl border p-4 cursor-pointer transition-all ${byMail ? "border-blue-400 bg-blue-50" : "border-blue-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={byMail}
                          onChange={(e) => setByMail(e.target.checked)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="font-semibold">By Mail</span>
                      </div>
                      {byMail && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium">
                            Mailing Address
                          </Label>
                          <Input
                            value={mailingAddress}
                            onChange={(e) => setMailingAddress(e.target.value)}
                            placeholder="123 Main Street, Calgary, AB T1A 1A1"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </label>

                    {/* By Phone */}
                    <label
                      className={`rounded-3xl border p-4 cursor-pointer transition-all ${byPhone ? "border-blue-400 bg-blue-50" : "border-blue-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={byPhone}
                          onChange={(e) => setByPhone(e.target.checked)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="font-semibold">By Phone</span>
                      </div>
                      {byPhone && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium">
                            Phone Number{" "}
                            <span className="text-blue-600">*</span>
                          </Label>
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={() => handleBlur("phone")}
                            placeholder="403-555-1234"
                            className={`mt-1 ${phoneError && touched.phone ? "border-red-500" : "border-blue-200"}`}
                          />
                          <ErrorMessage
                            message={touched.phone ? phoneError : undefined}
                          />
                        </div>
                      )}
                    </label>

                    {/* In Person */}
                    <label
                      className={`rounded-3xl border p-4 cursor-pointer transition-all ${inPerson ? "border-blue-400 bg-blue-50" : "border-blue-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={inPerson}
                          onChange={(e) => setInPerson(e.target.checked)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="font-semibold">In Person</span>
                      </div>
                      {inPerson && (
                        <div className="mt-4 grid gap-4">
                          <Input
                            value={inPersonAddress}
                            onChange={(e) => setInPersonAddress(e.target.value)}
                            placeholder="Full address"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="From (e.g., 9:00 AM)"
                              value={inPersonFromTime}
                              onChange={(e) =>
                                setInPersonFromTime(e.target.value)
                              }
                            />
                            <Input
                              placeholder="To (e.g., 5:00 PM)"
                              value={inPersonToTime}
                              onChange={(e) =>
                                setInPersonToTime(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 5 — Contact Information */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-blue-100">
                <SectionHeading step={5} title="Contact Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Contact Name
                    </Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      onBlur={() => handleBlur("contactName")}
                      placeholder="Jane Doe"
                      className={`border ${contactNameError && touched.contactName ? "border-red-500" : "border-blue-200"}`}
                    />
                    <ErrorMessage
                      message={
                        touched.contactName ? contactNameError : undefined
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Contact Type
                    </Label>
                    <select
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2"
                    >
                      <option>Employer</option>
                      <option>HR</option>
                      <option>Recruiter</option>
                      <option>Hiring Manager</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-gray-700 font-medium text-sm">
                    Company (for contact)
                  </Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Organization name"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4">
                {serverError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} />
                    {serverError}
                  </div>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      {editMode ? "Saving..." : "Submitting..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {editMode ? "Update Job" : "Submit Job Posting"}
                      {!editMode && <Send size={15} />}
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>

            {/* RIGHT: Preview Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-5 xl:sticky xl:top-24"
            >
              <JobPostingPreview data={previewData} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
