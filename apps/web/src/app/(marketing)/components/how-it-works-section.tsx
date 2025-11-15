interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Connect & Import",
    description:
      "Start with your next run. Import shows from your calendar or CSV, or set up a new tour from scratch. No big-bang migration required.",
    icon: "🔗",
  },
  {
    number: "02",
    title: "Plan & Operate",
    description:
      "Run booking, logistics, and day sheets out of one tour OS. Keep venues, promoters, and tour managers aligned in real time.",
    icon: "⚡",
  },
  {
    number: "03",
    title: "Optimize with AI",
    description:
      "Let TourBrain highlight routing options, ticket pacing issues, and at-risk dates—so you can fix problems before they hit your bottom line.",
    icon: "🎯",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            How TourBrain fits into your world.
          </h2>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden md:flex justify-between items-start space-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              {/* Step number and icon */}
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600/40 mb-4">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-bold">{step.number}</span>
                </div>

                {/* Connecting line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-full w-full h-0.5 bg-neutral-700 transform -translate-y-1/2 hidden lg:block"></div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical layout */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 border border-blue-600/40">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xs font-bold">{step.number}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
