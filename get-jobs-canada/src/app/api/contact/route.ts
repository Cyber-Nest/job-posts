import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail/sendContactEmail";

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      subject,
      message,
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 }
      );
    }

    await sendContactEmail({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}