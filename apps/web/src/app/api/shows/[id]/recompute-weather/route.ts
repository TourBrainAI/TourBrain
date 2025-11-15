import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { computeWeatherScore } from "@/lib/weatherScore";
import { weatherProvider } from "@/lib/weatherProvider";

interface RouteParams {
  params: { id: string };
}

/**
 * Recompute weatherScore for a given show.
 * POST /api/shows/[id]/recompute-weather
 */
export async function POST(
  _req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const showId = params.id;

    // Load show with venue, ensuring it belongs to the user's organization
    const show = await prisma.show.findFirst({
      where: {
        id: showId,
        tour: {
          organizationId: orgId,
        },
      },
      include: {
        venue: true,
        tour: {
          include: { artist: true },
        },
      },
    });

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    const venue = show.venue;

    if (!venue) {
      return NextResponse.json({ error: "Show has no venue" }, { status: 400 });
    }

    if (!(venue as any).isOutdoor) {
      return NextResponse.json(
        {
          message:
            "Venue is not marked as outdoor. Weather score is only computed for outdoor shows.",
          weatherScore: null,
          weatherRiskSummary: "Indoor venue - weather not applicable",
        },
        { status: 200 }
      );
    }

    if (venue.latitude == null || venue.longitude == null) {
      return NextResponse.json(
        {
          error:
            "Venue is missing latitude/longitude. Add coordinates to compute weatherScore.",
        },
        { status: 400 }
      );
    }

    const showDate = show.date;
    const month = showDate.getMonth() + 1; // JS: 0-11 → 1-12

    // Try to load cached VenueClimateProfile
    let climate = await prisma.venueClimateProfile.findUnique({
      where: {
        venueId_month: {
          venueId: venue.id,
          month,
        },
      },
    });

    // If no climate profile yet, fetch from provider and upsert
    if (!climate) {
      console.log(
        `Fetching climate data for venue ${venue.id}, month ${month}`
      );

      try {
        const stats = await weatherProvider.getMonthlyClimate(
          venue.latitude,
          venue.longitude,
          month
        );

        climate = await prisma.venueClimateProfile.upsert({
          where: {
            venueId_month: {
              venueId: venue.id,
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
            venueId: venue.id,
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
      } catch (weatherError) {
        console.error("Failed to fetch weather data:", weatherError);
        return NextResponse.json(
          { error: "Failed to fetch weather data from provider" },
          { status: 503 }
        );
      }
    }

    // Prepare climate profile for scoring
    const profile = {
      avgHighTempC: climate.avgHighTempC,
      avgLowTempC: climate.avgLowTempC,
      avgPrecipDays: climate.avgPrecipDays,
      hotDaysPct: climate.hotDaysPct,
      coldDaysPct: climate.coldDaysPct,
    };

    // Compute weather score
    const weatherResult = computeWeatherScore(profile);

    // Update the show with new weather data
    const updated = await prisma.show.update({
      where: { id: show.id },
      data: {
        weatherScore: weatherResult.score,
        weatherRiskSummary: weatherResult.summary,
        weatherDetailJson: {
          reasons: weatherResult.reasons,
          profile: weatherResult.profile,
          computedAt: new Date().toISOString(),
          climateSource: climate.source,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        showId: updated.id,
        weatherScore: updated.weatherScore,
        weatherRiskSummary: updated.weatherRiskSummary,
        weatherDetailJson: updated.weatherDetailJson,
        venue: {
          name: venue.name,
          city: venue.city,
          isOutdoor: (venue as any).isOutdoor,
        },
        showDate: show.date.toISOString(),
        month,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("recompute-weather error:", err);
    return NextResponse.json(
      { error: "Failed to recompute weatherScore" },
      { status: 500 }
    );
  }
}
