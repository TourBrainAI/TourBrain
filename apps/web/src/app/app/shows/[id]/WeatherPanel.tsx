"use client";

import type { Show, Venue } from "@prisma/client";
import { useMemo, useState } from "react";

type ShowWithVenue = Show & {
  venue: Venue;
};

interface WeatherPanelProps {
  show: ShowWithVenue;
}

/**
 * WeatherPanel
 *
 * - Displays a score (1–100) and color-coded badge
 * - Shows monthly climate snapshot for the show's month
 *   (for now, reads from show.weatherDetailJson if present)
 * - Explains why this date/time of year is good or risky for this location
 */
export function WeatherPanel({ show }: WeatherPanelProps) {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [recomputingWeather, setRecomputingWeather] = useState(false);
  const [weatherData, setWeatherData] = useState({
    score: (show as any).weatherScore,
    summary: (show as any).weatherRiskSummary,
    detail: (show as any).weatherDetailJson,
  });

  const weatherDetail = useMemo(() => {
    try {
      // shape: { reasons: string[]; profile: { avgHighTempC, avgLowTempC, avgPrecipDays, hotDaysPct, coldDaysPct, ... } }
      const detail = weatherData.detail ?? null;
      if (detail?.aiExplanation) {
        setAiExplanation(detail.aiExplanation);
      }
      return detail;
    } catch {
      return null;
    }
  }, [weatherData.detail]);

  const score = weatherData.score ?? null;
  const summary = weatherData.summary ?? null;

  const badgeColor =
    score == null
      ? "bg-neutral-700 text-neutral-200"
      : score >= 80
      ? "bg-emerald-500 text-black"
      : score >= 60
      ? "bg-amber-400 text-black"
      : score >= 40
      ? "bg-orange-500 text-black"
      : "bg-red-500 text-black";

  const monthLabel = new Intl.DateTimeFormat("en", { month: "long" }).format(
    show.date
  );

  const handleGetAIExplanation = async () => {
    if (loadingExplanation) return;

    setLoadingExplanation(true);
    try {
      const response = await fetch(
        `/api/shows/${show.id}/weather-explanation`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data.explanation);
      } else {
        console.error("Failed to get AI explanation");
      }
    } catch (error) {
      console.error("Error fetching AI explanation:", error);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleRecomputeWeather = async () => {
    if (recomputingWeather) return;

    setRecomputingWeather(true);
    try {
      const response = await fetch(`/api/shows/${show.id}/recompute-weather`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        // Update local weather data state
        setWeatherData({
          score: data.weatherScore,
          summary: data.weatherRiskSummary,
          detail: data.weatherDetailJson,
        });
        // Clear AI explanation so it can be regenerated with new data
        setAiExplanation(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to recompute weather:", errorData.error);
        alert(errorData.error || "Failed to recompute weather score");
      }
    } catch (error) {
      console.error("Error recomputing weather:", error);
      alert("Error recomputing weather score");
    } finally {
      setRecomputingWeather(false);
    }
  };

  return (
    <section className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Weather &amp; Seasonality</h2>
          <p className="text-xs text-neutral-500">
            Historical outdoor conditions for this city and time of year.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {score != null ? (
              <>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold ${badgeColor}`}
                >
                  {score}/100
                </span>
                <button
                  onClick={handleRecomputeWeather}
                  disabled={recomputingWeather}
                  className="text-[10px] bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 text-neutral-200 px-2 py-1 rounded transition-colors"
                  title="Recompute weather score"
                >
                  {recomputingWeather ? "..." : "↻"}
                </button>
              </>
            ) : (
              <button
                onClick={handleRecomputeWeather}
                disabled={recomputingWeather}
                className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-1 rounded transition-colors"
              >
                {recomputingWeather ? "Computing..." : "Compute Weather Score"}
              </button>
            )}
          </div>
          {score != null && (
            <span className="text-[11px] text-neutral-400 text-right">
              {summary ?? "Weather score"}
            </span>
          )}
        </div>
      </header>

      {/* Venue + date context */}
      <div className="text-xs text-neutral-300 space-y-1">
        <p>
          <span className="font-medium">{show.venue.name}</span>
          {show.venue.city && (
            <>
              {" "}
              &mdash; {show.venue.city}
              {show.venue.state ? `, ${show.venue.state}` : ""}
            </>
          )}
        </p>
        <p className="text-neutral-500">
          {(show.venue as any).isOutdoor
            ? "Outdoor / weather-sensitive venue"
            : "Indoor venue (weather impact is lower)"}
        </p>
        <p className="text-neutral-500">
          Typical conditions for {monthLabel} in this location:
        </p>
      </div>

      {/* Monthly climate snapshot */}
      {weatherDetail && weatherDetail.profile ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <ClimateStat
            label="Avg high"
            value={
              weatherDetail.profile.avgHighTempC != null
                ? `${weatherDetail.profile.avgHighTempC.toFixed(1)} °C`
                : "—"
            }
          />
          <ClimateStat
            label="Avg low"
            value={
              weatherDetail.profile.avgLowTempC != null
                ? `${weatherDetail.profile.avgLowTempC.toFixed(1)} °C`
                : "—"
            }
          />
          <ClimateStat
            label="Rainy days / month"
            value={
              weatherDetail.profile.avgPrecipDays != null
                ? weatherDetail.profile.avgPrecipDays.toFixed(1)
                : "—"
            }
          />
          <ClimateStat
            label="Very hot days"
            value={
              weatherDetail.profile.hotDaysPct != null
                ? `${weatherDetail.profile.hotDaysPct.toFixed(0)}%`
                : "—"
            }
          />
          <ClimateStat
            label="Very cold days"
            value={
              weatherDetail.profile.coldDaysPct != null
                ? `${weatherDetail.profile.coldDaysPct.toFixed(0)}%`
                : "—"
            }
          />
          {(show.venue as any).weatherNotes && (
            <ClimateStat
              label="Venue note"
              value={(show.venue as any).weatherNotes}
            />
          )}
        </div>
      ) : (
        <p className="text-xs text-neutral-500">
          Climate stats not available yet. Once this venue has latitude,
          longitude, and climate data populated, you'll see patterns here.
        </p>
      )}

      {/* Reasons / narrative */}
      {weatherDetail?.reasons && Array.isArray(weatherDetail.reasons) && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-neutral-200">
            Why this location and time of year:
          </p>
          <ul className="text-xs text-neutral-300 list-disc list-inside space-y-0.5">
            {weatherDetail.reasons.map((reason: string, idx: number) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Explanation Section */}
      {weatherDetail && (
        <div className="border-t border-neutral-800 pt-4">
          {aiExplanation ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-200">
                AI Weather Analysis:
              </p>
              <div className="text-xs text-neutral-300 bg-neutral-950/60 rounded-lg p-3">
                {aiExplanation}
              </div>
            </div>
          ) : (
            <button
              onClick={handleGetAIExplanation}
              disabled={loadingExplanation}
              className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-2 rounded-lg transition-colors"
            >
              {loadingExplanation ? "Generating..." : "Get AI Weather Analysis"}
            </button>
          )}
        </div>
      )}

      {/* Optional: tooltip / note about how to use this info */}
      <p className="text-[10px] text-neutral-500">
        Use this to decide whether this date is a good fit for an outdoor show,
        and whether you need backup plans (coverage, alternate dates, or indoor
        options).
      </p>
    </section>
  );
}

function ClimateStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-neutral-800 rounded-xl px-3 py-2 bg-neutral-950/40">
      <p className="text-[10px] text-neutral-500">{label}</p>
      <p className="text-xs text-neutral-200 mt-0.5">{value}</p>
    </div>
  );
}
