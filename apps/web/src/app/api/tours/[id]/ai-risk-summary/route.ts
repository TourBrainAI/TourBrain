import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai, logAIUsage } from "@/lib/openai";

export async function POST(
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

    // Get the tour with all shows and venues
    const tour = await prisma.tour.findFirst({
      where: {
        id: params.id,
        organizationId,
      },
      include: {
        artist: true,
        shows: {
          include: {
            venue: true,
          },
          orderBy: { date: "asc" },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Prepare tour data for analysis
    const upcomingShows = tour.shows.filter(
      (show) => new Date(show.date) >= new Date()
    );

    const showData = upcomingShows.map((show) => ({
      date: show.date.toLocaleDateString(),
      venue: show.venue.name,
      location: `${show.venue.city}, ${show.venue.state}`,
      capacity: show.venue.capacity || "Unknown",
      status: show.status,
      guarantee: show.guarantee || "TBD",
      ticketPrice: show.ticketPrice || "TBD",
    }));

    // Create the prompt for OpenAI
    const prompt = `Analyze this concert tour and provide a risk assessment:

Tour: ${tour.name}
Artist: ${tour.artist.name}
Total Shows: ${tour.shows.length}
Upcoming Shows: ${upcomingShows.length}

Upcoming Show Details:
${showData
  .map(
    (show, i) =>
      `${i + 1}. ${show.venue} (${show.location}) - ${show.date}
     Capacity: ${show.capacity} | Status: ${show.status} | Guarantee: $${
        show.guarantee
      }`
  )
  .join("\n")}

Please provide a concise risk assessment covering:
1. Shows that appear high-risk and why
2. Market concentration risks (too many shows in one area)
3. Timeline/logistics concerns
4. Financial risk factors
5. Recommendations for risk mitigation

Format as 3-5 bullet points, each focusing on a specific risk or opportunity.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced tour manager and music industry analyst providing risk assessments for concert tours.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const riskSummary =
      completion.choices[0]?.message?.content || "No analysis generated";

    // Log successful AI usage
    logAIUsage("ai-risk-summary", params.id, "gpt-4", true);

    return NextResponse.json({ summary: riskSummary });
  } catch (error) {
    console.error("Error generating AI tour risk summary:", error);

    // Log failed AI usage
    logAIUsage(
      "ai-risk-summary",
      params.id,
      "gpt-4",
      false,
      error instanceof Error ? error.message : "Unknown error"
    );

    // Handle OpenAI API errors
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate risk summary" },
      { status: 500 }
    );
  }
}
