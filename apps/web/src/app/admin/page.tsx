import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { WaitlistTable } from "./WaitlistTable";

export default async function AdminPage() {
  // Require admin or owner role
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">TourBrain Admin</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Admin dashboard for TourBrain management.
            </p>
          </div>
        </header>

        <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <WaitlistTable entries={[]} />
        </section>
      </div>
    </main>
  );
}
