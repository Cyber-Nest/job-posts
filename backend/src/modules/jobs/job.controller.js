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

    const formattedJob = {
      ...job,
      id: job._id,
      jobUniqueId: job.jobId || null,
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
    const rawSalaryPeriod = req.body.salaryType || req.body.salaryPeriod;
    if (rawSalaryPeriod) {
      let normalizedSalaryType = String(rawSalaryPeriod).toLowerCase().trim();
      if (normalizedSalaryType === "hourly") normalizedSalaryType = "hour";
      else if (normalizedSalaryType === "weekly") normalizedSalaryType = "week";
      else if (normalizedSalaryType === "monthly") normalizedSalaryType = "month";
      else if (normalizedSalaryType === "annual" || normalizedSalaryType === "annually") normalizedSalaryType = "year";
      req.body.salaryType = normalizedSalaryType;
    }
    if (req.body.startDate !== undefined) {
      req.body.startDate = req.body.startDate ? String(req.body.startDate).trim() : "";
    }
    if (req.body.website !== undefined) {
      req.body.website = req.body.website ? String(req.body.website).trim() : "";
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }
    return res.status(200).json({ success: true, data: updatedJob, job: updatedJob, message: "Job updated successfully." });
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
