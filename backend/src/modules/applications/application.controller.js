import { Application } from "./application.model.js";

export async function submitApplicationHandler(req, res, next) {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    if (!jobId || !resumeUrl) {
      return res.status(400).json({ success: false, error: "Job ID and resume URL are required." });
    }

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      coverLetter: coverLetter || "",
      resumeUrl,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "You have already applied for this job." });
    }
    next(error);
  }
}

export async function getUserApplicationsHandler(req, res, next) {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("jobId")
      .sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
}
