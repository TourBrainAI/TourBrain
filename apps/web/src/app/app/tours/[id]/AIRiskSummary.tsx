"use client";

import { useState } from "react";

interface AIRiskSummaryProps {
  tourId: string;
}

export function AIRiskSummary({ tourId }: AIRiskSummaryProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  async function generateRiskSummary() {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours/${tourId}/ai-risk-summary`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        setIsExpanded(true);
      } else {
        throw new Error("Failed to generate risk summary");
      }
    } catch (error) {
      console.error("Error generating AI risk summary:", error);
      alert("Failed to generate risk summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isExpanded && !summary) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              AI Risk Analysis
            </h2>
            <button
              onClick={generateRiskSummary}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Generate Analysis"}
            </button>
          </div>
        </div>
        <div className="p-6 text-center text-gray-500">
          <p>
            Click "Generate Analysis" to get AI-powered insights on tour risk
            factors and opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            AI Risk Analysis
          </h2>
          <div className="flex gap-2">
            <button
              onClick={generateRiskSummary}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Updating..." : "Refresh"}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && summary && (
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="whitespace-pre-line text-sm text-purple-900">
                {summary}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                alert("Risk summary copied to clipboard!");
              }}
              className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
