export type AccountType = "jobseeker" | "employer";
export type EmployerPackageStatus = "Active" | "Inactive" | "Expired";
export type JobStatus = "draft" | "active" | "closed" | "expired";
export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected";
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Temporary"
  | "Casual"
  | "Seasonal";

export type UserDoc = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  accountType: AccountType;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountDoc = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionDoc = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EmployerDoc = {
  id: string;
  userId: string;
  orgName: string;
  phoneNumber?: string | null;
  website?: string | null;
  province?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EmployerPackageDoc = {
  id: string;
  employerId: string;
  packageName: string;
  remainingCredits: number;
  totalCreditsPurchased: number;
  unlimitedJobs: boolean;
  isFreePlan: boolean;
  jobPostExpiryDays: number;
  status: EmployerPackageStatus;
  purchasedAt: Date;
  expiresAt?: Date | null;
  creditExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EmployerPackageHistoryDoc = {
  id: string;
  employerId: string;
  packageName: string;
  creditsAdded: number;
  unlimitedJobs: boolean;
  promoCodeUsed?: string | null;
  isFreePlan: boolean;
  jobPostExpiryDays: number;
  purchasedAt: Date;
  expiresAt?: Date | null;
  paymentStatus: "pending" | "paid" | "failed";
  paymentProvider?: string | null;
  transactionId?: string | null;
  amount?: number | null;
  currency?: string | null;
  paymentMethod?: string | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PromoCodeDoc = {
  id: string;
  code: string;
  packageName: string;
  status: "Unused" | "Used";
  assignedName?: string | null;
  assignedEmail?: string | null;
  assignedAt?: Date | null;
  redeemedName?: string | null;
  redeemedEmail?: string | null;
  redeemedAt?: Date | null;
  employerId?: string | null;
  active?: boolean;
  usedCount?: number;
  maxUses?: number | null;
  expiresAt?: Date | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentTransactionDoc = {
  id: string;
  employerId: string;
  packageName: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  paymentProvider: string;
  paymentMethod?: string | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  promoCodeUsed?: string | null;
  isPromoPayment: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type JobDoc = {
  remote: boolean;
  id: string;
  jobUniqueId: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  province: string;
  salary?: string | null;
  salaryPeriod?: string | null;
  vacancies?: number | null;
  adDurationDays: number;
  packageId?: string | null;
  creditConsumed?: boolean;
  startDate?: string | null;
  positionType?: string | null;
  experience?: string | null;
  education?: string | null;
  travel?: string | null;
  vacation?: string | null;
  jobPostingDate?: string | null;
  nocCode?: string | null;
  contactName?: string | null;
  contactType?: string | null;
  contactCompany?: string | null;
  applyByEmail: boolean;
  applicationEmail?: string | null;
  applyByMail: boolean;
  mailingAddress?: string | null;
  applyByPhone: boolean;
  applicationPhone?: string | null;
  applyInPerson: boolean;
  inPersonAddress?: string | null;
  inPersonFromTime?: string | null;
  inPersonToTime?: string | null;
  employmentType: EmploymentType;
  category: string;
  description: string;
  requirements?: string | null;
  status: JobStatus;
  indigenousPreference: boolean;
  website?: string | null;
  postedAt: Date | undefined;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactInquiryDoc = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ApplicationDoc = {
  id: string;
  jobId: string;
  userId: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
};

export type AdminDoc = {
  email: string;
  password: string;
  emailChangeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OTPPurpose = "registration" | "password_reset" | "admin_change";

export type OTPDoc = {
  id: string;
  email: string;
  otp: string;
  purpose: OTPPurpose;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
};

export type PackageDoc = {
  _id?: any;
  name: string;            // Fixed — Starter | Deluxe | Ultimate | Pro Plan | Unlimited
  originalPrice: number;
  discountedPrice: number;
  tagline: string;
  badge: string;
  features: string[];
  highlight: boolean;      
  darkVariant: boolean;    
  order: number;           
  credits: number;         
  expiryDays: number;      
  unlimitedJobs: boolean;  // whether this plan offers unlimited postings
  active?: boolean;        // whether this plan is active/visible in public views
  createdAt: Date;
  updatedAt: Date;
};
