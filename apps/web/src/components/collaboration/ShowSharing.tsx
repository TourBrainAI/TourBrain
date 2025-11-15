"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Users,
  Plus,
  Copy,
  Trash2,
  Eye,
  Edit3,
  DollarSign,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ShowCollaborator {
  id: string;
  email: string;
  name?: string;
  permission: "VIEW_ONLY" | "EDIT_LOGISTICS" | "EDIT_FINANCIALS";
  invitedAt: string;
  lastAccessedAt?: string;
  expiresAt?: string;
}

interface ShowSharingProps {
  showId: string;
  showTitle: string;
}

export function ShowSharing({ showId, showTitle }: ShowSharingProps) {
  const [collaborators, setCollaborators] = useState<ShowCollaborator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, showId]);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shows/${showId}/collaborate`);
      if (!response.ok) throw new Error("Failed to fetch collaborators");
      const data = await response.json();
      setCollaborators(data.collaborators || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load collaborators"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;

    try {
      const response = await fetch(
        `/api/shows/${showId}/collaborate?collaboratorId=${collaboratorId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to remove collaborator");

      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove collaborator"
      );
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "VIEW_ONLY":
        return <Eye className="w-4 h-4" />;
      case "EDIT_LOGISTICS":
        return <Edit3 className="w-4 h-4" />;
      case "EDIT_FINANCIALS":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case "VIEW_ONLY":
        return "View Only";
      case "EDIT_LOGISTICS":
        return "Edit Logistics";
      case "EDIT_FINANCIALS":
        return "Edit Financials";
      default:
        return permission;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "VIEW_ONLY":
        return "bg-gray-100 text-gray-800";
      case "EDIT_LOGISTICS":
        return "bg-blue-100 text-blue-800";
      case "EDIT_FINANCIALS":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Show
      </Button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Show
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Collaborate on {showTitle} with external partners
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="p-2"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Collaborators List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading collaborators...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Collaborators ({collaborators.length})
              </h4>
              <Button
                size="sm"
                onClick={() => setShowInviteForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Invite
              </Button>
            </div>

            {collaborators.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No collaborators yet
                </h4>
                <p className="text-gray-600 mb-4">
                  Invite venues, promoters, or team members to collaborate on
                  this show.
                </p>
                <Button
                  onClick={() => setShowInviteForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Invite Collaborator
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {collaborator.email}
                        </span>
                        {collaborator.name && (
                          <span className="text-sm text-gray-600">
                            ({collaborator.name})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {getPermissionIcon(collaborator.permission)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(
                              collaborator.permission
                            )}`}
                          >
                            {getPermissionLabel(collaborator.permission)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Invited{" "}
                          {new Date(
                            collaborator.invitedAt
                          ).toLocaleDateString()}
                        </div>

                        {collaborator.lastAccessedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Last accessed{" "}
                            {new Date(
                              collaborator.lastAccessedAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const baseUrl = window.location.origin;
                          // Note: This would need the actual token from the API response
                          const shareUrl = `${baseUrl}/shared/shows/${collaborator.id}`;
                          navigator.clipboard.writeText(shareUrl);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Link
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveCollaborator(collaborator.id)
                        }
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invite Form */}
        {showInviteForm && (
          <InviteCollaboratorForm
            showId={showId}
            onSuccess={(newCollaborator) => {
              setCollaborators((prev) => [
                ...prev,
                newCollaborator.collaborator,
              ]);
              setShowInviteForm(false);
            }}
            onCancel={() => setShowInviteForm(false)}
          />
        )}
      </div>
    </div>
  );
}

interface InviteCollaboratorFormProps {
  showId: string;
  onSuccess: (result: any) => void;
  onCancel: () => void;
}

function InviteCollaboratorForm({
  showId,
  onSuccess,
  onCancel,
}: InviteCollaboratorFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    permission: "VIEW_ONLY" as const,
    expiresInDays: 30,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(`/api/shows/${showId}/collaborate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite collaborator");
      }

      setShareUrl(data.shareUrl);
      onSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send invitation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (shareUrl) {
    return (
      <div className="mt-6 p-4 border-t border-gray-200">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Invitation Created!
          </h4>
          <p className="text-gray-600 mb-4">
            Share this link with {formData.email} to give them access to the
            show:
          </p>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(shareUrl)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={onCancel}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border-t border-gray-200 space-y-4"
    >
      <h4 className="font-medium text-gray-900">Invite Collaborator</h4>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            placeholder="collaborator@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (Optional)
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permission Level
          </label>
          <select
            value={formData.permission}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                permission: e.target.value as typeof formData.permission,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="VIEW_ONLY">View Only - Read show details</option>
            <option value="EDIT_LOGISTICS">
              Edit Logistics - Update times, notes
            </option>
            <option value="EDIT_FINANCIALS">
              Edit Financials - Update deals, settlement
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Access Duration
          </label>
          <select
            value={formData.expiresInDays}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                expiresInDays: parseInt(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={0}>No expiration</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Invitation...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
