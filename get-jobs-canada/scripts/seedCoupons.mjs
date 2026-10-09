import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "get_jobs_canada";

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// 5 Plans & Prefixes
const PACKAGES = [
  { name: "Starter", prefix: "ST" },
  { name: "Deluxe", prefix: "DE" },
  { name: "Ultimate", prefix: "UL" },
  { name: "Pro Plan", prefix: "PP" },
  { name: "Unlimited", prefix: "UN" },
];

const TARGET_PER_PACKAGE = 100; // 100 each = 500 total

// Define PromoCode Schema directly in script for standalone execution
const PromoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    packageName: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Unused", "Used"], default: "Unused" },
    assignedName: { type: String, default: null },
    assignedEmail: { type: String, default: null },
    assignedAt: { type: Date, default: null },
    redeemedName: { type: String, default: null },
    redeemedEmail: { type: String, default: null },
    redeemedAt: { type: Date, default: null },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", default: null },
  },
  { timestamps: true }
);

const PromoCode = mongoose.models.PromoCode || mongoose.model("PromoCode", PromoCodeSchema);

function generateCode(prefix, setOfCodes) {
  let code;
  do {
    const num = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
    code = `${prefix}-${num}-CA`;
  } while (setOfCodes.has(code));
  setOfCodes.add(code);
  return code;
}

async function seedCoupons() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log("✅ Connected to database:", MONGODB_DB_NAME);

    const existingCodes = await PromoCode.find({}).select("code");
    const usedCodesSet = new Set(existingCodes.map((c) => c.code));

    let totalCreated = 0;

    for (const pkg of PACKAGES) {
      const existingCount = await PromoCode.countDocuments({ packageName: pkg.name });
      console.log(`\n📦 Checking ${pkg.name}: Existing = ${existingCount} / ${TARGET_PER_PACKAGE}`);

      if (existingCount >= TARGET_PER_PACKAGE) {
        console.log(`   ✨ ${pkg.name} already has ${existingCount} coupons. Skipping generation.`);
        continue;
      }

      const needed = TARGET_PER_PACKAGE - existingCount;
      const newDocs = [];

      for (let i = 0; i < needed; i++) {
        const code = generateCode(pkg.prefix, usedCodesSet);
        newDocs.push({
          code,
          packageName: pkg.name,
          status: "Unused",
        });
      }

      if (newDocs.length > 0) {
        await PromoCode.insertMany(newDocs, { ordered: false });
        console.log(`   ✅ Successfully created ${newDocs.length} coupons for ${pkg.name}`);
        totalCreated += newDocs.length;
      }
    }

    console.log(`\n🎉 SEED COMPLETE! Total new coupons generated: ${totalCreated}`);

    // Print summary table
    const finalSummary = [];
    for (const pkg of PACKAGES) {
      const count = await PromoCode.countDocuments({ packageName: pkg.name });
      finalSummary.push({ Package: pkg.name, TotalCoupons: count });
    }
    console.table(finalSummary);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();

//script code to run on terminal
//node scripts/seedCoupons.mjs
