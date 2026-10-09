import Stripe from "stripe";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";

import { PackageDoc } from "@/server/db/models";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID" },
        { status: 400 },
      );
    }

    //Stripe directly Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found on Stripe" },
        { status: 404 },
      );
    }

    // Check payment 'paid' status
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment has not been completed yet" },
        { status: 400 },
      );
    }

    // Metadata
    const employerId = session.metadata?.employerId;
    const packageName = session.metadata?.packageName;
    const transactionId = session.metadata?.transactionId;

    if (!employerId || !packageName || !transactionId) {
      return NextResponse.json(
        { error: "Missing required metadata in Stripe Session" },
        { status: 400 },
      );
    }

    // Idempotency Check
    const paymentTransactions = await collection("paymentTransactions");
    const existingTx = await paymentTransactions.findOne({ id: transactionId });

    if (existingTx && existingTx.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified and processed.",
      });
    }

    //Card details fetch
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
      } catch (e) {
        console.error("Failed to fetch payment method details:", e);
      }
    }

    const packagesCollection = await collection<PackageDoc>("packages");
    const dbPackage = await packagesCollection.findOne({ name: packageName });

    if (!dbPackage) {
      return NextResponse.json(
        { error: "Invalid package config" },
        { status: 400 },
      );
    }

    const packages = await collection("employerPackages");
    const historyCollection = await collection("employerPackageHistory");
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + dbPackage.expiryDays);

    //  DB UPDATE - A) PAYMENT TRANSACTION
    await paymentTransactions.updateOne(
      { id: transactionId },
      {
        $set: {
          paymentStatus: "paid",
          stripePaymentIntentId: session.payment_intent,
          paymentMethod: paymentMethodType,
          updatedAt: now,
        },
      },
    );

    //  DB UPDATE - B) EMPLOYER PACKAGE
    const existingPackage = await packages.findOne({ employerId });

    if (existingPackage) {
      const updateDoc: Record<string, unknown> = {
        $set: {
          packageName,
          unlimitedJobs: dbPackage.unlimitedJobs,
          isFreePlan: false,
          status: "Active",
          purchasedAt: now,
          expiresAt,
          updatedAt: now,
        },
      };

      if (!dbPackage.unlimitedJobs) {
        updateDoc.$inc = {
          remainingCredits: dbPackage.credits,
          totalCreditsPurchased: dbPackage.credits,
        };
      }

      await packages.updateOne({ employerId }, updateDoc);
    } else {
      await packages.insertOne({
        id: randomUUID(),
        employerId,
        packageName,
        remainingCredits: dbPackage.credits,
        totalCreditsPurchased: dbPackage.credits,
        unlimitedJobs: dbPackage.unlimitedJobs,
        isFreePlan: false,
        jobPostExpiryDays: dbPackage.expiryDays,
        status: "Active",
        purchasedAt: now,
        expiresAt,
        creditExpiresAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    // DB UPDATE - C) LOG HISTORY
    await historyCollection.insertOne({
      id: randomUUID(),
      employerId,
      packageName,
      creditsAdded: dbPackage.credits,
      unlimitedJobs: dbPackage.unlimitedJobs,
      isFreePlan: false,
      jobPostExpiryDays: dbPackage.expiryDays,
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
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified.",
    });
  } catch (error) {
    console.error("STRIPE VERIFICATION ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 },
    );
  }
}
