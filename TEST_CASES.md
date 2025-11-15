# TourBrain Test Cases & Test Specifications

**Version:** 1.0.0  
**Last Updated:** November 14, 2025  
**Alignment:** USER_STORIES.md v0.3.0  
**Format:** Gherkin (Given-When-Then) with Test Implementation Details

---

## Overview

This document provides comprehensive test cases for TourBrain aligned with the user stories in USER_STORIES.md. Each test case includes:

- **Gherkin Scenario**: User-facing behavior description
- **Test Type**: Unit, Integration, E2E, or API
- **Implementation**: Specific test framework and approach
- **Assertions**: Expected outcomes and validation points
- **Setup Requirements**: Test data, authentication, and environment needs

## Test Infrastructure

### Frameworks

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + Supertest (API testing)
- **End-to-End Tests**: Playwright
- **Database Tests**: Jest + Prisma test database
- **Component Tests**: Jest + React Testing Library

### Test Environment

- **Database**: PostgreSQL test instance with Prisma migrations
- **Authentication**: Clerk test keys and mock users
- **File Storage**: Mock S3/local storage for uploads
- **External APIs**: Mock OpenAI and other external services
- **CI/CD**: GitHub Actions with test matrix

---

## Epic 1: Authentication & Multi-Tenancy System

### Feature 1.1: User Authentication

#### Test Case 1.1.1: User Sign-Up Flow

```gherkin
Feature: User Authentication

Scenario: New user creates account successfully
  Given I am a tour industry professional
  When I visit the sign-up page
  And I enter valid email and password
  And I verify my email address
  Then I should be redirected to organization onboarding
  And my account should be created in the system
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/auth/user-signup.spec.ts`
- **Setup**: Clean database, Clerk test environment
- **Assertions**:
  - User record created in database
  - Email verification triggered
  - Redirect to `/onboarding`
  - Session established

#### Test Case 1.1.2: User Sign-In Authentication

```gherkin
Feature: User Authentication

Scenario: Existing user signs in with valid credentials
  Given I have an existing TourBrain account
  When I visit the sign-in page
  And I enter my credentials
  Then I should be redirected to my dashboard
  And I should have access to my organization's data
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/auth/user-signin.spec.ts`
- **Setup**: Pre-created test user and organization
- **Assertions**:
  - Successful authentication
  - Redirect to `/dashboard`
  - Organization context loaded
  - Protected routes accessible

#### Test Case 1.1.3: Route Protection Security

```gherkin
Feature: User Authentication

Scenario: Unauthenticated user cannot access protected routes
  Given I am not signed in
  When I try to visit protected routes like /venues or /dashboard
  Then I should be redirected to the sign-in page
  And I should not be able to access protected content
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Supertest)
- **Test File**: `tests/integration/auth/route-protection.test.ts`
- **Setup**: No authentication tokens
- **Assertions**:
  - 401/403 status codes for protected API routes
  - Redirect behavior for protected pages
  - No sensitive data returned

### Feature 1.2: Organization Management

#### Test Case 1.2.1: Organization Onboarding Process

```gherkin
Feature: Organization Management

Scenario: New user creates organization during onboarding
  Given I have just signed up and verified my email
  When I am redirected to the onboarding page
  And I enter organization name, type, and description
  And I submit the form
  Then my organization should be created
  And I should be set as the owner
  And I should be redirected to the dashboard
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/onboarding/organization-creation.spec.ts`
- **Setup**: Authenticated user without organization
- **Assertions**:
  - Organization record created with correct details
  - User role set to OWNER
  - Organization slug generated
  - Dashboard displays organization info

#### Test Case 1.2.2: Multi-Tenant Data Isolation

```gherkin
Feature: Multi-Tenancy

Scenario: Users only see their organization's data
  Given I am logged in to "Red Rocks Amphitheatre"
  And another organization "Belly Up Tavern" exists with tours
  When I navigate to the Tours list
  Then I should only see tours belonging to Red Rocks Amphitheatre
  And I should not see any tours from Belly Up Tavern
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Prisma)
- **Test File**: `tests/integration/multi-tenancy/data-isolation.test.ts`
- **Setup**: Multiple organizations with test data
- **Assertions**:
  - API queries scoped to user's organization
  - No cross-organization data leakage
  - Database queries include organization filter

---

## Epic 2: Venue Management System

### Feature 2.1: Venue Creation

#### Test Case 2.1.1: Venue Creation Workflow

```gherkin
Feature: Venue Creation

Scenario: User adds a new venue to their organization
  Given I am signed in and have an organization
  When I navigate to /venues/new
  And I fill in required fields (name, address, city, country)
  And I optionally add capacity, contact info, and technical specs
  And I submit the form
  Then the venue should be created in my organization
  And I should be redirected to the venues list
  And I should see my new venue in the list
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/venues/venue-creation.spec.ts`
- **Setup**: Authenticated user with organization
- **Assertions**:
  - Venue record created with correct organizationId
  - Form validation works for required fields
  - Redirect to `/venues` after creation
  - New venue appears in venue list

#### Test Case 2.1.2: Venue Form Validation

```gherkin
Feature: Venue Creation

Scenario: Form validation prevents submission with missing required fields
  Given I am on the new venue form
  When I submit without required fields (name, address, city, country)
  Then I should see validation errors
  And the form should not submit
  And I should be able to correct and resubmit
```

**Implementation Details:**

- **Test Type**: Unit (Jest + React Testing Library)
- **Test File**: `tests/unit/components/venue-form.test.tsx`
- **Setup**: Rendered venue form component
- **Assertions**:
  - Required field validation messages displayed
  - Form submission blocked until valid
  - Error states cleared when fields corrected

### Feature 2.2: Venue Directory

#### Test Case 2.2.1: Venue List Display

```gherkin
Feature: Venue Directory

Scenario: User views their organization's venues
  Given I am signed in and have venues in my organization
  When I navigate to /venues
  Then I should see a grid of my organization's venues
  And each venue should show name, location, and capacity
  And I should see action buttons for view and edit
```

**Implementation Details:**

- **Test Type**: Integration (Jest + React Testing Library)
- **Test File**: `tests/integration/venues/venue-list.test.tsx`
- **Setup**: Organization with multiple test venues
- **Assertions**:
  - Correct number of venues displayed
  - Venue information correctly rendered
  - Action buttons present and functional

#### Test Case 2.2.2: Empty State Handling

```gherkin
Feature: Venue Directory

Scenario: User views venues when none exist
  Given I am signed in but have no venues
  When I navigate to /venues
  Then I should see an empty state message
  And I should see a prominent "Add Venue" button
```

**Implementation Details:**

- **Test Type**: Unit (Jest + React Testing Library)
- **Test File**: `tests/unit/pages/venues-empty-state.test.tsx`
- **Setup**: Organization with no venues
- **Assertions**:
  - Empty state component rendered
  - "Add Venue" button present and links correctly

---

## Epic 3: Tour & Show Operations

### Feature 3.1: Tour Management

#### Test Case 3.1.1: Tour Creation Process

```gherkin
Feature: Tour Management

Scenario: Tour manager creates a new tour
  Given I am logged in as a TOUR_MANAGER
  When I navigate to Tours page
  And I click "Create Tour"
  And I enter tour details (name, artist, dates, status)
  And I click "Create Tour"
  Then a new tour should be created
  And I should be redirected to the tour detail page
  And I should see the tour in my tours list
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/tours/tour-creation.spec.ts`
- **Setup**: User with TOUR_MANAGER role
- **Assertions**:
  - Tour record created with correct data
  - Redirect to tour detail page
  - Tour appears in tours list
  - Correct organization association

#### Test Case 3.1.2: Tour Financial Calculations

```gherkin
Feature: Financial Tracking

Scenario: System calculates tour-level financial summary
  Given I have a tour with multiple shows
  And each show has deal terms and expenses
  When I view the tour financial summary
  Then I should see aggregated totals for gross, expenses, and profit
  And calculations should be accurate across all shows
```

**Implementation Details:**

- **Test Type**: Unit (Jest)
- **Test File**: `tests/unit/lib/financial-calculations.test.ts`
- **Setup**: Mock tour data with multiple shows
- **Assertions**:
  - Correct aggregation of show financials
  - Accurate profit/loss calculations
  - Proper handling of different deal types

### Feature 3.2: Show Management

#### Test Case 3.2.1: Show Creation on Tour

```gherkin
Feature: Show Management

Scenario: Booker adds a show to a tour
  Given I am viewing a tour
  When I click "Add Show"
  And I select venue, date, and show details
  And I click "Add Show"
  Then the show should be created
  And it should appear in the tour's show list
  And I should be able to view the show detail page
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/shows/show-creation.spec.ts`
- **Setup**: Existing tour and available venues
- **Assertions**:
  - Show record created and linked to tour
  - Show appears in tour's show list
  - Show detail page accessible

#### Test Case 3.2.2: Show Deal Management

```gherkin
Feature: Show Management

Scenario: Promoter enters and calculates deal terms
  Given I am viewing a show detail page
  When I click the "Deal" tab
  And I enter guarantee, percentage, and estimated gross
  And I add expenses
  And I click "Save Deal"
  Then the deal should be saved
  And estimated profit should be calculated correctly
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Supertest)
- **Test File**: `tests/integration/shows/deal-management.test.ts`
- **Setup**: Existing show record
- **Assertions**:
  - Deal terms saved to database
  - Financial calculations correct
  - Tour financials updated

### Feature 3.3: Day Sheet Generation

#### Test Case 3.3.1: Day Sheet Creation

```gherkin
Feature: Day Sheet Generation

Scenario: Tour manager generates formatted day sheet
  Given I have a show with complete logistics information
  When I click "Generate Day Sheet"
  Then a formatted day sheet should be created
  And it should include all show details and contacts
  And it should be formatted for printing
```

**Implementation Details:**

- **Test Type**: Integration (Jest)
- **Test File**: `tests/integration/daysheet/generation.test.ts`
- **Setup**: Show with complete logistics data
- **Assertions**:
  - Day sheet generated with correct formatting
  - All required information included
  - PDF export functionality works

---

## Epic 4: Marketing & CRM System

### Feature 4.1: Waitlist Management

#### Test Case 4.1.1: Waitlist Signup Process

```gherkin
Feature: Waitlist Signup

Scenario: Venue booker joins early access waitlist
  Given I am on the marketing homepage
  When I scroll to the waitlist section
  And I fill in name, email, role, and company
  And I click "Join Waitlist"
  Then I should see a success message
  And my information should be saved in the database
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/marketing/waitlist-signup.spec.ts`
- **Setup**: Clean marketing site
- **Assertions**:
  - Waitlist entry created in database
  - Success message displayed
  - Form reset after submission

#### Test Case 4.1.2: Duplicate Email Handling

```gherkin
Feature: Waitlist Signup

Scenario: User signs up with email already on waitlist
  Given I previously signed up with an email
  When I attempt to sign up again with the same email
  Then the system should update my existing record
  And I should still see a success message
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Supertest)
- **Test File**: `tests/integration/waitlist/duplicate-handling.test.ts`
- **Setup**: Existing waitlist entry
- **Assertions**:
  - No duplicate records created
  - Existing record updated with new data
  - Appropriate response returned

### Feature 4.2: Admin CRM System

#### Test Case 4.2.1: Waitlist Status Management

```gherkin
Feature: Waitlist CRM

Scenario: Admin manages waitlist entry status and priority
  Given I am an admin viewing the waitlist
  When I select a waitlist entry
  And I change status and add notes
  Then the entry should be updated
  And changes should be tracked
```

**Implementation Details:**

- **Test Type**: E2E (Playwright)
- **Test File**: `tests/e2e/admin/waitlist-management.spec.ts`
- **Setup**: Admin user with waitlist entries
- **Assertions**:
  - Status changes saved correctly
  - Notes and priority updated
  - Activity log created

---

## Epic 5: AI Features & OpenAI Integration

### Feature 5.1: Day Sheet AI Generation

#### Test Case 5.1.1: AI Day Sheet Notes Generation

```gherkin
Feature: AI Day Sheet Generation

Scenario: System generates production notes using AI
  Given I have a show with venue and logistics information
  When I click "Generate AI Notes"
  Then the system should call OpenAI API
  And return formatted production notes
  And notes should be relevant to the venue and show
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Mock OpenAI)
- **Test File**: `tests/integration/ai/daysheet-generation.test.ts`
- **Setup**: Mock OpenAI API responses
- **Assertions**:
  - OpenAI API called with correct parameters
  - Response formatted correctly
  - Notes saved to show record

### Feature 5.2: Tour Risk Analysis

#### Test Case 5.2.1: AI Tour Risk Assessment

```gherkin
Feature: AI Risk Analysis

Scenario: System analyzes tour routing risks
  Given I have a tour with multiple shows
  When I request AI risk analysis
  Then the system should analyze routing and logistics
  And return risk assessment with recommendations
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Mock OpenAI)
- **Test File**: `tests/integration/ai/risk-analysis.test.ts`
- **Setup**: Tour with various risk factors
- **Assertions**:
  - Risk analysis generated
  - Recommendations provided
  - Risk scores calculated

---

## API Testing Specifications

### Authentication API Tests

#### Test Case: JWT Token Validation

```gherkin
Feature: API Authentication

Scenario: API validates JWT tokens correctly
  Given I have a valid JWT token
  When I make an API request with the token
  Then the request should be authenticated
  And I should receive the requested data
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Supertest)
- **Test File**: `tests/integration/api/auth.test.ts`
- **Assertions**:
  - Valid tokens accepted
  - Invalid tokens rejected
  - Proper error responses for authentication failures

### Organization Scoping API Tests

#### Test Case: Multi-Tenant API Security

```gherkin
Feature: API Security

Scenario: API prevents cross-organization data access
  Given I am authenticated for Organization A
  When I attempt to access Organization B's data
  Then the API should return 403 Forbidden
  And no data should be leaked
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Supertest)
- **Test File**: `tests/integration/api/multi-tenancy.test.ts`
- **Assertions**:
  - Proper organization scoping
  - Cross-tenant access blocked
  - Consistent security across all endpoints

### CRUD Operations API Tests

#### Test Case: Venue API Operations

```gherkin
Feature: Venue API

Scenario: Complete CRUD operations for venues
  Given I am authenticated with proper permissions
  When I perform CREATE, READ, UPDATE, DELETE operations
  Then all operations should work correctly
  And data should be properly validated
```

**Implementation Details:**

- **Test Type**: Integration (Jest + Supertest)
- **Test File**: `tests/integration/api/venues.test.ts`
- **Assertions**:
  - All CRUD operations functional
  - Proper validation and error handling
  - Consistent response formats

---

## Performance & Load Testing

### Database Performance Tests

#### Test Case: Large Dataset Queries

```gherkin
Feature: Database Performance

Scenario: System handles large datasets efficiently
  Given I have 10,000 venues and 50,000 shows
  When I query for organization data
  Then response time should be under 500ms
  And pagination should work correctly
```

**Implementation Details:**

- **Test Type**: Performance (Jest + Database)
- **Test File**: `tests/performance/database.test.ts`
- **Setup**: Large test dataset
- **Assertions**:
  - Query performance within limits
  - Proper indexing effectiveness
  - Memory usage optimization

### API Load Tests

#### Test Case: Concurrent User Handling

```gherkin
Feature: API Load Testing

Scenario: System handles multiple concurrent users
  Given 100 concurrent users are accessing the system
  When they perform various operations
  Then all requests should complete successfully
  And response times should remain acceptable
```

**Implementation Details:**

- **Test Type**: Load Testing (Artillery.io)
- **Test File**: `tests/load/api-load.yml`
- **Assertions**:
  - Successful request rates > 95%
  - Average response time < 1000ms
  - No memory leaks or crashes

---

## Security Testing

### Input Validation Tests

#### Test Case: SQL Injection Prevention

```gherkin
Feature: Security Testing

Scenario: System prevents SQL injection attacks
  Given I submit malicious SQL in form inputs
  When the system processes the request
  Then the SQL injection should be blocked
  And no database damage should occur
```

**Implementation Details:**

- **Test Type**: Security (Jest + Malicious Payloads)
- **Test File**: `tests/security/sql-injection.test.ts`
- **Assertions**:
  - Parameterized queries used
  - Input sanitization effective
  - No unauthorized database access

### Authorization Tests

#### Test Case: Role-Based Access Control

```gherkin
Feature: Authorization Testing

Scenario: System enforces role-based permissions
  Given I am a BOOKER user
  When I attempt admin-only operations
  Then the system should deny access
  And return appropriate error messages
```

**Implementation Details:**

- **Test Type**: Security (Jest + Role Testing)
- **Test File**: `tests/security/rbac.test.ts`
- **Assertions**:
  - Role permissions enforced
  - Privilege escalation prevented
  - Audit logging active

---

## Test Data Management

### Test Database Setup

#### Fixtures and Seed Data

```typescript
// Test data structure for consistent testing
export const testOrganizations = {
  redRocks: {
    name: "Red Rocks Amphitheatre",
    type: "VENUE",
    slug: "red-rocks-amphitheatre",
  },
  aegPresents: {
    name: "AEG Presents",
    type: "PROMOTER",
    slug: "aeg-presents",
  },
};

export const testVenues = {
  redRocks: {
    name: "Red Rocks Amphitheatre",
    capacity: 9525,
    city: "Morrison",
    state: "CO",
    country: "US",
  },
};

export const testTours = {
  midniteSummer: {
    name: "Midnite Summer Tour 2025",
    artist: "Midnite",
    startDate: "2025-06-15",
    endDate: "2025-08-20",
    status: "PLANNING",
  },
};
```

### Database Cleanup and Isolation

```typescript
// Test isolation utilities
export class TestDBManager {
  static async seedTestData() {
    // Create consistent test data
  }

  static async cleanupTestData() {
    // Remove all test data
  }

  static async isolateTest() {
    // Create isolated test environment
  }
}
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run db:test:setup
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## Test Coverage Requirements

### Coverage Targets

- **Overall Coverage**: > 80%
- **Critical Paths**: > 95% (auth, financial calculations, multi-tenancy)
- **API Routes**: > 90%
- **React Components**: > 75%
- **Business Logic**: > 95%

### Coverage Reporting

```typescript
// jest.config.js coverage settings
module.exports = {
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/types/**/*",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./src/lib/": {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
```

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Test infrastructure setup (Jest, Playwright, test DB)
- [ ] Authentication and authorization tests
- [ ] Multi-tenancy and data isolation tests
- [ ] Basic CRUD operation tests

### Phase 2: Core Features

- [ ] Venue management test suite
- [ ] Tour and show management tests
- [ ] Financial calculation tests
- [ ] Day sheet generation tests

### Phase 3: Advanced Features

- [ ] AI integration tests (mocked)
- [ ] Marketing website tests
- [ ] Admin CRM system tests
- [ ] API comprehensive test coverage

### Phase 4: Quality Assurance

- [ ] Performance and load testing
- [ ] Security testing suite
- [ ] Cross-browser E2E testing
- [ ] CI/CD integration and automation

### Phase 5: Production Readiness

- [ ] Monitoring and alerting tests
- [ ] Backup and recovery testing
- [ ] Documentation and test maintenance
- [ ] Team training and handoff

This comprehensive test specification ensures TourBrain's reliability, security, and performance across all user scenarios defined in the USER_STORIES.md document.
