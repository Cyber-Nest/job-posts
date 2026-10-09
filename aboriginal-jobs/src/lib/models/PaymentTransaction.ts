import { Schema, model, models } from "mongoose";

const PaymentTransactionSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
      index: true,
    },

    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "CAD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    paymentProvider: {
      type: String,
      default: "stripe",
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    stripeSessionId: {
      type: String,
      default: null,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    promoCodeUsed: {
      type: String,
      default: null,
    },

    isPromoPayment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

PaymentTransactionSchema.index({
  employerId: 1,
});

PaymentTransactionSchema.index({
  stripeSessionId: 1,
});

export const PaymentTransaction =
  models.PaymentTransaction ||
  model("PaymentTransaction", PaymentTransactionSchema);
