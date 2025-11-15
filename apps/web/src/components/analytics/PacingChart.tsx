"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { PacingPoint } from "@/lib/analytics/ticketingAnalytics";

interface PacingChartProps {
  data: PacingPoint[];
  capacity: number;
  showDate: Date;
  className?: string;
}

export function PacingChart({
  data,
  capacity,
  showDate,
  className = "",
}: PacingChartProps) {
  // Format data for recharts
  const chartData = data.map((point) => ({
    date: format(point.date, "MMM dd"),
    fullDate: point.date,
    ticketsSold: point.ticketsSold,
    sellThroughPct: point.sellThroughPct,
    daysUntilShow: point.daysUntilShow,
    grossSales: point.grossSales,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Tickets Sold: {data.ticketsSold.toLocaleString()}
          </p>
          <p className="text-green-600">
            Sell-through: {data.sellThroughPct.toFixed(1)}%
          </p>
          <p className="text-gray-600">Days Until Show: {data.daysUntilShow}</p>
          <p className="text-purple-600">
            Gross Sales: ${data.grossSales.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const latestData = chartData[chartData.length - 1];
  const currentSellThrough = latestData?.sellThroughPct || 0;

  // Determine line color based on risk level
  const getLineColor = () => {
    if (currentSellThrough >= 60) return "#10b981"; // Green - Healthy
    if (currentSellThrough >= 30) return "#f59e0b"; // Yellow - Needs Attention
    return "#ef4444"; // Red - At Risk
  };

  return (
    <div className={`bg-white p-6 rounded-lg border ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Ticket Sales Pacing
        </h3>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <span>
            Show Date: <strong>{format(showDate, "MMM dd, yyyy")}</strong>
          </span>
          <span>
            Capacity: <strong>{capacity.toLocaleString()}</strong>
          </span>
          {latestData && (
            <>
              <span>
                Current:{" "}
                <strong>{latestData.ticketsSold.toLocaleString()} sold</strong>
              </span>
              <span
                className={`font-medium ${
                  currentSellThrough >= 60
                    ? "text-green-600"
                    : currentSellThrough >= 30
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {currentSellThrough.toFixed(1)}% sold
              </span>
              <span>{latestData.daysUntilShow} days remaining</span>
            </>
          )}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference line at capacity */}
            <ReferenceLine
              y={capacity}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              label={{ value: "Capacity", position: "insideTopRight" }}
            />

            {/* Main pacing line */}
            <Line
              type="monotone"
              dataKey="ticketsSold"
              stroke={getLineColor()}
              strokeWidth={3}
              dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getLineColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk indicator */}
      <div className="mt-4 flex items-center justify-between">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            currentSellThrough >= 60
              ? "bg-green-100 text-green-800"
              : currentSellThrough >= 30
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {currentSellThrough >= 60
            ? "✓ Healthy"
            : currentSellThrough >= 30
            ? "⚠ Needs Attention"
            : "🚨 At Risk"}
        </div>

        <div className="text-sm text-gray-500">
          Updated{" "}
          {latestData
            ? format(latestData.fullDate, "MMM dd 'at' h:mm a")
            : "Never"}
        </div>
      </div>
    </div>
  );
}

// Simplified pacing chart for dashboard/list views
export function MiniPacingChart({
  data,
  capacity,
  className = "",
}: Omit<PacingChartProps, "showDate">) {
  const chartData = data.map((point) => ({
    ticketsSold: point.ticketsSold,
    sellThroughPct: point.sellThroughPct,
  }));

  const currentSellThrough = data[data.length - 1]?.sellThroughPct || 0;

  const getLineColor = () => {
    if (currentSellThrough >= 60) return "#10b981";
    if (currentSellThrough >= 30) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={`${className}`} style={{ width: "200px", height: "80px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <Line
            type="monotone"
            dataKey="ticketsSold"
            stroke={getLineColor()}
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine y={capacity} stroke="#9ca3af" strokeDasharray="2 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
