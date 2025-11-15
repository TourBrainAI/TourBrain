import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../../lib/prisma";
import { WeatherJob } from "../../../../../lib/weather-job";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const showId = params.id;

    // Get show with venue and weather data
    const show = await prisma.show.findFirst({
      where: {
        id: showId,
        tour: {
          organizationId: orgId,
        },
      },
      include: {
        venue: {
          include: {
            climateProfiles: true,
          },
        },
      },
    });

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    // If venue is not outdoor, return null weather data
    if (!show.venue.isOutdoor) {
      return NextResponse.json({
        show: {
          id: show.id,
          weatherScore: null,
          weatherRiskSummary: null,
          weatherDetailJson: null,
        },
        venue: {
          isOutdoor: false,
        },
        message: "Weather data not applicable for indoor venues",
      });
    }

    // Check if we need to update weather data
    const showMonth = new Date(show.date).getMonth() + 1;
    const climateProfile = show.venue.climateProfiles.find(
      (p) => p.month === showMonth
    );

    let needsUpdate = false;
    if (!climateProfile) {
      needsUpdate = true;
    } else {
      // Check if data is older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (climateProfile.lastUpdated < thirtyDaysAgo) {
        needsUpdate = true;
      }
    }

    // If weather score is missing or climate data needs update, trigger background update
    if (needsUpdate || !show.weatherScore) {
      // Trigger background updates
      if (needsUpdate) {
        WeatherJob.updateClimateForVenue(show.venue.id).catch(console.error);
      }
      WeatherJob.updateWeatherScoreForShow(show.id).catch(console.error);
    }

    // Return current weather data
    return NextResponse.json({
      show: {
        id: show.id,
        weatherScore: show.weatherScore,
        weatherRiskSummary: show.weatherRiskSummary,
        weatherDetailJson: show.weatherDetailJson,
      },
      venue: {
        id: show.venue.id,
        name: show.venue.name,
        isOutdoor: show.venue.isOutdoor,
        latitude: show.venue.latitude,
        longitude: show.venue.longitude,
        weatherNotes: show.venue.weatherNotes,
      },
      climateProfile: climateProfile
        ? {
            month: climateProfile.month,
            avgHighTempC: climateProfile.avgHighTempC,
            avgLowTempC: climateProfile.avgLowTempC,
            avgPrecipDays: climateProfile.avgPrecipDays,
            avgWindSpeed: climateProfile.avgWindSpeed,
            avgHumidity: climateProfile.avgHumidity,
            hotDaysPct: climateProfile.hotDaysPct,
            coldDaysPct: climateProfile.coldDaysPct,
            lastUpdated: climateProfile.lastUpdated,
          }
        : null,
      isUpdating: needsUpdate || !show.weatherScore,
    });
  } catch (error) {
    console.error("Error fetching show weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const showId = params.id;

    // Verify show belongs to organization
    const show = await prisma.show.findFirst({
      where: {
        id: showId,
        tour: {
          organizationId: orgId,
        },
      },
      include: {
        venue: true,
      },
    });

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    if (!show.venue.isOutdoor) {
      return NextResponse.json(
        { error: "Cannot update weather data for indoor venues" },
        { status: 400 }
      );
    }

    // Force update climate profile and weather score
    await WeatherJob.updateClimateForVenue(show.venue.id);
    await WeatherJob.updateWeatherScoreForShow(show.id);

    // Return updated data
    const updatedShow = await prisma.show.findUnique({
      where: { id: showId },
      include: {
        venue: {
          include: {
            climateProfiles: true,
          },
        },
      },
    });

    const showMonth = new Date(updatedShow!.date).getMonth() + 1;
    const climateProfile = updatedShow!.venue.climateProfiles.find(
      (p) => p.month === showMonth
    );

    return NextResponse.json({
      show: {
        id: updatedShow!.id,
        weatherScore: updatedShow!.weatherScore,
        weatherRiskSummary: updatedShow!.weatherRiskSummary,
        weatherDetailJson: updatedShow!.weatherDetailJson,
      },
      climateProfile: climateProfile
        ? {
            month: climateProfile.month,
            avgHighTempC: climateProfile.avgHighTempC,
            avgLowTempC: climateProfile.avgLowTempC,
            avgPrecipDays: climateProfile.avgPrecipDays,
            avgWindSpeed: climateProfile.avgWindSpeed,
            avgHumidity: climateProfile.avgHumidity,
            hotDaysPct: climateProfile.hotDaysPct,
            coldDaysPct: climateProfile.coldDaysPct,
            lastUpdated: climateProfile.lastUpdated,
          }
        : null,
      message: "Weather data updated successfully",
    });
  } catch (error) {
    console.error("Error updating show weather data:", error);
    return NextResponse.json(
      { error: "Failed to update weather data" },
      { status: 500 }
    );
  }
}
