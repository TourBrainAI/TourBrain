import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function ToursPage() {
  const { organizationId } = await getCurrentUser();

  if (!organizationId) {
    return <div>No organization found</div>;
  }

  const tours = await prisma.tour.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      artist: true,
      shows: {
        orderBy: { date: "asc" },
        include: { venue: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tours</h1>
            <p className="text-gray-600">Manage tour planning and logistics</p>
          </div>
          <Link
            href="/app/tours/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            New Tour
          </Link>
        </div>

        {tours.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No tours yet</h2>
            <p className="text-gray-600 mb-6">
              Start by creating your first tour.
            </p>
            <Link
              href="/app/tours/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Create Your First Tour
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tours.map((tour) => {
              const upcomingShows = tour.shows.filter(
                (show) => new Date(show.date) >= new Date()
              );
              const pastShows = tour.shows.filter(
                (show) => new Date(show.date) < new Date()
              );

              return (
                <div key={tour.id} className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link
                            href={`/app/tours/${tour.id}`}
                            className="hover:text-blue-600"
                          >
                            {tour.name}
                          </Link>
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{tour.artist.name}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {tour.status}
                          </span>
                          <span>{tour.shows.length} shows</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {tour.dealType && <div>Deal: {tour.dealType}</div>}
                          {tour.guarantee && (
                            <div>
                              Guarantee: ${tour.guarantee.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {upcomingShows.length > 0 && (
                    <div className="px-6 py-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Upcoming Shows ({upcomingShows.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {upcomingShows.slice(0, 6).map((show) => (
                          <Link
                            key={show.id}
                            href={`/app/shows/${show.id}`}
                            className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                          >
                            <div className="text-sm font-medium">
                              {show.venue.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {format(new Date(show.date), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {show.status}
                            </div>
                          </Link>
                        ))}
                      </div>
                      {upcomingShows.length > 6 && (
                        <div className="mt-3 text-sm text-gray-600">
                          +{upcomingShows.length - 6} more shows...
                        </div>
                      )}
                    </div>
                  )}

                  <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Created{" "}
                        {format(new Date(tour.createdAt), "MMM d, yyyy")}
                        {pastShows.length > 0 && (
                          <span> • {pastShows.length} shows completed</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/app/tours/${tour.id}/shows/new`}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Add Show
                        </Link>
                        <Link
                          href={`/app/tours/${tour.id}`}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
