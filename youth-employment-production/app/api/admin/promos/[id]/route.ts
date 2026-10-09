import { NextRequest, NextResponse } from "next/server";

import { collection } from "@/server/db/mongo";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    const promoCodes = await collection("promoCodes");

    const existingPromo = await promoCodes.findOne({
      id,
    });

    if (!existingPromo) {
      return NextResponse.json(
        {
          error: "Promo code not found",
        },
        {
          status: 404,
        },
      );
    }

    await promoCodes.deleteOne({
      id,
    });

    return NextResponse.json({
      success: true,

      message: "Promo code deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete promo code",
      },
      {
        status: 500,
      },
    );
  }
}
