"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Cloud,
  Sun,
  CloudRain,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface RoutingStop {
  id: string;
  date: string;
  city: string;
  state?: string;
  venueName: string;
  venueId: string;
  driveHours: number | null;
  weatherScore?: number | null;
  weatherSummary?: string | null;
  isOutdoor: boolean;
  estimatedRevenue?: number;
}

interface RoutingScenario {
  id: string;
  name: string;
  description: string;
  totalDriveHours: number;
  totalRevenue: number;
  avgWeatherScore: number | null;
  stops: RoutingStop[];
}

interface WeatherAwareRoutingProps {
  scenarios: RoutingScenario[];
  onSelectScenario?: (scenarioId: string) => void;
  className?: string;
}

export function WeatherAwareRouting({
  scenarios,
  onSelectScenario,
  className,
}: WeatherAwareRoutingProps) {
  const [sortBy, setSortBy] = useState<"weather" | "revenue" | "drive_time">(
    "weather"
  );

  const sortedScenarios = useMemo(() => {
    return [...scenarios].sort((a, b) => {
      switch (sortBy) {
        case "weather":
          const aWeather = a.avgWeatherScore ?? 0;
          const bWeather = b.avgWeatherScore ?? 0;
          return bWeather - aWeather; // Higher weather scores first
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "drive_time":
          return a.totalDriveHours - b.totalDriveHours;
        default:
          return 0;
      }
    });
  }, [scenarios, sortBy]);

  const getWeatherIcon = (score: number | null) => {
    if (!score) return <Cloud className="h-4 w-4" />;
    if (score >= 80) return <Sun className="h-4 w-4" />;
    if (score >= 60) return <Cloud className="h-4 w-4" />;
    return <CloudRain className="h-4 w-4" />;
  };

  const getWeatherBadgeColor = (score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScenarioWeatherExplanation = (scenario: RoutingScenario) => {
    const outdoorStops = scenario.stops.filter(
      (s) => s.isOutdoor && s.weatherScore !== null
    );

    if (outdoorStops.length === 0) {
      return "This route focuses on indoor venues, minimizing weather-related risks.";
    }

    const avgScore = scenario.avgWeatherScore;
    if (!avgScore) {
      return "Weather data is being analyzed for outdoor venues in this route.";
    }

    const goodWeatherStops = outdoorStops.filter(
      (s) => (s.weatherScore ?? 0) >= 70
    );
    const riskyWeatherStops = outdoorStops.filter(
      (s) => (s.weatherScore ?? 0) < 50
    );

    if (avgScore >= 75) {
      return `This route clusters outdoor shows during historically favorable weather windows. ${goodWeatherStops.length} of ${outdoorStops.length} outdoor shows have excellent conditions.`;
    } else if (avgScore >= 60) {
      return `This route has generally acceptable weather conditions for outdoor shows, with some potential risks to monitor.`;
    } else if (riskyWeatherStops.length > 0) {
      return `This route includes ${riskyWeatherStops.length} outdoor shows with significant weather risks. Consider backup plans or venue alternatives.`;
    }

    return `Weather conditions vary across this route. Plan accordingly for outdoor venues.`;
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Weather-Aware Routing</h3>
          <p className="text-sm text-gray-600">
            Tour scenarios optimized for weather conditions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={sortBy === "weather" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("weather")}
              className="rounded-none"
            >
              Weather
            </Button>
            <Button
              variant={sortBy === "revenue" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("revenue")}
              className="rounded-none"
            >
              Revenue
            </Button>
            <Button
              variant={sortBy === "drive_time" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("drive_time")}
              className="rounded-none"
            >
              Drive Time
            </Button>
          </div>
        </div>
      </div>

      {sortedScenarios.map((scenario, index) => (
        <Card key={scenario.id} className="relative overflow-hidden">
          {index === 0 && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
              Recommended
            </div>
          )}

          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{scenario.name}</CardTitle>
                <CardDescription className="mt-1">
                  {scenario.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {scenario.avgWeatherScore !== null && (
                  <div className="flex items-center gap-1">
                    <Badge
                      className={cn(
                        "px-2 py-1 text-white font-medium",
                        getWeatherBadgeColor(scenario.avgWeatherScore)
                      )}
                    >
                      {getWeatherIcon(scenario.avgWeatherScore)}
                      <span className="ml-1">
                        {Math.round(scenario.avgWeatherScore)}
                      </span>
                    </Badge>
                    <span className="text-xs text-gray-500">Weather</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Scenario Summary */}
            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {scenario.stops.length} stops
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {scenario.totalDriveHours}h drive time
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    ${scenario.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Explanation */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Cloud className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Weather Intelligence
                  </p>
                  <p className="text-sm text-blue-800">
                    {getScenarioWeatherExplanation(scenario)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stops List */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Stops</h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {scenario.stops.map((stop, stopIndex) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-2 border rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-mono text-xs w-6">
                        {stopIndex + 1}
                      </span>
                      <div>
                        <div className="font-medium">
                          {new Date(stop.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-gray-600">
                          {stop.city}
                          {stop.state && `, ${stop.state}`}
                        </div>
                      </div>
                      <div className="text-gray-600">{stop.venueName}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {stop.driveHours !== null && (
                        <span className="text-xs text-gray-500">
                          {stop.driveHours}h
                        </span>
                      )}

                      {stop.isOutdoor && stop.weatherScore !== null && (
                        <Badge
                          className={cn(
                            "px-2 py-1 text-white text-xs",
                            getWeatherBadgeColor(stop.weatherScore)
                          )}
                        >
                          {getWeatherIcon(stop.weatherScore)}
                          <span className="ml-1">{stop.weatherScore}</span>
                        </Badge>
                      )}

                      {!stop.isOutdoor && (
                        <Badge variant="outline" className="text-xs">
                          Indoor
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => onSelectScenario?.(scenario.id)}
                className="flex items-center gap-1"
              >
                <TrendingUp className="h-4 w-4" />
                Select Route
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {scenarios.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No routing scenarios available
              </h4>
              <p className="text-gray-600">
                Create tour dates to see weather-optimized routing suggestions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
