import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserWithOrganizations } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await getUserWithOrganizations();

  // If user has no organizations, redirect to onboarding
  if (
    !dbUser ||
    (dbUser.ownedOrganizations.length === 0 &&
      dbUser.organizationMemberships.length === 0)
  ) {
    redirect("/onboarding");
  }

  const organization =
    dbUser.ownedOrganizations[0] ||
    dbUser.organizationMemberships[0]?.organization;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">TourBrain</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {organization?.name}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to TourBrain, {user.firstName}!
            </h2>
            <p className="text-gray-600">
              Let&apos;s get your tour operations organized.
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Add Venues
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start by adding venues you work with
                </p>
                <a
                  href="/venues/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Venue
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Manage Artists
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add artists you&apos;re working with
                </p>
                <a
                  href="/artists/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Artist
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Create Tour
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Plan and organize a new tour
                </p>
                <a
                  href="/tours/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Tour
                </a>
              </div>
            </div>
          </div>

          {/* Recent activity placeholder */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                No recent activity yet. Start by adding venues, artists, or
                creating your first tour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
