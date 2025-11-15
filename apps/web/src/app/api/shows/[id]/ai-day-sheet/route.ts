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

    // Get the show with all related data
    const show = await prisma.show.findFirst({
      where: {
        id: params.id,
        tour: { organizationId },
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

    // Create the prompt for OpenAI
    const prompt = `Generate professional day sheet notes for this concert:

Artist: ${show.tour.artist.name}
Venue: ${show.venue.name}
Location: ${show.venue.city}, ${show.venue.state}
Date: ${new Date(show.date).toLocaleDateString()}
Capacity: ${show.venue.capacity || "Unknown"}

Show Details:
- Doors: ${show.doors ? new Date(show.doors).toLocaleTimeString() : "TBD"}
- Show Time: ${
      show.showtime ? new Date(show.showtime).toLocaleTimeString() : "TBD"
    }
- Curfew: ${show.curfew ? new Date(show.curfew).toLocaleTimeString() : "TBD"}
- Guarantee: ${show.guarantee ? `$${show.guarantee.toLocaleString()}` : "TBD"}

Venue Contact: ${show.venue.contactName || "TBD"} (${
      show.venue.contactEmail || "TBD"
    })

Please generate practical day sheet notes covering:
1. Load-in logistics and timing
2. Production considerations for this venue type
3. Sound check recommendations
4. Potential issues to watch for
5. Settlement and financial notes

Keep it concise, professional, and actionable for tour managers and production staff.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced tour manager creating practical day sheet notes for concert productions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiNotes =
      completion.choices[0]?.message?.content || "No notes generated";

    // Log successful AI usage
    logAIUsage("ai-day-sheet", params.id, "gpt-4", true);

    return NextResponse.json({ notes: aiNotes });
  } catch (error) {
    console.error("Error generating AI day sheet notes:", error);

    // Log failed AI usage
    logAIUsage(
      "ai-day-sheet",
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
      { error: "Failed to generate day sheet notes" },
      { status: 500 }
    );
  }
}
