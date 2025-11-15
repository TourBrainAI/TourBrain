import Link from "next/link";

interface RoleCard {
  title: string;
  bullets: string[];
  href: string;
  icon: string;
}

const roles: RoleCard[] = [
  {
    title: "Venues & Talent Buyers",
    icon: "🏛️",
    bullets: [
      "See your entire hold and confirm calendar at a glance.",
      "Keep deals, advancing info, and settlements in one system.",
      "Share clean show info with promoters and tour managers.",
    ],
    href: "/solutions/venues",
  },
  {
    title: "Regional & National Promoters",
    icon: "🎪",
    bullets: [
      "Design smarter runs across multiple markets and venue partners.",
      "Track tour health as a whole, not just show by show.",
      "Stop reconciling exports, emails, and spreadsheets.",
    ],
    href: "/solutions/promoters",
  },
  {
    title: "Agencies & Tour Managers",
    icon: "🎵",
    bullets: [
      "Plan tours with AI-assisted routing and date selection.",
      "Generate day sheets and crew comms in seconds.",
      "Give artists, venues, and promoters one shared source of truth.",
    ],
    href: "/solutions/agencies",
  },
];

export function RoleChooserSection() {
  return (
    <section className="py-16 bg-neutral-900/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Built for the people who actually run the shows.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div
              key={index}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{role.icon}</span>
                  <h3 className="text-xl font-bold">{role.title}</h3>
                </div>

                <ul className="space-y-3 text-neutral-300">
                  {role.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-start space-x-2"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={role.href}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-6 text-sm font-medium group"
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
