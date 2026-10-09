import { PromoCode } from "./promoCode.model.js";
import { Employer } from "../employers/employer.model.js";
import { Package } from "../packages/package.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { EmployerPackageHistory } from "../packages/employerPackageHistory.model.js";
import { PaymentTransaction } from "../payments/paymentTransaction.model.js";

export async function verifyPromoCodeHandler(req, res, next) {
  try {
    const { packageName, promoCode } = req.body;

    if (!packageName || !promoCode) {
      return res.status(400).json({ success: false, error: "Package and coupon code are required." });
    }

    const cleanPackage = packageName.trim();
    const cleanCode = promoCode.trim().toUpperCase();

    const selectedPackage = await Package.findOne({ name: cleanPackage });
    if (!selectedPackage) {
      return res.status(400).json({ success: false, error: "Invalid package selected." });
    }

    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer not found." });
    }

    const existingCoupon = await PromoCode.findOne({
      code: cleanCode,
      packageName: cleanPackage,
      status: "Unused",
    });

    if (!existingCoupon || !existingCoupon.assignedEmail) {
      return res.status(400).json({ success: false, error: "Invalid coupon code or coupon has already been used." });
    }

    // Atomic Redemption
    const redeemedCoupon = await PromoCode.findOneAndUpdate(
      {
        code: cleanCode,
        packageName: cleanPackage,
        status: "Unused",
        assignedEmail: { $ne: null },
      },
      {
        $set: {
          status: "Used",
          redeemedName: req.user.name || req.user.email,
          redeemedEmail: req.user.email,
          redeemedAt: new Date(),
          employerId: employer._id,
        },
      },
      { new: true, runValidators: true }
    );

    if (!redeemedCoupon) {
      return res.status(400).json({ success: false, error: "Invalid coupon code or coupon has already been used." });
    }

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + selectedPackage.expiryDays);

    const existingPackage = await EmployerPackage.findOne({ employerId: employer._id });
    if (existingPackage) {
      existingPackage.packageName = cleanPackage;
      existingPackage.unlimitedJobs = selectedPackage.unlimitedJobs;
      existingPackage.isFreePlan = false;
      existingPackage.status = "Active";
      existingPackage.purchasedAt = now;
      existingPackage.expiresAt = expiresAt;

      if (!selectedPackage.unlimitedJobs) {
        existingPackage.remainingCredits += selectedPackage.credits;
        existingPackage.totalCreditsPurchased += selectedPackage.credits;
      }
      await existingPackage.save();
    } else {
      await EmployerPackage.create({
        employerId: employer._id,
        packageName: cleanPackage,
        remainingCredits: selectedPackage.credits,
        totalCreditsPurchased: selectedPackage.credits,
        unlimitedJobs: selectedPackage.unlimitedJobs,
        isFreePlan: false,
        jobPostExpiryDays: selectedPackage.expiryDays,
        status: "Active",
        purchasedAt: now,
        expiresAt,
        creditExpiresAt: null,
      });
    }

    const payment = await PaymentTransaction.create({
      employerId: employer._id,
      packageName: cleanPackage,
      amount: 0,
      currency: "CAD",
      paymentStatus: "paid",
      paymentProvider: "coupon",
      paymentMethod: "Coupon Code",
      promoCodeUsed: cleanCode,
      isPromoPayment: true,
    });

    await EmployerPackageHistory.create({
      employerId: employer._id,
      packageName: cleanPackage,
      creditsAdded: selectedPackage.credits,
      unlimitedJobs: selectedPackage.unlimitedJobs,
      promoCodeUsed: cleanCode,
      isFreePlan: false,
      jobPostExpiryDays: selectedPackage.expiryDays,
      purchasedAt: now,
      expiresAt,
      paymentStatus: "paid",
      paymentProvider: "coupon",
      paymentMethod: "Coupon Code",
      transactionId: String(payment._id),
      amount: 0,
      currency: "CAD",
    });

    return res.status(200).json({
      success: true,
      message: "Coupon applied and package activated successfully.",
    });
  } catch (error) {
    next(error);
  }
}
