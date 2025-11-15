import { NextRequest, NextResponse } from "next/server";

// Waitlist functionality has been removed
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: "Waitlist functionality has been removed" },
    { status: 410 }
  );
}
