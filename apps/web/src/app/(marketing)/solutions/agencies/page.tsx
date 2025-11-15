import Link from "next/link";

export default function AgenciesSolutionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            TourBrain for agencies & management.
          </h1>
          <p className="text-xl text-neutral-300 mb-8">
            Coordinate tours for multiple artists with real-time visibility.
          </p>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            When you&apos;re juggling tours for 10+ artists.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">Tour Chaos</h3>
              <p className="text-sm text-neutral-300">
                Each artist&apos;s tour in different systems and spreadsheets.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">Client Blindness</h3>
              <p className="text-sm text-neutral-300">
                Artists can&apos;t see their own tour status in real-time.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-bold text-red-400 mb-3">
                Reporting Nightmares
              </h3>
              <p className="text-sm text-neutral-300">
                Manual compilation of tour results and financial summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            TourBrain for Agencies
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-3xl">👥</div>
              <h3 className="text-xl font-bold">Multi-Artist Management</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Centralized dashboard for all artist tours</li>
                <li>• Role-based access for artists and teams</li>
                <li>• Portfolio overview and resource allocation</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">🎯</div>
              <h3 className="text-xl font-bold">Client Collaboration</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Artists see their tour status in real-time</li>
                <li>• Shared logistics and production planning</li>
                <li>• Transparent financial tracking</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">📈</div>
              <h3 className="text-xl font-bold">Business Intelligence</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li>• Portfolio performance analytics</li>
                <li>• Venue relationship tracking</li>
                <li>• Commission and revenue reporting</li>
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
                <h3 className="font-semibold mb-2">Artist Onboarding</h3>
                <p className="text-sm text-neutral-300">
                  Add new artist with their team access, routing preferences,
                  and financial terms.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tour Development</h3>
                <p className="text-sm text-neutral-300">
                  Work with artist team to develop routing, identify venues, and
                  secure dates.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Execution & Monitoring</h3>
                <p className="text-sm text-neutral-300">
                  Track tour progress in real-time with artist team having
                  visibility into their shows.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analysis & Planning</h3>
                <p className="text-sm text-neutral-300">
                  Generate tour reports, analyze performance, and plan future
                  routing strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why agencies choose TourBrain
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-green-600/30 bg-green-600/5">
              <h3 className="font-bold text-green-400 mb-3">
                Scalable Operations
              </h3>
              <p className="text-sm text-neutral-300">
                Handle 10x more artists without 10x more administrative
                overhead.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-green-600/30 bg-green-600/5">
              <h3 className="font-bold text-green-400 mb-3">
                Client Satisfaction
              </h3>
              <p className="text-sm text-neutral-300">
                Artists love having real-time visibility into their tour
                progress.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-green-600/30 bg-green-600/5">
              <h3 className="font-bold text-green-400 mb-3">
                Data-Driven Growth
              </h3>
              <p className="text-sm text-neutral-300">
                Make better routing decisions with venue and market performance
                data.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-green-600/30 bg-green-600/5">
              <h3 className="font-bold text-green-400 mb-3">
                Professional Image
              </h3>
              <p className="text-sm text-neutral-300">
                Impress venues and promoters with organized, professional tour
                coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Features Section */}
      <section className="py-16 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Built for agency teams
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <h3 className="font-bold mb-3">🏢 Agency Dashboard</h3>
              <p className="text-sm text-neutral-300">
                Portfolio view of all artist tours, revenue pipeline, and team
                workload.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <h3 className="font-bold mb-3">🎤 Artist Portals</h3>
              <p className="text-sm text-neutral-300">
                Each artist sees only their tours with appropriate access
                levels.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <h3 className="font-bold mb-3">👥 Team Collaboration</h3>
              <p className="text-sm text-neutral-300">
                Agents, coordinators, and assistants work together seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to scale your agency operations?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            See how TourBrain can help you manage more artists more effectively.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#waitlist"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Join Early Access
            </Link>
            <a
              href="mailto:hello@tourbrain.ai?subject=Agency Demo Request"
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
