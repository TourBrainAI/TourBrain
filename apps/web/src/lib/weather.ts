export interface ClimateStats {
  avgHighTempC: number;
  avgLowTempC: number;
  avgPrecipDays: number; // per month
  avgWindSpeed?: number;
  avgHumidity?: number;
  hotDaysPct: number; // % of days > 30C
  coldDaysPct: number; // % of days < 5C
}

export interface WeatherProvider {
  getMonthlyClimate(
    latitude: number,
    longitude: number,
    month: number
  ): Promise<ClimateStats>;
}

export interface WeatherScore {
  score: number; // 1-100
  summary: string; // One-line explanation
  detail: {
    reasons: string[];
    profile: ClimateStats;
    recommendations?: string[];
  };
}

export function computeWeatherScore(profile: ClimateStats): WeatherScore {
  let score = 100;
  const reasons: string[] = [];
  const recommendations: string[] = [];

  // Temperature comfort scoring
  if (profile.avgHighTempC < 10) {
    score -= 25;
    reasons.push("Typically cold temperatures for an outdoor show.");
    recommendations.push("Consider indoor venue or heated areas for guests.");
  } else if (profile.avgHighTempC > 32) {
    score -= 25;
    reasons.push("Typically very hot temperatures for an outdoor show.");
    recommendations.push(
      "Ensure adequate shade, hydration stations, and cooling areas."
    );
  } else if (profile.avgHighTempC >= 22 && profile.avgHighTempC <= 28) {
    reasons.push("Ideal temperature range for outdoor events.");
  } else {
    reasons.push(
      "Moderate temperatures, generally comfortable for outdoor shows."
    );
  }

  // Precipitation risk
  if (profile.avgPrecipDays > 12) {
    score -= 20;
    reasons.push("High chance of rain this month.");
    recommendations.push("Have covered areas and weather backup plan ready.");
  } else if (profile.avgPrecipDays > 8) {
    score -= 10;
    reasons.push("Moderate chance of rain this month.");
    recommendations.push(
      "Monitor weather forecasts closely and have contingency plans."
    );
  } else if (profile.avgPrecipDays < 4) {
    reasons.push("Low chance of rain - excellent for outdoor events.");
  } else {
    reasons.push("Moderate precipitation risk.");
  }

  // Extreme weather penalties
  if (profile.hotDaysPct > 50) {
    score -= 15;
    reasons.push("Frequent very hot days (>30°C/86°F).");
    recommendations.push(
      "Plan for heat management: shade, cooling, adjusted schedule."
    );
  } else if (profile.hotDaysPct > 25) {
    score -= 8;
    reasons.push("Some risk of very hot days.");
  }

  if (profile.coldDaysPct > 50) {
    score -= 15;
    reasons.push("Frequent very cold days (<5°C/41°F).");
    recommendations.push("Consider heated areas or indoor alternatives.");
  } else if (profile.coldDaysPct > 25) {
    score -= 8;
    reasons.push("Some risk of very cold days.");
  }

  // Wind considerations
  if (profile.avgWindSpeed && profile.avgWindSpeed > 20) {
    score -= 10;
    reasons.push("Typically windy conditions.");
    recommendations.push(
      "Secure all equipment and signage. Consider wind-resistant setup."
    );
  }

  // Clamp score to valid range
  score = Math.max(0, Math.min(100, score));

  // Generate summary based on score
  let summary: string;
  if (score >= 85) {
    summary = "Excellent weather conditions for an outdoor show.";
  } else if (score >= 70) {
    summary = "Good conditions with minimal weather risk.";
  } else if (score >= 55) {
    summary = "Generally acceptable conditions with some risk.";
  } else if (score >= 40) {
    summary = "Significant weather risks - plan mitigation strategies.";
  } else {
    summary = "High weather risk - strongly consider indoor alternatives.";
  }

  return {
    score,
    summary,
    detail: {
      reasons,
      profile,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    },
  };
}
