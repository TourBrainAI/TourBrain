"use client";

import { useState } from "react";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is TourBrain?",
        answer:
          "TourBrain is a comprehensive tour management platform that centralizes booking, logistics, financials, and AI-powered insights for the live music industry. It's designed to replace the patchwork of spreadsheets, emails, and disconnected tools that tour professionals currently use.",
      },
      {
        question: "Who should use TourBrain?",
        answer:
          "TourBrain is built for venues, promoters, booking agencies, artist management companies, and tour managers. Whether you're booking 10 shows or 100, TourBrain scales to fit your operation.",
      },
      {
        question: "How does early access work?",
        answer:
          "We're currently onboarding select venues, promoters, and agencies to help us refine the platform. Early access users get free usage during the pilot period and direct input into feature development.",
      },
    ],
  },
  {
    category: "Tour Management",
    questions: [
      {
        question: "Can TourBrain handle complex touring scenarios?",
        answer:
          "Yes. TourBrain supports multi-leg tours, festival circuits, co-headlining arrangements, and complex routing scenarios. The platform is designed to handle the real-world complexity of professional touring.",
      },
      {
        question: "How does venue availability tracking work?",
        answer:
          "TourBrain maintains a comprehensive venue database with capacity, contact info, and availability patterns. You can search by market, capacity, genre fit, and other criteria to find the right venues for your tours.",
      },
      {
        question: "What about financial tracking and settlements?",
        answer:
          "TourBrain supports guarantee/plus/percentage deals, expense tracking, and automated settlement calculations. You get real-time P&L visibility across all your shows and tours.",
      },
    ],
  },
  {
    category: "AI Features",
    questions: [
      {
        question: "What AI capabilities does TourBrain include?",
        answer:
          "TourBrain includes AI-powered day sheet generation, tour risk analysis, and route optimization suggestions. The AI learns from industry patterns to provide intelligent recommendations for booking and logistics.",
      },
      {
        question: "How accurate is the AI risk analysis?",
        answer:
          "Our AI analyzes factors like market saturation, venue history, artist draw, and seasonal patterns to flag potential issues. While not perfect, it catches many problems that would otherwise be missed until it's too late to adjust.",
      },
      {
        question: "Can I customize AI recommendations?",
        answer:
          "Yes. The AI learns from your preferences and can be tuned to match your specific business rules, risk tolerance, and market knowledge.",
      },
    ],
  },
  {
    category: "Integration & Data",
    questions: [
      {
        question: "Can TourBrain integrate with my existing tools?",
        answer:
          "TourBrain is designed to be your central hub, but we understand you may have existing tools. We offer data import capabilities and are building integrations with common industry tools.",
      },
      {
        question: "What about data ownership and export?",
        answer:
          "Your data is always yours. TourBrain provides full data export capabilities, and you maintain complete ownership of all tour information, contacts, and financials.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. TourBrain uses enterprise-grade security with encrypted data transmission and storage, regular security audits, and strict access controls. Your sensitive tour and financial data is protected.",
      },
    ],
  },
  {
    category: "Pricing & Business",
    questions: [
      {
        question: "How much does TourBrain cost?",
        answer:
          "Pricing varies based on the size of your operation and features needed. Early access users get preferred pricing. Contact us for a custom quote based on your specific requirements.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes, qualified organizations can get access to a full-featured trial. This lets you import your existing tours and see how TourBrain would work for your specific operation.",
      },
      {
        question: "What kind of support do you provide?",
        answer:
          "TourBrain includes onboarding assistance, training for your team, and ongoing support. During early access, you'll have direct access to our team for feedback and assistance.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "Is TourBrain web-based or do I need to install software?",
        answer:
          "TourBrain is entirely web-based and works on any modern browser. No software installation required, and it works on desktop, tablet, and mobile devices.",
      },
      {
        question: "What about offline access?",
        answer:
          "TourBrain includes offline capabilities for essential functions like viewing day sheets and tour schedules. You can access critical information even without internet connectivity.",
      },
      {
        question: "Do you offer API access?",
        answer:
          "Yes, TourBrain provides API access for custom integrations and data synchronization with other systems. This is particularly useful for larger operations with existing tech infrastructure.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-neutral-300 mb-8">
            Everything you need to know about TourBrain and how it works.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          {faqData.map((category, categoryIndex) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems.includes(itemId);

                  return (
                    <div
                      key={itemId}
                      className="border border-neutral-800 rounded-lg bg-neutral-900/30"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/50 transition-colors rounded-lg"
                      >
                        <h3 className="font-semibold text-white pr-4">
                          {item.question}
                        </h3>
                        <svg
                          className={`w-5 h-5 text-neutral-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-neutral-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral-900/30">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
          <p className="text-lg text-neutral-300 mb-8">
            We&apos;re here to help. Reach out to our team for personalized
            answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@tourbrain.ai?subject=FAQ Question"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="mailto:hello@tourbrain.ai?subject=Demo Request"
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
