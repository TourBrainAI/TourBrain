import Link from "next/link";

export default function PromotersSolutionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">TourBrain for promoters.</h1>
          <p className="text-xl text-neutral-300 mb-8">
            Build and track multi-market campaigns from routing to settlement.
          </p>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            When you&apos;re managing 20+ shows across multiple markets.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">Routing Chaos</h3>
              <p className="text-sm text-neutral-300">
                Venue availability scattered across different systems.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">
                Financial Blindness
              </h3>
              <p className="text-sm text-neutral-300">
                No real-time view of tour P&amp;L across markets.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">
                Communication Gaps
              </h3>
              <p className="text-sm text-neutral-300">
                Logistics coordination via endless email chains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            TourBrain for Promoters
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-3xl">🗺️</div>
              <h3 className="text-xl font-bold">Tour Planning</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Route optimization with venue database</li>
                <li>• Market analysis and capacity planning</li>
                <li>• Multi-market campaign coordination</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">📊</div>
              <h3 className="text-xl font-bold">Tour Financials</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Real-time P&L across all markets</li>
                <li>• Guarantee vs. revenue tracking</li>
                <li>• Expense allocation and reporting</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">🎯</div>
              <h3 className="text-xl font-bold">Campaign Management</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Unified logistics across all shows</li>
                <li>• Production requirements tracking</li>
                <li>• Settlement coordination with venues</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Example Workflow
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Campaign Setup</h3>
                <p className="text-sm text-neutral-300">
                  Create tour campaign with target markets, budget, and routing
                  preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Venue Outreach</h3>
                <p className="text-sm text-neutral-300">
                  Use venue database to identify and contact appropriate venues
                  for each market.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Confirm & Coordinate</h3>
                <p className="text-sm text-neutral-300">
                  Convert holds to confirms, coordinate logistics and production
                  requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Execute & Report</h3>
                <p className="text-sm text-neutral-300">
                  Track shows in real-time, manage settlements, and generate
                  tour reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect for</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-blue-600/30 bg-blue-600/5">
              <h3 className="font-bold text-blue-400 mb-3">
                Regional Promoters
              </h3>
              <p className="text-sm text-neutral-300">
                Managing 10-30 show campaigns across your territory with
                multiple venue relationships.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-blue-600/30 bg-blue-600/5">
              <h3 className="font-bold text-blue-400 mb-3">National Tours</h3>
              <p className="text-sm text-neutral-300">
                Coordinating 50+ date tours with local promoters and venue
                partners.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-blue-600/30 bg-blue-600/5">
              <h3 className="font-bold text-blue-400 mb-3">
                Festival Operators
              </h3>
              <p className="text-sm text-neutral-300">
                Managing complex multi-day events with dozens of artists and
                logistics.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-blue-600/30 bg-blue-600/5">
              <h3 className="font-bold text-blue-400 mb-3">Booking Agencies</h3>
              <p className="text-sm text-neutral-300">
                Coordinating tours for multiple artists with real-time
                visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to streamline your next tour?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            See how TourBrain can help you manage campaigns more efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#waitlist"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Join Early Access
            </Link>
            <a
              href="mailto:hello@tourbrain.ai?subject=Promoter Demo Request"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-600 px-8 py-4 text-lg font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
