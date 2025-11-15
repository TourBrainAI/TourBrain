// Example integration with show creation API route
// This demonstrates how to wire up weather job hooks in existing API routes

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { onShowUpsert } from "@/lib/jobs/weatherJobHooks";
import { z } from "zod";

const createShowSchema = z.object({
  tourId: z.string(),
  venueId: z.string(),
  date: z.string().datetime(),
  doors: z.string().datetime().optional(),
  showtime: z.string().datetime().optional(),
  // ... other show fields
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createShowSchema.parse(body);

    // Create the show
    const show = await prisma.show.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        doors: validatedData.doors ? new Date(validatedData.doors) : undefined,
        showtime: validatedData.showtime
          ? new Date(validatedData.showtime)
          : undefined,
        // Ensure show belongs to user's organization through tour relationship
        tour: {
          connect: {
            id: validatedData.tourId,
          },
        },
        venue: {
          connect: {
            id: validatedData.venueId,
          },
        },
      },
      include: {
        venue: true,
        tour: true,
      },
    });

    // Verify tour belongs to user's organization
    if (show.tour.organizationId !== orgId) {
      // Rollback the show creation
      await prisma.show.delete({ where: { id: show.id } });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Trigger weather score computation in background
    await onShowUpsert(show.id, show.venueId, show.date);

    return NextResponse.json(show);
  } catch (error) {
    console.error("Error creating show:", error);

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

/*
Usage Examples:

1. Schedule climate data refresh (in a CRON job or scheduled function):
```typescript
import { scheduleClimateRefresh } from "@/lib/jobs/weatherJobHooks";

// Run daily or weekly
await scheduleClimateRefresh();
```

2. Schedule climate data cleanup (in a CRON job):
```typescript  
import { scheduleClimateCleanup } from "@/lib/jobs/weatherJobHooks";

// Run monthly
await scheduleClimateCleanup();
```

3. Manual venue climate update (admin function):
```typescript
import { updateVenueClimateProfiles } from "@/lib/jobs/updateVenueClimate";

// Update specific venue
await updateVenueClimateProfiles("venue-id-here");
```

4. Bulk weather score update for all shows at a venue:
```typescript
import { updateShowWeatherScores } from "@/lib/jobs/updateVenueClimate";

// After venue coordinates are updated
await updateShowWeatherScores("venue-id-here");
```
*/
