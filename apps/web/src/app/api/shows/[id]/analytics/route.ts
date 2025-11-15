import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  calculateShowRisk,
  generatePacingData,
  predictShowOutcome,
  generateRecommendedActions,
} from "@/lib/analytics/ticketingAnalytics";

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

    // Get show with snapshots
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
        tour: {
          select: {
            name: true,
            artist: {
              select: { name: true },
            },
          },
        },
        ticketSnapshots: {
          orderBy: {
            capturedAt: "desc",
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

    // Get latest snapshot
    const latestSnapshot = show.ticketSnapshots[0];

    // Calculate risk assessment
    const riskAssessment = calculateShowRisk(show, latestSnapshot);

    // Generate pacing data
    const pacingData = generatePacingData(show.ticketSnapshots.reverse()); // Reverse for chronological order

    // Predict show outcome
    const prediction = predictShowOutcome(show, show.ticketSnapshots);

    // Generate recommended actions
    const recommendedActions = generateRecommendedActions(riskAssessment);

    // Summary statistics
    const totalSnapshots = show.ticketSnapshots.length;
    const firstSnapshot = show.ticketSnapshots[0];
    const pacingPeriodDays =
      firstSnapshot && latestSnapshot
        ? Math.ceil(
            (new Date(latestSnapshot.capturedAt).getTime() -
              new Date(firstSnapshot.capturedAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;

    return NextResponse.json({
      show: {
        id: show.id,
        date: show.date,
        venue: {
          name: show.venue.name,
          city: show.venue.city,
          capacity: show.venue.capacity,
        },
        tour: show.tour,
        capacity: show.capacity || show.venue.capacity,
      },
      riskAssessment,
      pacingData,
      prediction,
      recommendedActions,
      analytics: {
        totalSnapshots,
        pacingPeriodDays,
        latestUpdate: latestSnapshot?.capturedAt,
        dataQuality:
          totalSnapshots >= 5 ? "HIGH" : totalSnapshots >= 3 ? "MEDIUM" : "LOW",
      },
    });
  } catch (error) {
    console.error("Error calculating show analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
