import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ArtistsPage() {
  const { organizationId } = await getCurrentUser();

  if (!organizationId) {
    return <div>No organization found</div>;
  }

  const artists = await prisma.artist.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
    include: {
      tours: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Artists</h1>
            <p className="text-gray-600">Manage your artist roster</p>
          </div>
          <Link
            href="/app/artists/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Artist
          </Link>
        </div>

        {artists.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No artists yet</h2>
            <p className="text-gray-600 mb-6">
              Start by adding artists to your roster.
            </p>
            <Link
              href="/app/artists/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add Your First Artist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {artist.name}
                    </h3>
                    {artist.genre && (
                      <p className="text-sm text-gray-600">{artist.genre}</p>
                    )}
                  </div>
                  <Link
                    href={`/app/artists/${artist.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </Link>
                </div>

                {artist.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {artist.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {artist.contactEmail && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-16">Email:</span>
                      <a
                        href={`mailto:${artist.contactEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {artist.contactEmail}
                      </a>
                    </div>
                  )}
                  {artist.contactPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-16">Phone:</span>
                      <span>{artist.contactPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  {artist.website && (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      Website
                    </a>
                  )}
                  {artist.spotifyUrl && (
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      Spotify
                    </a>
                  )}
                  {artist.instagramUrl && (
                    <a
                      href={artist.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded"
                    >
                      Instagram
                    </a>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {artist.tours.length} tours
                    </span>
                    <Link
                      href={`/app/tours/new?artistId=${artist.id}`}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      New Tour
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
