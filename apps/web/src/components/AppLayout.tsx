import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentOrganization } from "@/lib/auth";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const organization = await getCurrentOrganization();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/app" className="text-xl font-bold text-blue-600">
                TourBrain
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/app"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/app/venues"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Venues
                </Link>
                <Link
                  href="/app/artists"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Artists
                </Link>
                <Link
                  href="/app/tours"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Tours
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">{organization.name}</div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
