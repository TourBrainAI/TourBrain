// apps/web/src/lib/jobs/weatherJobHooks.ts

import {
  updateVenueClimateProfiles,
  updateShowWeatherScores,
} from "./updateVenueClimate";

/**
 * Hook to call after venue creation or update.
 * Triggers climate profile update if the venue has coordinates and is outdoor.
 */
export async function onVenueUpsert(
  venueId: string,
  latitude?: number | null,
  longitude?: number | null,
  isOutdoor?: boolean
): Promise<void> {
  try {
    // Only proceed if we have valid coordinates and it's an outdoor venue
    if (latitude != null && longitude != null && isOutdoor) {
      console.log(`Triggering climate update for venue ${venueId}`);

      // Fire-and-forget: update climate profiles in background
      updateVenueClimateProfiles(venueId)
        .then(() => {
          console.log(`Climate update completed for venue ${venueId}`);
          // After climate profiles are updated, update weather scores for shows
          return updateShowWeatherScores(venueId);
        })
        .catch((error) => {
          console.error(
            `Failed to update climate/weather for venue ${venueId}:`,
            error
          );
        });
    } else {
      console.log(
        `Skipping climate update for venue ${venueId} - missing coordinates or indoor venue`
      );
    }
  } catch (error) {
    console.error(`Error in onVenueUpsert for venue ${venueId}:`, error);
  }
}

/**
 * Hook to call after show creation or update.
 * Triggers weather score computation if the venue is outdoor and has climate data.
 */
export async function onShowUpsert(
  showId: string,
  venueId: string,
  showDate: Date
): Promise<void> {
  try {
    console.log(`Checking weather score update for show ${showId}`);

    // Fire-and-forget: compute weather score in background
    computeShowWeatherScore(showId).catch((error) => {
      console.error(
        `Failed to compute weather score for show ${showId}:`,
        error
      );
    });
  } catch (error) {
    console.error(`Error in onShowUpsert for show ${showId}:`, error);
  }
}

/**
 * Internal helper to compute weather score for a show
 */
async function computeShowWeatherScore(showId: string): Promise<void> {
  try {
    // Call the recompute weather API internally
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/shows/${showId}/recompute-weather`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(
        `Weather score computed for show ${showId}: ${data.weatherScore}`
      );
    } else {
      console.warn(
        `Failed to compute weather score for show ${showId}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Error computing weather score for show ${showId}:`, error);
  }
}

/**
 * Scheduled job function to refresh stale climate data
 * Can be called from a CRON job or similar scheduler
 */
export async function scheduleClimateRefresh(): Promise<void> {
  const { refreshStaleClimateProfiles } = await import("./updateVenueClimate");

  console.log("Starting scheduled climate data refresh");
  try {
    await refreshStaleClimateProfiles(90); // Refresh profiles older than 90 days
    console.log("Scheduled climate refresh completed successfully");
  } catch (error) {
    console.error("Scheduled climate refresh failed:", error);
  }
}

/**
 * Scheduled job function to cleanup very old climate data
 * Can be called from a CRON job or similar scheduler
 */
export async function scheduleClimateCleanup(): Promise<void> {
  const { cleanupOldClimateProfiles } = await import("./updateVenueClimate");

  console.log("Starting scheduled climate data cleanup");
  try {
    await cleanupOldClimateProfiles(365); // Delete profiles older than 1 year
    console.log("Scheduled climate cleanup completed successfully");
  } catch (error) {
    console.error("Scheduled climate cleanup failed:", error);
  }
}

// Example usage in API routes or server actions:
/*
// After creating/updating a venue:
import { onVenueUpsert } from "@/lib/jobs/weatherJobHooks";

const updatedVenue = await prisma.venue.update({
  where: { id },
  data: venueData,
});

// Trigger weather jobs if needed
await onVenueUpsert(
  updatedVenue.id,
  updatedVenue.latitude,
  updatedVenue.longitude,
  updatedVenue.isOutdoor
);

// After creating a show:
import { onShowUpsert } from "@/lib/jobs/weatherJobHooks";

const newShow = await prisma.show.create({
  data: showData,
});

await onShowUpsert(newShow.id, newShow.venueId, newShow.date);
*/
