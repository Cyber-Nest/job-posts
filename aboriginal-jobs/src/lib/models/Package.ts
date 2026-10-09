import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPackage extends Document {
  name: string;            // Fixed — Starter | Deluxe | Ultimate | Pro Plan | Unlimited
  originalPrice: number;
  discountedPrice: number;
  tagline: string;
  badge: string;
  features: string[];
  highlight: boolean;      // visual: highlighted card (Deluxe)
  darkVariant: boolean;    // visual: dark card (Unlimited)
  order: number;           // display order
  credits: number;         // actual job posting credits assigned on purchase
  expiryDays: number;      // package validity duration in days
  unlimitedJobs: boolean;  // whether this plan offers unlimited postings
  active: boolean;         // whether this plan is active/visible in public views
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    tagline: { type: String, required: true },
    badge: { type: String, default: "" },
    features: [{ type: String }],
    highlight: { type: Boolean, default: false },
    darkVariant: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    credits: { type: Number, required: true, default: 0 },
    expiryDays: { type: Number, required: true, default: 180 },
    unlimitedJobs: { type: Boolean, required: true, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Package: Model<IPackage> =
  mongoose.models.Package ||
  mongoose.model<IPackage>("Package", PackageSchema);

// Default seed data matching current hardcoded values
export const DEFAULT_PACKAGES = [
  {
    name: "Starter",
    originalPrice: 25,
    discountedPrice: 12.5,
    tagline: "FEATURES OF STARTER PLAN",
    badge: "50% OFF",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "1 Job Posting",
    ],
    highlight: false,
    darkVariant: false,
    order: 1,
    credits: 1,
    expiryDays: 180,
    unlimitedJobs: false,
    active: true,
  },
  {
    name: "Deluxe",
    originalPrice: 95,
    discountedPrice: 47.5,
    tagline: "FEATURES OF DELUXE PLAN",
    badge: "Most Popular • 50% OFF",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "5 Job Posting",
    ],
    highlight: true,
    darkVariant: false,
    order: 2,
    credits: 5,
    expiryDays: 180,
    unlimitedJobs: false,
    active: true,
  },
  {
    name: "Ultimate",
    originalPrice: 195,
    discountedPrice: 97.5,
    tagline: "FEATURES OF ULTIMATE PLAN",
    badge: "50% OFF",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "10 Job Posting",
    ],
    highlight: false,
    darkVariant: false,
    order: 3,
    credits: 10,
    expiryDays: 180,
    unlimitedJobs: false,
    active: true,
  },
  {
    name: "Pro Plan",
    originalPrice: 380,
    discountedPrice: 190,
    tagline: "FEATURES OF PRO PLAN",
    badge: "Best Value • 50% OFF",
    features: [
      "Job Post Expiry - 180 Days",
      "Credit Never Expire",
      "20 Job Posting",
    ],
    highlight: false,
    darkVariant: false,
    order: 4,
    credits: 20,
    expiryDays: 180,
    unlimitedJobs: false,
    active: true,
  },
  {
    name: "Unlimited",
    originalPrice: 1350,
    discountedPrice: 675,
    tagline: "FEATURES OF UNLIMITED PLAN",
    badge: "Mega Deal • 50% OFF",
    features: [
      "Job Post Expiry - 365 Days",
      "Unlimited Job Posting",
      "Priority Employer Support",
    ],
    highlight: false,
    darkVariant: true,
    order: 5,
    credits: 0,
    expiryDays: 365,
    unlimitedJobs: true,
    active: true,
  },
];
