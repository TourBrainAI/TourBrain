"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Music,
  Phone,
  Mail,
  Globe,
  Edit3,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  DollarSign,
} from "lucide-react";

interface SharedShow {
  id: string;
  date: string;
  doors?: string;
  showtime?: string;
  curfew?: string;
  status: string;
  capacity?: number;
  publicNotes?: string;
  loadInTime?: string;
  soundcheck?: string;
  // Financial fields (only visible with EDIT_FINANCIALS permission)
  guarantee?: number;
  splitPercent?: number;
  ticketPrice?: number;
  currency?: string;
  grossSales?: number;
  expenses?: number;
  netRevenue?: number;
  settled?: boolean;
  settledAt?: string;
  internalNotes?: string;
  tour: {
    id: string;
    name: string;
    artist: {
      id: string;
      name: string;
      genre?: string;
    };
  };
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    capacity?: number;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    loadInTime?: string;
    soundcheck?: string;
    curfew?: string;
    notes?: string;
  };
}

interface Collaborator {
  name?: string;
  email: string;
  permission: "VIEW_ONLY" | "EDIT_LOGISTICS" | "EDIT_FINANCIALS";
}

interface SharedShowViewProps {
  token: string;
}

export function SharedShowView({ token }: SharedShowViewProps) {
  const [show, setShow] = useState<SharedShow | null>(null);
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState<Partial<SharedShow>>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchShowData();
  }, [token]);

  const fetchShowData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/shared/shows/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Invalid or expired share link");
        } else if (response.status === 410) {
          throw new Error("This share link has expired");
        } else {
          throw new Error("Failed to load show data");
        }
      }

      const data = await response.json();
      setShow(data.show);
      setCollaborator(data.collaborator);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load show data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!show || !collaborator) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/shared/shows/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save changes");
      }

      const data = await response.json();
      setShow(data.show);
      setEditedData({});
      setEditing(false);
      setSaveMessage("Changes saved successfully");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const canEdit = () => {
    return collaborator && collaborator.permission !== "VIEW_ONLY";
  };

  const canEditFinancials = () => {
    return collaborator && collaborator.permission === "EDIT_FINANCIALS";
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "TBD";
    }
  };

  const getPermissionIcon = () => {
    if (!collaborator) return <Eye className="w-4 h-4" />;

    switch (collaborator.permission) {
      case "EDIT_LOGISTICS":
        return <Edit3 className="w-4 h-4" />;
      case "EDIT_FINANCIALS":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getPermissionLabel = () => {
    if (!collaborator) return "View Only";

    switch (collaborator.permission) {
      case "EDIT_LOGISTICS":
        return "Can Edit Logistics";
      case "EDIT_FINANCIALS":
        return "Can Edit Financials";
      default:
        return "View Only";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        Loading show details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Error
        </h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!show || !collaborator) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Show Not Found
        </h2>
        <p className="text-gray-600">The requested show could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {show.tour.artist.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{show.venue.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(show.date), "EEEE, MMMM do, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {getPermissionIcon()}
              <span className="font-medium">{getPermissionLabel()}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                Shared with {collaborator.name || collaborator.email}
              </span>
            </div>
          </div>

          {canEdit() && (
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditedData({});
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Details
                </button>
              )}
            </div>
          )}
        </div>

        {saveMessage && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            {saveMessage}
          </div>
        )}
      </div>

      {/* Show Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Show Schedule
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Doors</label>
            <div className="mt-1 text-lg font-mono">
              {formatTime(show.doors)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Show Time
            </label>
            <div className="mt-1 text-lg font-mono">
              {formatTime(show.showtime)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Curfew</label>
            <div className="mt-1 text-lg font-mono">
              {formatTime(show.curfew)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Capacity
            </label>
            <div className="mt-1 text-lg">
              {show.capacity?.toLocaleString() ||
                show.venue.capacity?.toLocaleString() ||
                "TBD"}
            </div>
          </div>
        </div>

        {canEdit() && editing && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Edit Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Load In Time
                </label>
                <input
                  type="time"
                  value={editedData.loadInTime || show.loadInTime || ""}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      loadInTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soundcheck
                </label>
                <input
                  type="time"
                  value={editedData.soundcheck || show.soundcheck || ""}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      soundcheck: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curfew
                </label>
                <input
                  type="time"
                  value={editedData.curfew || show.curfew || ""}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      curfew: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Venue Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Venue Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Venue</label>
              <div className="mt-1 text-lg">{show.venue.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">{show.venue.address}</div>
              <div>
                {show.venue.city}, {show.venue.state}
              </div>
            </div>
            {show.venue.website && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1">
                  <a
                    href={show.venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {show.venue.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {show.venue.contactName && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contact
                </label>
                <div className="mt-1">{show.venue.contactName}</div>
              </div>
            )}
            {show.venue.contactEmail && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <a
                    href={`mailto:${show.venue.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Mail className="w-4 h-4" />
                    {show.venue.contactEmail}
                  </a>
                </div>
              </div>
            )}
            {show.venue.contactPhone && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1">
                  <a
                    href={`tel:${show.venue.contactPhone}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Phone className="w-4 h-4" />
                    {show.venue.contactPhone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Information (if permitted) */}
      {canEditFinancials() && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Details
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Guarantee
              </label>
              <div className="mt-1 text-lg">
                {show.guarantee ? `$${show.guarantee.toLocaleString()}` : "TBD"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Split</label>
              <div className="mt-1 text-lg">
                {show.splitPercent ? `${show.splitPercent}%` : "TBD"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ticket Price
              </label>
              <div className="mt-1 text-lg">
                {show.ticketPrice ? `$${show.ticketPrice}` : "TBD"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    show.settled
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {show.settled ? "Settled" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>

        {editing && canEdit() ? (
          <div>
            <textarea
              value={editedData.publicNotes ?? show.publicNotes ?? ""}
              onChange={(e) =>
                setEditedData((prev) => ({
                  ...prev,
                  publicNotes: e.target.value,
                }))
              }
              placeholder="Add notes about the show..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div className="prose max-w-none">
            {show.publicNotes ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {show.publicNotes}
              </p>
            ) : (
              <p className="text-gray-500 italic">No notes available</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Powered by TourBrain • Shared on {format(new Date(), "MMMM do, yyyy")}
        </p>
      </div>
    </div>
  );
}
