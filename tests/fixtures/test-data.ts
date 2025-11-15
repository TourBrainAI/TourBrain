import {
  Organization,
  User,
  Venue,
  Tour,
  Show,
  WaitlistEntry,
} from "@prisma/client";

// Test Organizations
export const testOrganizations = {
  redRocks: {
    id: "org-red-rocks",
    name: "Red Rocks Amphitheatre",
    slug: "red-rocks-amphitheatre",
    type: "VENUE" as const,
    description: "Premier outdoor amphitheatre in Colorado",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  aegPresents: {
    id: "org-aeg-presents",
    name: "AEG Presents",
    slug: "aeg-presents",
    type: "PROMOTER" as const,
    description: "Leading live entertainment company",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  paradigmAgency: {
    id: "org-paradigm",
    name: "Paradigm Talent Agency",
    slug: "paradigm-talent-agency",
    type: "AGENCY" as const,
    description: "Full-service talent agency",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
} as const;

// Test Users
export const testUsers = {
  sarahJohnson: {
    id: "user-sarah-johnson",
    email: "sarah@redrocksdenver.com",
    name: "Sarah Johnson",
    organizationId: "org-red-rocks",
    role: "ADMIN" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  mikeRodriguez: {
    id: "user-mike-rodriguez",
    email: "mike@aegpresents.com",
    name: "Mike Rodriguez",
    organizationId: "org-aeg-presents",
    role: "PROMOTER" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  jamieSmith: {
    id: "user-jamie-smith",
    email: "jamie@paradigmagency.com",
    name: "Jamie Smith",
    organizationId: "org-paradigm",
    role: "AGENT" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
} as const;

// Test Venues
export const testVenues = {
  redRocks: {
    id: "venue-red-rocks",
    name: "Red Rocks Amphitheatre",
    address: "18300 W Alameda Pkwy",
    city: "Morrison",
    state: "CO",
    country: "US",
    postalCode: "80465",
    capacity: 9525,
    contactName: "Venue Operations",
    contactEmail: "ops@redrocks.com",
    contactPhone: "303-697-4939",
    website: "https://www.redrocks.com",
    loadInTime: "14:00",
    soundcheckTime: "17:00",
    curfew: "23:00",
    notes: "Outdoor venue, weather dependent",
    organizationId: "org-red-rocks",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  fillmore: {
    id: "venue-fillmore",
    name: "The Fillmore",
    address: "1805 Geary Blvd",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postalCode: "94115",
    capacity: 1315,
    contactName: "Production Manager",
    contactEmail: "production@fillmore.com",
    contactPhone: "415-346-3000",
    website: "https://www.fillmore.com",
    loadInTime: "12:00",
    soundcheckTime: "16:00",
    curfew: "02:00",
    notes: "Historic venue with strict noise ordinances",
    organizationId: "org-aeg-presents",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
} as const;

// Test Tours
export const testTours = {
  midniteSummer: {
    id: "tour-midnite-summer",
    name: "Midnite Summer Tour 2025",
    artist: "Midnite",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-08-20"),
    status: "PLANNING" as const,
    description: "Summer tour across major festivals and venues",
    organizationId: "org-paradigm",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  acousticSeries: {
    id: "tour-acoustic-series",
    name: "Acoustic Evening Series",
    artist: "Various Artists",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-11-30"),
    status: "ANNOUNCED" as const,
    description: "Intimate acoustic performances",
    organizationId: "org-red-rocks",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
} as const;

// Test Shows
export const testShows = {
  redRocksShow: {
    id: "show-red-rocks-midnite",
    date: new Date("2025-07-22"),
    doorsTime: "18:30",
    showTime: "20:00",
    capacity: 9525,
    status: "SCHEDULED" as const,
    tourId: "tour-midnite-summer",
    venueId: "venue-red-rocks",
    organizationId: "org-paradigm",
    // Deal information
    dealType: "GUARANTEE_VS_PERCENTAGE" as const,
    guarantee: 15000,
    dealPercentage: 85,
    estimatedGross: 50000,
    expenses: 8500,
    // Logistics
    loadInTime: "14:00",
    soundcheckTime: "17:00",
    curfew: "23:00",
    notes: "Bring extra cables for outdoor setup",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  fillmoreShow: {
    id: "show-fillmore-acoustic",
    date: new Date("2025-09-15"),
    doorsTime: "19:00",
    showTime: "20:30",
    capacity: 1315,
    status: "ON_SALE" as const,
    tourId: "tour-acoustic-series",
    venueId: "venue-fillmore",
    organizationId: "org-red-rocks",
    // Deal information
    dealType: "FLAT_FEE" as const,
    guarantee: 25000,
    dealPercentage: null,
    estimatedGross: 35000,
    expenses: 5000,
    // Logistics
    loadInTime: "12:00",
    soundcheckTime: "16:00",
    curfew: "02:00",
    notes: "Acoustic setup, minimal production",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
} as const;

// Test Waitlist Entries
export const testWaitlistEntries = {
  venueBooker: {
    id: "waitlist-venue-booker",
    name: "Alice Cooper",
    email: "alice@coopertheater.com",
    role: "VENUE_BOOKER",
    company: "Cooper Theater",
    notes: "Interested in 500-1500 capacity venues",
    status: "NEW" as const,
    priority: "MEDIUM" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  promoter: {
    id: "waitlist-promoter",
    name: "Bob Martin",
    email: "bob@martinpromotions.com",
    role: "PROMOTER",
    company: "Martin Promotions",
    notes: "Regional promoter covering Pacific Northwest",
    status: "QUALIFIED" as const,
    priority: "HIGH" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  agent: {
    id: "waitlist-agent",
    name: "Carol Davis",
    email: "carol@davisagency.com",
    role: "AGENT",
    company: "Davis Talent Agency",
    notes: "Boutique agency specializing in indie artists",
    status: "CONTACTED" as const,
    priority: "HIGH" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
} as const;

// Test Data Sets for Different Scenarios
export const testDataSets = {
  // Empty organization - for testing onboarding flows
  emptyOrg: {
    organization: testOrganizations.redRocks,
    users: [testUsers.sarahJohnson],
    venues: [],
    tours: [],
    shows: [],
  },

  // Small venue operation - for testing basic CRUD
  smallVenue: {
    organization: testOrganizations.redRocks,
    users: [testUsers.sarahJohnson],
    venues: [testVenues.redRocks],
    tours: [testTours.acousticSeries],
    shows: [testShows.fillmoreShow],
  },

  // Multi-organization setup - for testing collaboration
  multiOrg: {
    organizations: [
      testOrganizations.redRocks,
      testOrganizations.aegPresents,
      testOrganizations.paradigmAgency,
    ],
    users: [
      testUsers.sarahJohnson,
      testUsers.mikeRodriguez,
      testUsers.jamieSmith,
    ],
    venues: [testVenues.redRocks, testVenues.fillmore],
    tours: [testTours.midniteSummer, testTours.acousticSeries],
    shows: [testShows.redRocksShow, testShows.fillmoreShow],
  },

  // Large dataset - for testing performance
  largeTour: {
    organization: testOrganizations.paradigmAgency,
    users: [testUsers.jamieSmith],
    venues: Object.values(testVenues),
    tours: [testTours.midniteSummer],
    // Would generate 20+ shows for performance testing
    shows: [testShows.redRocksShow], // Expand this programmatically
  },
} as const;

// Utility functions for creating test data variations
export const testDataUtils = {
  // Create a venue with custom properties
  createVenue: (overrides: Partial<typeof testVenues.redRocks>) => ({
    ...testVenues.redRocks,
    ...overrides,
    id: `venue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }),

  // Create a tour with custom properties
  createTour: (overrides: Partial<typeof testTours.midniteSummer>) => ({
    ...testTours.midniteSummer,
    ...overrides,
    id: `tour-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }),

  // Create a show with custom properties
  createShow: (overrides: Partial<typeof testShows.redRocksShow>) => ({
    ...testShows.redRocksShow,
    ...overrides,
    id: `show-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }),

  // Create multiple shows for a tour (for performance testing)
  createMultipleShows: (count: number, tourId: string, orgId: string) => {
    const shows = [];
    for (let i = 0; i < count; i++) {
      const date = new Date("2025-06-15");
      date.setDate(date.getDate() + i * 3); // Shows every 3 days

      shows.push({
        ...testShows.redRocksShow,
        id: `show-${tourId}-${i}`,
        date,
        tourId,
        organizationId: orgId,
      });
    }
    return shows;
  },
};

// Export commonly used test data
export default {
  organizations: testOrganizations,
  users: testUsers,
  venues: testVenues,
  tours: testTours,
  shows: testShows,
  waitlistEntries: testWaitlistEntries,
  dataSets: testDataSets,
  utils: testDataUtils,
};
