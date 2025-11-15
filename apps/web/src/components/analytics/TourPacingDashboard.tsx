"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { RiskBadge, RiskScoreBar } from "./RiskAssessment";
import { MiniPacingChart } from "./PacingChart";

interface TourPacingDashboardProps {
  tourId: string;
}

interface ShowData {
  id: string;
  date: string;
  venue: {
    name: string;
    city: string;
    state: string;
    capacity: number;
  };
  capacity: number;
  status: string;
  ticketsSold: number;
  sellThroughPct: number;
  grossSales: number;
  daysUntilShow: number;
  riskAssessment: {
    riskLevel: "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK";
    riskScore: number;
    reasoning: string;
    recommendations: string[];
  };
  lastUpdated: string | null;
  hasData: boolean;
}

interface TourStats {
  totalShows: number;
  showsWithData: number;
  riskDistribution: {
    HEALTHY: number;
    NEEDS_ATTENTION: number;
    AT_RISK: number;
  };
  totalCapacity: number;
  totalTicketsSold: number;
  totalGrossSales: number;
  averageSellThrough: number;
  totalSellThroughPct?: number;
}

export function TourPacingDashboard({ tourId }: TourPacingDashboardProps) {
  const [data, setData] = useState<{
    tour: any;
    shows: ShowData[];
    stats: TourStats;
    urgentShows: ShowData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    risk: "",
    sort: "date",
    order: "asc",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.risk) params.append("risk", filters.risk);
      params.append("sort", filters.sort);
      params.append("order", filters.order);

      const response = await fetch(
        `/api/tours/${tourId}/pacing-dashboard?${params}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pacing data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tourId, filters]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Data</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { tour, shows, stats, urgentShows } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {tour.name} - Pacing Report
        </h1>
        <p className="text-gray-600">
          {tour.artist.name} • {format(new Date(tour.startDate), "MMM dd")} -{" "}
          {format(new Date(tour.endDate), "MMM dd, yyyy")}
        </p>
      </div>

      {/* Tour Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalShows}
              </div>
              <div className="text-sm text-gray-600">Total Shows</div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.showsWithData} with data
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalSellThroughPct?.toFixed(1) ||
              stats.averageSellThrough.toFixed(1)}
            %
          </div>
          <div className="text-sm text-gray-600">
            {stats.totalSellThroughPct
              ? "Total Sell-through"
              : "Avg Sell-through"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.totalTicketsSold.toLocaleString()} /{" "}
            {stats.totalCapacity.toLocaleString()} tickets
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            ${(stats.totalGrossSales / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-gray-600">Gross Sales</div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              ✓ {stats.riskDistribution.HEALTHY}
            </span>
            <span className="text-yellow-600">
              ⚠ {stats.riskDistribution.NEEDS_ATTENTION}
            </span>
            <span className="text-red-600">
              ! {stats.riskDistribution.AT_RISK}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Risk Distribution</div>
        </div>
      </div>

      {/* Urgent Shows Alert */}
      {urgentShows.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">
            🚨 {urgentShows.length} Show(s) Need Immediate Attention
          </h3>
          <div className="space-y-2">
            {urgentShows.map((show) => (
              <div
                key={show.id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-red-700">
                  {show.venue.name} • {format(new Date(show.date), "MMM dd")}
                </span>
                <span className="text-red-600 font-medium">
                  {show.sellThroughPct.toFixed(1)}% • {show.daysUntilShow} days
                  left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Filter by Risk:
          </label>
          <select
            value={filters.risk}
            onChange={(e) => updateFilters({ risk: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="">All Shows</option>
            <option value="HEALTHY">Healthy</option>
            <option value="NEEDS_ATTENTION">Needs Attention</option>
            <option value="AT_RISK">At Risk</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="date">Date</option>
            <option value="risk">Risk Level</option>
            <option value="sellthrough">Sell-through %</option>
            <option value="venue">Venue</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Order:
          </label>
          <select
            value={filters.order}
            onChange={(e) => updateFilters({ order: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Shows Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Show Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Assessment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pacing Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shows.map((show) => (
                <tr key={show.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {show.venue.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(show.date), "MMM dd, yyyy")} •{" "}
                        {show.venue.city}, {show.venue.state}
                      </div>
                      <div className="text-xs text-gray-500">
                        Capacity: {show.capacity.toLocaleString()}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {show.hasData ? (
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {show.sellThroughPct.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {show.ticketsSold.toLocaleString()} sold
                        </div>
                        <div className="text-xs text-gray-500">
                          ${show.grossSales.toLocaleString()} gross
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        No data available
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {show.hasData ? (
                      <div className="space-y-2">
                        <RiskBadge riskLevel={show.riskAssessment.riskLevel} />
                        <RiskScoreBar score={show.riskAssessment.riskScore} />
                        <div className="text-xs text-gray-600">
                          {show.daysUntilShow} days remaining
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {show.hasData ? (
                      <div>
                        {/* This would contain the mini pacing chart */}
                        <div className="text-xs text-gray-500">
                          Last updated:{" "}
                          {show.lastUpdated
                            ? format(new Date(show.lastUpdated), "MMM dd")
                            : "Never"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      {show.riskAssessment.recommendations
                        .slice(0, 2)
                        .map((rec, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                          >
                            {rec}
                          </div>
                        ))}
                      {show.riskAssessment.recommendations.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{show.riskAssessment.recommendations.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {shows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {filters.risk
              ? `No shows matching "${filters.risk}" risk level.`
              : "No shows found."}
          </div>
          {filters.risk && (
            <button
              onClick={() => updateFilters({ risk: "" })}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
