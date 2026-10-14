import mongoose from "mongoose";
import { getAllJobs, createJob } from "./job.service.js";
import { Job } from "./job.model.js";
import { resolveSiteFromRequest } from "../../utils/mailer.js";

export async function getJobsHandler(req, res, next) {
  try {
    const queryParams = { ...req.query };
    // By default, do NOT filter by site so that all jobs are shared/syndicated across all 3 platforms!
    // Only filter by site if explicitly requested in the query string (e.g. ?site=aboriginal) and !== 'all'
    const result = await getAllJobs(queryParams);
    return res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobByIdHandler(req, res, next) {
  try {
    let job = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      job = await Job.findById(req.params.id).lean();
    }
    if (!job) {
      job = await Job.findOne({ jobId: req.params.id }).lean();
    }
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }

    const howToApply = {
      byEmail: job.applyMethods?.some((m) => m.method === "email") || Boolean(job.contactEmail),
      applicationEmail: job.applyMethods?.find((m) => m.method === "email")?.email || job.contactEmail || "",
      byPhone: job.applyMethods?.some((m) => m.method === "phone"),
      phone: job.applyMethods?.find((m) => m.method === "phone")?.phone || "",
      byMail: job.applyMethods?.some((m) => m.method === "mail"),
      mailingAddress: job.applyMethods?.find((m) => m.method === "mail")?.mailAddress || "",
      inPerson: job.applyMethods?.some((m) => m.method === "inPerson"),
      inPersonAddress: job.applyMethods?.find((m) => m.method === "inPerson")?.inPersonAddress || "",
      inPersonFromTime: job.applyMethods?.find((m) => m.method === "inPerson")?.inPersonTiming?.split(" - ")[0] || "",
      inPersonToTime: job.applyMethods?.find((m) => m.method === "inPerson")?.inPersonTiming?.split(" - ")[1] || "",
    };

    const salaryPeriod = job.salaryPeriod || job.salaryType || "hour";
    const postingDate = job.jobPostingDate || job.postDate || job.postedAt || job.createdAt || new Date();

    const formattedJob = {
      ...job,
      id: job._id,
      jobId: job.jobId || null,
      jobUniqueId: job.jobId || null,
      salary: job.salary ? String(job.salary).trim() : "",
      salaryPeriod,
      salaryType: salaryPeriod,
      jobPostingDate: postingDate,
      postDate: postingDate,
      postedAt: postingDate,
      howToApply,
    };

    return res.status(200).json({ success: true, data: formattedJob, job: formattedJob });
  } catch (error) {
    next(error);
  }
}

export async function createJobHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const site = resolveSiteFromRequest(req);
    const createdJob = await createJob(userId, req.body, site);
    return res.status(201).json({
      success: true,
      jobId: createdJob._id,
      displayJobId: createdJob.jobId,
      job: {
        ...createdJob.toObject(),
        id: createdJob._id,
        jobUniqueId: createdJob.jobId,
      },
      data: createdJob,
      message: "Job posted successfully!",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateJobHandler(req, res, next) {
  try {
    let targetJob = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      targetJob = await Job.findById(req.params.id);
    }
    if (!targetJob) {
      targetJob = await Job.findOne({ jobId: req.params.id });
    }
    if (!targetJob) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }

    const rawSalaryPeriod = req.body.salaryType || req.body.salaryPeriod;
    if (rawSalaryPeriod) {
      let normalizedSalaryType = String(rawSalaryPeriod).toLowerCase().trim();
      if (normalizedSalaryType === "hourly") normalizedSalaryType = "hour";
      else if (normalizedSalaryType === "weekly") normalizedSalaryType = "week";
      else if (normalizedSalaryType === "monthly") normalizedSalaryType = "month";
      else if (normalizedSalaryType === "annual" || normalizedSalaryType === "annually") normalizedSalaryType = "year";
      else if (!["hour", "week", "month", "year"].includes(normalizedSalaryType)) {
        normalizedSalaryType = "hour";
      }
      req.body.salaryType = normalizedSalaryType;
    }

    if (req.body.city || req.body.province) {
      const city = (req.body.city || targetJob.city || "").trim();
      const province = (req.body.province || targetJob.province || "").trim();
      req.body.location = [city, province].filter(Boolean).join(", ");
    }

    if (req.body.company || req.body.companyName) {
      req.body.company = (req.body.company || req.body.companyName).trim();
    }
    if (req.body.contactName) {
      req.body.contactName = String(req.body.contactName).trim();
    }

    const cleanFields = [
      "startDate",
      "website",
      "nocCode",
      "experience",
      "positionType",
      "education",
      "travel",
      "vacation",
      "contactType",
    ];
    cleanFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.body[field] = req.body[field] ? String(req.body[field]).trim() : "";
      }
    });

    if (req.body.vacancies !== undefined) {
      req.body.vacancies = Number(req.body.vacancies) || 1;
    }
    if (req.body.indigenousOwned !== undefined || req.body.indigenous !== undefined) {
      req.body.indigenousOwned = Boolean(req.body.indigenousOwned || req.body.indigenous);
      req.body.indigenousPreference = Boolean(req.body.indigenousOwned || req.body.indigenous);
    }
    if (req.body.remote !== undefined) {
      req.body.remote = Boolean(req.body.remote);
    }

    const runDaysVal = req.body.runDays || req.body.adDurationDays;
    if (runDaysVal) {
      req.body.runDays = String(runDaysVal);
      const daysToAdd = parseInt(runDaysVal) || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);
      req.body.expiresAt = expiresAt;
    }

    // Format apply methods from either array or toggle fields
    let formattedApplyMethods = [];
    if (Array.isArray(req.body.applyMethods) && req.body.applyMethods.length > 0) {
      formattedApplyMethods = req.body.applyMethods.map((method) => {
        const formatted = { method: method.method };
        if (method.email) formatted.email = method.email.toLowerCase().trim();
        if (method.phone) formatted.phone = method.phone.trim();
        if (method.mailAddress) formatted.mailAddress = method.mailAddress.trim();
        if (method.inPersonAddress) formatted.inPersonAddress = method.inPersonAddress.trim();
        if (method.inPersonTiming) formatted.inPersonTiming = method.inPersonTiming.trim();
        return formatted;
      });
      req.body.applyMethods = formattedApplyMethods;
    } else if (
      req.body.byEmail !== undefined ||
      req.body.byPhone !== undefined ||
      req.body.byMail !== undefined ||
      req.body.inPerson !== undefined
    ) {
      if (req.body.byEmail && req.body.applicationEmail) {
        formattedApplyMethods.push({ method: "email", email: req.body.applicationEmail.toLowerCase().trim() });
      }
      if (req.body.byPhone && req.body.phone) {
        formattedApplyMethods.push({ method: "phone", phone: req.body.phone.trim() });
      }
      if (req.body.byMail && req.body.mailingAddress) {
        formattedApplyMethods.push({ method: "mail", mailAddress: req.body.mailingAddress.trim() });
      }
      if (req.body.inPerson && req.body.inPersonAddress) {
        const timing = [req.body.inPersonFromTime, req.body.inPersonToTime].filter(Boolean).join(" - ");
        formattedApplyMethods.push({
          method: "inPerson",
          inPersonAddress: req.body.inPersonAddress.trim(),
          inPersonTiming: timing || undefined,
        });
      }
      if (formattedApplyMethods.length > 0) {
        req.body.applyMethods = formattedApplyMethods;
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(targetJob._id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      data: updatedJob,
      job: {
        ...updatedJob.toObject(),
        id: updatedJob._id,
        jobUniqueId: updatedJob.jobId,
      },
      message: "Job updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteJobHandler(req, res, next) {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }
    return res.status(200).json({ success: true, message: "Job deleted successfully." });
  } catch (error) {
    next(error);
  }
}
