export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "replace-prism",
    question: "Is TourBrain a replacement for Prism?",
    answer:
      "Yes. TourBrain is designed to replace Prism's role as the booking and financial hub for venues, promoters, and agencies—while adding routing intelligence and tour-level logistics. Like Prism, TourBrain will handle calendars, holds, offers, deals, settlements, and reporting, but it also understands routing, ticket pacing, and show-day logistics in the same system.",
  },
  {
    id: "replace-mastertour",
    question: "Is TourBrain a replacement for Master Tour?",
    answer:
      "Yes. TourBrain is also designed to replace Master Tour's role as the tour logistics and day-sheet tool, so your itineraries, schedules, travel details, crew contacts, and production notes live in the same place as your deals and ticket data. The goal is to remove the split between 'Prism at the venue' and 'Master Tour on the bus,' and give everyone one shared tour OS.",
  },
  {
    id: "why-not-both",
    question:
      "Why would I use TourBrain instead of Prism + Master Tour together?",
    answer:
      "Prism and Master Tour together are powerful, but they're still two separate systems with different logins, data models, and workflows. TourBrain combines booking, finances, routing, and logistics in a single platform, so you don't have to reconcile show information between two tools. Your routing and ticket pacing data automatically inform your calendar, offers, and day sheets. Venues, promoters, and tour managers finally share one real-time source of truth instead of passing PDFs and exports around.",
  },
  {
    id: "data-migration",
    question: "Can TourBrain import my existing Prism or Master Tour data?",
    answer:
      "That's a core part of the roadmap. TourBrain will support CSV imports for shows, deals, settlements, and itineraries, as well as structured migration flows for common exports from Prism and Master Tour. The idea is: you don't start from zero—you bring your current data in, then let TourBrain layer AI routing and forecasting on top.",
  },
  {
    id: "ticketing-providers",
    question: "Do I have to change ticketing providers to use TourBrain?",
    answer:
      "No. TourBrain is built to sit next to your ticketing platforms, not replace them. You'll be able to import ticket sales via CSV or connect directly to compatible ticketing APIs where possible. That means you keep your existing ticketing deals, but gain a smarter layer for forecasting, pacing, and tour-level decision-making.",
  },
  {
    id: "target-users",
    question: "Who is TourBrain for right now?",
    answer:
      "Early access is focused on: Independent venues (roughly 500–3,000 cap), regional promoters operating across multiple markets, and boutique agencies and tour managers coordinating small to mid-level tours. If you're already using Prism and/or Master Tour—or you've built your own 'Prism + Master Tour in spreadsheets'—you're exactly who we're building for.",
  },
  {
    id: "deployment-type",
    question: "Is TourBrain desktop software or web-based?",
    answer:
      "TourBrain is being built as a modern, web-based platform from day one, with mobile-friendly access and no heavy desktop installs. The goal is to make it easy for venue staff, promoters, agents, and tour crews to all log into the same system from wherever they are—laptop, tablet, or phone—without worrying about version mismatches or software updates.",
  },
];
