import { getAllJobs, createJob } from "./job.service.js";
import { Job } from "./job.model.js";

export async function getJobsHandler(req, res, next) {
  try {
    const result = await getAllJobs(req.query);
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
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }
    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

export async function createJobHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const createdJob = await createJob(userId, req.body);
    return res.status(201).json({
      success: true,
      jobId: createdJob._id,
      displayJobId: createdJob.jobId,
      message: "Job posted successfully!",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateJobHandler(req, res, next) {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ success: false, error: "Job not found." });
    }
    return res.status(200).json({ success: true, data: updatedJob, message: "Job updated successfully." });
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
