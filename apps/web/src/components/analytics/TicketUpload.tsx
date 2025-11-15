"use client";

import React, { useState, useRef } from "react";
import { format } from "date-fns";

interface TicketUploadProps {
  showId: string;
  onUploadComplete: () => void;
  className?: string;
}

interface ParsedRow {
  date: string;
  tier?: string;
  sold: number;
  available: number;
  gross: number;
}

interface UploadResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export function TicketUpload({
  showId,
  onUploadComplete,
  className = "",
}: TicketUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualData, setManualData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    ticketsSold: "",
    ticketsAvailable: "",
    grossSales: "",
    notes: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (csvText: string): ParsedRow[] => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0]
      .toLowerCase()
      .split(",")
      .map((h) => h.trim());

    // Find column indices
    const dateIdx = headers.findIndex((h) => h.includes("date"));
    const soldIdx = headers.findIndex((h) => h.includes("sold"));
    const availableIdx = headers.findIndex(
      (h) => h.includes("available") || h.includes("remaining")
    );
    const grossIdx = headers.findIndex(
      (h) => h.includes("gross") || h.includes("revenue") || h.includes("sales")
    );
    const tierIdx = headers.findIndex(
      (h) => h.includes("tier") || h.includes("type") || h.includes("category")
    );

    if (
      dateIdx === -1 ||
      soldIdx === -1 ||
      availableIdx === -1 ||
      grossIdx === -1
    ) {
      throw new Error(
        "CSV must contain columns for date, sold, available, and gross sales"
      );
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim());

      try {
        return {
          date: values[dateIdx],
          tier: tierIdx >= 0 ? values[tierIdx] : undefined,
          sold: parseInt(values[soldIdx]) || 0,
          available: parseInt(values[availableIdx]) || 0,
          gross: parseFloat(values[grossIdx]) || 0,
        };
      } catch (error) {
        throw new Error(
          `Error parsing row ${index + 2}: ${
            error instanceof Error ? error.message : "Invalid data"
          }`
        );
      }
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const csvText = await file.text();
      const parsedData = parseCSV(csvText);

      const response = await fetch(`/api/shows/${showId}/ticket-snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvData: parsedData,
          source: "CSV_UPLOAD",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      setResult(result);

      if (result.success && result.imported > 0) {
        onUploadComplete();
      }
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/shows/${showId}/add-snapshot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          capturedAt: manualData.date,
          ticketsSold: parseInt(manualData.ticketsSold),
          ticketsAvailable: parseInt(manualData.ticketsAvailable),
          grossSales: parseFloat(manualData.grossSales),
          notes: manualData.notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add snapshot");
      }

      setResult({
        success: true,
        imported: 1,
        errors: [],
      });

      // Reset form
      setManualData({
        date: format(new Date(), "yyyy-MM-dd"),
        ticketsSold: "",
        ticketsAvailable: "",
        grossSales: "",
        notes: "",
      });

      onUploadComplete();
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`bg-white border rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Upload Ticket Data
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowManualEntry(false)}
            className={`px-3 py-1 text-sm rounded ${
              !showManualEntry
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            CSV Upload
          </button>
          <button
            onClick={() => setShowManualEntry(true)}
            className={`px-3 py-1 text-sm rounded ${
              showManualEntry
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {!showManualEntry ? (
        // CSV Upload Section
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="space-y-2">
                <div className="text-gray-600">
                  <span className="font-medium">Click to upload</span> or drag
                  and drop
                </div>
                <div className="text-sm text-gray-500">
                  CSV file with columns: date, sold, available, gross
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm"
                >
                  {uploading ? "Processing..." : "Choose File"}
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <strong>CSV Format Requirements:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Headers must include: date, sold, available, gross</li>
              <li>• Optional: tier (for tier-specific data)</li>
              <li>• Date format: YYYY-MM-DD or MM/DD/YYYY</li>
              <li>
                • Numbers should be integers (sold, available) or decimals
                (gross)
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // Manual Entry Section
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Snapshot Date
              </label>
              <input
                type="date"
                value={manualData.date}
                onChange={(e) =>
                  setManualData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tickets Sold
              </label>
              <input
                type="number"
                min="0"
                value={manualData.ticketsSold}
                onChange={(e) =>
                  setManualData((prev) => ({
                    ...prev,
                    ticketsSold: e.target.value,
                  }))
                }
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="2500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tickets Available
              </label>
              <input
                type="number"
                min="0"
                value={manualData.ticketsAvailable}
                onChange={(e) =>
                  setManualData((prev) => ({
                    ...prev,
                    ticketsAvailable: e.target.value,
                  }))
                }
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gross Sales ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={manualData.grossSales}
                onChange={(e) =>
                  setManualData((prev) => ({
                    ...prev,
                    grossSales: e.target.value,
                  }))
                }
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="125000.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={manualData.notes}
              onChange={(e) =>
                setManualData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={2}
              placeholder="Any additional context about this snapshot..."
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded"
          >
            {uploading ? "Adding Snapshot..." : "Add Ticket Snapshot"}
          </button>
        </form>
      )}

      {/* Upload Result */}
      {result && (
        <div
          className={`mt-4 p-4 rounded ${
            result.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {result.success ? (
            <div>
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <span>✅</span>
                Success! {result.imported} snapshot(s) imported.
              </div>
              {result.errors.length > 0 && (
                <div className="mt-2">
                  <div className="text-yellow-800 font-medium text-sm">
                    Warnings:
                  </div>
                  <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-red-800 font-medium">
                <span>❌</span>
                Upload Failed
              </div>
              {result.errors.length > 0 && (
                <ul className="text-red-700 text-sm mt-2 space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
