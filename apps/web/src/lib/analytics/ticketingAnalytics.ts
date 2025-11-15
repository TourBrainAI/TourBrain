/**
 * Ticketing Analytics Engine
 *
 * Core functions for ticket pacing analysis, risk scoring, and show health assessment.
 * Implements business logic from Epic 5: Ticketing Intelligence user stories.
 */

import { Show, TicketSnapshot } from "@prisma/client";

export type RiskLevel = "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK";

export interface ShowRiskAssessment {
  riskLevel: RiskLevel;
  riskScore: number; // 0-100 (higher = more risk)
  sellThroughPct: number;
  daysUntilShow: number;
  ticketsSold: number;
  capacity: number;
  recommendations: string[];
  reasoning: string;
}

export interface PacingPoint {
  date: Date;
  ticketsSold: number;
  sellThroughPct: number;
  daysUntilShow: number;
  grossSales: number;
}

/**
 * Calculate risk assessment for a show based on current pacing
 */
export function calculateShowRisk(
  show: Show,
  latestSnapshot?: TicketSnapshot
): ShowRiskAssessment {
  const now = new Date();
  const showDate = new Date(show.date);
  const daysUntilShow = Math.ceil(
    (showDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Default values if no snapshot available
  const ticketsSold = latestSnapshot?.ticketsSold || 0;
  const capacity = show.capacity || 1000; // Default capacity
  const sellThroughPct = (ticketsSold / capacity) * 100;

  // Risk scoring algorithm based on user stories
  let riskLevel: RiskLevel = "HEALTHY";
  let riskScore = 0;
  const recommendations: string[] = [];

  if (daysUntilShow <= 0) {
    // Show has passed
    riskLevel = "HEALTHY";
    riskScore = 0;
  } else if (sellThroughPct >= 60 && daysUntilShow >= 14) {
    // Healthy: >60% sold with >14 days out
    riskLevel = "HEALTHY";
    riskScore = Math.max(0, 40 - sellThroughPct);
  } else if (
    sellThroughPct >= 30 &&
    sellThroughPct < 60 &&
    daysUntilShow <= 14
  ) {
    // Needs Attention: 30-60% sold with <14 days out
    riskLevel = "NEEDS_ATTENTION";
    riskScore =
      60 + (40 - sellThroughPct) + Math.max(0, 14 - daysUntilShow) * 2;

    if (sellThroughPct < 40) {
      recommendations.push("Consider reducing ticket prices by 10-15%");
    }
    if (daysUntilShow <= 7) {
      recommendations.push("Increase marketing spend for this market");
    }
    recommendations.push("Send reminder email to venue's mailing list");
  } else if (sellThroughPct < 30 && daysUntilShow <= 7) {
    // At Risk: <30% sold with <7 days out
    riskLevel = "AT_RISK";
    riskScore = 80 + (30 - sellThroughPct) + (7 - daysUntilShow) * 3;

    recommendations.push("Reduce GA ticket price by 15%");
    recommendations.push("Increase Facebook ad spend by $500");
    recommendations.push("Consider adding special guest to drive interest");
    recommendations.push("Send targeted marketing to local fanbase");
  } else if (sellThroughPct < 50 && daysUntilShow >= 30) {
    // Early warning for slow start
    riskLevel = "NEEDS_ATTENTION";
    riskScore = 45 + (50 - sellThroughPct);
    recommendations.push("Monitor pacing closely");
    recommendations.push("Consider early bird promotions");
  }

  // Cap risk score at 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  const reasoning = generateRiskReasoning(
    sellThroughPct,
    daysUntilShow,
    riskLevel
  );

  return {
    riskLevel,
    riskScore,
    sellThroughPct,
    daysUntilShow,
    ticketsSold,
    capacity,
    recommendations,
    reasoning,
  };
}

/**
 * Generate human-readable reasoning for risk assessment
 */
function generateRiskReasoning(
  sellThroughPct: number,
  daysUntilShow: number,
  riskLevel: RiskLevel
): string {
  const formattedPct = sellThroughPct.toFixed(1);

  switch (riskLevel) {
    case "HEALTHY":
      if (sellThroughPct >= 80) {
        return `Strong performance: ${formattedPct}% sold with ${daysUntilShow} days remaining.`;
      } else if (sellThroughPct >= 60) {
        return `Good pacing: ${formattedPct}% sold, on track for healthy sales.`;
      } else {
        return `Early stage: ${formattedPct}% sold, plenty of time to build momentum.`;
      }

    case "NEEDS_ATTENTION":
      if (daysUntilShow <= 7) {
        return `Getting close: Only ${formattedPct}% sold with ${daysUntilShow} days left. Need marketing push.`;
      } else {
        return `Slower pacing: ${formattedPct}% sold, should monitor and consider promotions.`;
      }

    case "AT_RISK":
      return `High risk: Only ${formattedPct}% sold with ${daysUntilShow} days remaining. Immediate action required.`;

    default:
      return `${formattedPct}% sold, ${daysUntilShow} days until show.`;
  }
}

/**
 * Convert ticket snapshots to pacing chart data points
 */
export function generatePacingData(snapshots: TicketSnapshot[]): PacingPoint[] {
  return snapshots
    .sort(
      (a, b) =>
        new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
    )
    .map((snapshot) => ({
      date: new Date(snapshot.capturedAt),
      ticketsSold: snapshot.ticketsSold,
      sellThroughPct: snapshot.sellThroughPct,
      daysUntilShow: snapshot.daysUntilShow,
      grossSales: snapshot.grossSales,
    }));
}

/**
 * Calculate daily pacing velocity (tickets sold per day)
 */
export function calculatePacingVelocity(snapshots: TicketSnapshot[]): number {
  if (snapshots.length < 2) return 0;

  const sorted = snapshots.sort(
    (a, b) =>
      new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
  );

  const recent = sorted.slice(-7); // Last 7 snapshots
  if (recent.length < 2) return 0;

  const first = recent[0];
  const last = recent[recent.length - 1];

  const daysDiff =
    (new Date(last.capturedAt).getTime() -
      new Date(first.capturedAt).getTime()) /
    (1000 * 60 * 60 * 24);
  const ticketsDiff = last.ticketsSold - first.ticketsSold;

  return daysDiff > 0 ? ticketsDiff / daysDiff : 0;
}

/**
 * Predict show outcome based on current pacing
 */
export function predictShowOutcome(
  show: Show,
  snapshots: TicketSnapshot[]
): {
  projectedSellThrough: number;
  projectedGross: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  projectionNote: string;
} {
  const latestSnapshot = snapshots[snapshots.length - 1];
  if (!latestSnapshot) {
    return {
      projectedSellThrough: 0,
      projectedGross: 0,
      confidence: "LOW",
      projectionNote: "No ticket data available for projection",
    };
  }

  const velocity = calculatePacingVelocity(snapshots);
  const daysRemaining = Math.max(0, latestSnapshot.daysUntilShow);

  let projectedAdditionalSales = velocity * daysRemaining;

  // Apply curve fitting - sales typically slow down as show approaches
  if (daysRemaining > 14) {
    projectedAdditionalSales *= 0.8; // Slower growth early
  } else if (daysRemaining <= 3) {
    projectedAdditionalSales *= 1.3; // Last-minute rush
  }

  const projectedTotalSold =
    latestSnapshot.ticketsSold + projectedAdditionalSales;
  const capacity = show.capacity || 1000;
  const projectedSellThrough = Math.min(
    100,
    (projectedTotalSold / capacity) * 100
  );

  // Rough gross projection (assuming average ticket price)
  const avgTicketPrice =
    latestSnapshot.ticketsSold > 0
      ? latestSnapshot.grossSales / latestSnapshot.ticketsSold
      : show.ticketPrice || 50;
  const projectedGross = projectedTotalSold * avgTicketPrice;

  // Confidence based on data quality
  let confidence: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
  let projectionNote = "";

  if (snapshots.length >= 5 && daysRemaining >= 7) {
    confidence = "HIGH";
    projectionNote = "Based on consistent pacing data";
  } else if (snapshots.length >= 3) {
    confidence = "MEDIUM";
    projectionNote = "Limited data, projection may vary";
  } else {
    confidence = "LOW";
    projectionNote = "Very limited data, projection is rough estimate";
  }

  return {
    projectedSellThrough,
    projectedGross,
    confidence,
    projectionNote,
  };
}

/**
 * Generate recommended actions based on show performance
 */
export function generateRecommendedActions(assessment: ShowRiskAssessment): {
  priority: "HIGH" | "MEDIUM" | "LOW";
  actions: Array<{
    action: string;
    description: string;
    category: "PRICING" | "MARKETING" | "CONTENT" | "LOGISTICS";
  }>;
} {
  const actions: Array<{
    action: string;
    description: string;
    category: "PRICING" | "MARKETING" | "CONTENT" | "LOGISTICS";
  }> = [];

  let priority: "HIGH" | "MEDIUM" | "LOW" = "LOW";

  if (assessment.riskLevel === "AT_RISK") {
    priority = "HIGH";
    actions.push(
      {
        action: "Price Drop",
        description: "Reduce GA ticket price by 15%",
        category: "PRICING",
      },
      {
        action: "Marketing Push",
        description: "Increase Facebook ad spend by $500",
        category: "MARKETING",
      },
      {
        action: "Add Support Act",
        description: "Announce special guest to drive interest",
        category: "CONTENT",
      }
    );
  } else if (assessment.riskLevel === "NEEDS_ATTENTION") {
    priority = "MEDIUM";
    actions.push({
      action: "Email Blast",
      description: "Send reminder to venue's email list",
      category: "MARKETING",
    });

    if (assessment.sellThroughPct < 40) {
      actions.push({
        action: "Promotional Pricing",
        description: "Consider reducing ticket prices by 10%",
        category: "PRICING",
      });
    }
  }

  return { priority, actions };
}
