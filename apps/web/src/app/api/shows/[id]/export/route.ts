import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  logActivity,
  ACTIVITY_ACTIONS,
  ENTITY_TYPES,
} from "@/lib/collaboration/activityLogger";
import { generateDaySheetPDF } from "@/lib/exports/daySheetPDF";
import { generateICalEvent } from "@/lib/exports/iCal";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, organizationId } = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (!organizationId || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 403 }
      );
    }

    // Verify show belongs to organization
    const show = await prisma.show.findFirst({
      where: {
        id: params.id,
        tour: {
          organizationId,
        },
      },
      include: {
        tour: {
          include: {
            artist: true,
            organization: true,
          },
        },
        venue: true,
      },
    });

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    switch (format) {
      case "pdf":
        return await handlePDFExport(show, user.id, organizationId);

      case "ical":
        return await handleICalExport(show, user.id, organizationId);

      default:
        return NextResponse.json(
          { error: "Invalid format. Supported formats: pdf, ical" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error exporting show:", error);
    return NextResponse.json(
      { error: "Failed to export show" },
      { status: 500 }
    );
  }
}

async function handlePDFExport(
  show: any,
  userId: string,
  organizationId: string
) {
  // Generate PDF buffer
  const pdfBuffer = await generateDaySheetPDF(show);

  // Log activity
  await logActivity({
    organizationId,
    showId: show.id,
    tourId: show.tourId,
    userId,
    action: ACTIVITY_ACTIONS.DAY_SHEET_EXPORTED,
    entityType: ENTITY_TYPES.SHOW,
    entityId: show.id,
    metadata: {
      format: "pdf",
      venue: show.venue.name,
      date: show.date,
    },
  });

  // Generate filename
  const dateStr = new Date(show.date).toISOString().split("T")[0];
  const filename = `${show.tour.artist.name}-${show.venue.name}-${dateStr}-daysheet.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
}

async function handleICalExport(
  show: any,
  userId: string,
  organizationId: string
) {
  // Generate iCal content
  const iCalContent = generateICalEvent(show);

  // Log activity
  await logActivity({
    organizationId,
    showId: show.id,
    tourId: show.tourId,
    userId,
    action: ACTIVITY_ACTIONS.CALENDAR_EXPORTED,
    entityType: ENTITY_TYPES.SHOW,
    entityId: show.id,
    metadata: {
      format: "ical",
      venue: show.venue.name,
      date: show.date,
    },
  });

  // Generate filename
  const dateStr = new Date(show.date).toISOString().split("T")[0];
  const filename = `${show.tour.artist.name}-${show.venue.name}-${dateStr}.ics`;

  return new NextResponse(iCalContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
