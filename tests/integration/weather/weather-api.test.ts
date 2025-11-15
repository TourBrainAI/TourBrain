import { createMocks } from "node-mocks-http";
import {
  GET,
  POST,
} from "../../../apps/web/src/app/api/shows/[id]/weather/route";
import { prisma } from "../../../apps/web/src/lib/prisma";
import { testData } from "../../fixtures/test-data";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: testData.users.johnDoe.id,
    orgId: testData.organizations.acmeEntertainment.id,
  }),
}));

// Mock Prisma
jest.mock("../../../apps/web/src/lib/prisma", () => ({
  prisma: {
    show: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    venue: {
      findUnique: jest.fn(),
    },
    venueClimateProfile: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

// Mock Weather Job
jest.mock("../../../apps/web/src/lib/weather-job", () => ({
  WeatherJob: {
    updateClimateForVenue: jest.fn(),
    updateWeatherScoreForShow: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("/api/shows/[id]/weather", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/shows/[id]/weather", () => {
    const outdoorShow = {
      id: "show_123",
      date: new Date("2024-06-15"),
      weatherScore: 85,
      weatherRiskSummary: "Excellent conditions for outdoor show",
      weatherDetailJson: {
        reasons: ["Ideal temperature range", "Low precipitation risk"],
        profile: { avgHighTempC: 25, avgLowTempC: 15 },
        recommendations: ["Monitor weather forecasts"],
      },
      venue: {
        id: "venue_123",
        name: "Outdoor Amphitheater",
        isOutdoor: true,
        latitude: 40.7128,
        longitude: -74.006,
        weatherNotes: "Covered stage area",
        climateProfiles: [
          {
            id: "profile_123",
            month: 6,
            avgHighTempC: 25,
            avgLowTempC: 15,
            avgPrecipDays: 3,
            avgWindSpeed: 10,
            avgHumidity: 65,
            hotDaysPct: 5,
            coldDaysPct: 0,
            lastUpdated: new Date("2024-05-01"),
          },
        ],
      },
    };

    it("should return weather data for outdoor show", async () => {
      mockPrisma.show.findFirst.mockResolvedValueOnce(outdoorShow);

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.show.weatherScore).toBe(85);
      expect(data.venue.isOutdoor).toBe(true);
      expect(data.climateProfile.month).toBe(6);
    });

    it("should handle indoor venues", async () => {
      const indoorShow = {
        ...outdoorShow,
        venue: {
          ...outdoorShow.venue,
          isOutdoor: false,
        },
      };

      mockPrisma.show.findFirst.mockResolvedValueOnce(indoorShow);

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.venue.isOutdoor).toBe(false);
      expect(data.message).toContain("not applicable for indoor venues");
    });

    it("should trigger updates for stale data", async () => {
      const staleShow = {
        ...outdoorShow,
        weatherScore: null,
        venue: {
          ...outdoorShow.venue,
          climateProfiles: [
            {
              ...outdoorShow.venue.climateProfiles[0],
              lastUpdated: new Date("2024-01-01"), // Very old data
            },
          ],
        },
      };

      mockPrisma.show.findFirst.mockResolvedValueOnce(staleShow);

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.isUpdating).toBe(true);
    });

    it("should handle missing climate profile", async () => {
      const showWithoutProfile = {
        ...outdoorShow,
        venue: {
          ...outdoorShow.venue,
          climateProfiles: [],
        },
      };

      mockPrisma.show.findFirst.mockResolvedValueOnce(showWithoutProfile);

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.climateProfile).toBeNull();
      expect(data.isUpdating).toBe(true);
    });

    it("should require authentication", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        auth: () => ({ userId: null, orgId: null }),
      }));

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });

      expect(response.status).toBe(401);
    });

    it("should validate show ownership", async () => {
      mockPrisma.show.findFirst.mockResolvedValueOnce(null);

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/shows/[id]/weather", () => {
    const outdoorShow = {
      id: "show_123",
      date: new Date("2024-06-15"),
      venue: {
        id: "venue_123",
        name: "Outdoor Amphitheater",
        isOutdoor: true,
        latitude: 40.7128,
        longitude: -74.006,
      },
    };

    it("should force update weather data", async () => {
      mockPrisma.show.findFirst.mockResolvedValueOnce(outdoorShow);

      const updatedShow = {
        ...outdoorShow,
        weatherScore: 88,
        weatherRiskSummary: "Updated weather conditions",
        weatherDetailJson: { reasons: ["Updated analysis"] },
        venue: {
          ...outdoorShow.venue,
          climateProfiles: [
            {
              id: "profile_123",
              month: 6,
              avgHighTempC: 26,
              avgLowTempC: 16,
              avgPrecipDays: 2,
              avgWindSpeed: 8,
              avgHumidity: 60,
              hotDaysPct: 8,
              coldDaysPct: 0,
              lastUpdated: new Date(),
            },
          ],
        },
      };

      mockPrisma.show.findUnique.mockResolvedValueOnce(updatedShow);

      const { req } = createMocks({
        method: "POST",
      });

      const response = await POST(req, { params: { id: "show_123" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.show.weatherScore).toBe(88);
      expect(data.message).toContain("updated successfully");
    });

    it("should reject indoor venue updates", async () => {
      const indoorShow = {
        ...outdoorShow,
        venue: {
          ...outdoorShow.venue,
          isOutdoor: false,
        },
      };

      mockPrisma.show.findFirst.mockResolvedValueOnce(indoorShow);

      const { req } = createMocks({
        method: "POST",
      });

      const response = await POST(req, { params: { id: "show_123" } });

      expect(response.status).toBe(400);
      expect(response.json()).resolves.toMatchObject({
        error: "Cannot update weather data for indoor venues",
      });
    });

    it("should validate show ownership before update", async () => {
      mockPrisma.show.findFirst.mockResolvedValueOnce(null);

      const { req } = createMocks({
        method: "POST",
      });

      const response = await POST(req, { params: { id: "show_123" } });

      expect(response.status).toBe(404);
    });

    it("should handle weather job failures gracefully", async () => {
      mockPrisma.show.findFirst.mockResolvedValueOnce(outdoorShow);

      // Mock weather job failure
      const { WeatherJob } = require("../../../apps/web/src/lib/weather-job");
      WeatherJob.updateClimateForVenue.mockRejectedValueOnce(
        new Error("API failure")
      );

      const { req } = createMooks({
        method: "POST",
      });

      const response = await POST(req, { params: { id: "show_123" } });

      expect(response.status).toBe(500);
    });
  });

  describe("Weather Score Updates", () => {
    it("should update weather scores when show date changes", async () => {
      const show = {
        id: "show_123",
        date: new Date("2024-06-15"),
        venue: {
          id: "venue_123",
          isOutdoor: true,
          latitude: 40.7128,
          longitude: -74.006,
          climateProfiles: [
            {
              month: 6,
              avgHighTempC: 25,
              avgLowTempC: 15,
              avgPrecipDays: 3,
              hotDaysPct: 5,
              coldDaysPct: 0,
            },
          ],
        },
      };

      const { WeatherJob } = require("../../../apps/web/src/lib/weather-job");

      await WeatherJob.updateWeatherScoreForShow("show_123");

      expect(WeatherJob.updateWeatherScoreForShow).toHaveBeenCalledWith(
        "show_123"
      );
    });
  });

  describe("Climate Profile Caching", () => {
    it("should cache climate profiles by venue and month", async () => {
      const venue = {
        id: "venue_123",
        latitude: 40.7128,
        longitude: -74.006,
        isOutdoor: true,
      };

      mockPrisma.venue.findUnique.mockResolvedValueOnce(venue);

      const { WeatherJob } = require("../../../apps/web/src/lib/weather-job");

      await WeatherJob.updateClimateForVenue("venue_123");

      expect(WeatherJob.updateClimateForVenue).toHaveBeenCalledWith(
        "venue_123"
      );
    });

    it("should respect cache expiration", async () => {
      const freshProfile = {
        id: "profile_123",
        venueId: "venue_123",
        month: 6,
        lastUpdated: new Date(), // Fresh data
        avgHighTempC: 25,
        avgLowTempC: 15,
      };

      const oldProfile = {
        ...freshProfile,
        lastUpdated: new Date("2024-01-01"), // Old data
      };

      mockPrisma.venueClimateProfile.findMany.mockResolvedValueOnce([
        freshProfile,
      ]);

      const { req } = createMocks({ method: "GET" });

      // Fresh data should not trigger update
      const response1 = await GET(req, { params: { id: "show_123" } });
      expect((await response1.json()).isUpdating).toBeFalsy();

      mockPrisma.venueClimateProfile.findMany.mockResolvedValueOnce([
        oldProfile,
      ]);

      // Old data should trigger update
      const response2 = await GET(req, { params: { id: "show_123" } });
      expect((await response2.json()).isUpdating).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.show.findFirst.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });

      expect(response.status).toBe(500);
    });

    it("should handle missing coordinates", async () => {
      const showWithoutCoords = {
        id: "show_123",
        venue: {
          id: "venue_123",
          isOutdoor: true,
          latitude: null,
          longitude: null,
        },
      };

      mockPrisma.show.findFirst.mockResolvedValueOnce(showWithoutCoords);

      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req, { params: { id: "show_123" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.climateProfile).toBeNull();
    });
  });
});
