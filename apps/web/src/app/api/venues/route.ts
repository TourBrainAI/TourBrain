import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserWithOrganizations } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { onVenueUpsert } from "@/lib/jobs/weatherJobHooks";

const createVenueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().optional(),
  capacity: z.number().positive().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  loadInTime: z.string().optional(),
  soundcheck: z.string().optional(),
  curfew: z.string().optional(),
  notes: z.string().optional(),
  // Weather fields
  isOutdoor: z.boolean().default(false),
  weatherNotes: z.string().optional(),
  timezone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserWithOrganizations();
    if (
      !dbUser ||
      (dbUser.ownedOrganizations.length === 0 &&
        dbUser.organizationMemberships.length === 0)
    ) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 400 }
      );
    }

    const organization =
      dbUser.ownedOrganizations[0] ||
      dbUser.organizationMemberships[0]?.organization;

    const body = await request.json();
    const validatedData = createVenueSchema.parse(body);

    const venue = await prisma.venue.create({
      data: {
        ...validatedData,
        organizationId: organization.id,
        contactEmail: validatedData.contactEmail || undefined,
        website: validatedData.website || undefined,
      },
    });

    // Trigger weather data collection for outdoor venues
    await onVenueUpsert(
      venue.id,
      validatedData.latitude,
      validatedData.longitude,
      validatedData.isOutdoor
    );

    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error creating venue:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserWithOrganizations();
    if (
      !dbUser ||
      (dbUser.ownedOrganizations.length === 0 &&
        dbUser.organizationMemberships.length === 0)
    ) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 400 }
      );
    }

    const organization =
      dbUser.ownedOrganizations[0] ||
      dbUser.organizationMemberships[0]?.organization;

    const venues = await prisma.venue.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
