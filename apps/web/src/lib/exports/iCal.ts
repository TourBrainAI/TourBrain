/**
 * iCalendar Export Utilities
 *
 * Generates iCal (.ics) files for shows and tours
 * Compatible with Google Calendar, Outlook, Apple Calendar, etc.
 */

/**
 * Generate iCal event for a single show
 */
export function generateICalEvent(show: any): string {
  const startDate = new Date(show.showtime || show.date);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 3); // Default 3-hour show duration

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const escapeText = (text: string): string => {
    return text.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  };

  const uid = `show-${show.id}@tourbrain.com`;
  const summary = `${show.tour.artist.name} at ${show.venue.name}`;
  const location = `${show.venue.name}, ${show.venue.address}, ${show.venue.city}, ${show.venue.state}`;

  let description = `Artist: ${show.tour.artist.name}\\n`;
  description += `Venue: ${show.venue.name}\\n`;
  description += `Tour: ${show.tour.name}\\n`;
  if (show.doors) {
    description += `Doors: ${new Date(show.doors).toLocaleTimeString()}\\n`;
  }
  if (show.publicNotes) {
    description += `Notes: ${escapeText(show.publicNotes)}\\n`;
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TourBrain//Show Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
DTSTAMP:${formatDate(new Date())}
SUMMARY:${escapeText(summary)}
DESCRIPTION:${description}
LOCATION:${escapeText(location)}
STATUS:CONFIRMED
CATEGORIES:Concert,Tour
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generate iCal calendar for an entire tour
 */
export function generateTourICalendar(tour: any): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const escapeText = (text: string): string => {
    return text.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  };

  let calendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TourBrain//Tour Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${escapeText(tour.artist.name)} - ${escapeText(tour.name)}
X-WR-CALDESC:${escapeText(tour.artist.name)} tour dates`;

  if (tour.description) {
    calendar += ` - ${escapeText(tour.description)}`;
  }

  calendar += "\n";

  // Add each show as an event
  for (const show of tour.shows) {
    const startDate = new Date(show.showtime || show.date);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 3); // Default 3-hour duration

    const uid = `show-${show.id}@tourbrain.com`;
    const summary = `${tour.artist.name} at ${show.venue.name}`;
    const location = `${show.venue.name}, ${show.venue.address}, ${show.venue.city}, ${show.venue.state}`;

    let description = `Artist: ${tour.artist.name}\\n`;
    description += `Venue: ${show.venue.name}\\n`;
    description += `Tour: ${tour.name}\\n`;
    if (show.doors) {
      description += `Doors: ${new Date(show.doors).toLocaleTimeString()}\\n`;
    }
    if (show.guarantee) {
      description += `Guarantee: $${show.guarantee.toLocaleString()}\\n`;
    }
    if (show.publicNotes) {
      description += `Notes: ${escapeText(show.publicNotes)}\\n`;
    }

    calendar += `BEGIN:VEVENT
UID:${uid}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
DTSTAMP:${formatDate(new Date())}
SUMMARY:${escapeText(summary)}
DESCRIPTION:${description}
LOCATION:${escapeText(location)}
STATUS:CONFIRMED
CATEGORIES:Concert,Tour
END:VEVENT
`;
  }

  calendar += "END:VCALENDAR";

  return calendar;
}
