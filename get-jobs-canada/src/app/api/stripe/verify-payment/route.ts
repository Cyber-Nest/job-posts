import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { EmployerPackage } from "@/lib/models/EmployerPackage";
import { EmployerPackageHistory } from "@/lib/models/EmployerPackageHistory";
import { PaymentTransaction } from "@/lib/models/PaymentTransaction";
import { Package } from "@/lib/models/Package";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Missing session ID",
        },
        {
          status: 400,
        },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        {
          error: "Session not found",
        },
        {
          status: 404,
        },
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Payment not completed",
        },
        {
          status: 400,
        },
      );
    }

    const employerId = session.metadata?.employerId;

    const packageName = session.metadata?.packageName;

    const transactionId = session.metadata?.transactionId;

    if (!employerId || !packageName || !transactionId) {
      return NextResponse.json(
        {
          error: "Missing metadata",
        },
        {
          status: 400,
        },
      );
    }

    const transaction = await PaymentTransaction.findById(transactionId);

    if (transaction && transaction.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        message: "Already processed",
      });
    }

    let paymentMethodType = "Card";

    if (session.payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
        );

        const paymentMethod = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string,
        );

        paymentMethodType = paymentMethod.card?.brand
          ? `${paymentMethod.card.brand.toUpperCase()} Card`
          : paymentMethod.type;
      } catch (error) {
        console.error(error);
      }
    }

    const selectedPackage = await Package.findOne({ name: packageName });

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error: "Invalid package",
        },
        {
          status: 400,
        },
      );
    }

    const now = new Date();

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + selectedPackage.expiryDays);

    // PAYMENT UPDATE

    await PaymentTransaction.findByIdAndUpdate(transactionId, {
      paymentStatus: "paid",

      paymentMethod: paymentMethodType,

      stripePaymentIntentId: session.payment_intent,
    });

    // PACKAGE

    const existingPackage = await EmployerPackage.findOne({
      employerId,
    });

    if (existingPackage) {
      existingPackage.packageName = packageName;

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
        employerId,

        packageName,

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

    // HISTORY

    await EmployerPackageHistory.create({
      employerId,

      packageName,

      creditsAdded: selectedPackage.credits,

      unlimitedJobs: selectedPackage.unlimitedJobs,

      isFreePlan: false,

      jobPostExpiryDays: selectedPackage.expiryDays,

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

    return NextResponse.json({
      success: true,

      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to verify payment",
      },
      {
        status: 500,
      },
    );
  }
}
