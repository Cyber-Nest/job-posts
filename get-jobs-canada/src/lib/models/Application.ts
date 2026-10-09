import { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ jobId: 1 });
ApplicationSchema.index({ userId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const Application =
  models.Application || model("Application", ApplicationSchema);
