import { prisma } from "../lib/prisma";
import { weatherProvider } from "../lib/weather-provider";
import { computeWeatherScore } from "../lib/weather";

/**
 * Background job to update climate profiles for venues
 */
export class WeatherJob {
  /**
   * Update climate profile for a specific venue
   */
  static async updateClimateForVenue(venueId: string): Promise<void> {
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

      if (!venue.latitude || !venue.longitude) {
        console.warn(`Venue ${venue.name} (${venueId}) missing coordinates`);
        return;
      }

      if (!venue.isOutdoor) {
        console.log(`Venue ${venue.name} is indoor, skipping weather profile`);
        return;
      }

      console.log(`Updating climate profile for ${venue.name}...`);

      // Update climate data for all 12 months
      for (let month = 1; month <= 12; month++) {
        try {
          const stats = await weatherProvider.getMonthlyClimate(
            venue.latitude,
            venue.longitude,
            month
          );

          await prisma.venueClimateProfile.upsert({
            where: {
              venueId_month: { venueId: venue.id, month },
            },
            update: {
              avgHighTempC: stats.avgHighTempC,
              avgLowTempC: stats.avgLowTempC,
              avgPrecipDays: stats.avgPrecipDays,
              avgWindSpeed: stats.avgWindSpeed,
              avgHumidity: stats.avgHumidity,
              hotDaysPct: stats.hotDaysPct,
              coldDaysPct: stats.coldDaysPct,
              source: weatherProvider.constructor.name,
              lastUpdated: new Date(),
            },
            create: {
              venueId: venue.id,
              month,
              avgHighTempC: stats.avgHighTempC,
              avgLowTempC: stats.avgLowTempC,
              avgPrecipDays: stats.avgPrecipDays,
              avgWindSpeed: stats.avgWindSpeed,
              avgHumidity: stats.avgHumidity,
              hotDaysPct: stats.hotDaysPct,
              coldDaysPct: stats.coldDaysPct,
              source: weatherProvider.constructor.name,
            },
          });

          console.log(
            `Updated climate profile for ${venue.name} - Month ${month}`
          );
        } catch (error) {
          console.error(
            `Failed to update month ${month} for venue ${venue.name}:`,
            error
          );
          // Continue with other months even if one fails
        }
      }

      console.log(`Completed climate profile update for ${venue.name}`);
    } catch (error) {
      console.error(
        `Failed to update climate profile for venue ${venueId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Update climate profiles for all outdoor venues
   */
  static async updateAllVenueClimateProfiles(): Promise<void> {
    try {
      const outdoorVenues = await prisma.venue.findMany({
        where: {
          isOutdoor: true,
          latitude: { not: null },
          longitude: { not: null },
        },
        select: { id: true, name: true },
      });

      console.log(`Found ${outdoorVenues.length} outdoor venues to update`);

      for (const venue of outdoorVenues) {
        try {
          await this.updateClimateForVenue(venue.id);
        } catch (error) {
          console.error(`Failed to update venue ${venue.name}:`, error);
          // Continue with other venues
        }
      }

      console.log("Completed climate profile updates for all venues");
    } catch (error) {
      console.error("Failed to update venue climate profiles:", error);
      throw error;
    }
  }

  /**
   * Update weather scores for shows at outdoor venues
   */
  static async updateShowWeatherScores(tourId?: string): Promise<void> {
    try {
      const whereClause = {
        venue: {
          isOutdoor: true,
          latitude: { not: null },
          longitude: { not: null },
        },
        ...(tourId && { tourId }),
      };

      const shows = await prisma.show.findMany({
        where: whereClause,
        include: {
          venue: {
            include: {
              climateProfiles: true,
            },
          },
        },
      });

      console.log(`Updating weather scores for ${shows.length} outdoor shows`);

      for (const show of shows) {
        try {
          await this.updateWeatherScoreForShow(show.id);
        } catch (error) {
          console.error(
            `Failed to update weather score for show ${show.id}:`,
            error
          );
          // Continue with other shows
        }
      }

      console.log("Completed weather score updates");
    } catch (error) {
      console.error("Failed to update show weather scores:", error);
      throw error;
    }
  }

  /**
   * Update weather score for a specific show
   */
  static async updateWeatherScoreForShow(showId: string): Promise<void> {
    try {
      const show = await prisma.show.findUnique({
        where: { id: showId },
        include: {
          venue: {
            include: {
              climateProfiles: true,
            },
          },
        },
      });

      if (!show) {
        console.warn(`Show ${showId} not found`);
        return;
      }

      if (!show.venue.isOutdoor) {
        console.log(`Show venue is indoor, skipping weather score`);
        return;
      }

      const showMonth = new Date(show.date).getMonth() + 1; // JavaScript months are 0-indexed
      const climateProfile = show.venue.climateProfiles.find(
        (p) => p.month === showMonth
      );

      if (!climateProfile) {
        console.warn(
          `No climate profile found for venue ${show.venue.name} in month ${showMonth}`
        );
        return;
      }

      // Convert climate profile to ClimateStats format
      const stats = {
        avgHighTempC: climateProfile.avgHighTempC || 0,
        avgLowTempC: climateProfile.avgLowTempC || 0,
        avgPrecipDays: climateProfile.avgPrecipDays || 0,
        avgWindSpeed: climateProfile.avgWindSpeed,
        avgHumidity: climateProfile.avgHumidity,
        hotDaysPct: climateProfile.hotDaysPct || 0,
        coldDaysPct: climateProfile.coldDaysPct || 0,
      };

      const weatherScore = computeWeatherScore(stats);

      await prisma.show.update({
        where: { id: show.id },
        data: {
          weatherScore: weatherScore.score,
          weatherRiskSummary: weatherScore.summary,
          weatherDetailJson: weatherScore.detail,
        },
      });

      console.log(
        `Updated weather score for show at ${show.venue.name}: ${weatherScore.score}/100`
      );
    } catch (error) {
      console.error(
        `Failed to update weather score for show ${showId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Cleanup old climate profiles (older than 1 year)
   */
  static async cleanupOldClimateProfiles(): Promise<void> {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const result = await prisma.venueClimateProfile.deleteMany({
        where: {
          lastUpdated: {
            lt: oneYearAgo,
          },
        },
      });

      console.log(`Cleaned up ${result.count} old climate profiles`);
    } catch (error) {
      console.error("Failed to cleanup old climate profiles:", error);
      throw error;
    }
  }
}

/**
 * Trigger weather profile update when venue is created or updated
 */
export async function onVenueUpsert(venueId: string): Promise<void> {
  // Queue the job to run asynchronously
  if (process.env.NODE_ENV !== "test") {
    // In production, this would be queued to a job system like Bull or Agenda
    // For now, run it in the background
    WeatherJob.updateClimateForVenue(venueId).catch((error) => {
      console.error(
        `Background weather job failed for venue ${venueId}:`,
        error
      );
    });
  }
}

/**
 * Trigger weather score update when show is created or updated
 */
export async function onShowUpsert(showId: string): Promise<void> {
  // Queue the job to run asynchronously
  if (process.env.NODE_ENV !== "test") {
    // In production, this would be queued to a job system
    // For now, run it in the background
    WeatherJob.updateWeatherScoreForShow(showId).catch((error) => {
      console.error(`Background weather job failed for show ${showId}:`, error);
    });
  }
}
