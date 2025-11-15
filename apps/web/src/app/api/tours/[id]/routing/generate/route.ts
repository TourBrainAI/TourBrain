import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRoutingScenario } from "@/lib/routing/routingEngine";

interface RoutingConstraints {
  startDate: string;
  endDate: string;
  regions?: string[];
  states?: string[];
  maxDriveHours: number;
  maxConsecutiveDays: number;
  requiredVenues?: string[];
  offDays?: string[];
  capacityRange?: {
    min?: number;
    max?: number;
  };
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
      include: {
        artist: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      constraints,
    }: { name: string; constraints: RoutingConstraints } = body;

    // Validate constraints
    if (!constraints.startDate || !constraints.endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Get available venues based on constraints
    const venues = await prisma.venue.findMany({
      where: {
        organizationId,
        ...(constraints.capacityRange && {
          capacity: {
            gte: constraints.capacityRange.min,
            lte: constraints.capacityRange.max,
          },
        }),
        ...(constraints.states &&
          constraints.states.length > 0 && {
            state: {
              in: constraints.states,
            },
          }),
      },
      include: {
        climateProfiles: true,
      },
      orderBy: {
        city: "asc",
      },
    });

    if (venues.length === 0) {
      return NextResponse.json(
        { error: "No venues found matching the specified constraints" },
        { status: 400 }
      );
    }

    // Generate routing scenario using the routing engine
    const scenarioStops = await generateRoutingScenario({
      venues,
      constraints,
      tourId: params.id,
    });

    // Create the routing scenario in the database
    const scenario = await prisma.routingScenario.create({
      data: {
        tourId: params.id,
        name: name || `Route ${new Date().toLocaleDateString()}`,
        status: "DRAFT",
        constraints: constraints as any,
        stops: {
          create: scenarioStops.map((stop, index) => ({
            venueId: stop.venueId,
            date: stop.date,
            sequence: index + 1,
            driveTime: stop.driveTime,
            notes: stop.notes,
          })),
        },
      },
      include: {
        stops: {
          include: {
            venue: {
              include: {
                climateProfiles: true,
              },
            },
          },
          orderBy: {
            sequence: "asc",
          },
        },
      },
    });

    return NextResponse.json({ scenario });
  } catch (error) {
    console.error("Error generating routing scenario:", error);
    return NextResponse.json(
      { error: "Failed to generate routing scenario" },
      { status: 500 }
    );
  }
}
