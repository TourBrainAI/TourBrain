interface Pillar {
  title: string;
  description: string;
  bullets: string[];
  icon: string;
}

const pillars: Pillar[] = [
  {
    title: "Booking & Deal Desk",
    icon: "📋",
    description:
      "Manage holds, offers, and contracts in a single calendar. Track guarantees, splits, and expenses from inquiry to settlement—then roll everything up to the tour or venue level.",
    bullets: [
      "Central booking calendar by org and venue",
      "Guarantee, plus, and percentage deals",
      "Show-level and tour-level P&L",
    ],
  },
  {
    title: "Tour Logistics & Day Sheets",
    icon: "🚌",
    description:
      "Replace homemade spreadsheets and scattered PDFs. Build itineraries, travel plans, production notes, and day sheets that everyone can access in real time.",
    bullets: [
      "Itineraries with travel, hotels, and contacts",
      "Day sheets with schedule, local info, and production notes",
      "Print-friendly layouts for crew distribution",
    ],
  },
  {
    title: "AI Routing & Ticket Intelligence",
    icon: "🤖",
    description:
      "Use AI to design smarter tours and stay ahead of weak dates. Get routing suggestions, pacing alerts, and risk summaries before problems become expensive.",
    bullets: [
      "AI-assisted routing by region, drive-time, and anchor dates",
      "Ticket pacing vs capacity and similar markets",
      "One-click risk summaries per tour",
    ],
  },
];

export function ProductPillarsSection() {
  return (
    <section id="product" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            One tour OS for booking, logistics, and AI decisions.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} className="space-y-6">
              {/* Icon and title */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{pillar.icon}</span>
                <h3 className="text-2xl font-bold">{pillar.title}</h3>
              </div>

              {/* Description */}
              <p className="text-neutral-300 leading-relaxed">
                {pillar.description}
              </p>

              {/* Micro bullets */}
              <ul className="space-y-2">
                {pillar.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-neutral-400">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* TODO: Add small icon or mini UI preview */}
              <div className="mt-6 h-32 rounded-lg border border-neutral-800 bg-neutral-900/40 flex items-center justify-center">
                <span className="text-neutral-600 text-sm">
                  {/* Placeholder for mini UI preview */}
                  UI Preview
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
