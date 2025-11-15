import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserWithOrganizations } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function VenuesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await getUserWithOrganizations();

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

  // Get venues for this organization
  const venues = await prisma.venue.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-xl font-semibold text-gray-900"
              >
                TourBrain
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link href="/venues" className="text-blue-600 font-medium">
                  Venues
                </Link>
                <Link
                  href="/artists"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Artists
                </Link>
                <Link
                  href="/tours"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Tours
                </Link>
              </div>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Venues</h2>
              <p className="text-gray-600">Manage venues you work with</p>
            </div>
            <Link
              href="/venues/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Venue
            </Link>
          </div>

          {/* Venues grid */}
          {venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {venue.name}
                      </h3>
                      {venue.capacity && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {venue.capacity} cap
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {venue.city}, {venue.country}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {venue.address}
                    </p>

                    {venue.contactEmail && (
                      <p className="text-sm text-gray-600 mb-2">
                        Contact: {venue.contactEmail}
                      </p>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        href={`/venues/${venue.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/venues/${venue.id}/edit`}
                        className="text-sm text-gray-600 hover:text-gray-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No venues
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first venue.
              </p>
              <div className="mt-6">
                <Link
                  href="/venues/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Venue
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
