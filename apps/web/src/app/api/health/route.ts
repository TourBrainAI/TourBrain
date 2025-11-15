import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - dbStart;

    // Get basic counts for platform status
    const [tourCount, showCount, venueCount, organizationCount] =
      await Promise.all([
        prisma.tour.count(),
        prisma.show.count(),
        prisma.venue.count(),
        prisma.organization.count(),
      ]);

    // Check AI service availability
    const aiAvailable = !!process.env.OPENAI_API_KEY;

    // Check environment
    const environment = process.env.NODE_ENV || "development";
    const version = "1.0.0"; // TourBrain version

    return NextResponse.json({
      status: "ok",
      version,
      environment,
      services: {
        database: {
          status: "connected",
          responseTime: `${dbTime}ms`,
        },
        ai: {
          status: aiAvailable ? "configured" : "not_configured",
        },
      },
      platform: {
        organizations: organizationCount,
        tours: tourCount,
        shows: showCount,
        venues: venueCount,
      },
      timestamp: new Date().toISOString(),
      message: "TourBrain platform is operational",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        services: {
          database: {
            status: "error",
            error:
              error instanceof Error ? error.message : "Unknown database error",
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
