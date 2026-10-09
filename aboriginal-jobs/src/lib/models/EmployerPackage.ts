import { Schema, model, models } from "mongoose";

const EmployerPackageSchema = new Schema(
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

    remainingCredits: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    totalCreditsPurchased: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    unlimitedJobs: {
      type: Boolean,
      default: false,
    },

    isFreePlan: {
      type: Boolean,
      default: true,
    },

    jobPostExpiryDays: {
      type: Number,
      default: 30,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Expired",
      ],
      default: "Active",
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    creditExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

EmployerPackageSchema.index({
  employerId: 1,
});

export const EmployerPackage =
  models.EmployerPackage ||
  model(
    "EmployerPackage",
    EmployerPackageSchema,
  );