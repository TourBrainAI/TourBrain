import type { Show, Venue } from "@prisma/client";

interface ClimateProfile {
  avgHighTempC?: number | null;
  avgLowTempC?: number | null;
  avgPrecipDays?: number | null;
  hotDaysPct?: number | null;
  coldDaysPct?: number | null;
}

interface WeatherInsight {
  score?: number | null; // 0–100
  summary?: string | null;
  reasons?: string[];
  profile?: ClimateProfile;
}

interface RoutingContextStop {
  date: string; // ISO
  city: string;
  state?: string | null;
  venueName: string;
  isOutdoor?: boolean;
  weatherScore?: number | null;
}

interface RoutingContext {
  tourName?: string;
  artistName?: string;
  stops?: RoutingContextStop[];
}

/**
 * Build an AI prompt to explain why this location/time of year is good or risky
 * for an outdoor show, using climate stats + weather scoring + tour context.
 */
export function buildWeatherExplanationPrompt(opts: {
  show: Show;
  venue: Venue;
  weatherInsight: WeatherInsight;
  routingContext?: RoutingContext;
}) {
  const { show, venue, weatherInsight, routingContext } = opts;

  const monthLabel = new Intl.DateTimeFormat("en", { month: "long" }).format(
    show.date
  );
  const dateLabel = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(show.date);

  const locationLabel = [venue.city, venue.state, venue.country]
    .filter(Boolean)
    .join(", ");

  const profile = weatherInsight.profile ?? {};
  const reasons = weatherInsight.reasons ?? [];
  const score = weatherInsight.score ?? null;
  const summary = weatherInsight.summary ?? "";

  const routingSnippet =
    routingContext && routingContext.stops && routingContext.stops.length > 0
      ? JSON.stringify(
          routingContext.stops.map((stop) => ({
            date: stop.date,
            city: stop.city,
            state: stop.state,
            venueName: stop.venueName,
            isOutdoor: stop.isOutdoor,
            weatherScore: stop.weatherScore,
          })),
          null,
          2
        )
      : null;

  const base = `
You are an experienced tour director and promoter.

You are planning an ${venue.isOutdoor ? "OUTDOOR" : "INDOOR"} show at:

- Venue: ${venue.name}
- Location: ${locationLabel || "Unknown city"}
- Show date: ${dateLabel} (${monthLabel})

You have long-term climate statistics for this location and month:

- Average high temperature: ${
    profile.avgHighTempC != null
      ? `${profile.avgHighTempC.toFixed(1)} °C`
      : "N/A"
  }
- Average low temperature: ${
    profile.avgLowTempC != null ? `${profile.avgLowTempC.toFixed(1)} °C` : "N/A"
  }
- Average rainy days in this month: ${
    profile.avgPrecipDays != null ? profile.avgPrecipDays.toFixed(1) : "N/A"
  }
- Percent of very hot days: ${
    profile.hotDaysPct != null ? `${profile.hotDaysPct.toFixed(0)}%` : "N/A"
  }
- Percent of very cold days: ${
    profile.coldDaysPct != null ? `${profile.coldDaysPct.toFixed(0)}%` : "N/A"
  }

You also have a computed "weatherScore" (1–100) for this date and location:
- WeatherScore: ${score != null ? score : "N/A"}
- Weather summary: ${summary || "N/A"}

The scoring system has identified these key points:
${
  reasons.length
    ? reasons.map((r) => `- ${r}`).join("\n")
    : "- (no specific reasons provided)"
}
`;

  const routingPart = routingSnippet
    ? `
You are also looking at the rest of the tour routing. Here is a simplified JSON summary of other stops, with their WeatherScores:

${routingSnippet}

Consider whether this date and location are one of the stronger or weaker outdoor windows on the run, and whether the tour would benefit from moving this date earlier/later in the year or pairing it with indoor options.
`
    : "";

  const instructions = `
TASK:
Write a short, practical explanation for the tour and venue team that answers:

1. Why this location and time of year are a GOOD or RISKY choice for an outdoor show, based on temperature, rain, and extremes.
2. What kinds of operational decisions this suggests (e.g., backup weather plan, tenting/coverage, hydration, alternative timing/month).
3. If a tour context is provided, how this date compares to other stops from a weather perspective (better, worse, about the same).

FORMAT:
- Start with one concise sentence that labels the window as "strong", "workable with caveats", or "high-risk".
- Then provide 3–5 bullet points with concrete, non-generic details tied to the stats above.
- Avoid generic phrases like "weather can be unpredictable"; be specific to this market and month.

Tone:
- Practical and operator-focused.
- Assume the reader is a promoter, venue operator, or tour manager.
`;

  return base + routingPart + instructions;
}
