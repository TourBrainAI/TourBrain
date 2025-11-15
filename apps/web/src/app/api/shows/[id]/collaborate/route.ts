import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShareToken } from "@/lib/collaboration/shareTokens";
import { logActivity } from "@/lib/collaboration/activityLogger";

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

    // Verify show belongs to organization
    const show = await prisma.show.findFirst({
      where: {
        id: params.id,
        tour: {
          organizationId,
        },
      },
    });

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    // Get all collaborators for this show
    const collaborators = await prisma.showCollaborator.findMany({
      where: {
        showId: params.id,
      },
      orderBy: {
        invitedAt: "desc",
      },
    });

    return NextResponse.json({ collaborators });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, organizationId } = await getCurrentUser();

    if (!organizationId || !user?.id) {
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
          },
        },
        venue: true,
      },
    });

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    const body = await request.json();
    const { email, name, permission, expiresInDays } = body;

    // Validate permission
    if (
      !["VIEW_ONLY", "EDIT_LOGISTICS", "EDIT_FINANCIALS"].includes(permission)
    ) {
      return NextResponse.json(
        { error: "Invalid permission level" },
        { status: 400 }
      );
    }

    // Check if collaborator already exists
    const existingCollaborator = await prisma.showCollaborator.findUnique({
      where: {
        showId_email: {
          showId: params.id,
          email: email.toLowerCase(),
        },
      },
    });

    if (existingCollaborator) {
      return NextResponse.json(
        { error: "This email is already invited to collaborate on this show" },
        { status: 409 }
      );
    }

    // Generate share token
    const token = generateShareToken();

    // Calculate expiration date if specified
    let expiresAt: Date | null = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create collaborator
    const collaborator = await prisma.showCollaborator.create({
      data: {
        showId: params.id,
        email: email.toLowerCase(),
        name,
        permission,
        token,
        invitedBy: user.id,
        expiresAt,
      },
    });

    // Log activity
    await logActivity({
      organizationId,
      showId: params.id,
      tourId: show.tourId,
      userId: user.id,
      action: "invited_collaborator",
      entityType: "show",
      entityId: params.id,
      metadata: {
        collaboratorEmail: email,
        permission,
        expiresAt,
      },
    });

    // Generate shareable link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/shared/shows/${token}`;

    return NextResponse.json({
      collaborator,
      shareUrl,
      success: true,
    });
  } catch (error) {
    console.error("Error creating collaborator:", error);
    return NextResponse.json(
      { error: "Failed to create collaborator" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, organizationId } = await getCurrentUser();

    if (!organizationId || !user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const collaboratorId = searchParams.get("collaboratorId");

    if (!collaboratorId) {
      return NextResponse.json(
        { error: "Collaborator ID is required" },
        { status: 400 }
      );
    }

    // Verify show belongs to organization and collaborator exists
    const collaborator = await prisma.showCollaborator.findFirst({
      where: {
        id: collaboratorId,
        showId: params.id,
        show: {
          tour: {
            organizationId,
          },
        },
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }

    // Delete collaborator
    await prisma.showCollaborator.delete({
      where: { id: collaboratorId },
    });

    // Log activity
    await logActivity({
      organizationId,
      showId: params.id,
      userId: user.id,
      action: "removed_collaborator",
      entityType: "show",
      entityId: params.id,
      metadata: {
        collaboratorEmail: collaborator.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}
