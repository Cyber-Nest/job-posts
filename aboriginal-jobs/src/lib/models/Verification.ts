import { Schema, model, models } from "mongoose";

const VerificationSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    purpose: {
      type: String,
      enum: ["registration", "password_reset", "email_verification", "admin_change"],
      default: "registration",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired OTPs
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
VerificationSchema.index({ identifier: 1, purpose: 1 });

export const Verification = models.Verification || model("Verification", VerificationSchema);