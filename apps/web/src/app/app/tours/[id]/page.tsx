import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { AIRiskSummary } from "./AIRiskSummary";
import { SmartTourBuilder } from "@/components/routing";

interface TourDetailPageProps {
  params: { id: string };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { organizationId } = await getCurrentUser();

  if (!organizationId) {
    return <div>No organization found</div>;
  }

  const tour = await prisma.tour.findFirst({
    where: {
      id: params.id,
      organizationId,
    },
    include: {
      artist: true,
      shows: {
        orderBy: { date: "asc" },
        include: { venue: true },
      },
    },
  });

  if (!tour) {
    notFound();
  }

  const upcomingShows = tour.shows.filter(
    (show) => new Date(show.date) >= new Date()
  );
  const pastShows = tour.shows.filter(
    (show) => new Date(show.date) < new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tour.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="text-lg">{tour.artist.name}</span>
                <span className="px-3 py-1 bg-gray-100 rounded">
                  {tour.status}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/app/tours/${tour.id}/shows/new`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Add Show
              </Link>
              <Link
                href={`/app/tours/${tour.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Edit Tour
              </Link>
            </div>
          </div>

          {/* Tour Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Deal Info
              </h3>
              <div className="space-y-1 text-sm">
                {tour.dealType && <div>Type: {tour.dealType}</div>}
                {tour.guarantee && (
                  <div>Guarantee: ${tour.guarantee.toLocaleString()}</div>
                )}
                {tour.splitPercentage && (
                  <div>Split: {tour.splitPercentage}%</div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Shows</h3>
              <div className="space-y-1 text-sm">
                <div>Total: {tour.shows.length}</div>
                <div>Upcoming: {upcomingShows.length}</div>
                <div>Completed: {pastShows.length}</div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Timeline
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  Created: {format(new Date(tour.createdAt), "MMM d, yyyy")}
                </div>
                {tour.shows.length > 0 && (
                  <>
                    <div>
                      First show:{" "}
                      {format(new Date(tour.shows[0].date), "MMM d")}
                    </div>
                    <div>
                      Last show:{" "}
                      {format(
                        new Date(tour.shows[tour.shows.length - 1].date),
                        "MMM d"
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shows */}
        <div className="space-y-8">
          {/* AI Risk Analysis */}
          <AIRiskSummary tourId={tour.id} />

          {/* Smart Tour Builder */}
          <SmartTourBuilder
            tourId={tour.id}
            tourName={tour.name}
            artistName={tour.artist.name}
          />

          {/* Upcoming Shows */}
          {upcomingShows.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Shows ({upcomingShows.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="relative px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingShows.map((show) => (
                      <tr key={show.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(show.date), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {show.venue.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Cap: {show.venue.capacity?.toLocaleString() || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {show.venue.city},{" "}
                          {show.venue.state || show.venue.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              show.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : show.status === "ON_SALE"
                                ? "bg-blue-100 text-blue-800"
                                : show.status === "INQUIRY"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {show.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/app/shows/${show.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Past Shows */}
          {pastShows.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Completed Shows ({pastShows.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastShows.map((show) => (
                    <Link
                      key={show.id}
                      href={`/app/shows/${show.id}`}
                      className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="text-sm font-medium">
                        {show.venue.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {format(new Date(show.date), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {show.venue.city},{" "}
                        {show.venue.state || show.venue.country}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {tour.shows.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">
                No shows scheduled yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start by adding your first show to this tour.
              </p>
              <Link
                href={`/app/tours/${tour.id}/shows/new`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Add First Show
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
