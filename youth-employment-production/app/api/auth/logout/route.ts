import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { getCurrentUser } from "@/server/auth/local-auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Delete user session from database
      const sessions = await collection("sessions");
      await sessions.deleteMany({ userId: user.id });
    }

    // Create response with cookie deletion
    const response = NextResponse.json({ success: true });
    response.cookies.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
