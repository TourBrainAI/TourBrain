import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();

    const { status, priority, tags, internalNotes, assignedTo, markContacted } =
      body ?? {};

    const data: any = {};

    if (status) data.status = status;
    if (typeof priority === "number") data.priority = priority;
    if (Array.isArray(tags)) data.tags = tags;
    if (typeof internalNotes === "string") data.internalNotes = internalNotes;
    if (typeof assignedTo === "string") data.assignedTo = assignedTo;

    if (markContacted === true) {
      data.lastContactedAt = new Date();
      if (!status) {
        data.status = "CONTACTED";
      }
    }

    const updated = await prisma.waitlistEntry.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, entry: updated });
  } catch (err) {
    console.error("Admin waitlist update error:", err);
    return NextResponse.json(
      { error: "Failed to update waitlist entry" },
      { status: 500 }
    );
  }
}
