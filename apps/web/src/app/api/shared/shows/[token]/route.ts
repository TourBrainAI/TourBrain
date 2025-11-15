import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/collaboration/activityLogger";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Find the collaborator by token
    const collaborator = await prisma.showCollaborator.findUnique({
      where: {
        token: params.token,
      },
      include: {
        show: {
          include: {
            tour: {
              include: {
                artist: true,
                organization: true,
              },
            },
            venue: true,
          },
        },
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { error: "Invalid or expired share link" },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (collaborator.expiresAt && collaborator.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Share link has expired" },
        { status: 410 }
      );
    }

    // Update last accessed time
    await prisma.showCollaborator.update({
      where: { id: collaborator.id },
      data: { lastAccessedAt: new Date() },
    });

    // Log activity
    await logActivity({
      organizationId: collaborator.show.tour.organizationId,
      showId: collaborator.showId,
      tourId: collaborator.show.tourId,
      email: collaborator.email,
      action: "accessed_shared_show",
      entityType: "show",
      entityId: collaborator.showId,
      metadata: {
        permission: collaborator.permission,
      },
    });

    // Filter show data based on permissions
    const showData = filterShowDataByPermission(
      collaborator.show,
      collaborator.permission
    );

    return NextResponse.json({
      show: showData,
      collaborator: {
        name: collaborator.name,
        email: collaborator.email,
        permission: collaborator.permission,
      },
    });
  } catch (error) {
    console.error("Error accessing shared show:", error);
    return NextResponse.json(
      { error: "Failed to access shared show" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Find the collaborator by token
    const collaborator = await prisma.showCollaborator.findUnique({
      where: {
        token: params.token,
      },
      include: {
        show: {
          include: {
            tour: {
              include: {
                organization: true,
              },
            },
          },
        },
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { error: "Invalid or expired share link" },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (collaborator.expiresAt && collaborator.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Share link has expired" },
        { status: 410 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Check permissions and validate updates
    if (collaborator.permission === "VIEW_ONLY") {
      return NextResponse.json(
        { error: "No permission to edit this show" },
        { status: 403 }
      );
    }

    if (collaborator.permission === "EDIT_LOGISTICS") {
      // Allow logistics updates
      const allowedFields = [
        "loadInTime",
        "soundcheck",
        "curfew",
        "publicNotes",
      ];
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }
    }

    if (collaborator.permission === "EDIT_FINANCIALS") {
      // Allow financial updates
      const allowedFields = [
        "guarantee",
        "splitPercent",
        "ticketPrice",
        "currency",
        "grossSales",
        "expenses",
        "netRevenue",
      ];
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the show
    const updatedShow = await prisma.show.update({
      where: { id: collaborator.showId },
      data: {
        ...updates,
        updatedAt: new Date(),
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

    // Log activity
    await logActivity({
      organizationId: collaborator.show.tour.organizationId,
      showId: collaborator.showId,
      tourId: collaborator.show.tourId,
      email: collaborator.email,
      action: "updated_show",
      entityType: "show",
      entityId: collaborator.showId,
      changes: updates,
      metadata: {
        permission: collaborator.permission,
      },
    });

    // Filter response data based on permissions
    const showData = filterShowDataByPermission(
      updatedShow,
      collaborator.permission
    );

    return NextResponse.json({
      show: showData,
      success: true,
    });
  } catch (error) {
    console.error("Error updating shared show:", error);
    return NextResponse.json(
      { error: "Failed to update show" },
      { status: 500 }
    );
  }
}

function filterShowDataByPermission(show: any, permission: string) {
  const baseData = {
    id: show.id,
    date: show.date,
    doors: show.doors,
    showtime: show.showtime,
    status: show.status,
    capacity: show.capacity,
    publicNotes: show.publicNotes,
    loadInTime: show.loadInTime,
    soundcheck: show.soundcheck,
    curfew: show.curfew,
    createdAt: show.createdAt,
    updatedAt: show.updatedAt,
    tour: {
      id: show.tour.id,
      name: show.tour.name,
      description: show.tour.description,
      artist: {
        id: show.tour.artist.id,
        name: show.tour.artist.name,
        genre: show.tour.artist.genre,
      },
    },
    venue: {
      id: show.venue.id,
      name: show.venue.name,
      address: show.venue.address,
      city: show.venue.city,
      state: show.venue.state,
      country: show.venue.country,
      capacity: show.venue.capacity,
      contactName: show.venue.contactName,
      contactEmail: show.venue.contactEmail,
      contactPhone: show.venue.contactPhone,
      website: show.venue.website,
      loadInTime: show.venue.loadInTime,
      soundcheck: show.venue.soundcheck,
      curfew: show.venue.curfew,
      notes: show.venue.notes,
    },
  };

  // Add financial data only if permission allows
  if (permission === "EDIT_FINANCIALS") {
    return {
      ...baseData,
      guarantee: show.guarantee,
      splitPercent: show.splitPercent,
      ticketPrice: show.ticketPrice,
      currency: show.currency,
      grossSales: show.grossSales,
      expenses: show.expenses,
      netRevenue: show.netRevenue,
      settled: show.settled,
      settledAt: show.settledAt,
      internalNotes: show.internalNotes,
    };
  }

  return baseData;
}
