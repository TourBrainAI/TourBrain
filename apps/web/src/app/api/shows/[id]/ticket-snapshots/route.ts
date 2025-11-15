import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// CSV row validation schema
const TicketSnapshotRowSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  tier: z.string().optional(),
  sold: z.number().min(0),
  available: z.number().min(0),
  gross: z.number().min(0),
});

const TicketSnapshotUploadSchema = z.object({
  showId: z.string(),
  csvData: z.array(TicketSnapshotRowSchema),
  source: z.string().default("CSV_UPLOAD"),
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

    // Validate the request data
    const { csvData, source } = TicketSnapshotUploadSchema.parse({
      showId,
      csvData: body.csvData,
      source: body.source,
    });

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
        tour: true,
      },
    });

    if (!show) {
      return NextResponse.json(
        { error: "Show not found or access denied" },
        { status: 404 }
      );
    }

    const capacity = show.capacity || show.venue.capacity || 1000;
    const showDate = new Date(show.date);

    // Process CSV data and create snapshots
    const snapshots = [];
    const errors = [];

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];

      try {
        // Validate row data
        if (row.sold > row.sold + row.available) {
          errors.push(`Row ${i + 1}: Sold tickets cannot exceed total tickets`);
          continue;
        }

        const capturedAt = new Date(row.date);
        const daysUntilShow = Math.ceil(
          (showDate.getTime() - capturedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        const ticketsSold = row.sold;
        const ticketsAvailable = row.available;
        const totalTickets = ticketsSold + ticketsAvailable;
        const sellThroughPct =
          totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0;

        // Create tier breakdown if tier is specified
        const tierBreakdown = row.tier
          ? {
              [row.tier]: {
                sold: row.sold,
                available: row.available,
                gross: row.gross,
              },
            }
          : null;

        const snapshotData = {
          showId: showId,
          capturedAt: capturedAt,
          ticketsSold: ticketsSold,
          ticketsAvailable: ticketsAvailable,
          grossSales: row.gross,
          sellThroughPct: sellThroughPct,
          daysUntilShow: daysUntilShow,
          tierBreakdown: tierBreakdown,
          source: source,
          uploadedBy: userId,
        };

        snapshots.push(snapshotData);
      } catch (error) {
        errors.push(
          `Row ${i + 1}: ${
            error instanceof Error ? error.message : "Invalid data"
          }`
        );
      }
    }

    // Bulk create valid snapshots
    let createdSnapshots = [];
    if (snapshots.length > 0) {
      // Use upsert to handle duplicate timestamps
      createdSnapshots = await Promise.all(
        snapshots.map((snapshot) =>
          prisma.ticketSnapshot.upsert({
            where: {
              // Use composite key of showId and capturedAt for uniqueness
              id: `${showId}-${snapshot.capturedAt.toISOString()}`,
            },
            update: snapshot,
            create: snapshot,
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      imported: createdSnapshots.length,
      errors: errors,
      snapshots: createdSnapshots,
    });
  } catch (error) {
    console.error("Error uploading ticket snapshots:", error);

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

// Get ticket snapshots for a show
export async function GET(
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const sort = searchParams.get("sort") || "desc";

    // Verify access to show
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
    });

    if (!show) {
      return NextResponse.json(
        { error: "Show not found or access denied" },
        { status: 404 }
      );
    }

    // Get ticket snapshots
    const snapshots = await prisma.ticketSnapshot.findMany({
      where: {
        showId: showId,
      },
      orderBy: {
        capturedAt: sort === "asc" ? "asc" : "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      snapshots,
      count: snapshots.length,
    });
  } catch (error) {
    console.error("Error fetching ticket snapshots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
