"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  PlayCircle,
} from "lucide-react";
import { format } from "date-fns";

interface RoutingScenario {
  id: string;
  name: string;
  status: "DRAFT" | "APPLIED" | "ARCHIVED";
  createdAt: string;
  constraints: any;
  stops: Array<{
    id: string;
    venueId: string;
    date: string;
    sequence: number;
    driveTime?: number;
    notes?: string;
    venue: {
      id: string;
      name: string;
      city: string;
      state?: string;
      capacity?: number;
      isOutdoor: boolean;
    };
  }>;
  _count: {
    stops: number;
  };
}

interface RoutingScenariosListProps {
  tourId: string;
  onBack: () => void;
  onGenerateNew: () => void;
}

export function RoutingScenariosList({
  tourId,
  onBack,
  onGenerateNew,
}: RoutingScenariosListProps) {
  const [scenarios, setScenarios] = useState<RoutingScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchScenarios();
  }, [tourId]);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/tours/${tourId}/routing/scenarios`);

      if (!response.ok) {
        throw new Error("Failed to fetch scenarios");
      }

      const data = await response.json();
      setScenarios(data.scenarios || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scenarios");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyScenario = async (scenarioId: string) => {
    try {
      setActionLoading(scenarioId);
      setError(null);

      const response = await fetch(`/api/tours/${tourId}/routing/scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          action: "apply",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError(`Cannot apply scenario: ${data.error}`);
          return;
        }
        throw new Error(data.error || "Failed to apply scenario");
      }

      // Refresh scenarios list
      await fetchScenarios();

      // Show success message
      alert(
        `Successfully created ${data.showsCreated} shows from the routing scenario!`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply scenario");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    if (!confirm("Are you sure you want to delete this routing scenario?")) {
      return;
    }

    try {
      setActionLoading(scenarioId);
      setError(null);

      const response = await fetch(`/api/tours/${tourId}/routing/scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          action: "delete",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete scenario");
      }

      // Refresh scenarios list
      await fetchScenarios();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete scenario"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: RoutingScenario["status"]) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>
        );
      case "APPLIED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Applied
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Archived
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-medium">Routing Scenarios</h3>
        </div>

        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading scenarios...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-medium">Routing Scenarios</h3>
        </div>

        <Button onClick={onGenerateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate New Route
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Scenarios List */}
      {scenarios.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No routing scenarios yet
          </h4>
          <p className="text-gray-600 mb-4">
            Generate your first AI-optimized tour route to get started.
          </p>
          <Button onClick={onGenerateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Generate Route
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="border border-gray-200 rounded-lg"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {scenario.name}
                      </h4>
                      {getStatusBadge(scenario.status)}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {scenario._count.stops} shows
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created{" "}
                        {format(new Date(scenario.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedScenario(
                            selectedScenario === scenario.id
                              ? null
                              : scenario.id
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {selectedScenario === scenario.id
                          ? "Hide"
                          : "View"}{" "}
                        Details
                      </Button>

                      {scenario.status === "DRAFT" && (
                        <Button
                          size="sm"
                          onClick={() => handleApplyScenario(scenario.id)}
                          disabled={actionLoading === scenario.id}
                          className="flex items-center gap-2"
                        >
                          {actionLoading === scenario.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4" />
                              Apply Route
                            </>
                          )}
                        </Button>
                      )}

                      {scenario.status !== "APPLIED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteScenario(scenario.id)}
                          disabled={actionLoading === scenario.id}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scenario Details */}
                {selectedScenario === scenario.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Date
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Venue
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Location
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Capacity
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Drive Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenario.stops.map((stop) => (
                            <tr
                              key={stop.id}
                              className="border-t border-gray-200"
                            >
                              <td className="px-3 py-2">
                                {format(new Date(stop.date), "MMM d, yyyy")}
                              </td>
                              <td className="px-3 py-2 font-medium">
                                {stop.venue.name}
                                {stop.venue.isOutdoor && (
                                  <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                    Outdoor
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {stop.venue.city}, {stop.venue.state}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {stop.venue.capacity?.toLocaleString() || "N/A"}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {stop.driveTime
                                  ? `${Math.round(stop.driveTime / 60)}h ${
                                      stop.driveTime % 60
                                    }m`
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {scenario.stops[0]?.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Notes:</strong> {scenario.stops[0].notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
