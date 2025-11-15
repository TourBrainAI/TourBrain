import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { organizationId } = await getCurrentUser();

    if (!organizationId) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 403 }
      );
    }

    // Verify tour belongs to organization
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.id,
        organizationId,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Get all routing scenarios for the tour
    const scenarios = await prisma.routingScenario.findMany({
      where: {
        tourId: params.id,
      },
      include: {
        stops: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
                capacity: true,
                isOutdoor: true,
              },
            },
          },
          orderBy: {
            sequence: "asc",
          },
        },
        _count: {
          select: {
            stops: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error("Error fetching routing scenarios:", error);
    return NextResponse.json(
      { error: "Failed to fetch routing scenarios" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { organizationId } = await getCurrentUser();

    if (!organizationId) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 403 }
      );
    }

    // Verify tour belongs to organization
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.id,
        organizationId,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const body = await request.json();
    const { scenarioId, action } = body;

    if (action === "apply") {
      // Apply the scenario by creating shows
      const scenario = await prisma.routingScenario.findFirst({
        where: {
          id: scenarioId,
          tourId: params.id,
        },
        include: {
          stops: {
            include: {
              venue: true,
            },
            orderBy: {
              sequence: "asc",
            },
          },
        },
      });

      if (!scenario) {
        return NextResponse.json(
          { error: "Scenario not found" },
          { status: 404 }
        );
      }

      // Check for existing shows on the same dates
      const existingShows = await prisma.show.findMany({
        where: {
          tourId: params.id,
          date: {
            in: scenario.stops.map((stop) => stop.date),
          },
        },
      });

      if (existingShows.length > 0) {
        return NextResponse.json(
          {
            error: "Some dates already have shows scheduled",
            conflictingDates: existingShows.map((show) => show.date),
          },
          { status: 409 }
        );
      }

      // Create shows from scenario stops
      const shows = await Promise.all(
        scenario.stops.map(async (stop) => {
          return prisma.show.create({
            data: {
              tourId: params.id,
              venueId: stop.venueId,
              date: stop.date,
              status: "INQUIRY",
              notes: stop.notes || "",
            },
            include: {
              venue: true,
            },
          });
        })
      );

      // Update scenario status to APPLIED
      await prisma.routingScenario.update({
        where: { id: scenarioId },
        data: { status: "APPLIED" },
      });

      return NextResponse.json({
        success: true,
        showsCreated: shows.length,
        shows,
      });
    }

    if (action === "delete") {
      // Delete the scenario
      await prisma.routingScenario.delete({
        where: {
          id: scenarioId,
          tourId: params.id,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error managing routing scenario:", error);
    return NextResponse.json(
      { error: "Failed to manage routing scenario" },
      { status: 500 }
    );
  }
}
