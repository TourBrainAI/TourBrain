import { faqItems } from "@/data/faq";

export function Faq() {
  return (
    <section id="faq" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          TourBrain vs Prism vs Master Tour
        </p>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg px-6 py-4 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow"
            >
              <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-gray-100">
                {item.question}
              </summary>
              <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
