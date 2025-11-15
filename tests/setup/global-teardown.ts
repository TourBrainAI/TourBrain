import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

export default async function globalTeardown() {
  console.log("🧹 Cleaning up test environment...");

  try {
    // Clean up test data
    await cleanupTestData();

    console.log("✅ Test environment cleanup complete");
  } catch (error) {
    console.error("❌ Test cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanupTestData() {
  console.log("🗑️  Removing test data...");

  // Delete in reverse order of dependencies
  await prisma.show.deleteMany({
    where: {
      tour: {
        organization: {
          id: { in: ["test-org-1", "test-org-2"] },
        },
      },
    },
  });

  await prisma.tour.deleteMany({
    where: {
      organizationId: { in: ["test-org-1", "test-org-2"] },
    },
  });

  await prisma.venue.deleteMany({
    where: {
      organizationId: { in: ["test-org-1", "test-org-2"] },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: { in: ["test-user-1", "test-user-2"] },
    },
  });

  await prisma.organization.deleteMany({
    where: {
      id: { in: ["test-org-1", "test-org-2"] },
    },
  });

  console.log("✅ Test data cleaned up");
}
