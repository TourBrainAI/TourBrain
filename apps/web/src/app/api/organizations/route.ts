import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createOrganization, ensureUserExists } from "@/lib/auth";
import { z } from "zod";

const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  type: z.enum(["VENUE", "PROMOTER", "AGENCY", "ARTIST_MANAGEMENT", "OTHER"]),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrgSchema.parse(body);

    // Ensure user exists in our database
    await ensureUserExists();

    // Create the organization
    const organization = await createOrganization({
      ...validatedData,
      website: validatedData.website || undefined,
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error creating organization:", error);

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
