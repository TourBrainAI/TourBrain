import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">TourBrain</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/why-tourbrain"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
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

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            The AI-Native Tour Operations Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Replace spreadsheets, Prism, and Master Tour with one intelligent
            platform. Built for venues, promoters, and tour managers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#early-access"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Join the Waitlist
            </a>
            <a
              href="/why-tourbrain"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Why TourBrain?
            </a>
            <a
              href="/venues"
              className="inline-block border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Quick Value Props */}
      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate day sheets, analyze tour risks, and optimize routing
                with intelligent automation
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">All-in-One</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Booking, logistics, financials, and analytics in a single modern
                platform
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Built for Today</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Modern web interface, mobile-friendly, real-time collaboration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="early-access" className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Modernize Tour Operations?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join leading venues, promoters, and tour managers already using
            TourBrain.
          </p>
          <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
            <form className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Early access • No spam • Unsubscribe anytime
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
