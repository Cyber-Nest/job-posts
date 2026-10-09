import Stripe from "stripe";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";
import { PromoCode } from "@/lib/models/PromoCode";
import { PaymentTransaction } from "@/lib/models/PaymentTransaction";
import { Package } from "@/lib/models/Package";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKAGE_CONFIG = {
  Starter: {
    credits: 1,
    amount: 12.5,
  },
  // Starter: {
  //   credits: 1,
  //   amount: 0.50,
  // },

  Deluxe: {
    credits: 5,
    amount: 47.5,
  },

  Ultimate: {
    credits: 10,
    amount: 97.5,
  },

  "Pro Plan": {
    credits: 20,
    amount: 190,
  },

  Unlimited: {
    credits: 0,
    amount: 675,
  },
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const packageName = body.packageName?.trim();

    const promoCode = body.promoCode?.trim()?.toUpperCase() || null;

    if (!packageName) {
      return NextResponse.json(
        {
          error: "Package name is required.",
        },
        {
          status: 400,
        },
      );
    }

    const dbPackage = await Package.findOne({ name: packageName });
    const selectedPackage =
      PACKAGE_CONFIG[packageName as keyof typeof PACKAGE_CONFIG];

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error: "Invalid package selected.",
        },
        {
          status: 400,
        },
      );
    }

    const amount = dbPackage ? dbPackage.discountedPrice : selectedPackage.amount;

    const employer = await Employer.findOne({
      authUserId: session.user.id,
    });

    if (!employer) {
      return NextResponse.json(
        {
          error: "Employer not found.",
        },
        {
          status: 404,
        },
      );
    }

    // PROMO VALIDATION

    let isFreePromo = false;

    if (promoCode) {
      const coupon = await PromoCode.findOne({
        code: promoCode,
        packageName,
        status: "Unused",
      });

      if (!coupon) {
        return NextResponse.json(
          {
            error: "Invalid or already used coupon code.",
          },
          {
            status: 400,
          },
        );
      }

      isFreePromo = true;
    }

    // FREE PROMO

    if (isFreePromo) {
      return NextResponse.json({
        success: true,

        freePromo: true,

        message: "Promo code applied successfully.",
      });
    }

    // PAYMENT RECORD

    const transactionId = randomUUID();

    const payment = await PaymentTransaction.create({
      employerId: employer._id,

      packageName,

      amount: amount,

      currency: "CAD",

      paymentStatus: "pending",

      paymentProvider: "stripe",

      stripeSessionId: null,

      stripePaymentIntentId: null,

      promoCodeUsed: null,

      isPromoPayment: false,
    });

    // STRIPE SESSION

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      customer_email: session.user.email,

      line_items: [
        {
          price_data: {
            currency: "cad",

            product_data: {
              name: `${packageName} Package`,
            },

            unit_amount: Math.round(amount * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        employerId: String(employer._id),

        packageName,

        transactionId: String(payment._id),
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    await PaymentTransaction.findByIdAndUpdate(payment._id, {
      stripeSessionId: checkoutSession.id,
    });

    return NextResponse.json({
      success: true,

      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create checkout session.",
      },
      {
        status: 500,
      },
    );
  }
}
