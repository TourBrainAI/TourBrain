"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Settings } from "lucide-react";
import { RoutingConstraintsForm } from "./RoutingConstraintsForm";
import { RoutingScenariosList } from "./RoutingScenariosList";

interface SmartTourBuilderProps {
  tourId: string;
  tourName: string;
  artistName: string;
}

type View = "overview" | "constraints" | "scenarios";

export function SmartTourBuilder({
  tourId,
  tourName,
  artistName,
}: SmartTourBuilderProps) {
  const [currentView, setCurrentView] = useState<View>("overview");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Smart Tour Builder
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered route optimization for {artistName}
            </p>
          </div>

          {currentView === "overview" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView("scenarios")}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Scenarios
              </Button>
              <Button
                onClick={() => setCurrentView("constraints")}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Generate Route
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {currentView === "overview" && (
          <OverviewPanel
            tourId={tourId}
            onGenerateRoute={() => setCurrentView("constraints")}
            onViewScenarios={() => setCurrentView("scenarios")}
          />
        )}

        {currentView === "constraints" && (
          <RoutingConstraintsForm
            tourId={tourId}
            isGenerating={isGenerating}
            onGenerating={setIsGenerating}
            onCancel={() => setCurrentView("overview")}
            onSuccess={() => setCurrentView("scenarios")}
          />
        )}

        {currentView === "scenarios" && (
          <RoutingScenariosList
            tourId={tourId}
            onBack={() => setCurrentView("overview")}
            onGenerateNew={() => setCurrentView("constraints")}
          />
        )}
      </div>
    </div>
  );
}

interface OverviewPanelProps {
  tourId: string;
  onGenerateRoute: () => void;
  onViewScenarios: () => void;
}

function OverviewPanel({
  tourId,
  onGenerateRoute,
  onViewScenarios,
}: OverviewPanelProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Intelligent Tour Routing
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Let TourBrain analyze venues, geography, and logistics to create
          optimized tour routes that minimize travel time and maximize audience
          reach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Smart Scheduling</h4>
          <p className="text-sm text-gray-600 mt-1">
            Optimize dates considering drive times and venue availability
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Geographic Clustering</h4>
          <p className="text-sm text-gray-600 mt-1">
            Group venues by region to minimize long-distance travel
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Weather Intelligence</h4>
          <p className="text-sm text-gray-600 mt-1">
            Factor in climate data for outdoor venues and seasonal planning
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={onViewScenarios}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          View Existing Routes
        </Button>
        <Button onClick={onGenerateRoute} className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Generate New Route
        </Button>
      </div>
    </div>
  );
}
