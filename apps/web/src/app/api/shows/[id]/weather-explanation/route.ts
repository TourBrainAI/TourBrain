// Example usage of the weather explanation prompt builder
// This shows how to integrate the buildWeatherExplanationPrompt with OpenAI

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { buildWeatherExplanationPrompt } from "@/lib/prompts/weatherExplanation";

interface RouteParams {
  params: { id: string };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch show with venue and weather data
    const show = await prisma.show.findFirst({
      where: {
        id: params.id,
        tour: { organizationId: orgId },
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

    // Parse weather detail from the cached JSON
    const weatherDetail = show.weatherDetailJson as any;
    if (!weatherDetail) {
      return NextResponse.json(
        { error: "No weather data available for this show" },
        { status: 400 }
      );
    }

    // Optional: Get routing context (other shows on the tour)
    const tourShows = await prisma.show.findMany({
      where: {
        tourId: show.tourId,
        id: { not: show.id },
      },
      include: { venue: true },
      orderBy: { date: "asc" },
    });

    const routingContext = {
      tourName: show.tour.name,
      artistName: show.tour.artist.name,
      stops: tourShows.map((s) => ({
        date: s.date.toISOString(),
        city: s.venue.city || "Unknown",
        state: s.venue.state,
        venueName: s.venue.name,
        isOutdoor: s.venue.isOutdoor,
        weatherScore: s.weatherScore,
      })),
    };

    // Build the AI prompt
    const prompt = buildWeatherExplanationPrompt({
      show,
      venue: show.venue,
      weatherInsight: {
        score: show.weatherScore,
        summary: show.weatherRiskSummary,
        reasons: weatherDetail.reasons,
        profile: weatherDetail.profile,
      },
      routingContext,
    });

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const explanation = response.choices[0]?.message?.content;

    if (!explanation) {
      return NextResponse.json(
        { error: "Failed to generate weather explanation" },
        { status: 500 }
      );
    }

    // Optionally update the show with the AI-generated explanation
    await prisma.show.update({
      where: { id: show.id },
      data: {
        weatherDetailJson: {
          ...(weatherDetail || {}),
          aiExplanation: explanation,
          aiGeneratedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      explanation,
      weatherScore: show.weatherScore,
      weatherSummary: show.weatherRiskSummary,
      prompt, // Include prompt for debugging if needed
    });
  } catch (error) {
    console.error("Error generating weather explanation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/*
Usage example:

POST /api/shows/[id]/weather-explanation

Response:
{
  "explanation": "This outdoor show in Austin during March represents a workable window with some caveats. March in Austin typically sees mild temperatures with average highs around 22°C (72°F) and lows around 10°C (50°F), making it comfortable for outdoor events. However, this month averages 3-4 rainy days, requiring a solid backup weather plan including covered areas or indoor alternatives. The 15% chance of very hot days suggests some variability, so monitoring weather forecasts closely in the week leading up to the show is essential. Compared to your other tour stops, this Austin date scores moderately well (75/100) but ranks below your Phoenix show (88/100) due to higher precipitation risk. Consider having tent/coverage options ready and clear communication about weather contingency plans.",
  "weatherScore": 75,
  "weatherSummary": "Generally favorable with rain backup needed",
  "prompt": "..." // The full prompt sent to OpenAI (for debugging)
}
*/
