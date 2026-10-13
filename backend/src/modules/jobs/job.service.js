import { Job } from "./job.model.js";
import { Employer } from "../employers/employer.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { generateJobId } from "../../utils/generateJobId.js";

export async function getAllJobs(queryParams) {
  const { category, province, employmentType, remote, search, site } = queryParams;
  const limit = parseInt(queryParams.limit || "20");
  const page = parseInt(queryParams.page || "1");
  const skip = (page - 1) * limit;

  const query = {
    status: "active",
    $and: [
      {
        $or: [
          { expiresAt: { $eq: null } },
          { expiresAt: { $gt: new Date() } },
        ],
      },
    ],
  };

  if (site && site !== "all") {
    query.site = site;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  if (province && province !== "all") {
    query.province = province;
  }

  if (employmentType && employmentType !== "all") {
    query.employmentType = employmentType;
  }

  if (remote === "true") {
    query.remote = true;
  }

  if (search?.trim()) {
    const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { company: { $regex: safeSearch, $options: "i" } },
      { category: { $regex: safeSearch, $options: "i" } },
      { descriptionHtml: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .sort({ postDate: -1, postedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Job.countDocuments(query),
  ]);

  const formattedJobs = jobs.map((job) => {
    let formattedExperience = "";
    if (job.experience) {
      if (!isNaN(Number(job.experience))) {
        const years = Number(job.experience);
        formattedExperience = `${years} ${years === 1 ? "year" : "years"}`;
      } else if (job.experience.includes("+") && !job.experience.toLowerCase().includes("year")) {
        formattedExperience = `${job.experience} year`;
      } else {
        formattedExperience = job.experience;
      }
    }

    return {
      _id: job._id,
      jobId: job.jobId || null,
      site: job.site || "getjobscanada",
      title: job.title || "",
      company: job.company || "",
      city: job.city || "",
      province: job.province || "",
      location: job.location || [job.city, job.province].filter(Boolean).join(", "),
      salary: job.salary ? `${job.salary}` : "",
      salaryType: job.salaryType || job.salaryPeriod || "hour",
      employmentType: job.employmentType || "",
      category: job.category || "",
      nocCode: job.nocCode || "",
      experience: formattedExperience,
      startDate:
        job.startDate === "immediate" || job.startDate === "asap"
          ? "Immediate"
          : job.startDate === "1week"
          ? "Within 1 week"
          : job.startDate || "",
      descriptionHtml: job.descriptionHtml || job.description || "",
      requirementsHtml: job.requirementsHtml || job.requirements || "",
      contactEmail: job.contactEmail || "",
      website: job.website || "",
      postDate: job.postDate || job.postedAt || job.createdAt || new Date(),
      remote: Boolean(job.remote),
      indigenousOwned: Boolean(job.indigenousOwned || job.indigenous),
      indigenousPreference: Boolean(job.indigenousPreference || job.indigenousOwned || job.indigenous),
      status: job.status || "active",
      vacancies: job.vacancies || 1,
      applyMethods: job.applyMethods || [],
    };
  });

  return {
    jobs: formattedJobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createJob(userId, jobData, siteFromHeader = null) {
  const targetSite = siteFromHeader || jobData.site || "getjobscanada";

  let employerRecord = await Employer.findOne({
    $or: [{ authUserId: String(userId) }, { authUserId: userId }],
  });
  if (!employerRecord) {
    employerRecord = await Employer.create({
      authUserId: String(userId),
      orgName: (jobData.company || "Employer").trim(),
      site: targetSite,
    });
  }

  // Active Package Verification
  let employerPackage = await EmployerPackage.findOne({
    employerId: employerRecord._id,
    status: "Active",
  });

  if (!employerPackage) {
    // If no package records exist at all, auto-provision 1 free credit
    const anyPkg = await EmployerPackage.findOne({ employerId: employerRecord._id });
    if (!anyPkg) {
      employerPackage = await EmployerPackage.create({
        employerId: employerRecord._id,
        packageName: "Free Plan",
        remainingCredits: 1,
        totalCreditsPurchased: 1,
        unlimitedJobs: false,
        isFreePlan: true,
        jobPostExpiryDays: 30,
        status: "Active",
        purchasedAt: new Date(),
      });
      employerRecord.currentPackageId = employerPackage._id;
      await employerRecord.save();
    }
  }

  if (!employerPackage) {
    const error = new Error("No active package found. Please purchase a package to post jobs.");
    error.statusCode = 403;
    throw error;
  }

  if (employerPackage.expiresAt && new Date(employerPackage.expiresAt) < new Date()) {
    const error = new Error("Your package has expired. Please upgrade your plan.");
    error.statusCode = 403;
    throw error;
  }

  if (!employerPackage.unlimitedJobs && employerPackage.remainingCredits <= 0) {
    const error = new Error("Your credits are exhausted. Please upgrade your plan.");
    error.statusCode = 403;
    throw error;
  }

  const location = [jobData.city?.trim() || "", jobData.province?.trim() || ""].filter(Boolean).join(", ");
  let expiresAt = null;
  const runDaysVal = jobData.runDays || jobData.adDurationDays || "30";
  if (runDaysVal) {
    const daysToAdd = parseInt(runDaysVal) || 30;
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysToAdd);
  }

  // Handle Apply Methods from either array or toggle fields
  let formattedApplyMethods = [];
  if (Array.isArray(jobData.applyMethods) && jobData.applyMethods.length > 0) {
    formattedApplyMethods = jobData.applyMethods.map((method) => {
      const formatted = { method: method.method };
      if (method.email) formatted.email = method.email.toLowerCase().trim();
      if (method.phone) formatted.phone = method.phone.trim();
      if (method.mailAddress) formatted.mailAddress = method.mailAddress.trim();
      if (method.inPersonAddress) formatted.inPersonAddress = method.inPersonAddress.trim();
      if (method.inPersonTiming) formatted.inPersonTiming = method.inPersonTiming.trim();
      return formatted;
    });
  } else {
    // Convert boolean toggles (Youth Employment format)
    if (jobData.byEmail && jobData.applicationEmail) {
      formattedApplyMethods.push({ method: "email", email: jobData.applicationEmail.toLowerCase().trim() });
    }
    if (jobData.byPhone && jobData.phone) {
      formattedApplyMethods.push({ method: "phone", phone: jobData.phone.trim() });
    }
    if (jobData.byMail && jobData.mailingAddress) {
      formattedApplyMethods.push({ method: "mail", mailAddress: jobData.mailingAddress.trim() });
    }
    if (jobData.inPerson && jobData.inPersonAddress) {
      const timing = [jobData.inPersonFromTime, jobData.inPersonToTime].filter(Boolean).join(" - ");
      formattedApplyMethods.push({
        method: "inPerson",
        inPersonAddress: jobData.inPersonAddress.trim(),
        inPersonTiming: timing || undefined,
      });
    }
  }

  // Fallback to contact email if apply methods empty
  if (formattedApplyMethods.length === 0 && (jobData.contactEmail || jobData.email)) {
    formattedApplyMethods.push({
      method: "email",
      email: (jobData.contactEmail || jobData.email).toLowerCase().trim(),
    });
  }

  const newJobId = await generateJobId();

  const createdJob = await Job.create({
    employerId: employerRecord._id,
    site: targetSite,
    jobId: newJobId,
    title: jobData.title.trim(),
    company: jobData.company.trim(),
    contactName: (jobData.contactName || "Hiring Manager").trim(),
    city: jobData.city.trim(),
    province: jobData.province.trim(),
    location,
    salary: jobData.salary?.trim() || "",
    salaryType: jobData.salaryType || jobData.salaryPeriod || "hour",
    vacancies: Number(jobData.vacancies) || 1,
    employmentType: jobData.employmentType,
    category: jobData.category.trim(),
    nocCode: jobData.nocCode?.trim() || "",
    runDays: String(runDaysVal),
    experience: jobData.experience?.trim() || "",
    startDate: jobData.startDate || "",
    descriptionHtml: jobData.descriptionHtml.trim(),
    requirementsHtml: jobData.requirementsHtml?.trim() || "",
    website: jobData.website?.trim() || "",
    indigenousOwned: Boolean(jobData.indigenousOwned || jobData.indigenous),
    remote: Boolean(jobData.remote),
    status: "active",
    indigenousPreference: Boolean(jobData.indigenousOwned || jobData.indigenous),
    expiresAt,
    applyMethods: formattedApplyMethods,
    packageId: employerPackage._id,
    creditConsumed: true,
    ...(jobData.contactEmail?.trim() && { contactEmail: jobData.contactEmail.trim().toLowerCase() }),
    ...(jobData.postDate && { postDate: new Date(jobData.postDate) }),
  });

  // Deduct Credit
  if (!employerPackage.unlimitedJobs) {
    employerPackage.remainingCredits -= 1;
    await employerPackage.save();
  }

  return createdJob;
}
