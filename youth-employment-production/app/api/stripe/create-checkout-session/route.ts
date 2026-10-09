import Stripe from "stripe";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { getCurrentUser } from "@/server/auth/local-auth";

import { PackageDoc } from "@/server/db/models";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (user.accountType !== "employer") {
      return NextResponse.json(
        { error: "Only employers can purchase packages" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const packageName = body.packageName?.trim();
    const promoCode = body.promoCode?.trim()?.toUpperCase() || null;

    if (!packageName) {
      return NextResponse.json(
        { error: "Package name is required" },
        { status: 400 },
      );
    }

    const packagesCollection = await collection<PackageDoc>("packages");
    const dbPackage = await packagesCollection.findOne({ name: packageName });

    if (!dbPackage) {
      return NextResponse.json(
        { error: "Invalid package selected" },
        { status: 400 },
      );
    }

    // EMPLOYER
    const employers = await collection("employers");
    const employer = await employers.findOne({ userId: user.id });

    if (!employer) {
      return NextResponse.json(
        { error: "Employer profile not found" },
        { status: 404 },
      );
    }

    // PROMO VALIDATION
    let isFreePromo = false;

    if (promoCode) {
      const promoCodes = await collection("promoCodes");
      const promo = await promoCodes.findOne({
        code: promoCode,
        packageName,
        status: "Unused",
      });

      if (!promo) {
        return NextResponse.json(
          { error: "Invalid promo code" },
          { status: 400 },
        );
      }

      isFreePromo = true;
    }

    // FREE PROMO
    if (isFreePromo) {
      return NextResponse.json({
        success: true,
        freePromo: true,
        message: "Free promo applied successfully",
      });
    }

    // PAYMENT TRANSACTION
    const paymentTransactions = await collection("paymentTransactions");
    const transactionId = randomUUID();

    await paymentTransactions.insertOne({
      id: transactionId,
      employerId: employer.id,
      packageName,
      amount: dbPackage.discountedPrice,
      currency: "CAD",
      paymentStatus: "pending",
      paymentProvider: "stripe",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      promoCodeUsed: null,
      isPromoPayment: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${packageName} Package`,
            },
            unit_amount: Math.round(dbPackage.discountedPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        employerId: String(employer.id),
        packageName,
        transactionId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    // UPDATE SESSION ID
    await paymentTransactions.updateOne(
      { id: transactionId },
      {
        $set: {
          stripeSessionId: session.id,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
