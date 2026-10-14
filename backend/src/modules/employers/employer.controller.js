import { Employer } from "./employer.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { PaymentTransaction } from "../payments/paymentTransaction.model.js";
import { Job } from "../jobs/job.model.js";
import mongoose from "mongoose";

async function findEmployerByUser(user) {
  if (!user) return null;
  const queries = [
    { authUserId: String(user.id) },
    { authUserId: user.id },
  ];
  if (user.email) {
    queries.push({ email: user.email.toLowerCase().trim() });
  }
  return await Employer.findOne({ $or: queries });
}

export async function checkEmployerHandler(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(200).json({ isEmployer: false });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await mongoose.connection.collection("user").findOne({ email: cleanEmail });
    if (!user) {
      return res.status(200).json({ isEmployer: false });
    }

    const employer = await Employer.findOne({
      $or: [
        { authUserId: user._id.toString() },
        { authUserId: user._id },
        { email: cleanEmail },
      ],
    });
    return res.status(200).json({ isEmployer: !!employer });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerProfileHandler(req, res, next) {
  try {
    const employer = await findEmployerByUser(req.user);
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
    let employer = await findEmployerByUser(req.user);
    if (!employer) {
      employer = await Employer.create({
        authUserId: String(req.user.id),
        orgName: req.body.orgName || req.user.name || "Company",
        email: req.user.email,
        ...req.body,
      });
    } else {
      employer = await Employer.findByIdAndUpdate(
        employer._id,
        { $set: req.body },
        { new: true }
      );
    }
    return res.status(200).json({ success: true, data: employer, message: "Employer profile updated successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerPackageHandler(req, res, next) {
  try {
    let employer = await findEmployerByUser(req.user);
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer not found." });
    }

    let employerPackage = await EmployerPackage.findOne({
      employerId: employer._id,
      status: "Active",
    }).lean();

    // Auto-provision 1 free credit if employer has no package records
    if (!employerPackage) {
      const anyPkg = await EmployerPackage.findOne({ employerId: employer._id });
      if (!anyPkg) {
        const newPkg = await EmployerPackage.create({
          employerId: employer._id,
          packageName: "Free Plan",
          remainingCredits: 1,
          totalCreditsPurchased: 1,
          unlimitedJobs: false,
          isFreePlan: true,
          jobPostExpiryDays: 30,
          status: "Active",
          purchasedAt: new Date(),
        });
        employer.currentPackageId = newPkg._id;
        await employer.save();
        employerPackage = newPkg.toObject();
      }
    }

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
    const employer = await findEmployerByUser(req.user);
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
    const employer = await findEmployerByUser(req.user);
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

    const [rawJobs, total] = await Promise.all([
      Job.find(query).sort({ postedAt: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ]);

    const jobs = rawJobs.map((j) => ({
      ...j,
      id: String(j._id),
      jobId: j.jobId || String(j._id).slice(-6).toUpperCase(),
    }));

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
