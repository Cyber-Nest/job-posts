import { randomUUID } from "crypto";
import { stripe } from "../../config/stripe.js";
import { env } from "../../config/env.js";
import { Employer } from "../employers/employer.model.js";
import { Package } from "../packages/package.model.js";
import { EmployerPackage } from "../packages/employerPackage.model.js";
import { EmployerPackageHistory } from "../packages/employerPackageHistory.model.js";
import { PaymentTransaction } from "./paymentTransaction.model.js";
import { PromoCode } from "../promo/promoCode.model.js";

const PACKAGE_CONFIG = {
  Starter: { credits: 1, amount: 12.5 },
  Deluxe: { credits: 5, amount: 47.5 },
  Ultimate: { credits: 10, amount: 97.5 },
  "Pro Plan": { credits: 20, amount: 190 },
  Unlimited: { credits: 0, amount: 675 },
};

export async function createCheckoutSessionHandler(req, res, next) {
  try {
    const { packageName, promoCode } = req.body;

    if (!packageName?.trim()) {
      return res.status(400).json({ success: false, error: "Package name is required." });
    }

    const dbPackage = await Package.findOne({ name: packageName.trim() });
    const selectedPackage = PACKAGE_CONFIG[packageName.trim()];

    if (!selectedPackage && !dbPackage) {
      return res.status(400).json({ success: false, error: "Invalid package selected." });
    }

    const amount = dbPackage ? dbPackage.discountedPrice : selectedPackage.amount;

    const employer = await Employer.findOne({ authUserId: req.user.id });
    if (!employer) {
      return res.status(404).json({ success: false, error: "Employer profile not found." });
    }

    if (promoCode?.trim()) {
      const coupon = await PromoCode.findOne({
        code: promoCode.trim().toUpperCase(),
        packageName: packageName.trim(),
        status: "Unused",
      });

      if (!coupon) {
        return res.status(400).json({ success: false, error: "Invalid or already used coupon code." });
      }

      return res.status(200).json({
        success: true,
        freePromo: true,
        message: "Promo code applied successfully.",
      });
    }

    const payment = await PaymentTransaction.create({
      employerId: employer._id,
      packageName: packageName.trim(),
      amount,
      currency: "CAD",
      paymentStatus: "pending",
      paymentProvider: "stripe",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      promoCodeUsed: null,
      isPromoPayment: false,
    });

    const clientUrl = env.CLIENT_URL;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${packageName.trim()} Package`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        employerId: String(employer._id),
        packageName: packageName.trim(),
        transactionId: String(payment._id),
      },
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment/cancel`,
    });

    await PaymentTransaction.findByIdAndUpdate(payment._id, {
      stripeSessionId: checkoutSession.id,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyPaymentHandler(req, res, next) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, error: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, error: "Payment not completed" });
    }

    const { employerId, packageName, transactionId } = session.metadata || {};
    if (!employerId || !packageName || !transactionId) {
      return res.status(400).json({ success: false, error: "Missing metadata" });
    }

    const transaction = await PaymentTransaction.findById(transactionId);
    if (transaction && transaction.paymentStatus === "paid") {
      return res.status(200).json({ success: true, message: "Already processed" });
    }

    let paymentMethodType = "Card";
    if (session.payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        paymentMethodType = paymentMethod.card?.brand
          ? `${paymentMethod.card.brand.toUpperCase()} Card`
          : paymentMethod.type;
      } catch (err) {
        console.error("Stripe payment method retrieval error:", err);
      }
    }

    const selectedPackage = await Package.findOne({ name: packageName });
    const expiryDays = selectedPackage ? selectedPackage.expiryDays : 180;
    const credits = selectedPackage ? selectedPackage.credits : 1;
    const unlimitedJobs = selectedPackage ? selectedPackage.unlimitedJobs : false;

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    await PaymentTransaction.findByIdAndUpdate(transactionId, {
      paymentStatus: "paid",
      paymentMethod: paymentMethodType,
      stripePaymentIntentId: session.payment_intent,
    });

    const existingPackage = await EmployerPackage.findOne({ employerId });
    if (existingPackage) {
      existingPackage.packageName = packageName;
      existingPackage.unlimitedJobs = unlimitedJobs;
      existingPackage.isFreePlan = false;
      existingPackage.status = "Active";
      existingPackage.purchasedAt = now;
      existingPackage.expiresAt = expiresAt;

      if (!unlimitedJobs) {
        existingPackage.remainingCredits += credits;
        existingPackage.totalCreditsPurchased += credits;
      }
      await existingPackage.save();
    } else {
      await EmployerPackage.create({
        employerId,
        packageName,
        remainingCredits: credits,
        totalCreditsPurchased: credits,
        unlimitedJobs,
        isFreePlan: false,
        jobPostExpiryDays: expiryDays,
        status: "Active",
        purchasedAt: now,
        expiresAt,
        creditExpiresAt: null,
      });
    }

    await EmployerPackageHistory.create({
      employerId,
      packageName,
      creditsAdded: credits,
      unlimitedJobs,
      isFreePlan: false,
      jobPostExpiryDays: expiryDays,
      purchasedAt: now,
      expiresAt,
      paymentStatus: "paid",
      paymentProvider: "stripe",
      paymentMethod: paymentMethodType,
      transactionId,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || "CAD",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    next(error);
  }
}
