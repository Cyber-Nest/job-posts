import { Package, DEFAULT_PACKAGES } from "./package.model.js";
import { Employer } from "../employers/employer.model.js";
import { EmployerPackage } from "./employerPackage.model.js";

export async function getPackagesHandler(req, res, next) {
  try {
    let packages = await Package.find({ active: true }).sort({ order: 1 });

    if (packages.length === 0) {
      await Package.insertMany(DEFAULT_PACKAGES);
      packages = await Package.find({ active: true }).sort({ order: 1 });
    }

    return res.status(200).json({ success: true, data: packages });
  } catch (error) {
    next(error);
  }
}

export async function getEmployerActivePackageHandler(req, res, next) {
  try {
    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer profile not found." });
    }

    const activePackage = await EmployerPackage.findOne({
      employerId: employer._id,
      status: "Active",
    });

    return res.status(200).json({
      success: true,
      data: activePackage || {
        packageName: "Free Trial / No Package",
        remainingCredits: 0,
        unlimitedJobs: false,
        status: "Inactive",
      },
    });
  } catch (error) {
    next(error);
  }
}
