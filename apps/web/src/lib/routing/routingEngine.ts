/**
 * Basic Routing Engine for TourBrain
 *
 * This is a rule-based routing algorithm that generates tour routes based on:
 * - Geographic proximity (distance-based optimization)
 * - Date constraints and off-days
 * - Drive time limitations
 * - Venue capacity requirements
 * - Weather scores (when available)
 *
 * Future enhancements will include:
 * - Real-time drive time APIs (Google Maps, etc.)
 * - Machine learning for demand prediction
 * - Historical performance data integration
 * - Market analysis and pricing optimization
 */

interface Venue {
  id: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  isOutdoor: boolean;
  climateProfiles?: VenueClimateProfile[];
}

interface VenueClimateProfile {
  month: number;
  avgHighTempC: number;
  avgLowTempC: number;
  avgPrecipDays: number;
  hotDaysPct: number;
  coldDaysPct: number;
}

interface RoutingConstraints {
  startDate: string;
  endDate: string;
  regions?: string[];
  states?: string[];
  maxDriveHours: number;
  maxConsecutiveDays: number;
  requiredVenues?: string[];
  offDays?: string[];
  capacityRange?: {
    min?: number;
    max?: number;
  };
}

interface ScenarioStop {
  venueId: string;
  date: Date;
  driveTime?: number;
  notes?: string;
  weatherScore?: number;
}

interface RoutingParams {
  venues: Venue[];
  constraints: RoutingConstraints;
  tourId: string;
}

/**
 * Calculate approximate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate drive time based on distance
 * Assumes average speed of 80 km/h for highway driving
 */
function estimateDriveTime(distanceKm: number): number {
  const avgSpeedKmh = 80;
  const hours = distanceKm / avgSpeedKmh;
  return Math.round(hours * 60); // Return minutes
}

/**
 * Calculate weather score for a venue on a specific date
 * Uses climate profile data to estimate weather conditions
 */
function calculateWeatherScore(venue: Venue, date: Date): number {
  if (!venue.climateProfiles || venue.climateProfiles.length === 0) {
    return 75; // Default neutral score
  }

  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const profile = venue.climateProfiles.find((p) => p.month === month);

  if (!profile) {
    return 75; // Default if no data for the month
  }

  let score = 100;

  // Outdoor venues are more weather sensitive
  if (venue.isOutdoor) {
    // Temperature penalties
    if (profile.avgHighTempC > 30) score -= 15; // Very hot
    if (profile.avgHighTempC < 5) score -= 20; // Very cold

    // Precipitation penalties
    if (profile.avgPrecipDays > 15) score -= 10; // High rain days

    // Extreme weather penalties
    score -= profile.hotDaysPct * 0.3; // Hot days impact
    score -= profile.coldDaysPct * 0.4; // Cold days impact
  } else {
    // Indoor venues have less weather impact
    if (profile.avgHighTempC > 35) score -= 5; // Extreme heat affects attendance
    if (profile.avgHighTempC < 0) score -= 5; // Extreme cold affects attendance
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Generate possible show dates between start and end dates
 * Respects off-days and maximum consecutive show constraints
 */
function generatePossibleDates(
  startDate: Date,
  endDate: Date,
  offDays: string[],
  maxConsecutiveDays: number
): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  let consecutiveDays = 0;

  // Convert off-days to day numbers (0 = Sunday, 6 = Saturday)
  const offDayNumbers = offDays.map((day) => {
    const dayMap: { [key: string]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return dayMap[day.toLowerCase()];
  });

  while (current <= endDate) {
    const dayOfWeek = current.getDay();

    if (!offDayNumbers.includes(dayOfWeek)) {
      if (consecutiveDays < maxConsecutiveDays) {
        dates.push(new Date(current));
        consecutiveDays++;
      } else {
        consecutiveDays = 0; // Reset counter after hitting limit
      }
    } else {
      consecutiveDays = 0; // Reset counter on off-days
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Score a venue for a specific date based on multiple factors
 */
function scoreVenue(
  venue: Venue,
  date: Date,
  constraints: RoutingConstraints,
  previousVenue?: Venue
): number {
  let score = 50; // Base score

  // Weather scoring (higher is better)
  const weatherScore = calculateWeatherScore(venue, date);
  score += weatherScore * 0.3; // 30% weight to weather

  // Capacity scoring - prefer venues within capacity range
  if (constraints.capacityRange && venue.capacity) {
    const { min = 0, max = Infinity } = constraints.capacityRange;
    if (venue.capacity >= min && venue.capacity <= max) {
      score += 20; // Bonus for capacity match
    }
  }

  // Geographic clustering - prefer venues close to previous venue
  if (
    previousVenue &&
    venue.latitude &&
    venue.longitude &&
    previousVenue.latitude &&
    previousVenue.longitude
  ) {
    const distance = calculateDistance(
      previousVenue.latitude,
      previousVenue.longitude,
      venue.latitude,
      venue.longitude
    );

    // Prefer closer venues (distance penalty)
    if (distance < 200) score += 15; // Very close
    else if (distance < 500) score += 10; // Moderately close
    else if (distance > 1000) score -= 10; // Far away
  }

  // Required venues get highest priority
  if (constraints.requiredVenues?.includes(venue.id)) {
    score += 50;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Main routing algorithm that generates an optimized tour route
 */
export async function generateRoutingScenario({
  venues,
  constraints,
  tourId,
}: RoutingParams): Promise<ScenarioStop[]> {
  const startDate = new Date(constraints.startDate);
  const endDate = new Date(constraints.endDate);
  const offDays = constraints.offDays || ["sunday"]; // Default to Sunday off

  // Generate possible show dates
  const possibleDates = generatePossibleDates(
    startDate,
    endDate,
    offDays,
    constraints.maxConsecutiveDays
  );

  if (possibleDates.length === 0) {
    throw new Error("No valid dates available with the given constraints");
  }

  // Filter venues by state if specified
  let availableVenues = venues;
  if (constraints.states && constraints.states.length > 0) {
    availableVenues = venues.filter(
      (v) => v.state && constraints.states!.includes(v.state)
    );
  }

  if (availableVenues.length === 0) {
    throw new Error("No venues available in specified regions");
  }

  const stops: ScenarioStop[] = [];
  const usedVenues = new Set<string>();
  let previousVenue: Venue | undefined;

  // Sort dates chronologically
  possibleDates.sort((a, b) => a.getTime() - b.getTime());

  // For each date, find the best available venue
  for (
    let i = 0;
    i < Math.min(possibleDates.length, availableVenues.length);
    i++
  ) {
    const date = possibleDates[i];

    // Score all unused venues for this date
    const venueScores = availableVenues
      .filter((venue) => !usedVenues.has(venue.id))
      .map((venue) => ({
        venue,
        score: scoreVenue(venue, date, constraints, previousVenue),
      }))
      .sort((a, b) => b.score - a.score);

    if (venueScores.length === 0) {
      break; // No more venues available
    }

    const bestVenue = venueScores[0].venue;
    usedVenues.add(bestVenue.id);

    // Calculate drive time from previous venue
    let driveTime: number | undefined;
    if (
      previousVenue &&
      bestVenue.latitude &&
      bestVenue.longitude &&
      previousVenue.latitude &&
      previousVenue.longitude
    ) {
      const distance = calculateDistance(
        previousVenue.latitude,
        previousVenue.longitude,
        bestVenue.latitude,
        bestVenue.longitude
      );
      driveTime = estimateDriveTime(distance);

      // Check drive time constraint
      if (driveTime > constraints.maxDriveHours * 60) {
        // Find next best venue within drive time limit
        const alternativeVenue = venueScores.find((vs) => {
          if (
            !vs.venue.latitude ||
            !vs.venue.longitude ||
            !previousVenue!.latitude ||
            !previousVenue!.longitude
          ) {
            return false;
          }

          const dist = calculateDistance(
            previousVenue!.latitude!,
            previousVenue!.longitude!,
            vs.venue.latitude,
            vs.venue.longitude
          );
          const time = estimateDriveTime(dist);
          return time <= constraints.maxDriveHours * 60;
        });

        if (alternativeVenue) {
          usedVenues.delete(bestVenue.id); // Release the first choice
          usedVenues.add(alternativeVenue.venue.id);

          const distance = calculateDistance(
            previousVenue.latitude!,
            previousVenue.longitude!,
            alternativeVenue.venue.latitude!,
            alternativeVenue.venue.longitude!
          );
          driveTime = estimateDriveTime(distance);

          stops.push({
            venueId: alternativeVenue.venue.id,
            date,
            driveTime,
            weatherScore: calculateWeatherScore(alternativeVenue.venue, date),
          });

          previousVenue = alternativeVenue.venue;
          continue;
        }
      }
    }

    stops.push({
      venueId: bestVenue.id,
      date,
      driveTime,
      weatherScore: calculateWeatherScore(bestVenue, date),
    });

    previousVenue = bestVenue;
  }

  // Add route optimization notes
  stops.forEach((stop, index) => {
    const notes: string[] = [];

    if (stop.driveTime && stop.driveTime > 240) {
      // 4+ hours
      notes.push(`Long drive: ${Math.round(stop.driveTime / 60)} hours`);
    }

    if (stop.weatherScore && stop.weatherScore < 60) {
      notes.push(`Weather risk: ${stop.weatherScore}/100`);
    }

    if (index === 0) {
      notes.push("Tour opener");
    } else if (index === stops.length - 1) {
      notes.push("Tour closer");
    }

    if (notes.length > 0) {
      stop.notes = notes.join("; ");
    }
  });

  return stops;
}
