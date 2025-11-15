"use client";

import React from "react";
import { ShowRiskAssessment } from "@/lib/analytics/ticketingAnalytics";

interface RiskAssessmentProps {
  assessment: ShowRiskAssessment;
  className?: string;
}

export function RiskAssessmentCard({
  assessment,
  className = "",
}: RiskAssessmentProps) {
  const {
    riskLevel,
    sellThroughPct,
    daysUntilShow,
    ticketsSold,
    capacity,
    recommendations,
    reasoning,
  } = assessment;

  const getRiskColor = () => {
    switch (riskLevel) {
      case "HEALTHY":
        return "green";
      case "NEEDS_ATTENTION":
        return "yellow";
      case "AT_RISK":
        return "red";
      default:
        return "gray";
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case "HEALTHY":
        return "✅";
      case "NEEDS_ATTENTION":
        return "⚠️";
      case "AT_RISK":
        return "🚨";
      default:
        return "📊";
    }
  };

  const color = getRiskColor();

  return (
    <div className={`bg-white border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getRiskIcon()}</span>
          <div>
            <h3 className={`text-lg font-semibold text-${color}-800`}>
              {riskLevel.replace("_", " ")}
            </h3>
            <p className="text-gray-600 text-sm">{reasoning}</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}
        >
          Risk Score: {Math.round(assessment.riskScore)}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {sellThroughPct.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Sold</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {daysUntilShow}
          </div>
          <div className="text-sm text-gray-600">Days Left</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {ticketsSold.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Tickets Sold</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {capacity.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Capacity</div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Recommended Actions:
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-3 rounded-md bg-${color}-50 border border-${color}-200`}
              >
                <span className={`text-${color}-600`}>•</span>
                <span className={`text-${color}-800 text-sm`}>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact risk indicator for lists/tables
export function RiskBadge({
  riskLevel,
  className = "",
}: {
  riskLevel: ShowRiskAssessment["riskLevel"];
  className?: string;
}) {
  const getColorClasses = () => {
    switch (riskLevel) {
      case "HEALTHY":
        return "bg-green-100 text-green-800 border-green-200";
      case "NEEDS_ATTENTION":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "AT_RISK":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (riskLevel) {
      case "HEALTHY":
        return "✓";
      case "NEEDS_ATTENTION":
        return "⚠";
      case "AT_RISK":
        return "!";
      default:
        return "?";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses()} ${className}`}
    >
      <span>{getIcon()}</span>
      {riskLevel.replace("_", " ")}
    </span>
  );
}

// Risk score progress bar
export function RiskScoreBar({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const getBarColor = () => {
    if (score <= 30) return "bg-green-500";
    if (score <= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (score <= 30) return "text-green-700";
    if (score <= 60) return "text-yellow-700";
    return "text-red-700";
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Risk Score</span>
        <span className={`text-sm font-bold ${getTextColor()}`}>
          {Math.round(score)}/100
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${Math.min(100, score)}%` }}
        ></div>
      </div>
    </div>
  );
}
