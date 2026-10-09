import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "jobs_posts",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "fallback-secret",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  
  // Admin Credentials
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com.ca",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin@12345",
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || "getjobscanada-admin-jwt-secret-secure",

  // Email & Resend
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || "inquiries@getjobscanada.ca",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || "GetJobsCanada <info@getjobscanada.ca>",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
