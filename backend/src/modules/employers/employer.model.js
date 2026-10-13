import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const EmployerSchema = new Schema(
  {
    authUserId: {
      type: String,
      required: true,
    },
    site: {
      type: String,
      enum: ["getjobscanada", "aboriginal", "youthemployment"],
      default: "getjobscanada",
      index: true,
    },
    currentPackageId: {
      type: Schema.Types.ObjectId,
      ref: "EmployerPackage",
      default: null,
    },
    orgName: {
      type: String,
      required: true,
      trim: true,
    },
    website: String,
    province: String,
    description: String,
    logoUrl: String,
  },
  { timestamps: true }
);

EmployerSchema.index({ orgName: 1 });
EmployerSchema.index({ site: 1 });

export const Employer = models.Employer || model("Employer", EmployerSchema);
