"use client";

import { useMemo, useState, useEffect } from "react";
import type { WaitlistEntry } from "@prisma/client";
import { format } from "date-fns";

type RoleFilter =
  | "all"
  | "venue"
  | "promoter"
  | "agency"
  | "tour_manager"
  | "other";

type StatusFilter =
  | "all"
  | "NEW"
  | "QUALIFIED"
  | "CONTACTED"
  | "SCHEDULED"
  | "ACTIVE"
  | "LOST";

interface Props {
  entries: WaitlistEntry[];
}

export function WaitlistTable({ entries }: Props) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<
    "createdAt" | "role" | "email" | "status"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // CRM edit state
  const [saving, setSaving] = useState(false);
  const [detailStatus, setDetailStatus] = useState<StatusFilter>("NEW");
  const [detailPriority, setDetailPriority] = useState<number>(3);
  const [detailTags, setDetailTags] = useState<string>("");
  const [detailInternalNotes, setDetailInternalNotes] = useState<string>("");
  const [detailAssignedTo, setDetailAssignedTo] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries
      .filter((e) => {
        if (roleFilter !== "all") {
          const r = (e.role ?? "other") as RoleFilter;
          if (r !== roleFilter) return false;
        }
        if (statusFilter !== "all") {
          if (e.status !== statusFilter) return false;
        }
        if (!q) return true;
        return (
          e.email.toLowerCase().includes(q) ||
          (e.name ?? "").toLowerCase().includes(q) ||
          (e.organization ?? "").toLowerCase().includes(q) ||
          (e.notes ?? "").toLowerCase().includes(q) ||
          (e.internalNotes ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const dir = sortDirection === "asc" ? 1 : -1;
        if (sortField === "createdAt") {
          return (a.createdAt.getTime() - b.createdAt.getTime()) * dir;
        }
        if (sortField === "email") {
          return a.email.localeCompare(b.email) * dir;
        }
        if (sortField === "role") {
          const ra = (a.role ?? "other").toString();
          const rb = (b.role ?? "other").toString();
          return ra.localeCompare(rb) * dir;
        }
        if (sortField === "status") {
          const sa = a.status ?? "NEW";
          const sb = b.status ?? "NEW";
          return sa.localeCompare(sb) * dir;
        }
        return 0;
      });
  }, [entries, search, roleFilter, statusFilter, sortField, sortDirection]);

  const selected = useMemo(
    () => filtered.find((e) => e.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  // Sync detail form when selection changes
  useEffect(() => {
    if (!selected) return;
    setDetailStatus((selected.status as any) ?? "NEW");
    setDetailPriority(selected.priority ?? 3);
    setDetailTags((selected.tags ?? []).join(", "));
    setDetailInternalNotes(selected.internalNotes ?? "");
    setDetailAssignedTo(selected.assignedTo ?? "");
  }, [selected]);

  function handleSortChange(field: "createdAt" | "role" | "email" | "status") {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  }

  async function saveDetails(opts?: { markContacted?: boolean }) {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: detailStatus,
          priority: detailPriority,
          tags: detailTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          internalNotes: detailInternalNotes,
          assignedTo: detailAssignedTo,
          markContacted: opts?.markContacted ?? false,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, org, notes…"
            className="w-full md:w-64 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:items-center text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-500">Role:</span>
            {(
              [
                "all",
                "venue",
                "promoter",
                "agency",
                "tour_manager",
                "other",
              ] as RoleFilter[]
            ).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 rounded-full border text-xs ${
                  roleFilter === role
                    ? "bg-emerald-500 text-black border-emerald-400"
                    : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
                }`}
              >
                {roleLabel(role)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-500">Status:</span>
            {(
              [
                "all",
                "NEW",
                "QUALIFIED",
                "CONTACTED",
                "SCHEDULED",
                "ACTIVE",
                "LOST",
              ] as StatusFilter[]
            ).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full border text-xs ${
                  statusFilter === st
                    ? "bg-blue-500 text-black border-blue-400"
                    : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
                }`}
              >
                {st === "all" ? "All" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table + detail side panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 overflow-x-auto rounded-xl border border-neutral-800">
          <table className="min-w-full text-xs">
            <thead className="bg-neutral-900/80">
              <tr>
                <SortableHeader
                  label="Date"
                  field="createdAt"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onClick={handleSortChange}
                />
                <SortableHeader
                  label="Email"
                  field="email"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onClick={handleSortChange}
                />
                <SortableHeader
                  label="Name"
                  field="email"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  // clicking Name won't change sort for now
                  onClick={() => {}}
                  disableSort
                />
                <SortableHeader
                  label="Role"
                  field="role"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onClick={handleSortChange}
                />
                <SortableHeader
                  label="Status"
                  field="status"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onClick={handleSortChange}
                />
                <th className="px-3 py-2 text-left font-medium text-neutral-400">
                  Priority
                </th>
                <th className="px-3 py-2 text-left font-medium text-neutral-400">
                  Organization
                </th>
                <th className="px-3 py-2 text-left font-medium text-neutral-400">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-neutral-500"
                  >
                    No entries found for current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`border-t border-neutral-800 cursor-pointer hover:bg-neutral-900/80 ${
                      selectedId === entry.id ? "bg-neutral-900/90" : ""
                    }`}
                    onClick={() =>
                      setSelectedId((prev) =>
                        prev === entry.id ? null : entry.id
                      )
                    }
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-300">
                      {format(entry.createdAt, "MM/dd/yyyy HH:mm")}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-emerald-300">
                      {entry.email}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-200">
                      {entry.name || "—"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-300">
                      {roleLabel((entry.role as any) ?? "other")}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <StatusBadge status={(entry.status as any) ?? "NEW"} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-200">
                      {(entry.priority as any) ?? 3}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-300">
                      {entry.organization || "—"}
                    </td>
                    <td className="px-3 py-2 max-w-xs text-neutral-400">
                      <span className="line-clamp-2">{entry.notes || "—"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div className="w-full lg:w-80 bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Entry details</h3>
          {!selected ? (
            <p className="text-xs text-neutral-500">
              Select a row to see the full context and notes.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Name" value={selected.name || "—"} />
              <DetailRow
                label="Role"
                value={roleLabel((selected.role as any) ?? "other")}
              />
              <DetailRow
                label="Organization"
                value={selected.organization || "—"}
              />
              <DetailRow
                label="Source"
                value={selected.source || "landing_page"}
              />
              <DetailRow
                label="Created"
                value={format(selected.createdAt, "PPpp")}
              />

              {/* Editable CRM fields */}
              <div>
                <p className="text-neutral-500 mb-1">Status</p>
                <select
                  value={detailStatus}
                  onChange={(e) =>
                    setDetailStatus(e.target.value as StatusFilter)
                  }
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                >
                  {[
                    "NEW",
                    "QUALIFIED",
                    "CONTACTED",
                    "SCHEDULED",
                    "ACTIVE",
                    "LOST",
                  ].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-neutral-500 mb-1">Priority (1 = highest)</p>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={detailPriority}
                  onChange={(e) =>
                    setDetailPriority(Number(e.target.value) || 3)
                  }
                  className="w-20 rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                />
              </div>

              <div>
                <p className="text-neutral-500 mb-1">Tags (comma separated)</p>
                <input
                  type="text"
                  value={detailTags}
                  onChange={(e) => setDetailTags(e.target.value)}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                  placeholder="indie venue, multi-market, design partner"
                />
              </div>

              <div>
                <p className="text-neutral-500 mb-1">Assigned to</p>
                <input
                  type="text"
                  value={detailAssignedTo}
                  onChange={(e) => setDetailAssignedTo(e.target.value)}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                  placeholder="JJ, AE name, etc."
                />
              </div>

              <div>
                <p className="text-neutral-500 mb-1">Internal notes</p>
                <textarea
                  value={detailInternalNotes}
                  onChange={(e) => setDetailInternalNotes(e.target.value)}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                  rows={4}
                  placeholder="Use this like a mini CRM for outreach history, call notes, etc."
                />
              </div>

              {(selected.lastContactedAt as any) && (
                <DetailRow
                  label="Last contacted"
                  value={format(selected.lastContactedAt as any, "PPpp")}
                />
              )}

              <div>
                <p className="text-neutral-500 mb-1">
                  User notes (from signup)
                </p>
                <p className="text-neutral-200 whitespace-pre-wrap">
                  {selected.notes || "—"}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => saveDetails()}
                  disabled={saving}
                  className="flex-1 rounded bg-emerald-500 text-black px-3 py-1.5 text-xs font-medium hover:bg-emerald-400 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => saveDetails({ markContacted: true })}
                  disabled={saving}
                  className="flex-1 rounded border border-blue-400 text-blue-200 px-3 py-1.5 text-xs font-medium hover:bg-blue-500/10 disabled:opacity-60"
                >
                  Mark contacted
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function roleLabel(role: RoleFilter | string): string {
  switch (role) {
    case "all":
      return "All";
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

function StatusBadge({ status }: { status: StatusFilter | string }) {
  const s = status as StatusFilter;
  const labels: Record<string, string> = {
    NEW: "New",
    QUALIFIED: "Qualified",
    CONTACTED: "Contacted",
    SCHEDULED: "Scheduled",
    ACTIVE: "Active",
    LOST: "Lost",
  };
  const colors: Record<string, string> = {
    NEW: "bg-neutral-700 text-neutral-100",
    QUALIFIED: "bg-emerald-600/80 text-black",
    CONTACTED: "bg-blue-500/80 text-black",
    SCHEDULED: "bg-purple-500/80 text-black",
    ACTIVE: "bg-emerald-400/80 text-black",
    LOST: "bg-red-500/80 text-black",
  };
  const label = labels[s] ?? s;
  const color = colors[s] ?? "bg-neutral-700 text-neutral-100";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}
    >
      {label}
    </span>
  );
}

interface HeaderProps {
  label: string;
  field: "createdAt" | "role" | "email" | "status";
  sortField: string;
  sortDirection: "asc" | "desc";
  onClick: (field: any) => void;
  disableSort?: boolean;
}

function SortableHeader({
  label,
  field,
  sortField,
  sortDirection,
  onClick,
  disableSort,
}: HeaderProps) {
  const isActive = sortField === field;
  return (
    <th
      className="px-3 py-2 text-left font-medium text-neutral-400"
      onClick={disableSort ? undefined : () => onClick(field)}
    >
      <button
        type="button"
        className={`flex items-center gap-1 ${
          disableSort ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <span>{label}</span>
        {!disableSort && (
          <span className="text-[10px] text-neutral-500">
            {isActive ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
          </span>
        )}
      </button>
    </th>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-neutral-500 mb-1">{label}</p>
      <p className="text-neutral-200">{value}</p>
    </div>
  );
}
