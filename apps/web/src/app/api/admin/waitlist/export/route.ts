import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "id",
    "email",
    "name",
    "role",
    "organization",
    "status",
    "priority",
    "tags",
    "notes",
    "internalNotes",
    "assignedTo",
    "lastContactedAt",
    "source",
    "createdAt",
  ];

  const rows = entries.map((e) => [
    e.id,
    e.email,
    e.name ?? "",
    e.role ?? "",
    e.organization ?? "",
    e.status,
    e.priority?.toString() ?? "",
    (e.tags ?? []).join("|"),
    (e.notes ?? "").replace(/\r?\n/g, " "),
    (e.internalNotes ?? "").replace(/\r?\n/g, " "),
    e.assignedTo ?? "",
    e.lastContactedAt ? e.lastContactedAt.toISOString() : "",
    e.source ?? "",
    e.createdAt.toISOString(),
  ]);

  const csvLines = [header, ...rows]
    .map((cols) =>
      cols
        .map((c) => {
          const s = c ?? "";
          if (s.includes(",") || s.includes('"') || s.includes("\n")) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        })
        .join(",")
    )
    .join("\n");

  return new NextResponse(csvLines, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tourbrain_waitlist_${
        new Date().toISOString().split("T")[0]
      }.csv"`,
    },
  });
}
