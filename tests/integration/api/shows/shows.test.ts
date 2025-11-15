import { createMocks } from "node-mocks-http";
import {
  GET,
  POST,
  PUT,
  DELETE,
} from "../../../../apps/web/src/app/api/shows/route";
import { prisma } from "../../../../apps/web/src/lib/prisma";
import { testData } from "../../../fixtures/test-data";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: testData.users.johnDoe.id,
    orgId: testData.organizations.acmeEntertainment.id,
  }),
}));

// Mock Prisma
jest.mock("../../../../apps/web/src/lib/prisma", () => ({
  prisma: {
    show: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    venue: {
      findUnique: jest.fn(),
    },
    tour: {
      findUnique: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("/api/shows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/shows", () => {
    it("should return shows for organization", async () => {
      const mockShows = [testData.shows.madSquareGardenShow];
      mockPrisma.show.findMany.mockResolvedValueOnce(mockShows);

      const { req, res } = createMocks({
        method: "GET",
        url: "/api/shows?tourId=tour_123",
      });

      await GET(req);

      expect(mockPrisma.show.findMany).toHaveBeenCalledWith({
        where: {
          tourId: "tour_123",
          tour: {
            organizationId: testData.organizations.acmeEntertainment.id,
          },
        },
        include: {
          venue: true,
          tour: true,
        },
        orderBy: {
          date: "asc",
        },
      });
    });

    it("should filter shows by status", async () => {
      mockPrisma.show.findMany.mockResolvedValueOnce([]);

      const { req } = createMocks({
        method: "GET",
        url: "/api/shows?tourId=tour_123&status=confirmed",
      });

      await GET(req);

      expect(mockPrisma.show.findMany).toHaveBeenCalledWith({
        where: {
          tourId: "tour_123",
          status: "confirmed",
          tour: {
            organizationId: testData.organizations.acmeEntertainment.id,
          },
        },
        include: {
          venue: true,
          tour: true,
        },
        orderBy: {
          date: "asc",
        },
      });
    });

    it("should filter shows by date range", async () => {
      mockPrisma.show.findMany.mockResolvedValueOnce([]);

      const { req } = createMocks({
        method: "GET",
        url: "/api/shows?tourId=tour_123&startDate=2024-06-01&endDate=2024-06-30",
      });

      await GET(req);

      expect(mockPrisma.show.findMany).toHaveBeenCalledWith({
        where: {
          tourId: "tour_123",
          date: {
            gte: new Date("2024-06-01"),
            lte: new Date("2024-06-30"),
          },
          tour: {
            organizationId: testData.organizations.acmeEntertainment.id,
          },
        },
        include: {
          venue: true,
          tour: true,
        },
        orderBy: {
          date: "asc",
        },
      });
    });

    it("should require authentication", async () => {
      // Mock unauthenticated request
      jest.doMock("@clerk/nextjs/server", () => ({
        auth: () => ({ userId: null, orgId: null }),
      }));

      const { req } = createMocks({
        method: "GET",
        url: "/api/shows",
      });

      const response = await GET(req);
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/shows", () => {
    const validShowData = {
      tourId: testData.tours.northAmericanTour.id,
      venueId: testData.venues.madisonSquareGarden.id,
      date: "2024-06-15",
      time: "20:00",
      status: "confirmed",
      guarantee: 50000,
      merchandiseSplit: 85,
      productionCosts: 15000,
    };

    beforeEach(() => {
      mockPrisma.tour.findUnique.mockResolvedValue(
        testData.tours.northAmericanTour
      );
      mockPrisma.venue.findUnique.mockResolvedValue(
        testData.venues.madisonSquareGarden
      );
    });

    it("should create show with valid data", async () => {
      const createdShow = {
        id: "show_123",
        ...validShowData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.show.create.mockResolvedValueOnce(createdShow);

      const { req } = createMocks({
        method: "POST",
        body: validShowData,
      });

      const response = await POST(req);

      expect(response.status).toBe(201);
      expect(mockPrisma.show.create).toHaveBeenCalledWith({
        data: validShowData,
      });
    });

    it("should validate required fields", async () => {
      const invalidData = { ...validShowData };
      delete invalidData.venueId;

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should validate tour exists and belongs to organization", async () => {
      mockPrisma.tour.findUnique.mockResolvedValueOnce(null);

      const { req } = createMocks({
        method: "POST",
        body: validShowData,
      });

      const response = await POST(req);

      expect(response.status).toBe(404);
    });

    it("should validate venue exists", async () => {
      mockPrisma.venue.findUnique.mockResolvedValueOnce(null);

      const { req } = createMocks({
        method: "POST",
        body: validShowData,
      });

      const response = await POST(req);

      expect(response.status).toBe(404);
    });

    it("should validate date format", async () => {
      const invalidData = { ...validShowData, date: "invalid-date" };

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should validate time format", async () => {
      const invalidData = { ...validShowData, time: "25:00" };

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should validate financial data", async () => {
      const invalidData = { ...validShowData, guarantee: -1000 };

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should validate merchandise split range", async () => {
      const invalidData = { ...validShowData, merchandiseSplit: 150 };

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should prevent double booking same venue", async () => {
      // Mock existing show on same date/venue
      mockPrisma.show.findMany.mockResolvedValueOnce([
        testData.shows.madSquareGardenShow,
      ]);

      const { req } = createMocks({
        method: "POST",
        body: validShowData,
      });

      const response = await POST(req);

      expect(response.status).toBe(409);
    });
  });

  describe("PUT /api/shows/[id]", () => {
    const showId = "show_123";
    const updateData = {
      status: "on_sale",
      guarantee: 55000,
    };

    beforeEach(() => {
      mockPrisma.show.findUnique.mockResolvedValue({
        ...testData.shows.madSquareGardenShow,
        tour: testData.tours.northAmericanTour,
      });
    });

    it("should update show with valid data", async () => {
      const updatedShow = {
        ...testData.shows.madSquareGardenShow,
        ...updateData,
        updatedAt: new Date(),
      };
      mockPrisma.show.update.mockResolvedValueOnce(updatedShow);

      const { req } = createMocks({
        method: "PUT",
        body: updateData,
      });

      // Mock dynamic route parameter
      const mockRequest = {
        ...req,
        nextUrl: { pathname: `/api/shows/${showId}` },
      };

      const response = await PUT(mockRequest, { params: { id: showId } });

      expect(response.status).toBe(200);
      expect(mockPrisma.show.update).toHaveBeenCalledWith({
        where: { id: showId },
        data: updateData,
      });
    });

    it("should validate show exists and belongs to organization", async () => {
      mockPrisma.show.findUnique.mockResolvedValueOnce(null);

      const { req } = createMocks({
        method: "PUT",
        body: updateData,
      });

      const response = await PUT(req, { params: { id: showId } });

      expect(response.status).toBe(404);
    });

    it("should validate update permissions", async () => {
      // Mock show from different organization
      mockPrisma.show.findUnique.mockResolvedValueOnce({
        ...testData.shows.madSquareGardenShow,
        tour: {
          ...testData.tours.northAmericanTour,
          organizationId: "different_org",
        },
      });

      const { req } = createMocks({
        method: "PUT",
        body: updateData,
      });

      const response = await PUT(req, { params: { id: showId } });

      expect(response.status).toBe(403);
    });

    it("should validate status transitions", async () => {
      // Try to update cancelled show to confirmed
      mockPrisma.show.findUnique.mockResolvedValueOnce({
        ...testData.shows.madSquareGardenShow,
        status: "cancelled",
        tour: testData.tours.northAmericanTour,
      });

      const { req } = createMocks({
        method: "PUT",
        body: { status: "confirmed" },
      });

      const response = await PUT(req, { params: { id: showId } });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/shows/[id]", () => {
    const showId = "show_123";

    beforeEach(() => {
      mockPrisma.show.findUnique.mockResolvedValue({
        ...testData.shows.madSquareGardenShow,
        tour: testData.tours.northAmericanTour,
      });
    });

    it("should delete show successfully", async () => {
      mockPrisma.show.delete.mockResolvedValueOnce(
        testData.shows.madSquareGardenShow
      );

      const { req } = createMocks({
        method: "DELETE",
      });

      const response = await DELETE(req, { params: { id: showId } });

      expect(response.status).toBe(200);
      expect(mockPrisma.show.delete).toHaveBeenCalledWith({
        where: { id: showId },
      });
    });

    it("should validate show exists and belongs to organization", async () => {
      mockPrisma.show.findUnique.mockResolvedValueOnce(null);

      const { req } = createMocks({
        method: "DELETE",
      });

      const response = await DELETE(req, { params: { id: showId } });

      expect(response.status).toBe(404);
    });

    it("should prevent deletion of past shows", async () => {
      const pastShow = {
        ...testData.shows.madSquareGardenShow,
        date: "2020-01-01",
        tour: testData.tours.northAmericanTour,
      };
      mockPrisma.show.findUnique.mockResolvedValueOnce(pastShow);

      const { req } = createMocks({
        method: "DELETE",
      });

      const response = await DELETE(req, { params: { id: showId } });

      expect(response.status).toBe(400);
    });

    it("should prevent deletion of confirmed shows close to date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const upcomingShow = {
        ...testData.shows.madSquareGardenShow,
        date: tomorrow.toISOString().split("T")[0],
        status: "confirmed",
        tour: testData.tours.northAmericanTour,
      };
      mockPrisma.show.findUnique.mockResolvedValueOnce(upcomingShow);

      const { req } = createMocks({
        method: "DELETE",
      });

      const response = await DELETE(req, { params: { id: showId } });

      expect(response.status).toBe(400);
    });
  });

  describe("Financial Calculations", () => {
    it("should calculate show profitability correctly", async () => {
      const showData = {
        guarantee: 50000,
        productionCosts: 15000,
        merchandiseSplit: 85,
        merchandiseRevenue: 10000,
      };

      const expectedNetProfit =
        showData.guarantee -
        showData.productionCosts +
        (showData.merchandiseRevenue * showData.merchandiseSplit) / 100;

      mockPrisma.show.create.mockResolvedValueOnce({
        id: "show_123",
        ...showData,
        netProfit: expectedNetProfit,
      });

      const { req } = createMocks({
        method: "POST",
        body: {
          tourId: testData.tours.northAmericanTour.id,
          venueId: testData.venues.madisonSquareGarden.id,
          date: "2024-06-15",
          time: "20:00",
          status: "confirmed",
          ...showData,
        },
      });

      await POST(req);

      expect(mockPrisma.show.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            netProfit: expectedNetProfit,
          }),
        })
      );
    });
  });

  describe("Venue Availability", () => {
    it("should check venue availability on create", async () => {
      const showData = {
        tourId: testData.tours.northAmericanTour.id,
        venueId: testData.venues.madisonSquareGarden.id,
        date: "2024-06-15",
        time: "20:00",
      };

      // Mock venue availability check
      mockPrisma.show.findMany.mockResolvedValueOnce([]);

      const { req } = createMocks({
        method: "POST",
        body: showData,
      });

      await POST(req);

      expect(mockPrisma.show.findMany).toHaveBeenCalledWith({
        where: {
          venueId: showData.venueId,
          date: showData.date,
          status: {
            not: "cancelled",
          },
        },
      });
    });
  });
});
