// apps/web/src/lib/jobs/updateVenueClimate.ts

import { prisma } from "@/lib/prisma";
import { weatherProvider } from "@/lib/weatherProvider";

/**
 * Background job to update climate profiles for a venue across all 12 months.
 * Called when venues are created/updated with lat/long coordinates.
 */
export async function updateVenueClimateProfiles(
  venueId: string
): Promise<void> {
  console.log(`Starting climate profile update for venue ${venueId}`);

  try {
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        isOutdoor: true,
      },
    });

    if (!venue) {
      console.warn(`Venue ${venueId} not found`);
      return;
    }

    if (venue.latitude == null || venue.longitude == null) {
      console.warn(`Venue ${venueId} missing coordinates`);
      return;
    }

    if (!(venue as any).isOutdoor) {
      console.log(`Venue ${venueId} is indoor - skipping climate profile`);
      return;
    }

    console.log(
      `Fetching climate data for ${venue.name} (${venue.latitude}, ${venue.longitude})`
    );

    // Fetch climate data for all 12 months
    const monthPromises = [];
    for (let month = 1; month <= 12; month++) {
      monthPromises.push(
        updateVenueMonthClimate(
          venue.id,
          venue.latitude,
          venue.longitude,
          month
        )
      );
    }

    await Promise.allSettled(monthPromises);
    console.log(`Completed climate profile update for venue ${venueId}`);
  } catch (error) {
    console.error(
      `Failed to update venue climate profiles for ${venueId}:`,
      error
    );
    throw error;
  }
}

/**
 * Update climate profile for a specific venue and month
 */
async function updateVenueMonthClimate(
  venueId: string,
  latitude: number,
  longitude: number,
  month: number
): Promise<void> {
  try {
    const stats = await weatherProvider.getMonthlyClimate(
      latitude,
      longitude,
      month
    );

    await prisma.venueClimateProfile.upsert({
      where: {
        venueId_month: {
          venueId: venueId,
          month,
        },
      },
      update: {
        avgHighTempC: stats.avgHighTempC,
        avgLowTempC: stats.avgLowTempC,
        avgPrecipDays: stats.avgPrecipDays,
        avgWindSpeed: stats.avgWindSpeed,
        avgHumidity: stats.avgHumidity,
        hotDaysPct: stats.hotDaysPct,
        coldDaysPct: stats.coldDaysPct,
        source: stats.source ?? "unknown",
        lastUpdated: new Date(),
      },
      create: {
        venueId: venueId,
        month,
        avgHighTempC: stats.avgHighTempC,
        avgLowTempC: stats.avgLowTempC,
        avgPrecipDays: stats.avgPrecipDays,
        avgWindSpeed: stats.avgWindSpeed,
        avgHumidity: stats.avgHumidity,
        hotDaysPct: stats.hotDaysPct,
        coldDaysPct: stats.coldDaysPct,
        source: stats.source ?? "unknown",
      },
    });

    console.log(`Updated climate data for venue ${venueId}, month ${month}`);
  } catch (error) {
    console.error(
      `Failed to update climate for venue ${venueId}, month ${month}:`,
      error
    );
    // Don't throw here - we want other months to continue processing
  }
}

/**
 * Update weather scores for all shows at a venue after climate profiles are updated
 */
export async function updateShowWeatherScores(venueId: string): Promise<void> {
  try {
    // Find all shows at this venue that need weather score updates
    const shows = await prisma.show.findMany({
      where: {
        venueId: venueId,
        venue: {
          isOutdoor: true,
        },
      },
      select: {
        id: true,
        date: true,
      },
    });

    console.log(`Found ${shows.length} shows to update at venue ${venueId}`);

    // Update weather scores for each show
    const updatePromises = shows.map(async (show) => {
      try {
        // Call the recompute weather API internally
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/shows/${show.id}/recompute-weather`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          console.log(`Updated weather score for show ${show.id}`);
        } else {
          console.warn(
            `Failed to update weather score for show ${show.id}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error(
          `Error updating weather score for show ${show.id}:`,
          error
        );
      }
    });

    await Promise.allSettled(updatePromises);
  } catch (error) {
    console.error(
      `Failed to update show weather scores for venue ${venueId}:`,
      error
    );
  }
}

/**
 * Cleanup old climate profiles (optional maintenance job)
 */
export async function cleanupOldClimateProfiles(
  olderThanDays: number = 365
): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.venueClimateProfile.deleteMany({
      where: {
        lastUpdated: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Cleaned up ${result.count} old climate profiles`);
  } catch (error) {
    console.error("Failed to cleanup old climate profiles:", error);
  }
}

/**
 * Refresh stale climate profiles (scheduled job)
 */
export async function refreshStaleClimateProfiles(
  staleAfterDays: number = 90
): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - staleAfterDays);

    // Find venues with stale climate profiles
    const staleProfiles = await prisma.venueClimateProfile.findMany({
      where: {
        lastUpdated: {
          lt: cutoffDate,
        },
      },
      select: {
        venueId: true,
      },
      distinct: ["venueId"],
    });

    console.log(`Found ${staleProfiles.length} venues with stale climate data`);

    // Update each venue's climate profiles
    const updatePromises = staleProfiles.map((profile) =>
      updateVenueClimateProfiles(profile.venueId)
    );

    await Promise.allSettled(updatePromises);
    console.log("Completed stale climate profile refresh");
  } catch (error) {
    console.error("Failed to refresh stale climate profiles:", error);
  }
}
