"use client";

interface HeroSectionProps {
  onPrimaryClick?: () => void;
}

export function HeroSection({ onPrimaryClick }: HeroSectionProps) {
  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      // Scroll to waitlist section
      const waitlistSection = document.getElementById("waitlist");
      waitlistSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 flex flex-col md:flex-row gap-10 items-center min-h-[80vh]">
      {/* Left: Text content */}
      <div className="flex-1 space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          The AI Tour OS for live music.
        </h1>

        <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
          One platform for booking, finances, routing, and tour logistics—for
          venues, promoters, and tour managers.
        </p>

        {/* Bullets */}
        <div className="space-y-3 text-lg text-neutral-200">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Stop juggling booking tools, spreadsheets, and PDFs.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Run tours with shared calendars, deals, and day sheets.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Use AI to design smarter routes and catch weak dates early.</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handlePrimaryClick}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Get Early Access
          </button>
          <a
            href="mailto:hello@tourbrain.ai?subject=20-min Tour Ops Demo Request"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-600 px-8 py-4 text-lg font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Book a 20-min Tour Ops Demo
          </a>
        </div>
      </div>

      {/* Right: Hero mock UI */}
      <div className="flex-1">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 shadow-xl p-4">
          {/* Mock TourBrain UI */}
          <div className="flex h-96">
            {/* Left sidebar */}
            <div className="w-48 border-r border-neutral-700 pr-4">
              <div className="space-y-2">
                <div className="px-3 py-2 rounded text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                  Tours
                </div>
                <div className="px-3 py-2 rounded text-sm text-neutral-400 hover:text-white cursor-pointer">
                  Venues
                </div>
                <div className="px-3 py-2 rounded text-sm text-neutral-400 hover:text-white cursor-pointer">
                  Artists
                </div>
                <div className="px-3 py-2 rounded text-sm text-neutral-400 hover:text-white cursor-pointer">
                  Shows
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 pl-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Fall 2025 Tour
                </h3>
                <p className="text-sm text-neutral-400">
                  Artist Name • 12 shows • Oct-Nov 2025
                </p>
              </div>

              {/* Shows table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 rounded bg-neutral-800/50 text-sm">
                  <span className="text-neutral-300">Oct 15 • Chicago, IL</span>
                  <span className="text-green-400">85% sold</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded bg-neutral-800/50 text-sm">
                  <span className="text-neutral-300">
                    Oct 17 • Milwaukee, WI
                  </span>
                  <span className="text-yellow-400">45% sold</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded bg-neutral-800/50 text-sm">
                  <span className="text-neutral-300">Oct 19 • Detroit, MI</span>
                  <span className="text-green-400">92% sold</span>
                </div>
              </div>

              {/* AI Risk Summary card */}
              <div className="mt-6 p-4 rounded-lg border border-purple-600/30 bg-purple-600/10">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">
                  AI Risk Summary
                </h4>
                <div className="space-y-1 text-xs text-neutral-300">
                  <div>• Milwaukee pacing 40% below similar markets</div>
                  <div>• Consider social media push for Oct 17</div>
                  <div>• Route spacing optimal for fan travel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
