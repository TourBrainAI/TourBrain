"use client";

import { useState } from "react";

interface AINotesButtonProps {
  showId: string;
}

export function AINotesButton({ showId }: AINotesButtonProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

  async function generateNotes() {
    setLoading(true);
    try {
      const response = await fetch(`/api/shows/${showId}/ai-day-sheet`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      } else {
        throw new Error("Failed to generate notes");
      }
    } catch (error) {
      console.error("Error generating AI notes:", error);
      alert("Failed to generate AI notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={generateNotes}
        disabled={loading}
        className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate AI Notes"}
      </button>

      {notes && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">
            AI Generated Notes
          </h4>
          <div className="text-sm text-blue-800 whitespace-pre-wrap">
            {notes}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(notes);
              alert("Notes copied to clipboard!");
            }}
            className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </>
  );
}
