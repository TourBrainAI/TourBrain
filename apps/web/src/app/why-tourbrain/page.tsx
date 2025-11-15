import { ComparisonTable } from "@/components/ComparisonTable";
import { Faq } from "@/components/Faq";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function WhyTourBrainPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">
            TourBrain
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/why-tourbrain" className="text-blue-600 font-medium">
              Why TourBrain
            </a>
            <a
              href="/venues"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Demo
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <SignedOut>
              <a
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </a>
              <a
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Sign Up
              </a>
            </SignedOut>
            <SignedIn>
              <a
                href="/app"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </a>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section - Focused on Why */}
      <section className="flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 mt-16">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Why Replace Prism + Master Tour?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Because tour operations need a modern, AI-native platform that
            unifies booking, logistics, and analytics in one place.
          </p>
        </div>
      </section>

      {/* Problem / Why Section */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center">
          The Current State is Broken
        </h2>
        <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-400">
            <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">
              The Problem Today
            </h3>
            <p>
              Tour operations are split across multiple disconnected tools:
              <strong> Prism for booking and finances</strong> at the venue,
              <strong> Master Tour for logistics</strong> on the road,
              <strong> spreadsheets for routing</strong>, and
              <strong> manual analysis</strong> for ticket trends.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
              The Cost
            </h3>
            <p>
              The result? <strong>Late insights</strong>,
              <strong> duplicated data entry</strong>, and
              <strong> missed opportunities</strong>. By the time you realize a
              show isn't pacing well or a route doesn't make sense, it's too
              late to fix.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-400">
            <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
              The TourBrain Solution
            </h3>
            <p className="text-xl font-semibold">
              TourBrain brings everything into one AI-native platform—so you can
              plan smarter, move faster, and make data-driven decisions in real
              time.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            Three Core Pillars
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center max-w-3xl mx-auto">
            Everything you need for modern tour operations, integrated into one
            intelligent platform
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">
                📋 Booking & Deal Desk
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Unified calendar with holds and conflicts</li>
                <li>• Multi-venue visibility for promoters</li>
                <li>• Deal tracking and automated settlements</li>
                <li>• Tour-level and venue-level P&L</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">
                🚌 Tour Logistics & Day Sheets
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Itineraries, travel, and hotel management</li>
                <li>• Run-of-show and production notes</li>
                <li>• Auto-generated day sheets with financials</li>
                <li>• Real-time collaboration for tour crews</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">
                🤖 AI Routing & Forecasting
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• AI-powered tour routing by region and dates</li>
                <li>• Ticket pacing vs. comparable shows</li>
                <li>• Risk scoring and pricing recommendations</li>
                <li>• Merchandise sales forecasting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Built For Your Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">🏛️ For Venues</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Manage your calendar and holds in one place</li>
                <li>• Track deals, settlements, and show finances</li>
                <li>• See ticket pacing for your upcoming shows</li>
                <li>• Collaborate with promoters and agencies</li>
              </ul>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">🎪 For Promoters</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Multi-venue visibility across your markets</li>
                <li>• AI routing for optimal tour planning</li>
                <li>• Real-time ticket intelligence and forecasts</li>
                <li>• Centralized deal and settlement management</li>
              </ul>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                🎵 For Agencies & Tour Managers
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Complete tour logistics and day sheets</li>
                <li>• Shared access with venues and promoters</li>
                <li>• Mobile-friendly for on-the-road access</li>
                <li>• No more PDFs and spreadsheet chaos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="flex flex-col items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="z-10 max-w-5xl w-full">
          <h2 className="text-4xl font-bold mb-4 text-center">Key Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center max-w-3xl mx-auto">
            Everything you need to run professional tour operations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <h2 className="text-2xl font-semibold mb-4">🗺️ Smart Routing</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Optimize tour routes and schedules with AI-powered planning
              </p>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <h2 className="text-2xl font-semibold mb-4">
                🎫 Ticket Intelligence
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Predict sales trends and optimize pricing strategies
              </p>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <h2 className="text-2xl font-semibold mb-4">
                👕 Merch Intelligence
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Predict merchandise sales and pricing trends
              </p>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <h2 className="text-2xl font-semibold mb-4">
                📊 Unified Workspace
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage tours, shows, and venues all in one place
              </p>
            </div>
          </div>
        </div>
      </section>

      <ComparisonTable />
      <Faq />

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Tour Operations?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the future of AI-powered tour management. Complete platform
            ready for production use.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg text-lg transition-colors"
          >
            Start Your Free Trial
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Full platform access • AI routing • Professional exports • No setup
            fees
          </p>
        </div>
      </section>
    </main>
  );
}
