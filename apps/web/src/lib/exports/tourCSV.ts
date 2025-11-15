/**
 * Tour CSV Export
 *
 * Generates CSV files with comprehensive tour data
 * Includes show details, venue information, and financial data
 */

/**
 * Generate CSV export for a tour
 */
export function generateTourCSV(tour: any): string {
  const headers = [
    "Show Date",
    "Venue Name",
    "City",
    "State",
    "Country",
    "Venue Address",
    "Venue Capacity",
    "Show Status",
    "Doors Time",
    "Show Time",
    "Curfew",
    "Load In Time",
    "Guarantee",
    "Split Percent",
    "Ticket Price",
    "Currency",
    "Gross Sales",
    "Expenses",
    "Net Revenue",
    "Settled",
    "Public Notes",
    "Venue Contact Name",
    "Venue Contact Email",
    "Venue Contact Phone",
    "Weather Score",
    "Created At",
    "Updated At",
  ];

  const rows = tour.shows.map((show: any) => {
    return [
      formatDate(show.date),
      escapeCsvValue(show.venue.name),
      escapeCsvValue(show.venue.city),
      escapeCsvValue(show.venue.state),
      escapeCsvValue(show.venue.country),
      escapeCsvValue(show.venue.address),
      show.venue.capacity || "",
      show.status,
      formatTime(show.doors),
      formatTime(show.showtime),
      formatTime(show.curfew),
      formatTime(show.loadInTime),
      show.guarantee || "",
      show.splitPercent || "",
      show.ticketPrice || "",
      show.currency || "USD",
      show.grossSales || "",
      show.expenses || "",
      show.netRevenue || "",
      show.settled ? "Yes" : "No",
      escapeCsvValue(show.publicNotes),
      escapeCsvValue(show.venue.contactName),
      escapeCsvValue(show.venue.contactEmail),
      escapeCsvValue(show.venue.contactPhone),
      show.weatherScore || "",
      formatDateTime(show.createdAt),
      formatDateTime(show.updatedAt),
    ];
  });

  // Combine headers and rows
  const csvLines = [headers, ...rows];

  // Convert to CSV format
  return csvLines.map((row) => row.join(",")).join("\n");
}

/**
 * Escape CSV values that contain commas, quotes, or newlines
 */
function escapeCsvValue(value: any): string {
  if (value == null) return "";

  const stringValue = String(value);

  // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }

  return stringValue;
}

/**
 * Format date for CSV
 */
function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US");
}

/**
 * Format time for CSV
 */
function formatTime(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format full datetime for CSV
 */
function formatDateTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString(
    "en-US"
  )}`;
}
