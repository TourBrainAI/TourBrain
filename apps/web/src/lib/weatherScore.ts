// apps/web/src/lib/weatherScore.ts

export interface ClimateStats {
  avgHighTempC?: number | null;
  avgLowTempC?: number | null;
  avgPrecipDays?: number | null;
  hotDaysPct?: number | null;
  coldDaysPct?: number | null;
}

export interface WeatherScoreResult {
  score: number;
  summary: string;
  reasons: string[];
  profile: ClimateStats;
}

/**
 * Compute a weather score (1-100) for outdoor shows based on climate statistics.
 * Higher scores indicate better conditions for outdoor events.
 */
export function computeWeatherScore(profile: ClimateStats): WeatherScoreResult {
  let score = 100;
  const reasons: string[] = [];

  // Temperature comfort scoring
  if (profile.avgHighTempC == null) {
    score -= 10;
    reasons.push("No temperature data available.");
  } else if (profile.avgHighTempC < 5) {
    score -= 30;
    reasons.push("Very cold temperatures - challenging for outdoor events.");
  } else if (profile.avgHighTempC < 10) {
    score -= 20;
    reasons.push(
      "Typically cold for an outdoor show - plan for heating/coverage."
    );
  } else if (profile.avgHighTempC > 35) {
    score -= 25;
    reasons.push("Extremely hot temperatures - significant heat stress risk.");
  } else if (profile.avgHighTempC > 30) {
    score -= 20;
    reasons.push(
      "Typically very hot for an outdoor show - plan cooling/shade."
    );
  } else if (profile.avgHighTempC >= 18 && profile.avgHighTempC <= 26) {
    reasons.push("Ideal temperature range for outdoor events.");
  } else {
    reasons.push("Comfortable average high temperature.");
  }

  // Low temperature considerations
  if (profile.avgLowTempC != null) {
    if (profile.avgLowTempC < 0) {
      score -= 15;
      reasons.push(
        "Freezing nighttime temperatures - equipment and safety concerns."
      );
    } else if (profile.avgLowTempC < 5) {
      score -= 10;
      reasons.push("Very cold evenings - attendee comfort considerations.");
    }
  }

  // Precipitation risk
  if (profile.avgPrecipDays != null) {
    if (profile.avgPrecipDays > 15) {
      score -= 25;
      reasons.push("High chance of rain - essential backup plans required.");
    } else if (profile.avgPrecipDays > 10) {
      score -= 20;
      reasons.push("Higher-than-average chance of rain this month.");
    } else if (profile.avgPrecipDays > 5) {
      score -= 10;
      reasons.push("Moderate rain risk - consider weather contingencies.");
    } else if (profile.avgPrecipDays < 3) {
      reasons.push("Low chance of rain - excellent for outdoor events.");
    } else {
      reasons.push("Relatively low chance of rain.");
    }
  }

  // Extreme weather frequency
  if (profile.hotDaysPct != null && profile.hotDaysPct > 50) {
    score -= 15;
    reasons.push("Frequent very hot days - high heat stress risk.");
  } else if (profile.hotDaysPct != null && profile.hotDaysPct > 25) {
    score -= 8;
    reasons.push("Some very hot days expected - plan cooling measures.");
  }

  if (profile.coldDaysPct != null && profile.coldDaysPct > 50) {
    score -= 15;
    reasons.push("Frequent very cold days - significant comfort challenges.");
  } else if (profile.coldDaysPct != null && profile.coldDaysPct > 25) {
    score -= 8;
    reasons.push("Some very cold days expected - plan warming measures.");
  }

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score));

  // Generate summary based on score
  const summary =
    score >= 85
      ? "Excellent weather window for outdoor shows"
      : score >= 70
      ? "Great weather conditions with minimal risk"
      : score >= 55
      ? "Generally good conditions with some precautions needed"
      : score >= 40
      ? "Workable conditions but weather backup plans essential"
      : score >= 25
      ? "Significant weather risk - consider indoor alternatives"
      : "High weather risk - outdoor events not recommended";

  return {
    score,
    summary,
    reasons,
    profile,
  };
}
