import { Schema, model, models } from "mongoose";

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

      validate: {
        validator: function (this: any, v: string) {
          if (this.method === "email") {
            return Boolean(v && v.length > 0 && /^\S+@\S+\.\S+$/.test(v));
          }

          return true;
        },

        message: "Valid email is required for email application method",
      },
    },

    phone: {
      type: String,
      trim: true,

      validate: {
        validator: function (this: any, v: string) {
          if (this.method === "phone") {
            return Boolean(v && v.length > 0);
          }

          return true;
        },

        message: "Phone number is required for phone application method",
      },
    },

    mailAddress: {
      type: String,
      trim: true,

      validate: {
        validator: function (this: any, v: string) {
          if (this.method === "mail") {
            return Boolean(v && v.length > 0);
          }

          return true;
        },

        message: "Mail address is required for mail application method",
      },
    },

    inPersonAddress: {
      type: String,
      trim: true,

      validate: {
        validator: function (this: any, v: string) {
          if (this.method === "inPerson") {
            return Boolean(v && v.length > 0);
          }

          return true;
        },

        message:
          "In-person address is required for in-person application method",
      },
    },

    inPersonTiming: {
      type: String,
      trim: true,

      validate: {
        validator: function (this: any, v: string) {
          if (this.method === "inPerson") {
            return Boolean(v && v.length > 0);
          }

          return true;
        },

        message: "Time schedule is required for in-person application method",
      },
    },
  },
  {
    _id: false,
  },
);

const JobSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    jobId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
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
      enum: ["hour", "week", "month", "year"],
      default: "hour",
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
      enum: ["Full-time", "Part-time", "Contract", "Casual", "Volunteer"],
      required: true,
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
      enum: ["30", "60", "90", "120", "150"],
      default: "30",
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: String,
      enum: ["asap", "immediate", "1week", "2weeks", "1month", ""],
      default: "",
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

      validate: {
        validator: function (v: any[]) {
          return Array.isArray(v) && v.length > 0;
        },

        message: "At least one application method is required",
      },
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
  {
    timestamps: true,
  },
);

JobSchema.virtual("fullLocation").get(function () {
  return [this.city, this.province].filter(Boolean).join(", ");
});

JobSchema.virtual("displayDate").get(function () {
  return this.postDate || this.postedAt;
});

JobSchema.index({ employerId: 1 });

JobSchema.index({ status: 1 });

JobSchema.index({ category: 1 });

JobSchema.index({ province: 1 });

JobSchema.index({ postedAt: -1 });

JobSchema.set("toJSON", {
  virtuals: true,
});

JobSchema.set("toObject", {
  virtuals: true,
});

export const Job = models.Job || model("Job", JobSchema);
