import { NextRequest, NextResponse } from "next/server";

// Waitlist functionality has been removed
export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { error: "Waitlist functionality has been removed" },
    { status: 410 }
  );
}
