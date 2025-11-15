import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { WaitlistTable } from "./WaitlistTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

type WaitlistRole =
  | "venue"
  | "promoter"
  | "agency"
  | "tour_manager"
  | "other"
  | null;

interface WaitlistStats {
  total: number;
  byRole: Record<string, number>;
  last7Days: number;
  last30Days: number;
  dailyCounts: { date: string; count: number }[];
}

async function getWaitlistData(): Promise<{
  entries: Awaited<ReturnType<typeof prisma.waitlistEntry.findMany>>;
  stats: WaitlistStats;
}> {
  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const last7 = new Date(now);
  last7.setDate(now.getDate() - 7);
  const last30 = new Date(now);
  last30.setDate(now.getDate() - 30);

  let total = entries.length;
  let last7Days = 0;
  let last30Days = 0;
  const byRole: Record<string, number> = {};
  const dailyMap: Record<string, number> = {};

  for (const entry of entries) {
    const createdDate = entry.createdAt;
    if (createdDate >= last7) last7Days += 1;
    if (createdDate >= last30) last30Days += 1;

    const role: WaitlistRole = (entry.role as WaitlistRole) ?? "other";
    const key = role ?? "other";
    byRole[key] = (byRole[key] ?? 0) + 1;

    const dayKey = format(createdDate, "yyyy-MM-dd");
    dailyMap[dayKey] = (dailyMap[dayKey] ?? 0) + 1;
  }

  const dailyCounts = Object.entries(dailyMap)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, count }));

  return {
    entries,
    stats: {
      total,
      byRole,
      last7Days,
      last30Days,
      dailyCounts,
    },
  };
}

export default async function AdminPage() {
  // Require admin or owner role
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/");
  }

  const { entries, stats } = await getWaitlistData();

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("admin-session");
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">TourBrain Admin</h1>
              <form action={handleLogout}>
                <button
                  type="submit"
                  className="text-xs px-3 py-1 rounded-full border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
                >
                  Logout
                </button>
              </form>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Internal dashboard for monitoring early access demand and user
              segments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right space-y-1">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Waitlist total
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <a
              href="/api/admin/waitlist/export"
              className="inline-flex items-center rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              Export CSV
            </a>
          </div>
        </header>

        {/* KPI cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total signups" value={stats.total} />
          <KpiCard label="Last 7 days" value={stats.last7Days} />
          <KpiCard label="Last 30 days" value={stats.last30Days} />
          <KpiCard
            label="Top segment"
            value={getTopRoleLabel(stats.byRole) ?? "—"}
          />
        </section>

        {/* Role breakdown + daily trend */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
            <h2 className="text-sm font-medium mb-3">
              Segments by role (count)
            </h2>
            <ul className="space-y-1 text-sm">
              {Object.entries(stats.byRole).length === 0 && (
                <li className="text-neutral-500">No entries yet.</li>
              )}
              {Object.entries(stats.byRole)
                .sort(([, a], [, b]) => b - a)
                .map(([role, count]) => (
                  <li
                    key={role}
                    className="flex items-center justify-between text-neutral-300"
                  >
                    <span>{roleLabel(role as WaitlistRole)}</span>
                    <span className="font-mono">{count}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="lg:col-span-2 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
            <h2 className="text-sm font-medium mb-3">
              Signups by day (last {stats.dailyCounts.length} days)
            </h2>
            {stats.dailyCounts.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No signups yet. Share your landing page to start collecting
                interest.
              </p>
            ) : (
              <div className="h-40 flex items-end gap-1">
                {stats.dailyCounts.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div
                      className="w-full bg-emerald-500/80 rounded-t"
                      style={{
                        height: `${Math.min(d.count * 20, 120)}px`,
                      }}
                    ></div>
                    <div className="mt-1 text-[10px] text-neutral-500 group-hover:text-neutral-300">
                      {format(new Date(d.date), "MM/dd")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Waitlist table */}
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium">
                Waitlist entries ({entries.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Search, filter, and inspect signups. Use this to prioritize
                outreach.
              </p>
            </div>
          </div>
          <WaitlistTable entries={entries} />
        </section>
      </div>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function getTopRoleLabel(byRole: Record<string, number>): string | null {
  const entries = Object.entries(byRole);
  if (entries.length === 0) return null;
  const [topRole] = entries.sort(([, a], [, b]) => b - a)[0];
  return roleLabel(topRole as WaitlistRole);
}

function roleLabel(role: WaitlistRole): string {
  switch (role) {
    case "venue":
      return "Venue / talent buyer";
    case "promoter":
      return "Promoter";
    case "agency":
      return "Agency";
    case "tour_manager":
      return "Tour manager / production";
    case "other":
    default:
      return "Other";
  }
}
