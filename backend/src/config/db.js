import mongoose from "mongoose";
import { env } from "./env.js";
import { encryptPassword } from "../utils/crypto.js";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing.");
    }

    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
    });

    logger.info(`[Database] MongoDB Connected to database: ${env.MONGODB_DB_NAME}`);

    // Seed/Migrate Admin credentials
    await seedAdmin();

    return mongoose.connection;
  } catch (error) {
    logger.error("[Database] MongoDB Connection Error:", { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

async function seedAdmin() {
  try {
    const { Admin } = await import("../modules/admin/admin.model.js");
    const count = await Admin.countDocuments();

    if (count === 0) {
      const email = env.ADMIN_EMAIL;
      const password = env.ADMIN_PASSWORD;
      const encryptedPassword = encryptPassword(password);

      await Admin.create({
        email: email.toLowerCase(),
        password: encryptedPassword,
        emailChangeCount: 0,
      });

      console.log(`[Database] Admin seeded successfully (${email})`);
    } else {
      const admin = await Admin.findOne();
      if (admin) {
        const isBcrypt = admin.password.startsWith("$2") && admin.password.length === 60;
        const isPlaintext = !admin.password.includes(":");

        if (isBcrypt || isPlaintext) {
          const defaultPassword = env.ADMIN_PASSWORD;
          const encrypted = encryptPassword(defaultPassword);
          await Admin.updateOne({ _id: admin._id }, { $set: { password: encrypted } });
          console.log("[Database] Admin password migrated to encrypted format.");
        }
      }
    }
  } catch (error) {
    console.error("[Database] Error seeding admin:", error);
  }
}
