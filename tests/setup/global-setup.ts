import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

export default async function globalSetup() {
  console.log("🧪 Setting up test environment...");

  try {
    // Ensure test database exists and is migrated
    if (process.env.TEST_DATABASE_URL) {
      console.log("📊 Setting up test database...");

      // Run Prisma migrations for test database
      execSync("npx prisma migrate deploy", {
        env: {
          ...process.env,
          DATABASE_URL: process.env.TEST_DATABASE_URL,
        },
        stdio: "inherit",
      });

      // Generate Prisma client for test environment
      execSync("npx prisma generate", {
        stdio: "inherit",
      });

      console.log("✅ Test database ready");
    }

    // Connect to database to ensure it's accessible
    await prisma.$connect();

    // Seed test data if needed
    await seedTestData();

    console.log("✅ Test environment setup complete");
  } catch (error) {
    console.error("❌ Test setup failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedTestData() {
  console.log("🌱 Seeding test data...");

  // Create test organizations
  const testOrgs = [
    {
      id: "test-org-1",
      name: "Test Organization 1",
      slug: "test-org-1",
      type: "VENUE",
    },
    {
      id: "test-org-2",
      name: "Test Organization 2",
      slug: "test-org-2",
      type: "PROMOTER",
    },
  ];

  for (const org of testOrgs) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: org,
      create: org,
    });
  }

  // Create test users
  const testUsers = [
    {
      id: "test-user-1",
      email: "test1@example.com",
      name: "Test User 1",
      organizationId: "test-org-1",
      role: "ADMIN",
    },
    {
      id: "test-user-2",
      email: "test2@example.com",
      name: "Test User 2",
      organizationId: "test-org-2",
      role: "ADMIN",
    },
  ];

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  console.log("✅ Test data seeded");
}
