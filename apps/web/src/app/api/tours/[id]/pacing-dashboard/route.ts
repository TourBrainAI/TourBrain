import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { calculateShowRisk } from "@/lib/analytics/ticketingAnalytics";

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

    const tourId = params.id;
    const { searchParams } = new URL(request.url);
    const riskFilter = searchParams.get("risk"); // 'HEALTHY', 'NEEDS_ATTENTION', 'AT_RISK'
    const sortBy = searchParams.get("sort") || "date"; // 'date', 'risk', 'sellthrough'
    const sortOrder = searchParams.get("order") || "asc";

    // Get tour with shows and their latest snapshots
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
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
      include: {
        artist: {
          select: { name: true },
        },
        shows: {
          include: {
            venue: {
              select: {
                name: true,
                city: true,
                state: true,
                capacity: true,
              },
            },
            ticketSnapshots: {
              orderBy: {
                capturedAt: "desc",
              },
              take: 1, // Get only the latest snapshot
            },
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found or access denied" },
        { status: 404 }
      );
    }

    // Calculate analytics for each show
    const showAnalytics = tour.shows.map((show) => {
      const latestSnapshot = show.ticketSnapshots[0];
      const riskAssessment = calculateShowRisk(show, latestSnapshot);
      const capacity = show.capacity || show.venue.capacity || 1000;

      return {
        id: show.id,
        date: show.date,
        venue: show.venue,
        capacity,
        status: show.status,
        ticketsSold: latestSnapshot?.ticketsSold || 0,
        sellThroughPct: latestSnapshot?.sellThroughPct || 0,
        grossSales: latestSnapshot?.grossSales || 0,
        daysUntilShow: riskAssessment.daysUntilShow,
        riskAssessment: {
          riskLevel: riskAssessment.riskLevel,
          riskScore: riskAssessment.riskScore,
          reasoning: riskAssessment.reasoning,
          recommendations: riskAssessment.recommendations,
        },
        lastUpdated: latestSnapshot?.capturedAt,
        hasData: !!latestSnapshot,
      };
    });

    // Filter by risk level if specified
    let filteredShows = showAnalytics;
    if (riskFilter) {
      filteredShows = showAnalytics.filter(
        (show) => show.riskAssessment.riskLevel === riskFilter
      );
    }

    // Sort shows
    filteredShows.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "risk":
          comparison = b.riskAssessment.riskScore - a.riskAssessment.riskScore; // Higher risk first
          break;
        case "sellthrough":
          comparison = b.sellThroughPct - a.sellThroughPct; // Higher sell-through first
          break;
        case "venue":
          comparison = a.venue.name.localeCompare(b.venue.name);
          break;
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    // Calculate tour-level statistics
    const tourStats = {
      totalShows: tour.shows.length,
      showsWithData: showAnalytics.filter((s) => s.hasData).length,
      riskDistribution: {
        HEALTHY: showAnalytics.filter(
          (s) => s.riskAssessment.riskLevel === "HEALTHY"
        ).length,
        NEEDS_ATTENTION: showAnalytics.filter(
          (s) => s.riskAssessment.riskLevel === "NEEDS_ATTENTION"
        ).length,
        AT_RISK: showAnalytics.filter(
          (s) => s.riskAssessment.riskLevel === "AT_RISK"
        ).length,
      },
      totalCapacity: showAnalytics.reduce(
        (sum, show) => sum + show.capacity,
        0
      ),
      totalTicketsSold: showAnalytics.reduce(
        (sum, show) => sum + show.ticketsSold,
        0
      ),
      totalGrossSales: showAnalytics.reduce(
        (sum, show) => sum + show.grossSales,
        0
      ),
      averageSellThrough:
        showAnalytics.length > 0
          ? showAnalytics.reduce((sum, show) => sum + show.sellThroughPct, 0) /
            showAnalytics.length
          : 0,
    };

    tourStats.totalCapacity &&
      (tourStats.totalSellThroughPct =
        (tourStats.totalTicketsSold / tourStats.totalCapacity) * 100);

    // Identify shows needing immediate attention
    const urgentShows = showAnalytics.filter(
      (show) =>
        show.riskAssessment.riskLevel === "AT_RISK" && show.daysUntilShow <= 7
    );

    return NextResponse.json({
      tour: {
        id: tour.id,
        name: tour.name,
        artist: tour.artist,
        startDate: tour.startDate,
        endDate: tour.endDate,
        status: tour.status,
      },
      shows: filteredShows,
      stats: tourStats,
      urgentShows,
      filters: {
        risk: riskFilter,
        sort: sortBy,
        order: sortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching tour pacing dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
