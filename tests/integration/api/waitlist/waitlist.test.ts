import { createMocks } from "node-mocks-http";
import { GET, POST } from "../../../../apps/web/src/app/api/waitlist/route";
import { prisma } from "../../../../apps/web/src/lib/prisma";
import { testData } from "../../../fixtures/test-data";

// Mock Prisma
jest.mock("../../../../apps/web/src/lib/prisma", () => ({
  prisma: {
    waitlistEntry: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("/api/waitlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/waitlist", () => {
    it("should return waitlist entries for admin users", async () => {
      const mockEntries = [testData.waitlistEntries.johnDoe];
      mockPrisma.waitlistEntry.findMany.mockResolvedValueOnce(mockEntries);
      mockPrisma.waitlistEntry.count.mockResolvedValueOnce(1);

      const { req } = createMocks({
        method: "GET",
        headers: {
          "x-admin-key": process.env.ADMIN_API_KEY,
        },
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.entries).toEqual(mockEntries);
      expect(data.total).toBe(1);
    });

    it("should filter entries by role", async () => {
      mockPrisma.waitlistEntry.findMany.mockResolvedValueOnce([]);
      mockPrisma.waitlistEntry.count.mockResolvedValueOnce(0);

      const { req } = createMocks({
        method: "GET",
        url: "/api/waitlist?role=artist",
        headers: {
          "x-admin-key": process.env.ADMIN_API_KEY,
        },
      });

      await GET(req);

      expect(mockPrisma.waitlistEntry.findMany).toHaveBeenCalledWith({
        where: { role: "artist" },
        orderBy: { createdAt: "desc" },
        take: 50,
        skip: 0,
      });
    });

    it("should handle pagination", async () => {
      mockPrisma.waitlistEntry.findMany.mockResolvedValueOnce([]);
      mockPrisma.waitlistEntry.count.mockResolvedValueOnce(0);

      const { req } = createMocks({
        method: "GET",
        url: "/api/waitlist?page=2&limit=10",
        headers: {
          "x-admin-key": process.env.ADMIN_API_KEY,
        },
      });

      await GET(req);

      expect(mockPrisma.waitlistEntry.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        take: 10,
        skip: 10,
      });
    });

    it("should require admin authentication", async () => {
      const { req } = createMocks({
        method: "GET",
      });

      const response = await GET(req);

      expect(response.status).toBe(401);
    });

    it("should validate admin API key", async () => {
      const { req } = createMocks({
        method: "GET",
        headers: {
          "x-admin-key": "invalid-key",
        },
      });

      const response = await GET(req);

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/waitlist", () => {
    const validWaitlistData = {
      email: "test@example.com",
      name: "John Doe",
      role: "artist",
      company: "Independent",
      hearAboutUs: "social_media",
    };

    it("should create waitlist entry with valid data", async () => {
      const createdEntry = {
        id: "waitlist_123",
        ...validWaitlistData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.waitlistEntry.create.mockResolvedValueOnce(createdEntry);
      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(null); // Email doesn't exist

      const { req } = createMocks({
        method: "POST",
        body: validWaitlistData,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBe("waitlist_123");
      expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
        data: validWaitlistData,
      });
    });

    it("should validate required fields", async () => {
      const invalidData = { ...validWaitlistData };
      delete invalidData.email;

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should validate email format", async () => {
      const invalidData = { ...validWaitlistData, email: "invalid-email" };

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should validate role enum", async () => {
      const invalidData = { ...validWaitlistData, role: "invalid-role" };

      const { req } = createMocks({
        method: "POST",
        body: invalidData,
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("should prevent duplicate email addresses", async () => {
      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(
        testData.waitlistEntries.johnDoe
      );

      const { req } = createMocks({
        method: "POST",
        body: validWaitlistData,
      });

      const response = await POST(req);

      expect(response.status).toBe(409);
      expect(mockPrisma.waitlistEntry.create).not.toHaveBeenCalled();
    });

    it("should sanitize input data", async () => {
      const maliciousData = {
        ...validWaitlistData,
        name: '<script>alert("xss")</script>John Doe',
        company: "Company<img src=x onerror=alert(1)>Inc",
      };

      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(null);
      mockPrisma.waitlistEntry.create.mockResolvedValueOnce({
        id: "waitlist_123",
        ...maliciousData,
        name: "John Doe", // Sanitized
        company: "CompanyInc", // Sanitized
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { req } = createMocks({
        method: "POST",
        body: maliciousData,
      });

      const response = await POST(req);

      expect(response.status).toBe(201);
      expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: expect.not.stringContaining("<script>"),
          company: expect.not.stringContaining("<img"),
        }),
      });
    });

    it("should handle rate limiting", async () => {
      // Mock rate limiter (this would depend on your implementation)
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(
          createMocks({
            method: "POST",
            body: { ...validWaitlistData, email: `test${i}@example.com` },
            headers: {
              "x-forwarded-for": "192.168.1.1",
            },
          })
        );
      }

      mockPrisma.waitlistEntry.findUnique.mockResolvedValue(null);
      mockPrisma.waitlistEntry.create.mockResolvedValue({
        id: "waitlist_123",
        ...validWaitlistData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Process requests rapidly
      const responses = await Promise.all(requests.map(({ req }) => POST(req)));

      // Some requests should be rate limited (429 status)
      const rateLimitedResponses = responses.filter(
        (res) => res.status === 429
      );
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it("should track source attribution", async () => {
      const dataWithSource = {
        ...validWaitlistData,
        source: "hero_cta",
        utm_campaign: "launch_announcement",
        utm_medium: "social",
        utm_source: "twitter",
      };

      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(null);
      mockPrisma.waitlistEntry.create.mockResolvedValueOnce({
        id: "waitlist_123",
        ...dataWithSource,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { req } = createMocks({
        method: "POST",
        body: dataWithSource,
        headers: {
          referer: "https://twitter.com/tourbrain",
        },
      });

      await POST(req);

      expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          source: "hero_cta",
          utm_campaign: "launch_announcement",
          utm_medium: "social",
          utm_source: "twitter",
        }),
      });
    });

    it("should send welcome email after successful signup", async () => {
      // Mock email service
      const mockSendEmail = jest.fn();
      jest.doMock("../../../../apps/web/src/lib/email", () => ({
        sendWelcomeEmail: mockSendEmail,
      }));

      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(null);
      mockPrisma.waitlistEntry.create.mockResolvedValueOnce({
        id: "waitlist_123",
        ...validWaitlistData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { req } = createMocks({
        method: "POST",
        body: validWaitlistData,
      });

      await POST(req);

      expect(mockSendEmail).toHaveBeenCalledWith({
        to: validWaitlistData.email,
        name: validWaitlistData.name,
      });
    });

    it("should handle database errors gracefully", async () => {
      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(null);
      mockPrisma.waitlistEntry.create.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const { req } = createMocks({
        method: "POST",
        body: validWaitlistData,
      });

      const response = await POST(req);

      expect(response.status).toBe(500);
    });

    it("should validate and process optional fields", async () => {
      const dataWithOptionals = {
        ...validWaitlistData,
        company: "Test Records",
        website: "https://testrecords.com",
        phone: "+1-555-0123",
        tourSize: "medium",
        currentTools: ["excel", "email"],
        hearAboutUs: "referral",
        referralSource: "John Smith",
      };

      mockPrisma.waitlistEntry.findUnique.mockResolvedValueOnce(null);
      mockPrisma.waitlistEntry.create.mockResolvedValueOnce({
        id: "waitlist_123",
        ...dataWithOptionals,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { req } = createMocks({
        method: "POST",
        body: dataWithOptionals,
      });

      const response = await POST(req);

      expect(response.status).toBe(201);
      expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
        data: dataWithOptionals,
      });
    });
  });

  describe("Waitlist Analytics", () => {
    it("should track conversion metrics", async () => {
      const analyticsData = {
        totalSignups: 150,
        signupsByRole: {
          artist: 85,
          promoter: 30,
          venue: 25,
          agent: 10,
        },
        signupsBySource: {
          hero_cta: 60,
          product_features: 40,
          social_media: 30,
          referral: 20,
        },
        conversionRate: 12.5,
        dailySignups: [
          { date: "2024-06-01", count: 15 },
          { date: "2024-06-02", count: 22 },
          { date: "2024-06-03", count: 18 },
        ],
      };

      mockPrisma.waitlistEntry.findMany.mockResolvedValueOnce([]);
      mockPrisma.waitlistEntry.count.mockResolvedValueOnce(150);

      const { req } = createMocks({
        method: "GET",
        url: "/api/waitlist/analytics",
        headers: {
          "x-admin-key": process.env.ADMIN_API_KEY,
        },
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("totalSignups");
      expect(data).toHaveProperty("signupsByRole");
      expect(data).toHaveProperty("conversionRate");
    });
  });
});
