import { Employer } from "./employer.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { PaymentTransaction } from "../payments/paymentTransaction.model.js";
import { Job } from "../jobs/job.model.js";
import mongoose from "mongoose";

export async function checkEmployerHandler(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(200).json({ isEmployer: false });
    }

    const user = await mongoose.connection.collection("user").findOne({ email });
    if (!user) {
      return res.status(200).json({ isEmployer: false });
    }

    const employer = await Employer.findOne({ authUserId: user._id.toString() });
    return res.status(200).json({ isEmployer: !!employer });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerProfileHandler(req, res, next) {
  try {
    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer profile not found." });
    }
    return res.status(200).json({ success: true, data: employer });
  } catch (error) {
    next(error);
  }
}

export async function updateEmployerProfileHandler(req, res, next) {
  try {
    const employer = await Employer.findOneAndUpdate(
      { authUserId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    return res.status(200).json({ success: true, data: employer, message: "Employer profile updated successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerPackageHandler(req, res, next) {
  try {
    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer not found." });
    }

    const employerPackage = await EmployerPackage.findOne({
      employerId: employer._id,
      status: "Active",
    }).lean();

    const latestPayment = await PaymentTransaction.findOne({
      employerId: employer._id,
      paymentStatus: "paid",
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      package: employerPackage
        ? {
            ...employerPackage,
            paymentMethod: latestPayment?.paymentMethod || null,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerStatsHandler(req, res, next) {
  try {
    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(200).json({
        success: true,
        stats: {
          totalJobs: 0,
          activeJobs: 0,
          closedJobs: 0,
          totalViews: 0,
          totalApplications: 0,
        },
      });
    }

    const [totalJobs, activeJobs, closedJobs] = await Promise.all([
      Job.countDocuments({ employerId: employer._id }),
      Job.countDocuments({ employerId: employer._id, status: "active" }),
      Job.countDocuments({ employerId: employer._id, status: "closed" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalViews: 0,
        totalApplications: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerJobsHandler(req, res, next) {
  try {
    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer profile not found." });
    }

    const { status, search } = req.query;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const query = { employerId: employer._id };
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ postedAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
