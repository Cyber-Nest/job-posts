import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { collection } from "@/server/db/mongo";
import type {
  EmployerDoc,
  EmployerPackageDoc,
  EmploymentType,
  JobDoc,
} from "@/server/db/models";
import { getCurrentUser } from "@/server/auth/local-auth";

// const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Validation Regex
const nameRegex = /^[A-Za-z\s\-\'À-ÿ]+$/;
const companyRegex = /^[A-Za-z0-9\s\&\-\.\']+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+\s\-\(\)0-9]{10,20}$/;
const urlRegex =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// RESPONSE
function buildJobResponse(job: JobDoc) {
  const baseDate = job.jobPostingDate || job.createdAt;

  const postingDate = new Date(baseDate);

  const expiresAt = new Date(postingDate);

  expiresAt.setDate(expiresAt.getDate() + (job.adDurationDays || 90));

  return {
    id: job.id,
    jobUniqueId: job.jobUniqueId,

    title: job.title,
    company: job.company,

    location: job.location,
    province: job.province,

    employmentType: job.employmentType,
    category: job.category,

    salary: job.salary,
    salaryPeriod: job.salaryPeriod,

    vacancies: job.vacancies,

    startDate: job.startDate,
    positionType: job.positionType,
    experience: job.experience,
    education: job.education,
    travel: job.travel,
    vacation: job.vacation,

    nocCode: job.nocCode,

    contactName: job.contactName,
    contactType: job.contactType,
    contactCompany: job.contactCompany,

    description: job.description,
    requirements: job.requirements,

    website: job.website,

    remote: job.remote ?? false,
    indigenous: job.indigenousPreference ?? false,

    status: job.status,

    adDurationDays: job.adDurationDays,

    // DATE FIELDS
    jobPostingDate: postingDate.toISOString(),
    expiresAt: expiresAt.toISOString(),

    createdAt: job.createdAt,
    updatedAt: job.updatedAt,

    howToApply: {
      byEmail: job.applyByEmail,
      email: job.applicationEmail,

      byMail: job.applyByMail,
      mailingAddress: job.mailingAddress,

      byPhone: job.applyByPhone,
      phone: job.applicationPhone,

      inPerson: job.applyInPerson,
      inPersonAddress: job.inPersonAddress,
      inPersonFromTime: job.inPersonFromTime,
      inPersonToTime: job.inPersonToTime,
    },
  };
}

function buildJobListItem(job: JobDoc) {
  const baseDate = job.jobPostingDate || job.createdAt;

  const postingDate = new Date(baseDate);

  const expiresAt = new Date(postingDate);

  expiresAt.setDate(expiresAt.getDate() + (job.adDurationDays || 90));

  return {
    id: job.id,

    jobUniqueId: job.jobUniqueId,

    title: job.title,

    company: job.company,

    location: job.location,

    employmentType: job.employmentType,

    category: job.category,

    salary: job.salary,

    salaryPeriod: job.salaryPeriod,

    remote: job.remote ?? false,

    indigenous: job.indigenousPreference ?? false,

    jobPostingDate: postingDate.toISOString(),

    expiresAt: expiresAt.toISOString(),
  };
}

async function nextJobUniqueId() {
  const jobs = await collection<JobDoc>("jobs");

  const latest = await jobs
    .find({ jobUniqueId: /^YEC-\d+$/ })
    .sort({ jobUniqueId: -1 })
    .limit(1)
    .next();

  const maxNumber = latest
    ? Number(latest.jobUniqueId.replace("YEC-", "")) || 0
    : 0;

  return `YEC-${String(maxNumber + 1).padStart(6, "0")}`;
}

// GET
export async function GET(req: NextRequest) {
  const jobs = await collection<JobDoc>("jobs");

  const id = req.nextUrl.searchParams.get("id");

  // SINGLE JOB
  if (id) {
    const job = await jobs.findOne({
      id,
      status: "active",
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({
      job: buildJobResponse(job),
    });
  }

  // JOB LIST
  const rows = await jobs
    .find({ status: "active" })
    .sort({ jobPostingDate: -1 })
    .toArray();

  return NextResponse.json({
    jobs: rows.map(buildJobListItem),
  });
}

// POST
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));

  const {
    title,
    company,
    city,
    province,
    employmentType,
    salary,
    salaryPeriod,
    vacancies,
    adDurationDays,
    category,
    startDate,
    positionType,
    experience,
    education,
    travel,
    vacation,
    nocCode,
    contactName,
    contactType,
    companyName,
    descriptionHtml,
    requirementsHtml,
    indigenousOwned,
    howToApply,
    website,
    remote,
  } = body;

  const durationDays = Number(adDurationDays ?? 0);

  const methods = howToApply ?? {};

  const byEmail = Boolean(methods.byEmail);
  const byMail = Boolean(methods.byMail);
  const byPhone = Boolean(methods.byPhone);
  const inPerson = Boolean(methods.inPerson);

  const emailValue = String(methods.email ?? "").trim();
  const mailingValue = String(methods.mailingAddress ?? "").trim();
  const phoneValue = String(methods.phone ?? "").trim();

  const inPersonAddressValue = String(methods.inPersonAddress ?? "").trim();

  const inPersonFromValue = String(methods.inPersonFromTime ?? "").trim();

  const inPersonToValue = String(methods.inPersonToTime ?? "").trim();

  const websiteValue = String(website ?? "").trim();

  const contactNameValue = String(contactName ?? "").trim();

  const salaryValue = String(salary ?? "").trim();

  const vacanciesValue = vacancies ? Number(vacancies) : null;

  // REQUIRED VALIDATIONS
  if (!String(title ?? "").trim()) {
    return NextResponse.json(
      { error: "Job title is required." },
      { status: 400 },
    );
  }

  if (!String(company ?? "").trim()) {
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 },
    );
  }

  if (!String(city ?? "").trim()) {
    return NextResponse.json({ error: "City is required." }, { status: 400 });
  }

  if (!String(province ?? "").trim()) {
    return NextResponse.json(
      { error: "Province is required." },
      { status: 400 },
    );
  }

  if (!String(employmentType ?? "").trim()) {
    return NextResponse.json(
      { error: "Employment type is required." },
      { status: 400 },
    );
  }

  if (!String(category ?? "").trim()) {
    return NextResponse.json(
      { error: "Category is required." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(durationDays) || durationDays <= 0) {
    return NextResponse.json(
      { error: "Ad duration is required." },
      { status: 400 },
    );
  }

  if (!String(descriptionHtml ?? "").trim()) {
    return NextResponse.json(
      { error: "Job description is required." },
      { status: 400 },
    );
  }

  // EXTRA VALIDATIONS
  if (!companyRegex.test(String(company).trim())) {
    return NextResponse.json(
      {
        error:
          "Company name should contain only letters, numbers, spaces, &, ., -",
      },
      { status: 400 },
    );
  }

  if (!nameRegex.test(String(city).trim())) {
    return NextResponse.json(
      { error: "City should contain only letters and spaces" },
      { status: 400 },
    );
  }

  if (contactNameValue && !nameRegex.test(contactNameValue)) {
    return NextResponse.json(
      {
        error: "Contact name should contain only letters and spaces",
      },
      { status: 400 },
    );
  }

  if (websiteValue && !urlRegex.test(websiteValue)) {
    return NextResponse.json(
      {
        error: "Please enter a valid website URL",
      },
      { status: 400 },
    );
  }

  if (salaryValue && !/^[\d,.]+$/.test(salaryValue)) {
    return NextResponse.json(
      {
        error: "Salary should contain only numbers, commas, and decimals",
      },
      { status: 400 },
    );
  }

  if (salaryValue && !String(salaryPeriod ?? "").trim()) {
    return NextResponse.json(
      {
        error: "Salary period is required when salary is provided.",
      },
      { status: 400 },
    );
  }

  // APPLY VALIDATIONS
  if (!byEmail && !byMail && !byPhone && !inPerson) {
    return NextResponse.json(
      {
        error: "Select at least one application method.",
      },
      { status: 400 },
    );
  }

  if (byEmail && !emailRegex.test(emailValue)) {
    return NextResponse.json(
      {
        error: "A valid application email is required.",
      },
      { status: 400 },
    );
  }

  if (byMail && !mailingValue) {
    return NextResponse.json(
      {
        error: "A mailing address is required when By Mail is selected.",
      },
      { status: 400 },
    );
  }

  if (byPhone && !phoneRegex.test(phoneValue)) {
    return NextResponse.json(
      {
        error: "A valid phone number is required when By Phone is selected.",
      },
      { status: 400 },
    );
  }

  if (
    inPerson &&
    (!inPersonAddressValue || !inPersonFromValue || !inPersonToValue)
  ) {
    return NextResponse.json(
      {
        error: "In Person address and time range are required.",
      },
      { status: 400 },
    );
  }

  // EMPLOYER VALIDATION
  const employers = await collection<EmployerDoc>("employers");

  const employer = await employers.findOne({
    userId: user.id,
  });

  if (!employer) {
    return NextResponse.json(
      {
        error: "Employer profile not found.",
      },
      { status: 404 },
    );
  }

  // PACKAGE VALIDATION

  const packages = await collection<EmployerPackageDoc>("employerPackages");

  const employerPackage = await packages.findOne({
    employerId: employer.id,
  });

  if (!employerPackage) {
    return NextResponse.json(
      {
        error: "No active job posting package found.",
      },
      { status: 400 },
    );
  }

  if (employerPackage.status !== "Active") {
    return NextResponse.json(
      {
        error: "Your package is not active.",
      },
      { status: 403 },
    );
  }

  if (!employerPackage.unlimitedJobs && employerPackage.remainingCredits <= 0) {
    return NextResponse.json(
      {
        error: employerPackage.isFreePlan
          ? "Your free plan limit has ended. Please upgrade your package."
          : "No job posting credits remaining.",
      },
      {
        status: 403,
      },
    );
  }

  const typeMap: Record<string, EmploymentType> = {
    "Full-time": "Full-time",
    "Part-time": "Part-time",
    Contract: "Contract",
    "Casual / Seasonal": "Casual",
    Volunteer: "Contract",
  };

  const now = new Date();

  const jobId = randomUUID();

  const jobUniqueId = await nextJobUniqueId();

  const jobs = await collection<JobDoc>("jobs");

  // INSERT JOB

  await jobs.insertOne({
    id: jobId,

    jobUniqueId,

    employerId: employer.id,
    packageId: employerPackage.id,

    title: String(title).trim(),

    company: String(company).trim(),

    location: [String(city).trim(), String(province).trim()].join(", "),

    province: String(province).trim(),

    salary: salaryValue || null,

    salaryPeriod: String(salaryPeriod ?? "").trim() || null,

    vacancies: vacanciesValue,

    adDurationDays: durationDays,

    startDate: String(startDate ?? "").trim() || null,

    positionType: String(positionType ?? "").trim() || null,

    experience: String(experience ?? "").trim() || null,

    education: String(education ?? "").trim() || null,

    travel: String(travel ?? "").trim() || null,

    vacation: String(vacation ?? "").trim() || null,

    // MAIN DATE FIELD
    jobPostingDate: now.toISOString(),

    nocCode: String(nocCode ?? "").trim() || null,

    contactName: contactNameValue || null,

    contactType: String(contactType ?? "").trim() || null,

    contactCompany: String(companyName ?? "").trim() || null,

    applyByEmail: byEmail,

    applicationEmail: byEmail ? emailValue : null,

    applyByMail: byMail,

    mailingAddress: byMail ? mailingValue : null,

    applyByPhone: byPhone,

    applicationPhone: byPhone ? phoneValue : null,

    applyInPerson: inPerson,

    inPersonAddress: inPerson ? inPersonAddressValue : null,

    inPersonFromTime: inPerson ? inPersonFromValue : null,

    inPersonToTime: inPerson ? inPersonToValue : null,

    employmentType: typeMap[String(employmentType)] ?? "Full-time",

    category: String(category).trim(),

    description: String(descriptionHtml).trim(),

    requirements: String(requirementsHtml ?? "").trim() || null,

    status: "active",

    indigenousPreference: Boolean(indigenousOwned),

    remote: Boolean(remote ?? false),

    website: websiteValue || null,

    // IMPORTANT
    createdAt: now,
    updatedAt: now,
    postedAt: undefined,
  });

  // UPDATE PACKAGE

  // await packages.updateOne(
  //   { id: employerPackage.id },
  //   {
  //     $inc: {
  //       jobCredits: -1,
  //       jobsPosted: 1,
  //     },
  //     $set: {
  //       updatedAt: now,
  //     },
  //   },
  // );

  await packages.updateOne(
    {
      id: employerPackage.id,
    },
    {
      ...(employerPackage.unlimitedJobs
        ? {}
        : {
            $inc: {
              remainingCredits: -1,
            },
          }),

      $set: {
        updatedAt: now,
      },
    },
  );

  return NextResponse.json(
    {
      success: true,

      job: {
        id: jobId,

        jobUniqueId,

        title: String(title).trim(),

        company: String(company).trim(),

        jobPostingDate: now.toISOString(),
      },
    },
    { status: 201 },
  );
}
