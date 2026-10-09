import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { collection, ensureIndexes } from "@/server/db/mongo";
import type {
  AccountDoc,
  EmployerDoc,
  EmployerPackageDoc,
  UserDoc,
} from "@/server/db/models";
import { hashPassword } from "@/server/auth/local-auth";

function validatePassword(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter.";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must include at least one number.";
  return null;
}

export async function POST(req: NextRequest) {
  await ensureIndexes();
  const body = await req.json().catch(() => ({}));
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const username = String(body.username ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");
  const businessName = String(body.businessName ?? "").trim();
  const phoneNumber = String(body.phoneNumber ?? "").trim();
  const province = String(body.province ?? "").trim();

  // Validation
  if (!firstName)
    return NextResponse.json(
      { error: "First name is required." },
      { status: 400 },
    );
  if (!lastName)
    return NextResponse.json(
      { error: "Last name is required." },
      { status: 400 },
    );
  if (!businessName)
    return NextResponse.json(
      { error: "Business name is required." },
      { status: 400 },
    );
  if (!phoneNumber)
    return NextResponse.json(
      { error: "Phone number is required." },
      { status: 400 },
    );
  if (!province)
    return NextResponse.json(
      { error: "Province is required." },
      { status: 400 },
    );
  if (!username)
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 },
    );

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const passwordError = validatePassword(password);
  if (passwordError)
    return NextResponse.json({ error: passwordError }, { status: 400 });

  // Check for duplicate email/username
  const users = await collection<UserDoc>("users");
  const duplicate = await users.findOne({ $or: [{ email }, { username }] });
  if (duplicate?.email === email)
    return NextResponse.json(
      { error: "Email already exists." },
      { status: 409 },
    );
  if (duplicate?.username === username)
    return NextResponse.json(
      { error: "Username already exists." },
      { status: 409 },
    );

  const now = new Date();
  const userId = randomUUID();
  const employerId = randomUUID();
  const packageId = randomUUID();
  const fullName = `${firstName} ${lastName}`.trim();

  await users.insertOne({
    id: userId,
    name: fullName,
    email,
    emailVerified: true,
    image: null,
    username,
    firstName,
    lastName,
    phoneNumber,
    accountType: "employer",
    createdAt: now,
    updatedAt: now,
  });

  // Create account
  await (
    await collection<AccountDoc>("accounts")
  ).insertOne({
    id: randomUUID(),
    accountId: email,
    providerId: "credential",
    userId,
    password: hashPassword(password),
    createdAt: now,
    updatedAt: now,
  });

  // Create employer profile
  await (
    await collection<EmployerDoc>("employers")
  ).insertOne({
    id: employerId,
    userId,
    orgName: businessName,
    phoneNumber,
    province,
    createdAt: now,
    updatedAt: now,
  });

  // Create employer package
  await (
    await collection<EmployerPackageDoc>("employerPackages")
  ).insertOne({
    id: packageId,

    employerId,

    packageName: "Free Plan",

    remainingCredits: 3,

    totalCreditsPurchased: 3,

    unlimitedJobs: false,

    isFreePlan: true,

    jobPostExpiryDays: 180,

    status: "Active",

    purchasedAt: now,

    expiresAt: null,

    creditExpiresAt: null,

    createdAt: now,

    updatedAt: now,
  });

  return NextResponse.json(
    {
      success: true,
      user: {
        id: userId,
        name: fullName,
        email,
        emailVerified: true,
        username,
        firstName,
        lastName,
        phoneNumber,
        accountType: "employer",
      },
      employerProfile: {
        businessName,
        phoneNumber,
        province,
        packageName: "Free Plan",
        packageStatus: "Active",
        remainingCredits: 3,
        totalCreditsPurchased: 3,
        isFreePlan: true,
        jobPostExpiryDays: 180,
      },
    },
    { status: 201 },
  );
}
