import mongoose from "mongoose";

export async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.["better-auth.session_token"] ||
      req.cookies?.["__Secure-better-auth.session_token"] ||
      req.cookies?.["__Host-better-auth.session_token"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, error: "Authentication required." });
    }

    // Lookup session in MongoDB 'session' collection
    const db = mongoose.connection.db;
    const sessionCollection = db.collection("session");
    const sessionDoc = await sessionCollection.findOne({ token });

    if (!sessionDoc || new Date(sessionDoc.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, error: "Session expired or invalid." });
    }

    const userCollection = db.collection("user");
    const userDoc = await userCollection.findOne({ _id: sessionDoc.userId });

    if (!userDoc) {
      return res.status(401).json({ success: false, error: "User not found." });
    }

    req.user = {
      id: String(userDoc._id),
      email: userDoc.email,
      name: userDoc.name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, error: "Authentication failed." });
  }
}
