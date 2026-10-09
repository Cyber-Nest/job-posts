import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { collection, ensureIndexes } from "@/server/db/mongo";
import type {
  AccountDoc,
  EmployerDoc,
  EmployerPackageDoc,
  SessionDoc,
  UserDoc,
} from "@/server/db/models";

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `${salt.toString("base64")}$${derived.toString("base64")}`;
}

export function verifyPassword(
  password: string,
  storedHash?: string | null,
): boolean {
  if (!storedHash) return false;
  const [salt, storedDerived] = storedHash.split("$");
  if (!salt || !storedDerived) return false;

  try {
    const saltBuffer = Buffer.from(salt, "base64");
    const storedBuffer = Buffer.from(storedDerived, "base64");
    const derived = scryptSync(password, saltBuffer, storedBuffer.length);
    return (
      derived.length === storedBuffer.length &&
      timingSafeEqual(derived, storedBuffer)
    );
  } catch {
    return false;
  }
}

export async function findUserByIdentifier(identifier: string) {
  await ensureIndexes();
  const normalized = identifier.toLowerCase().trim();
  const users = await collection<UserDoc>("users");
  return users.findOne({
    $or: [{ email: normalized }, { username: normalized }],
  });
}

export async function findUserById(userId: string) {
  const users = await collection<UserDoc>("users");
  return users.findOne({ id: userId });
}

export async function findAccountByUserId(userId: string) {
  const accounts = await collection<AccountDoc>("accounts");
  return accounts.findOne({ userId });
}

export async function createLocalSession(userId: string) {
  const token = randomUUID();
  const now = new Date();
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day
  const requestHeaders = await headers();
  const sessions = await collection<SessionDoc>("sessions");

  await sessions.insertOne({
    id: randomUUID(),
    token,
    userId,
    expiresAt,
    ipAddress:
      String(requestHeaders.get("x-forwarded-for") ?? "")
        .split(",")[0]
        .trim() || null,
    userAgent: requestHeaders.get("user-agent") || null,
    createdAt: now,
    updatedAt: now,
  });

  return { token, expiresAt };
}

export async function getSessionByToken(token: string) {
  const sessions = await collection<SessionDoc>("sessions");
  return sessions.findOne({ token, expiresAt: { $gt: new Date() } });
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("local_session")?.value;
  if (!token) return null;
  return getSessionByToken(token);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session) return null;
  return findUserById(session.userId);
}

export async function deleteSessionByToken(token: string) {
  const sessions = await collection<SessionDoc>("sessions");
  await sessions.deleteOne({ token });
}

export async function fetchEmployerProfile(userId: string) {
  const employers = await collection<EmployerDoc>("employers");
  const packages = await collection<EmployerPackageDoc>("employerPackages");
  const employer = await employers.findOne({ userId });

  if (!employer) {
    return { employerProfile: null, package: null };
  }

  const packageData = await packages.findOne({ employerId: employer.id });

  return {
    employerProfile: {
      businessName: employer.orgName,
      phoneNumber: employer.phoneNumber ?? null,
      province: employer.province ?? null,
    },
    package: packageData
      ? {
          packageName: packageData.packageName,
          remainingCredits: packageData.remainingCredits,
          totalCreditsPurchased: packageData.totalCreditsPurchased,
          unlimitedJobs: packageData.unlimitedJobs,
          isFreePlan: packageData.isFreePlan,
          jobPostExpiryDays: packageData.jobPostExpiryDays,
          status: packageData.status,
          expiresAt: packageData.expiresAt ?? null,
        }
      : null,
  };
}

export function publicUser(user: UserDoc) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phoneNumber: user.phoneNumber ?? "",
    accountType: user.accountType,
  };
}
