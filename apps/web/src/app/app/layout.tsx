import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentOrganization } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let organization;
  try {
    organization = await getCurrentOrganization();
  } catch (error) {
    // If no organization, redirect to onboarding
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to TourBrain</h1>
          <p className="text-gray-600 mb-6">
            You need to set up your organization to get started.
          </p>
          <Link
            href="/onboarding"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Set Up Organization
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and nav links */}
            <div className="flex items-center space-x-8">
              <Link href="/app" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">
                  TourBrain
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/app"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/app/venues"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Venues
                </Link>
                <Link
                  href="/app/artists"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Artists
                </Link>
                <Link
                  href="/app/tours"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Tours
                </Link>
              </div>
            </div>

            {/* Right side - Organization name and user button */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                <span className="font-medium">{organization.name}</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                  {organization.type}
                </span>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile menu (hidden by default, can be enhanced later) */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              href="/app"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/app/venues"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              Venues
            </Link>
            <Link
              href="/app/artists"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              Artists
            </Link>
            <Link
              href="/app/tours"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              Tours
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
