import { Schema, model, models } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    packageName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Unused", "Used"],
      default: "Unused",
      index: true,
    },

    // Assignment Info
    assignedName: {
      type: String,
      default: null,
      trim: true,
    },

    assignedEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    // Redemption Info
    redeemedName: {
      type: String,
      default: null,
      trim: true,
    },

    redeemedEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    redeemedAt: {
      type: Date,
      default: null,
    },

    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PromoCodeSchema.index({ code: 1, packageName: 1 });
PromoCodeSchema.index({ packageName: 1, status: 1 });

export const PromoCode =
  models.PromoCode || model("PromoCode", PromoCodeSchema);
