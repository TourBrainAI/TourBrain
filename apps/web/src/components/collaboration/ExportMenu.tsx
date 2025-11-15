"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Calendar,
  Table,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ExportMenuProps {
  showId?: string;
  tourId?: string;
  type: "show" | "tour";
  title: string;
}

export function ExportMenu({ showId, tourId, type, title }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setError(null);
    setSuccess(null);
    setLoading(format);

    try {
      const baseUrl =
        type === "show"
          ? `/api/shows/${showId}/export`
          : `/api/tours/${tourId}/export`;

      const response = await fetch(`${baseUrl}?format=${format}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Export failed");
      }

      // Get the filename from response headers or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `${title}-${format}.${getFileExtension(format)}`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(`${format.toUpperCase()} exported successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setLoading(null);
    }
  };

  const getFileExtension = (format: string): string => {
    switch (format) {
      case "pdf":
        return "pdf";
      case "csv":
        return "csv";
      case "ical":
        return "ics";
      default:
        return "txt";
    }
  };

  const exportOptions =
    type === "show"
      ? [
          {
            format: "pdf",
            icon: <FileText className="w-4 h-4" />,
            label: "Day Sheet PDF",
            description: "Professional day sheet for printing",
          },
          {
            format: "ical",
            icon: <Calendar className="w-4 h-4" />,
            label: "Calendar Event",
            description: "Add to Google Calendar, Outlook, etc.",
          },
        ]
      : [
          {
            format: "csv",
            icon: <Table className="w-4 h-4" />,
            label: "Tour Data CSV",
            description: "Spreadsheet with all show details",
          },
          {
            format: "ical",
            icon: <Calendar className="w-4 h-4" />,
            label: "Tour Calendar",
            description: "Full tour schedule for calendar apps",
          },
        ];

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg border min-w-[300px] z-10">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export {type === "show" ? "Show" : "Tour"}
            </h3>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="p-1 h-auto"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={loading === option.format}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
            >
              {loading === option.format ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                option.icon
              )}

              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">
                  {option.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Exports are logged for audit purposes
          </p>
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
    </div>
  );
}
