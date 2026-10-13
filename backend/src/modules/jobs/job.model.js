import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ApplyMethodSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["email", "phone", "mail", "inPerson"],
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    mailAddress: {
      type: String,
      trim: true,
    },
    inPersonAddress: {
      type: String,
      trim: true,
    },
    inPersonTiming: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const JobSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    site: {
      type: String,
      enum: ["getjobscanada", "aboriginal", "youthemployment"],
      default: "getjobscanada",
      index: true,
    },
    jobId: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      default: "",
    },
    salaryType: {
      type: String,
      default: "hour",
      lowercase: true,
      trim: true,
    },
    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "EmployerPackage",
      default: null,
    },
    creditConsumed: {
      type: Boolean,
      default: false,
    },
    employmentType: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    nocCode: {
      type: String,
      trim: true,
      default: "",
    },
    runDays: {
      type: String,
      default: "30",
    },
    experience: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: String,
      default: "",
      trim: true,
    },
    positionType: {
      type: String,
      default: "",
      trim: true,
    },
    education: {
      type: String,
      default: "",
      trim: true,
    },
    travel: {
      type: String,
      default: "",
      trim: true,
    },
    vacation: {
      type: String,
      default: "",
      trim: true,
    },
    contactType: {
      type: String,
      default: "",
      trim: true,
    },
    descriptionHtml: {
      type: String,
      required: true,
    },
    requirementsHtml: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    indigenousOwned: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    indigenousPreference: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "expired"],
      default: "active",
    },
    applyMethods: {
      type: [ApplyMethodSchema],
      required: true,
    },
    postDate: {
      type: Date,
      default: Date.now,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

JobSchema.index({ employerId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ province: 1 });
JobSchema.index({ postedAt: -1 });

export const Job = models.Job || model("Job", JobSchema);
