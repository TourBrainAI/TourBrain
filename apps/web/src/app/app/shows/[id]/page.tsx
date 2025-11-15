import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { AINotesButton } from "./AINotesButton";
import { WeatherPanel } from "./WeatherPanel";

interface ShowDetailPageProps {
  params: { id: string };
}

export default async function ShowDetailPage({ params }: ShowDetailPageProps) {
  const { organizationId } = await getCurrentUser();

  if (!organizationId) {
    return <div>No organization found</div>;
  }

  const show = await prisma.show.findFirst({
    where: {
      id: params.id,
      tour: { organizationId },
    },
    include: {
      venue: true,
      tour: {
        include: { artist: true },
      },
    },
  });

  if (!show) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {show.tour.artist.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="text-lg">{show.venue.name}</span>
                <span className="px-3 py-1 bg-gray-100 rounded">
                  {show.status}
                </span>
              </div>
              <div className="mt-2 text-lg text-gray-700">
                {format(new Date(show.date), "EEEE, MMMM d, yyyy")}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/app/shows/${show.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Edit Show
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Show Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Show Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Timing
                    </h3>
                    <div className="space-y-1 text-sm">
                      {show.doors && (
                        <div>
                          Doors: {format(new Date(show.doors), "h:mm a")}
                        </div>
                      )}
                      {show.showtime && (
                        <div>
                          Show: {format(new Date(show.showtime), "h:mm a")}
                        </div>
                      )}
                      {show.curfew && (
                        <div>
                          Curfew: {format(new Date(show.curfew), "h:mm a")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Deal
                    </h3>
                    <div className="space-y-1 text-sm">
                      {show.guarantee && (
                        <div>Guarantee: ${show.guarantee.toLocaleString()}</div>
                      )}
                      {show.splitPercent && (
                        <div>Split: {show.splitPercent}%</div>
                      )}
                      {show.ticketPrice && (
                        <div>Ticket Price: ${show.ticketPrice}</div>
                      )}
                    </div>
                  </div>
                </div>

                {show.publicNotes && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {show.publicNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Weather Intelligence Panel */}
            <WeatherPanel show={show} />

            {/* Day Sheet */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Day Sheet
                  </h2>
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md print:hidden"
                  >
                    Print Day Sheet
                  </button>
                </div>
              </div>
              <div className="p-6 print:p-0">
                <div className="print:text-black print:bg-white">
                  {/* Day Sheet Header */}
                  <div className="text-center mb-6 print:mb-4">
                    <h1 className="text-2xl font-bold print:text-xl">
                      {show.tour.artist.name}
                    </h1>
                    <h2 className="text-lg print:text-base">
                      {show.venue.name}
                    </h2>
                    <p className="text-gray-600 print:text-black">
                      {format(new Date(show.date), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>

                  {/* Venue Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:mb-4">
                    <div>
                      <h3 className="font-semibold mb-2">Venue Information</h3>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Address:</strong> {show.venue.address}
                        </div>
                        <div>
                          <strong>City:</strong> {show.venue.city},{" "}
                          {show.venue.state} {show.venue.postalCode}
                        </div>
                        <div>
                          <strong>Capacity:</strong>{" "}
                          {show.venue.capacity?.toLocaleString() || "—"}
                        </div>
                        {show.venue.website && (
                          <div>
                            <strong>Website:</strong> {show.venue.website}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Venue Contact</h3>
                      <div className="space-y-1 text-sm">
                        {show.venue.contactName && (
                          <div>
                            <strong>Name:</strong> {show.venue.contactName}
                          </div>
                        )}
                        {show.venue.contactEmail && (
                          <div>
                            <strong>Email:</strong> {show.venue.contactEmail}
                          </div>
                        )}
                        {show.venue.contactPhone && (
                          <div>
                            <strong>Phone:</strong> {show.venue.contactPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show Schedule */}
                  <div className="mb-6 print:mb-4">
                    <h3 className="font-semibold mb-2">Schedule</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {show.doors && (
                        <div>
                          <strong>Doors:</strong>{" "}
                          {format(new Date(show.doors), "h:mm a")}
                        </div>
                      )}
                      {show.showtime && (
                        <div>
                          <strong>Show Time:</strong>{" "}
                          {format(new Date(show.showtime), "h:mm a")}
                        </div>
                      )}
                      {show.curfew && (
                        <div>
                          <strong>Curfew:</strong>{" "}
                          {format(new Date(show.curfew), "h:mm a")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deal Information */}
                  <div className="mb-6 print:mb-4">
                    <h3 className="font-semibold mb-2">Deal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {show.guarantee && (
                        <div>
                          <strong>Guarantee:</strong> $
                          {show.guarantee.toLocaleString()}
                        </div>
                      )}
                      {show.splitPercent && (
                        <div>
                          <strong>Split:</strong> {show.splitPercent}%
                        </div>
                      )}
                      {show.ticketPrice && (
                        <div>
                          <strong>Ticket Price:</strong> ${show.ticketPrice}
                        </div>
                      )}
                      <div>
                        <strong>Status:</strong> {show.status}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {show.publicNotes && (
                    <div className="mb-6 print:mb-4">
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <div className="text-sm whitespace-pre-wrap border p-3 rounded print:border-black">
                        {show.publicNotes}
                      </div>
                    </div>
                  )}

                  {/* Blank sections for handwritten notes */}
                  <div className="print:block hidden">
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Load-In Notes</h3>
                      <div className="border border-black h-20"></div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Production Notes</h3>
                      <div className="border border-black h-20"></div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Settlement Notes</h3>
                      <div className="border border-black h-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tour Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour</h3>
              <Link
                href={`/app/tours/${show.tour.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {show.tour.name}
              </Link>
              <div className="mt-2 text-sm text-gray-600">
                {show.tour.status}
              </div>
            </div>

            {/* Venue Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Venue
              </h3>
              <Link
                href={`/app/venues/${show.venue.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {show.venue.name}
              </Link>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div>Venue</div>
                <div>
                  {show.venue.city}, {show.venue.state}
                </div>
                <div>Cap: {show.venue.capacity?.toLocaleString() || "—"}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <AINotesButton showId={show.id} />
                <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">
                  Export Day Sheet
                </button>
                <Link
                  href={`/app/shows/${show.id}/edit`}
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                >
                  Edit Show Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
