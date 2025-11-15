/**
 * Day Sheet PDF Export
 *
 * Generates professional PDF day sheets using Puppeteer
 * Converts the existing HTML day sheet to PDF format
 */

// Note: This is a simplified implementation
// In production, you would want to use Puppeteer or a similar library
// For now, this returns a placeholder that would work with the API structure

export async function generateDaySheetPDF(show: any): Promise<Buffer> {
  // This is a placeholder implementation
  // In a real implementation, you would:
  // 1. Use Puppeteer to render the day sheet HTML
  // 2. Generate a proper PDF
  // 3. Return the PDF buffer

  const htmlContent = generateDaySheetHTML(show);

  // For now, return the HTML as a text buffer
  // In production, replace this with actual PDF generation
  return Buffer.from(htmlContent, "utf-8");
}

function generateDaySheetHTML(show: any): string {
  const showDate = new Date(show.date);
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Day Sheet - ${show.tour.artist.name}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      font-size: 12px;
      line-height: 1.4;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .subtitle {
      font-size: 18px;
      color: #666;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      background: #f0f0f0;
      padding: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #333;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .info-item {
      margin-bottom: 8px;
    }
    .label {
      font-weight: bold;
      display: inline-block;
      width: 120px;
    }
    .notes-section {
      border: 1px solid #ccc;
      padding: 15px;
      min-height: 100px;
    }
    @media print {
      body { margin: 0; }
      .page-break { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${show.tour.artist.name}</div>
    <div class="subtitle">${show.venue.name} • ${show.venue.city}, ${
    show.venue.state
  }</div>
    <div class="subtitle">${showDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</div>
  </div>

  <div class="section">
    <div class="section-title">Show Information</div>
    <div class="info-grid">
      <div>
        <div class="info-item">
          <span class="label">Date:</span>
          ${showDate.toLocaleDateString()}
        </div>
        <div class="info-item">
          <span class="label">Doors:</span>
          ${formatTime(show.doors)}
        </div>
        <div class="info-item">
          <span class="label">Show Time:</span>
          ${formatTime(show.showtime)}
        </div>
        <div class="info-item">
          <span class="label">Curfew:</span>
          ${formatTime(show.curfew)}
        </div>
      </div>
      <div>
        <div class="info-item">
          <span class="label">Capacity:</span>
          ${show.capacity || show.venue.capacity || "TBD"}
        </div>
        <div class="info-item">
          <span class="label">Status:</span>
          ${show.status}
        </div>
        ${
          show.guarantee
            ? `
        <div class="info-item">
          <span class="label">Guarantee:</span>
          $${show.guarantee.toLocaleString()}
        </div>
        `
            : ""
        }
        ${
          show.splitPercent
            ? `
        <div class="info-item">
          <span class="label">Split:</span>
          ${show.splitPercent}%
        </div>
        `
            : ""
        }
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Venue Information</div>
    <div class="info-grid">
      <div>
        <div class="info-item">
          <span class="label">Venue:</span>
          ${show.venue.name}
        </div>
        <div class="info-item">
          <span class="label">Address:</span>
          ${show.venue.address}
        </div>
        <div class="info-item">
          <span class="label">City:</span>
          ${show.venue.city}, ${show.venue.state}
        </div>
        ${
          show.venue.website
            ? `
        <div class="info-item">
          <span class="label">Website:</span>
          ${show.venue.website}
        </div>
        `
            : ""
        }
      </div>
      <div>
        ${
          show.venue.contactName
            ? `
        <div class="info-item">
          <span class="label">Contact:</span>
          ${show.venue.contactName}
        </div>
        `
            : ""
        }
        ${
          show.venue.contactEmail
            ? `
        <div class="info-item">
          <span class="label">Email:</span>
          ${show.venue.contactEmail}
        </div>
        `
            : ""
        }
        ${
          show.venue.contactPhone
            ? `
        <div class="info-item">
          <span class="label">Phone:</span>
          ${show.venue.contactPhone}
        </div>
        `
            : ""
        }
        ${
          show.loadInTime
            ? `
        <div class="info-item">
          <span class="label">Load In:</span>
          ${formatTime(show.loadInTime)}
        </div>
        `
            : ""
        }
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Production Notes</div>
    <div class="notes-section">
      ${show.publicNotes || "No notes available"}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Additional Notes</div>
    <div class="notes-section">
      <!-- Space for handwritten notes -->
    </div>
  </div>

  <div style="margin-top: 40px; text-align: center; color: #666; font-size: 10px;">
    Generated by TourBrain on ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
  `;
}
