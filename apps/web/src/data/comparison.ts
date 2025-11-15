export type CompetitorId = "tourbrain" | "prism" | "mastertour";

export interface ComparisonFeature {
  id: string;
  label: string;
  description?: string;
  values: Record<CompetitorId, string>;
}

export const competitors: Record<CompetitorId, string> = {
  tourbrain: "TourBrain",
  prism: "Prism",
  mastertour: "Master Tour",
};

export const comparisonFeatures: ComparisonFeature[] = [
  {
    id: "focus",
    label: "Primary Focus",
    values: {
      tourbrain:
        "Full-stack tour OS for venues, promoters, and tour managers: booking, finances, routing, and logistics in one platform.",
      prism:
        "Live music booking and financial management for venues, promoters, and agencies.",
      mastertour:
        "Tour logistics, itineraries, day sheets, and crew communication for artists and tour teams.",
    },
  },
  {
    id: "users",
    label: "Core Users",
    values: {
      tourbrain:
        "Venue operators, promoters, booking teams, tour managers, production managers.",
      prism: "Talent buyers, promoters, venues, agencies.",
      mastertour: "Tour managers, production managers, crew, artists.",
    },
  },
  {
    id: "deployment",
    label: "Deployment & Access",
    values: {
      tourbrain:
        "100% web-based app, designed for shared access across organizations; mobile-friendly from day one.",
      prism:
        "Web-based platform with browser access and mobile-friendly components.",
      mastertour:
        "Desktop application plus web portal and mobile apps for viewing/limited actions.",
    },
  },
  {
    id: "booking",
    label: "Booking Calendar & Holds",
    values: {
      tourbrain:
        "Unified calendar for venues and tours, shared holds, conflict detection, and routing-aware suggestions.",
      prism:
        "Advanced calendar with holds, conflicts, and multi-venue visibility.",
      mastertour:
        "Tour calendars and schedule items focused on routes and daily schedules, not venue booking inventory.",
    },
  },
  {
    id: "deals",
    label: "Deals, Contracts & Settlements",
    values: {
      tourbrain:
        "End-to-end deal tracking, multi-party splits, automated settlements, tour-level and venue-level P&L.",
      prism:
        "Comprehensive show deals, contracts, and settlement tools with real-time financials and ticketing integrations.",
      mastertour:
        "Focuses more on logistics and less on deep financial/settlement workflows (though it can store accounting info).",
    },
  },
  {
    id: "logistics",
    label: "Tour Logistics & Day Sheets",
    values: {
      tourbrain:
        "Itineraries, travel, hotels, run-of-show, tech/production notes, and auto-generated day sheets tied to financial and ticket data.",
      prism:
        "Can manage run-of-show and advancing details but is primarily a booking/financial tool.",
      mastertour:
        "Deep feature set for itineraries, schedules, day sheets, personnel, and venue/route data; industry standard for logistics.",
    },
  },
  {
    id: "routing",
    label: "AI Routing & Tour Design",
    values: {
      tourbrain:
        "Built-in AI routing engine that plans tours by region, date range, and constraints (drive time, off-days, anchors).",
      prism:
        "Powerful calendar + insights; routing is manual or based on user judgment and reports (not marketed as AI-based routing).",
      mastertour:
        "Routing tools exist (e.g., routing calculations) but primarily focused on representing a plan, not generating AI plans.",
    },
  },
  {
    id: "ticketing",
    label: "Ticketing Intelligence & Forecasting",
    values: {
      tourbrain:
        "Ticket snapshot ingestion, show pacing vs comparable dates/markets, risk scoring, and recommendations for pricing and routing.",
      prism:
        "Real-time ticketing integrations, box office pooling, and Insights for artist and show performance across venues.",
      mastertour:
        "Ticket status can be tracked, but not focused on predictive analytics or cross-venue box office data pooling.",
    },
  },
  {
    id: "collaboration",
    label: "Collaboration & Permissions",
    values: {
      tourbrain:
        "Multi-org, role-based access for venues, promoters, agencies, and crew in a single tour OS.",
      prism:
        "Robust role-based permissions and shared access for teams across deals, financials, and docs.",
      mastertour:
        "Strong collaboration and mobile access for tour teams, with offline editing and syncing.",
    },
  },
  {
    id: "migration",
    label: "Migration & Imports",
    values: {
      tourbrain:
        "CSV imports for shows, deals, settlements, itineraries; opinionated migration flows for Prism/Master Tour users (roadmap).",
      prism:
        "Integrations with ticketing/finance platforms and import tools for existing data.",
      mastertour:
        "Import tools for tour details and calendar syncing; supports migrating existing tours.",
    },
  },
];
