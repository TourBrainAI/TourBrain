import { competitors, comparisonFeatures } from "@/data/comparison";

export function ComparisonTable() {
  const competitorIds = Object.keys(competitors) as Array<
    keyof typeof competitors
  >;

  return (
    <section id="comparison" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">
          TourBrain vs Prism vs Master Tour
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
          Prism and Master Tour are battle-tested tools—Prism for booking and
          financials, Master Tour for tour logistics and day sheets. TourBrain
          is designed as a <strong>single, AI-native system</strong> that
          replaces both: booking + finances <em>and</em> routing + logistics,
          with modern web UX and built-in intelligence.
        </p>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="text-left px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                  Feature
                </th>
                {competitorIds.map((id) => (
                  <th
                    key={id}
                    className="text-left px-6 py-4 font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {competitors[id]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, idx) => (
                <tr
                  key={feature.id}
                  className={
                    idx % 2
                      ? "bg-white dark:bg-gray-950"
                      : "bg-gray-50 dark:bg-gray-900"
                  }
                >
                  <td className="align-top px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {feature.label}
                  </td>
                  {competitorIds.map((id) => (
                    <td
                      key={id}
                      className="align-top px-6 py-4 text-gray-700 dark:text-gray-300"
                    >
                      {feature.values[id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
