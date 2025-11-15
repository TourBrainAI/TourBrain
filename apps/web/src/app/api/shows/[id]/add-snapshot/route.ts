import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ManualSnapshotSchema = z.object({
  capturedAt: z.string().transform((str) => new Date(str)),
  ticketsSold: z.number().min(0),
  ticketsAvailable: z.number().min(0),
  grossSales: z.number().min(0),
  notes: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const showId = params.id;
    const body = await request.json();

    const { capturedAt, ticketsSold, ticketsAvailable, grossSales, notes } =
      ManualSnapshotSchema.parse(body);

    // Verify the user has access to this show
    const show = await prisma.show.findFirst({
      where: {
        id: showId,
        tour: {
          organization: {
            OR: [
              { ownerId: userId },
              {
                members: {
                  some: {
                    userId: userId,
                    role: { in: ["OWNER", "ADMIN", "MEMBER"] },
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        venue: true,
      },
    });

    if (!show) {
      return NextResponse.json(
        { error: "Show not found or access denied" },
        { status: 404 }
      );
    }

    // Validate ticket data
    const totalTickets = ticketsSold + ticketsAvailable;
    if (totalTickets <= 0) {
      return NextResponse.json(
        { error: "Total tickets must be greater than 0" },
        { status: 400 }
      );
    }

    const capacity = show.capacity || show.venue.capacity || 1000;
    if (totalTickets > capacity * 1.1) {
      // Allow 10% over capacity for flexibility
      return NextResponse.json(
        {
          error: `Total tickets (${totalTickets}) exceeds venue capacity (${capacity})`,
        },
        { status: 400 }
      );
    }

    // Calculate metrics
    const showDate = new Date(show.date);
    const daysUntilShow = Math.ceil(
      (showDate.getTime() - capturedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const sellThroughPct = (ticketsSold / totalTickets) * 100;

    // Create the snapshot
    const snapshot = await prisma.ticketSnapshot.create({
      data: {
        showId: showId,
        capturedAt: capturedAt,
        ticketsSold: ticketsSold,
        ticketsAvailable: ticketsAvailable,
        grossSales: grossSales,
        sellThroughPct: sellThroughPct,
        daysUntilShow: daysUntilShow,
        source: "MANUAL",
        uploadedBy: userId,
        tierBreakdown: notes ? { notes } : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      snapshot,
    });
  } catch (error) {
    console.error("Error creating manual ticket snapshot:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
