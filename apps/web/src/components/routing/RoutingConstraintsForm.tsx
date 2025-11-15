"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format, addDays } from "date-fns";

interface RoutingConstraintsFormProps {
  tourId: string;
  isGenerating: boolean;
  onGenerating: (generating: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  state?: string;
  capacity?: number;
}

interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  states: string[];
  maxDriveHours: number;
  maxConsecutiveDays: number;
  requiredVenues: string[];
  offDays: string[];
  capacityRange: {
    min: number;
    max: number;
  };
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function RoutingConstraintsForm({
  tourId,
  isGenerating,
  onGenerating,
  onCancel,
  onSuccess,
}: RoutingConstraintsFormProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    states: [],
    maxDriveHours: 6,
    maxConsecutiveDays: 3,
    requiredVenues: [],
    offDays: ["Sunday"],
    capacityRange: {
      min: 0,
      max: 5000,
    },
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoadingVenues(true);
      const response = await fetch("/api/venues");
      if (!response.ok) throw new Error("Failed to fetch venues");
      const data = await response.json();
      setVenues(data.venues || []);
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError("Failed to load venues");
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    onGenerating(true);

    try {
      const response = await fetch(`/api/tours/${tourId}/routing/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || `Route ${format(new Date(), "MMM dd, yyyy")}`,
          constraints: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate route");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate route");
    } finally {
      onGenerating(false);
    }
  };

  const handleStateToggle = (state: string) => {
    setFormData((prev) => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter((s) => s !== state)
        : [...prev.states, state],
    }));
  };

  const handleVenueToggle = (venueId: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredVenues: prev.requiredVenues.includes(venueId)
        ? prev.requiredVenues.filter((id) => id !== venueId)
        : [...prev.requiredVenues, venueId],
    }));
  };

  const handleOffDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      offDays: prev.offDays.includes(day)
        ? prev.offDays.filter((d) => d !== day)
        : [...prev.offDays, day],
    }));
  };

  if (loadingVenues) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading venues...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-medium">Configure Tour Route</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Route Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., East Coast Winter Tour"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Geographic Constraints */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Geographic Preferences
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target States/Regions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
            {US_STATES.map((state) => (
              <label key={state} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.states.includes(state)}
                  onChange={() => handleStateToggle(state)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{state}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Drive Time (hours)
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={formData.maxDriveHours}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxDriveHours: parseInt(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum travel time between consecutive shows
          </p>
        </div>
      </div>

      {/* Scheduling Constraints */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Scheduling Preferences
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Consecutive Show Days
          </label>
          <input
            type="number"
            min="1"
            max="7"
            value={formData.maxConsecutiveDays}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxConsecutiveDays: parseInt(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Off Days (no shows scheduled)
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.offDays.includes(day)}
                  onChange={() => handleOffDayToggle(day)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Venue Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Venue Preferences
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Capacity
            </label>
            <input
              type="number"
              min="0"
              value={formData.capacityRange.min}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  capacityRange: {
                    ...prev.capacityRange,
                    min: parseInt(e.target.value) || 0,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Capacity
            </label>
            <input
              type="number"
              min="0"
              value={formData.capacityRange.max}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  capacityRange: {
                    ...prev.capacityRange,
                    max: parseInt(e.target.value) || 5000,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {venues.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Venues (anchor dates)
            </label>
            <div className="max-h-32 overflow-y-auto border rounded-lg p-3">
              {venues.map((venue) => (
                <label
                  key={venue.id}
                  className="flex items-center space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={formData.requiredVenues.includes(venue.id)}
                    onChange={() => handleVenueToggle(venue.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {venue.name} - {venue.city}, {venue.state}
                    {venue.capacity && ` (${venue.capacity} cap)`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isGenerating}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Route...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Generate Route
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
