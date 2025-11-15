import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  logActivity,
  ACTIVITY_ACTIONS,
  ENTITY_TYPES,
} from "@/lib/collaboration/activityLogger";
import { generateTourCSV } from "@/lib/exports/tourCSV";
import { generateTourICalendar } from "@/lib/exports/iCal";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { organizationId, userId } = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (!organizationId || !userId) {
      return NextResponse.json(
        { error: "Authentication required" },
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
        organization: true,
        shows: {
          include: {
            venue: true,
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    switch (format) {
      case "csv":
        return await handleCSVExport(tour, userId, organizationId);

      case "ical":
        return await handleICalExport(tour, userId, organizationId);

      default:
        return NextResponse.json(
          { error: "Invalid format. Supported formats: csv, ical" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error exporting tour:", error);
    return NextResponse.json(
      { error: "Failed to export tour" },
      { status: 500 }
    );
  }
}

async function handleCSVExport(
  tour: any,
  userId: string,
  organizationId: string
) {
  // Generate CSV content
  const csvContent = generateTourCSV(tour);

  // Log activity
  await logActivity({
    organizationId,
    tourId: tour.id,
    userId,
    action: ACTIVITY_ACTIONS.TOUR_DATA_EXPORTED,
    entityType: ENTITY_TYPES.TOUR,
    entityId: tour.id,
    metadata: {
      format: "csv",
      showCount: tour.shows.length,
      artist: tour.artist.name,
    },
  });

  // Generate filename
  const filename = `${tour.artist.name}-${tour.name.replace(
    /\s+/g,
    "-"
  )}-tour-data.csv`;

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

async function handleICalExport(
  tour: any,
  userId: string,
  organizationId: string
) {
  // Generate iCal content for entire tour
  const iCalContent = generateTourICalendar(tour);

  // Log activity
  await logActivity({
    organizationId,
    tourId: tour.id,
    userId,
    action: ACTIVITY_ACTIONS.CALENDAR_EXPORTED,
    entityType: ENTITY_TYPES.TOUR,
    entityId: tour.id,
    metadata: {
      format: "ical",
      showCount: tour.shows.length,
      artist: tour.artist.name,
    },
  });

  // Generate filename
  const filename = `${tour.artist.name}-${tour.name.replace(
    /\s+/g,
    "-"
  )}-tour-calendar.ics`;

  return new NextResponse(iCalContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
