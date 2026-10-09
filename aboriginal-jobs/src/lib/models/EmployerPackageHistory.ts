import { Schema, model, models } from "mongoose";

const EmployerPackageHistorySchema = new Schema(
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

    creditsAdded: {
      type: Number,
      required: true,
      default: 0,
    },

    unlimitedJobs: {
      type: Boolean,
      default: false,
    },

    isFreePlan: {
      type: Boolean,
      default: false,
    },
    promoCodeUsed: {
      type: String,
      default: null,
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

    jobPostExpiryDays: {
      type: Number,
      default: 30,
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },

    paymentProvider: {
      type: String,
      default: "manual",
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "CAD",
    },
  },
  {
    timestamps: true,
  },
);

EmployerPackageHistorySchema.index({
  employerId: 1,
});

EmployerPackageHistorySchema.index({
  purchasedAt: -1,
});

export const EmployerPackageHistory =
  models.EmployerPackageHistory ||
  model("EmployerPackageHistory", EmployerPackageHistorySchema);
