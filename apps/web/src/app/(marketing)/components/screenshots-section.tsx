export function ScreenshotsSection() {
  return (
    <section id="features" className="py-16 bg-neutral-900/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">
            See your tours the way you actually think about them.
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Instead of jumping between multiple tools and spreadsheets,
            TourBrain gives you a single tour view—dates, deals, logistics, and
            AI insights side by side.
          </p>
        </div>

        {/* Main screenshot mockup */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl overflow-hidden">
          {/* Top nav bar */}
          <div className="bg-neutral-900 border-b border-neutral-800 p-4">
            <div className="flex items-center space-x-6">
              <div className="text-lg font-bold">TourBrain</div>
              <nav className="flex space-x-6 text-sm">
                <span className="text-blue-400 font-medium">Dashboard</span>
                <span className="text-neutral-400 hover:text-white cursor-pointer">
                  Tours
                </span>
                <span className="text-neutral-400 hover:text-white cursor-pointer">
                  Venues
                </span>
                <span className="text-neutral-400 hover:text-white cursor-pointer">
                  Artists
                </span>
                <span className="text-neutral-400 hover:text-white cursor-pointer">
                  Shows
                </span>
                <span className="text-neutral-400 hover:text-white cursor-pointer">
                  Settings
                </span>
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="p-6">
            <div className="flex space-x-6">
              {/* Left: Tour info */}
              <div className="w-80 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Fall 2025 Northeast Run
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs border border-green-600/30">
                      CONFIRMED
                    </span>
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs border border-blue-600/30">
                      12 SHOWS
                    </span>
                  </div>
                  <div className="text-sm text-neutral-400 space-y-1">
                    <p>
                      <span className="font-medium">Artist:</span> The Midnight
                      Express
                    </p>
                    <p>
                      <span className="font-medium">Dates:</span> Oct 15 - Nov
                      8, 2025
                    </p>
                    <p>
                      <span className="font-medium">Gross Potential:</span>{" "}
                      $485K
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle: Shows table */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Shows</h3>
                <div className="space-y-2">
                  {/* Table header */}
                  <div className="grid grid-cols-5 gap-4 py-2 px-4 text-xs font-medium text-neutral-400 uppercase tracking-wide border-b border-neutral-800">
                    <span>Date</span>
                    <span>City</span>
                    <span>Venue</span>
                    <span>Status</span>
                    <span>Tickets Sold</span>
                  </div>

                  {/* Table rows */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-5 gap-4 py-3 px-4 rounded bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                      <span className="text-sm text-neutral-300">Oct 15</span>
                      <span className="text-sm text-neutral-300">
                        Boston, MA
                      </span>
                      <span className="text-sm text-neutral-300">
                        Paradise Rock Club
                      </span>
                      <span className="inline-flex px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                        SOLD OUT
                      </span>
                      <span className="text-sm text-green-400 font-medium">
                        967/967
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-4 py-3 px-4 rounded bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                      <span className="text-sm text-neutral-300">Oct 17</span>
                      <span className="text-sm text-neutral-300">
                        New York, NY
                      </span>
                      <span className="text-sm text-neutral-300">
                        Webster Hall
                      </span>
                      <span className="inline-flex px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                        STRONG
                      </span>
                      <span className="text-sm text-green-400 font-medium">
                        1,201/1,400
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-4 py-3 px-4 rounded bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                      <span className="text-sm text-neutral-300">Oct 20</span>
                      <span className="text-sm text-neutral-300">
                        Philadelphia, PA
                      </span>
                      <span className="text-sm text-neutral-300">
                        Union Transfer
                      </span>
                      <span className="inline-flex px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">
                        SLOW
                      </span>
                      <span className="text-sm text-yellow-400 font-medium">
                        487/1,200
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-4 py-3 px-4 rounded bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                      <span className="text-sm text-neutral-300">Oct 23</span>
                      <span className="text-sm text-neutral-300">
                        Washington, DC
                      </span>
                      <span className="text-sm text-neutral-300">
                        9:30 Club
                      </span>
                      <span className="inline-flex px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
                        AT RISK
                      </span>
                      <span className="text-sm text-red-400 font-medium">
                        234/1,200
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: AI panel */}
              <div className="w-72">
                <div className="p-4 rounded-lg border border-purple-600/30 bg-purple-600/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-4">
                    AI Risk Summary
                  </h3>
                  <div className="space-y-3 text-sm text-neutral-300">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                      <span>
                        DC and Philly pacing 45% below comparable markets
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                      <span>
                        Consider social media push for Oct 20-23 corridor
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                      <span>
                        Boston-NYC routing optimal for fan travel overlap
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                      <span>Merch sales tracking 23% above tour average</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors">
                    Generate Full Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
