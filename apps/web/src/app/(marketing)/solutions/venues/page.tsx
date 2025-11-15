import Link from "next/link";

export default function VenuesSolutionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            TourBrain for venues & talent buyers.
          </h1>
          <p className="text-xl text-neutral-300 mb-8">
            One calendar and tour OS for holds, confirms, deals, and day sheets.
          </p>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            When your building runs on spreadsheets and siloed tools.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">Scattered Holds</h3>
              <p className="text-sm text-neutral-300">
                Holds split across calendars and email threads.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">Lost Information</h3>
              <p className="text-sm text-neutral-300">
                Advancing info stored in random docs and PDFs.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">Last-Minute Chaos</h3>
              <p className="text-sm text-neutral-300">
                Last-minute scrambles for day-of details and settlements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            TourBrain for Venues
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-3xl">📅</div>
              <h3 className="text-xl font-bold">Booking Calendar</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Central hold/confirm calendar across rooms</li>
                <li>• Conflict detection and status color coding</li>
                <li>• Integration with your existing booking workflow</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">💰</div>
              <h3 className="text-xl font-bold">Deal & Settlement</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Guarantee/plus/% deal support</li>
                <li>• Expense entry and basic P&L per show</li>
                <li>• Automated settlement calculations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">📋</div>
              <h3 className="text-xl font-bold">Logistics</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Venue-side day sheets with house notes</li>
                <li>• Production info shared in real time</li>
                <li>• Mobile access for staff during shows</li>
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
                <h3 className="font-semibold mb-2">Receive Inquiry</h3>
                <p className="text-sm text-neutral-300">
                  Agent sends inquiry → create hold in TourBrain with all
                  details in one place.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Convert to Confirmed</h3>
                <p className="text-sm text-neutral-300">
                  Convert hold to confirmed show with deal fields, capacity, and
                  financial terms.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Collaborate on Logistics</h3>
                <p className="text-sm text-neutral-300">
                  Work with tour manager on logistics inside the same show
                  record—no separate emails.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Execute & Settle</h3>
                <p className="text-sm text-neutral-300">
                  Print day sheet for show day, track expenses, and mark show
                  settled with final numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to modernize your venue operations?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            Talk to us about running your next month of shows in TourBrain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#waitlist"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Join Early Access
            </Link>
            <a
              href="mailto:hello@tourbrain.ai?subject=Venue Demo Request"
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
