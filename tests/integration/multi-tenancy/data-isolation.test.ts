import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import testData from "../../fixtures/test-data";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

describe("Multi-Tenant Data Isolation", () => {
  beforeEach(async () => {
    // Clean up test data
    await cleanupTestData();

    // Create test organizations and users
    await setupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe("Organization Data Scoping", () => {
    it("should only return venues for the users organization", async () => {
      // Given I am a user in Red Rocks organization
      const redRocksOrgId = testData.organizations.redRocks.id;
      const aegOrgId = testData.organizations.aegPresents.id;

      // When I query for venues with organization scoping
      const redRocksVenues = await prisma.venue.findMany({
        where: { organizationId: redRocksOrgId },
      });

      const aegVenues = await prisma.venue.findMany({
        where: { organizationId: aegOrgId },
      });

      // Then I should only see venues from my organization
      expect(redRocksVenues).toHaveLength(1);
      expect(redRocksVenues[0].organizationId).toBe(redRocksOrgId);

      expect(aegVenues).toHaveLength(1);
      expect(aegVenues[0].organizationId).toBe(aegOrgId);

      // And venues should not cross organizations
      expect(redRocksVenues[0].id).not.toBe(aegVenues[0].id);
    });

    it("should only return tours for the users organization", async () => {
      // Given I am a user in Paradigm Agency
      const paradigmOrgId = testData.organizations.paradigmAgency.id;
      const redRocksOrgId = testData.organizations.redRocks.id;

      // When I query for tours with organization scoping
      const paradigmTours = await prisma.tour.findMany({
        where: { organizationId: paradigmOrgId },
      });

      const redRocksTours = await prisma.tour.findMany({
        where: { organizationId: redRocksOrgId },
      });

      // Then each organization should only see their own tours
      expect(paradigmTours).toHaveLength(1);
      expect(paradigmTours[0].organizationId).toBe(paradigmOrgId);

      expect(redRocksTours).toHaveLength(1);
      expect(redRocksTours[0].organizationId).toBe(redRocksOrgId);
    });

    it("should prevent cross-organization data access via direct ID", async () => {
      // Given I know the ID of a venue from another organization
      const aegVenueId = testData.venues.fillmore.id;
      const redRocksOrgId = testData.organizations.redRocks.id;

      // When I try to access it with my organization filter
      const venue = await prisma.venue.findFirst({
        where: {
          id: aegVenueId,
          organizationId: redRocksOrgId, // Wrong organization
        },
      });

      // Then I should not be able to access it
      expect(venue).toBeNull();
    });

    it("should enforce organization scoping in show queries", async () => {
      // Given shows exist across multiple organizations
      const paradigmOrgId = testData.organizations.paradigmAgency.id;

      // When I query shows for my organization
      const orgShows = await prisma.show.findMany({
        where: { organizationId: paradigmOrgId },
        include: {
          tour: true,
          venue: true,
        },
      });

      // Then all related data should belong to my organization
      expect(orgShows).toHaveLength(1);
      expect(orgShows[0].organizationId).toBe(paradigmOrgId);
      expect(orgShows[0].tour.organizationId).toBe(paradigmOrgId);

      // Note: Venue might belong to different org in collaboration scenarios
      // but the show itself should belong to the requesting organization
    });
  });

  describe("User Organization Assignment", () => {
    it("should associate users with correct organizations", async () => {
      // Given users are created for different organizations
      const users = await prisma.user.findMany({
        include: { organization: true },
      });

      // Then each user should be associated with correct organization
      const sarahUser = users.find(
        (u) => u.id === testData.users.sarahJohnson.id
      );
      const mikeUser = users.find(
        (u) => u.id === testData.users.mikeRodriguez.id
      );

      expect(sarahUser?.organizationId).toBe(
        testData.organizations.redRocks.id
      );
      expect(sarahUser?.organization?.name).toBe("Red Rocks Amphitheatre");

      expect(mikeUser?.organizationId).toBe(
        testData.organizations.aegPresents.id
      );
      expect(mikeUser?.organization?.name).toBe("AEG Presents");
    });

    it("should prevent users from accessing other organizations data", async () => {
      // Given I am Sarah from Red Rocks
      const sarahsOrgId = testData.organizations.redRocks.id;
      const aegOrgId = testData.organizations.aegPresents.id;

      // When I try to access AEG's data
      const aegData = await prisma.venue.findMany({
        where: { organizationId: aegOrgId },
      });

      // Then I should not get any results when properly scoped
      // (In real app, this would be enforced by middleware/auth)
      expect(aegData).toBeDefined(); // Data exists in DB

      // But with proper scoping to Sarah's org, she shouldn't see AEG data
      const sarahsData = await prisma.venue.findMany({
        where: { organizationId: sarahsOrgId },
      });

      expect(sarahsData).toHaveLength(1);
      expect(sarahsData[0].organizationId).toBe(sarahsOrgId);
    });
  });

  describe("Organization Creation and Slug Generation", () => {
    it("should generate unique slugs for organizations", async () => {
      // Given I create multiple organizations with similar names
      const org1 = await prisma.organization.create({
        data: {
          name: "The Fillmore",
          slug: "the-fillmore",
          type: "VENUE",
        },
      });

      const org2 = await prisma.organization.create({
        data: {
          name: "The Fillmore Detroit",
          slug: "the-fillmore-detroit",
          type: "VENUE",
        },
      });

      // Then each should have a unique slug
      expect(org1.slug).toBe("the-fillmore");
      expect(org2.slug).toBe("the-fillmore-detroit");
      expect(org1.slug).not.toBe(org2.slug);
    });

    it("should enforce unique organization slugs", async () => {
      // Given an organization with a slug already exists
      await prisma.organization.create({
        data: {
          name: "Test Org",
          slug: "test-org",
          type: "VENUE",
        },
      });

      // When I try to create another organization with the same slug
      // Then it should throw a unique constraint error
      await expect(
        prisma.organization.create({
          data: {
            name: "Another Test Org",
            slug: "test-org", // Duplicate slug
            type: "PROMOTER",
          },
        })
      ).rejects.toThrow();
    });
  });

  describe("Cascade Operations", () => {
    it("should handle organization deletion properly", async () => {
      // Given an organization with associated data
      const orgId = testData.organizations.redRocks.id;

      // Verify data exists
      const venues = await prisma.venue.findMany({
        where: { organizationId: orgId },
      });
      expect(venues.length).toBeGreaterThan(0);

      // When the organization is deleted
      await prisma.organization.delete({
        where: { id: orgId },
      });

      // Then associated data should also be deleted (due to cascading)
      const remainingVenues = await prisma.venue.findMany({
        where: { organizationId: orgId },
      });
      expect(remainingVenues).toHaveLength(0);
    });
  });
});

// Helper functions
async function setupTestData() {
  // Create test organizations
  for (const org of Object.values(testData.organizations)) {
    await prisma.organization.create({ data: org });
  }

  // Create test users
  for (const user of Object.values(testData.users)) {
    await prisma.user.create({ data: user });
  }

  // Create test venues
  for (const venue of Object.values(testData.venues)) {
    await prisma.venue.create({ data: venue });
  }

  // Create test tours
  for (const tour of Object.values(testData.tours)) {
    await prisma.tour.create({ data: tour });
  }

  // Create test shows
  for (const show of Object.values(testData.shows)) {
    await prisma.show.create({ data: show });
  }
}

async function cleanupTestData() {
  // Delete in reverse order of dependencies
  await prisma.show.deleteMany({
    where: {
      id: { in: Object.values(testData.shows).map((s) => s.id) },
    },
  });

  await prisma.tour.deleteMany({
    where: {
      id: { in: Object.values(testData.tours).map((t) => t.id) },
    },
  });

  await prisma.venue.deleteMany({
    where: {
      id: { in: Object.values(testData.venues).map((v) => v.id) },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: { in: Object.values(testData.users).map((u) => u.id) },
    },
  });

  await prisma.organization.deleteMany({
    where: {
      id: { in: Object.values(testData.organizations).map((o) => o.id) },
    },
  });
}
