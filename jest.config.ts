import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests", "<rootDir>/apps/web/src"],

  // Test file patterns
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.test.tsx",
    "**/apps/web/src/**/*.test.ts",
    "**/apps/web/src/**/*.test.tsx",
  ],

  // Transform patterns
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Module path mapping
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/apps/web/src/$1",
    "^@/components/(.*)$": "<rootDir>/apps/web/src/components/$1",
    "^@/lib/(.*)$": "<rootDir>/apps/web/src/lib/$1",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],

  // Coverage configuration
  collectCoverageFrom: [
    "apps/web/src/**/*.{ts,tsx}",
    "!apps/web/src/**/*.d.ts",
    "!apps/web/src/types/**/*",
    "!apps/web/src/**/*.stories.{ts,tsx}",
  ],

  coverageDirectory: "<rootDir>/coverage",

  coverageReporters: ["text", "lcov", "html", "json-summary"],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Critical paths require higher coverage
    "./apps/web/src/lib/": {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    "./apps/web/src/app/api/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // Test environment setup
  globalSetup: "<rootDir>/tests/setup/global-setup.ts",
  globalTeardown: "<rootDir>/tests/setup/global-teardown.ts",

  // Ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/e2e/",
  ],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout (30 seconds)
  testTimeout: 30000,
};

export default config;
