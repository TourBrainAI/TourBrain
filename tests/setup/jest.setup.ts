import { beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "",
}));

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: "test-user-id",
    sessionId: "test-session-id",
    orgId: "test-org-id",
    orgRole: "admin",
    getToken: jest.fn(() => Promise.resolve("mock-token")),
  }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "test-user-id",
      emailAddresses: [{ emailAddress: "test@example.com" }],
      firstName: "Test",
      lastName: "User",
    },
  }),
  useOrganization: () => ({
    isLoaded: true,
    organization: {
      id: "test-org-id",
      name: "Test Organization",
      slug: "test-org",
    },
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignUpButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <div>UserButton</div>,
  auth: () => ({
    userId: "test-user-id",
    sessionId: "test-session-id",
    orgId: "test-org-id",
    getToken: jest.fn(() => Promise.resolve("mock-token")),
  }),
}));

// Mock OpenAI
jest.mock("openai", () => ({
  OpenAI: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn(() =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: "Mock AI response",
                },
              },
            ],
          })
        ),
      },
    },
  })),
}));

// Mock Prisma client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  organization: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  venue: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tour: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  show: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  waitlistEntry: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
};

jest.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

// Global test setup
beforeAll(() => {
  // Setup test environment
});

afterAll(() => {
  // Cleanup test environment
});

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});

// Extend global with test utilities
declare global {
  var testUtils: {
    mockPrisma: typeof mockPrismaClient;
  };
}

global.testUtils = {
  mockPrisma: mockPrismaClient,
};
