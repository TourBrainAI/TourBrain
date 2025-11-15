import { getCurrentUser, getCurrentOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function AppDashboard() {
  const { organizationId } = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!organizationId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Found</h1>
          <p className="text-gray-600 mb-4">
            You need to be part of an organization to access TourBrain.
          </p>
          <Link
            href="/onboarding"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create Organization
          </Link>
        </div>
      </div>
    );
  }

  // Get dashboard data
  const [tours, upcomingShows, venues, artists] = await Promise.all([
    prisma.tour.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        artist: true,
        shows: {
          orderBy: { date: "asc" },
          take: 1,
        },
      },
    }),
    prisma.show.findMany({
      where: {
        tour: { organizationId },
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 10,
      include: {
        venue: true,
        tour: {
          include: { artist: true },
        },
      },
    }),
    prisma.venue.count({ where: { organizationId } }),
    prisma.artist.count({ where: { organizationId } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {organization.name}
              </h1>
              <p className="text-gray-600">{organization.type} Dashboard</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/app/tours"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                New Tour
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Tours
            </h3>
            <p className="text-3xl font-bold text-blue-600">{tours.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Shows
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {upcomingShows.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Venues</h3>
            <p className="text-3xl font-bold text-purple-600">{venues}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Artists</h3>
            <p className="text-3xl font-bold text-orange-600">{artists}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tours */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Tours
                </h2>
                <Link
                  href="/app/tours"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {tours.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No tours yet.{" "}
                  <Link href="/app/tours" className="text-blue-600">
                    Create your first tour
                  </Link>
                </p>
              ) : (
                <div className="space-y-4">
                  {tours.map((tour) => (
                    <div
                      key={tour.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-md"
                    >
                      <div>
                        <h3 className="font-semibold">{tour.name}</h3>
                        <p className="text-sm text-gray-600">
                          {tour.artist.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tour.status}</p>
                        <p className="text-xs text-gray-500">
                          {tour.shows.length > 0
                            ? format(new Date(tour.shows[0].date), "MMM d")
                            : "No shows"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Shows */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Shows
                </h2>
                <Link
                  href="/app/tours"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {upcomingShows.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No upcoming shows scheduled.
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingShows.map((show) => (
                    <Link
                      key={show.id}
                      href={`/app/shows/${show.id}`}
                      className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">
                            {show.tour.artist.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {show.venue.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(new Date(show.date), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">{show.status}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/app/venues"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">🏛️</div>
            <h3 className="font-semibold">Venues</h3>
            <p className="text-sm text-gray-600">Manage venue database</p>
          </Link>
          <Link
            href="/app/artists"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">🎤</div>
            <h3 className="font-semibold">Artists</h3>
            <p className="text-sm text-gray-600">Artist contacts & info</p>
          </Link>
          <Link
            href="/app/tours"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">🚌</div>
            <h3 className="font-semibold">Tours</h3>
            <p className="text-sm text-gray-600">Tour planning & logistics</p>
          </Link>
          <Link
            href="/admin"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold">Admin</h3>
            <p className="text-sm text-gray-600">System administration</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
