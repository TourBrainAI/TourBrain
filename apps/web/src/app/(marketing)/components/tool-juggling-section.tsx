export function ToolJugglingSection() {
  return (
    <section className="py-16 bg-neutral-900/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Left: narrative */}
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold">
              Trade the patchwork for one shared tour OS.
            </h2>

            <p className="text-xl text-neutral-300 leading-relaxed">
              Most teams run tours with a patchwork: booking software, logistics
              tools, spreadsheets, PDFs, and endless email threads. TourBrain
              gives you one place to plan, operate, and optimize your
              runs—without forcing you to change ticketing providers or abandon
              what already works.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-neutral-200">
                  One timeline from hold → offer → on sale → settled.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-neutral-200">
                  One source of truth for dates, deals, and day sheets.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-neutral-200">
                  One AI layer that sees the whole tour, not just single shows.
                </p>
              </div>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="flex-1">
            <div className="relative">
              {/* Scattered tools illustration */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <span className="text-sm text-neutral-400">Booking</span>
                </div>
                <div className="p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 text-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <span className="text-sm text-neutral-400">Logistics</span>
                </div>
                <div className="p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <span className="text-sm text-neutral-400">Spreadsheets</span>
                </div>
                <div className="p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 text-center">
                  <div className="text-2xl mb-2">📄</div>
                  <span className="text-sm text-neutral-400">Docs</span>
                </div>
              </div>

              {/* Arrow pointing down */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>

              {/* TourBrain unified UI */}
              <div className="p-6 rounded-xl border border-blue-600/50 bg-blue-600/10 text-center">
                <div className="text-3xl mb-3">🧠</div>
                <div className="font-bold text-blue-400 mb-2">TourBrain</div>
                <span className="text-xs text-neutral-400">
                  One unified tour OS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
