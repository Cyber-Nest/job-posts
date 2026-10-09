import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ isEmployer: false });
    }
    
    const userCollection = mongoose.connection.collection("user");
    const user = await userCollection.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ isEmployer: false });
    }
    
    const employerCollection = mongoose.connection.collection("employers");
    const employer = await employerCollection.findOne({ authUserId: user._id.toString() });
    
    return NextResponse.json({ isEmployer: !!employer });
  } catch (error) {
    console.error("Check employer error:", error);
    return NextResponse.json({ isEmployer: false });
  }
}