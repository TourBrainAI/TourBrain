/**
 * Example usage of the ticketing analytics system
 * This demonstrates how the Epic 5 features work together
 */

import {
  calculateShowRisk,
  generatePacingData,
  predictShowOutcome,
} from "@/lib/analytics/ticketingAnalytics";

// Example show data
const exampleShow = {
  id: "show-123",
  date: new Date("2025-12-15T20:00:00Z"), // Show in 30 days
  capacity: 5000,
  venue: {
    name: "Red Rocks Amphitheatre",
    capacity: 5000,
  },
};

// Example ticket snapshots showing pacing over time
const exampleSnapshots = [
  {
    id: "snap-1",
    showId: "show-123",
    capturedAt: new Date("2025-11-01"),
    ticketsSold: 500,
    ticketsAvailable: 4500,
    grossSales: 25000,
    sellThroughPct: 10,
    daysUntilShow: 44,
    source: "MANUAL",
    tierBreakdown: null,
    uploadedBy: "user-123",
  },
  {
    id: "snap-2",
    showId: "show-123",
    capturedAt: new Date("2025-11-15"),
    ticketsSold: 1200,
    ticketsAvailable: 3800,
    grossSales: 60000,
    sellThroughPct: 24,
    daysUntilShow: 30,
    source: "CSV_UPLOAD",
    tierBreakdown: null,
    uploadedBy: "user-123",
  },
  {
    id: "snap-3",
    showId: "show-123",
    capturedAt: new Date("2025-11-25"),
    ticketsSold: 2100,
    ticketsAvailable: 2900,
    grossSales: 105000,
    sellThroughPct: 42,
    daysUntilShow: 20,
    source: "MANUAL",
    tierBreakdown: null,
    uploadedBy: "user-123",
  },
  {
    id: "snap-4",
    showId: "show-123",
    capturedAt: new Date("2025-12-05"),
    ticketsSold: 2800,
    ticketsAvailable: 2200,
    grossSales: 140000,
    sellThroughPct: 56,
    daysUntilShow: 10,
    source: "API",
    tierBreakdown: {
      GA: { sold: 2000, available: 1500, gross: 100000 },
      VIP: { sold: 800, available: 700, gross: 40000 },
    },
    uploadedBy: "user-123",
  },
];

/**
 * Demo function showing Epic 5 analytics in action
 */
export function demonstrateTicketingAnalytics() {
  console.log("🎫 TourBrain Epic 5: Ticketing Intelligence Demo\n");

  // Feature 5.3: Risk Assessment (Stories 5.3.1-5.3.3)
  const latestSnapshot = exampleSnapshots[exampleSnapshots.length - 1];
  const riskAssessment = calculateShowRisk(
    exampleShow as any,
    latestSnapshot as any
  );

  console.log("📊 Risk Assessment:");
  console.log(`   Risk Level: ${riskAssessment.riskLevel}`);
  console.log(`   Risk Score: ${riskAssessment.riskScore}/100`);
  console.log(`   Sell-through: ${riskAssessment.sellThroughPct.toFixed(1)}%`);
  console.log(`   Days Until Show: ${riskAssessment.daysUntilShow}`);
  console.log(`   Reasoning: ${riskAssessment.reasoning}`);

  if (riskAssessment.recommendations.length > 0) {
    console.log(`   Recommendations:`);
    riskAssessment.recommendations.forEach((rec) => {
      console.log(`     • ${rec}`);
    });
  }
  console.log("");

  // Feature 5.2: Pacing Visualization (Stories 5.2.1-5.2.2)
  const pacingData = generatePacingData(exampleSnapshots as any);

  console.log("📈 Pacing Analysis:");
  console.log("   Date        | Sold    | Sell % | Days Left | Gross Sales");
  console.log("   -------------------------------------------------------");
  pacingData.forEach((point) => {
    const dateStr = point.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const soldStr = point.ticketsSold.toString().padStart(7);
    const pctStr = `${point.sellThroughPct.toFixed(1)}%`.padStart(6);
    const daysStr = point.daysUntilShow.toString().padStart(9);
    const grossStr = `$${(point.grossSales / 1000).toFixed(0)}K`.padStart(11);
    console.log(
      `   ${dateStr}    | ${soldStr} | ${pctStr} |${daysStr} | ${grossStr}`
    );
  });
  console.log("");

  // Feature 5.4: Predictions & Recommendations (Stories 5.4.1-5.4.2)
  const prediction = predictShowOutcome(
    exampleShow as any,
    exampleSnapshots as any
  );

  console.log("🔮 Show Outcome Prediction:");
  console.log(
    `   Projected Sell-through: ${prediction.projectedSellThrough.toFixed(1)}%`
  );
  console.log(
    `   Projected Gross: $${(prediction.projectedGross / 1000).toFixed(0)}K`
  );
  console.log(`   Confidence Level: ${prediction.confidence}`);
  console.log(`   Note: ${prediction.projectionNote}`);
  console.log("");

  // Feature 5.4: Tour-level Overview
  const showsNeedingAttention = [riskAssessment].filter(
    (assessment) => assessment.riskLevel !== "HEALTHY"
  );

  console.log("🎪 Tour Summary:");
  console.log(`   Total Shows: 1 (demo)`);
  console.log(`   Shows with Data: 1`);
  console.log(`   Shows Needing Attention: ${showsNeedingAttention.length}`);
  console.log(
    `   Average Sell-through: ${riskAssessment.sellThroughPct.toFixed(1)}%`
  );
  console.log("");

  console.log("✅ Epic 5 Implementation Complete!");
  console.log("   ✓ Ticket Data Ingestion (CSV + Manual)");
  console.log("   ✓ Pacing Visualization (Charts + Analytics)");
  console.log("   ✓ Risk Scoring & Alerts (Auto Assessment)");
  console.log("   ✓ Tour Dashboard & Reports (Multi-show View)");
}

// Export types for use in components
export type {
  ShowRiskAssessment,
  PacingPoint,
} from "@/lib/analytics/ticketingAnalytics";

// Example API response format for shows
export interface ShowAnalyticsResponse {
  show: {
    id: string;
    date: string;
    venue: {
      name: string;
      city: string;
      capacity: number;
    };
    capacity: number;
  };
  riskAssessment: ShowRiskAssessment;
  pacingData: PacingPoint[];
  prediction: ReturnType<typeof predictShowOutcome>;
  analytics: {
    totalSnapshots: number;
    pacingPeriodDays: number;
    latestUpdate?: string;
    dataQuality: "HIGH" | "MEDIUM" | "LOW";
  };
}

// Example tour dashboard response
export interface TourPacingResponse {
  tour: {
    id: string;
    name: string;
    artist: { name: string };
  };
  shows: Array<{
    id: string;
    date: string;
    venue: {
      name: string;
      city: string;
    };
    riskAssessment: {
      riskLevel: "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK";
      riskScore: number;
      reasoning: string;
    };
    sellThroughPct: number;
    daysUntilShow: number;
    hasData: boolean;
  }>;
  stats: {
    totalShows: number;
    showsWithData: number;
    riskDistribution: {
      HEALTHY: number;
      NEEDS_ATTENTION: number;
      AT_RISK: number;
    };
    averageSellThrough: number;
  };
}
