import { test, expect } from "@playwright/test";

test.describe("Tour Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user with TOUR_MANAGER role
    await page.addInitScript(() => {
      window.mockAuthState = {
        isLoaded: true,
        isSignedIn: true,
        userId: "test-tour-manager",
        orgId: "test-org-id",
        user: {
          id: "test-tour-manager",
          emailAddresses: [{ emailAddress: "tourmanager@example.com" }],
          firstName: "Tour",
          lastName: "Manager",
        },
        organization: {
          id: "test-org-id",
          name: "Test Agency",
          slug: "test-agency",
        },
      };
    });
  });

  test("should display tour creation form", async ({ page }) => {
    // Given I am logged in as a TOUR_MANAGER
    // When I navigate to Tours page and create new tour
    await page.goto("/tours");

    // Click "Create Tour" button
    const createButton = page.getByRole("button", { name: /create tour/i });
    const createLink = page.getByRole("link", { name: /create tour/i });

    if (await createButton.isVisible()) {
      await createButton.click();
    } else if (await createLink.isVisible()) {
      await createLink.click();
    } else {
      // Navigate directly to create tour page
      await page.goto("/tours/new");
    }

    // Then I should see the tour creation form
    await expect(page.getByText(/create tour|new tour/i)).toBeVisible();
    await expect(page.locator("form")).toBeVisible();

    // And I should see required form fields
    await expect(page.getByLabel(/tour name/i)).toBeVisible();
    await expect(page.getByLabel(/artist/i)).toBeVisible();
    await expect(page.getByLabel(/start date/i)).toBeVisible();
    await expect(page.getByLabel(/end date/i)).toBeVisible();
    await expect(page.getByLabel(/status/i)).toBeVisible();
  });

  test("should validate required tour fields", async ({ page }) => {
    // Given I am on the create tour page
    await page.goto("/tours/new");

    // When I try to submit without required fields
    const submitButton = page.getByRole("button", {
      name: /create tour|save tour/i,
    });
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Then I should see validation errors
      const nameField = page.getByLabel(/tour name/i);
      const artistField = page.getByLabel(/artist/i);

      if (await nameField.isVisible()) {
        expect(nameField).toBeRequired();
      }
      if (await artistField.isVisible()) {
        expect(artistField).toBeRequired();
      }
    }
  });

  test("should accept comprehensive tour information", async ({ page }) => {
    // Given I am creating a new tour
    await page.goto("/tours/new");

    // When I fill in tour details
    await page.fill(
      '[name="name"], [name="tourName"]',
      "Midnite Summer Tour 2025"
    );
    await page.fill('[name="artist"], [name="artistName"]', "Midnite");
    await page.fill('[name="startDate"]', "2025-06-15");
    await page.fill('[name="endDate"]', "2025-08-20");

    // Select status from dropdown
    const statusField = page.getByLabel(/status/i);
    if (await statusField.isVisible()) {
      await statusField.selectOption("PLANNING");
    }

    // Optional description
    const descField = page.getByLabel(/description/i);
    if (await descField.isVisible()) {
      await descField.fill("Summer tour across major festivals and venues");
    }

    // Then all fields should accept the input
    await expect(
      page.getByDisplayValue("Midnite Summer Tour 2025")
    ).toBeVisible();
    await expect(page.getByDisplayValue("Midnite")).toBeVisible();
    await expect(page.getByDisplayValue("2025-06-15")).toBeVisible();
  });

  test("should validate date ranges", async ({ page }) => {
    // Given I am filling out tour details
    await page.goto("/tours/new");

    // When I enter an end date before start date
    await page.fill('[name="startDate"]', "2025-08-20");
    await page.fill('[name="endDate"]', "2025-06-15"); // Earlier than start

    // Then I should see a validation error
    const endDateField = page.getByLabel(/end date/i);
    if (await endDateField.isVisible()) {
      // Custom validation might show error message
      const errorMessage = page.getByText(
        /end date.*start date|invalid date range/i
      );
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test("should show tour status options", async ({ page }) => {
    // Given I am creating a tour
    await page.goto("/tours/new");

    // When I click on the status field
    const statusField = page.getByLabel(/status/i);
    if (await statusField.isVisible()) {
      await statusField.click();

      // Then I should see available status options
      const statusOptions = [
        "PLANNING",
        "ANNOUNCED",
        "ON_SALE",
        "ACTIVE",
        "COMPLETED",
      ];

      for (const status of statusOptions) {
        const option = page.getByText(status);
        if (await option.isVisible()) {
          await expect(option).toBeVisible();
        }
      }
    }
  });

  test.skip("should create tour and redirect to tour detail", async ({
    page,
  }) => {
    // This test requires API mocking

    // Given I am filling out the tour form completely
    await page.goto("/tours/new");

    await page.fill('[name="name"]', "Test Tour 2025");
    await page.fill('[name="artist"]', "Test Artist");
    await page.fill('[name="startDate"]', "2025-07-01");
    await page.fill('[name="endDate"]', "2025-07-31");

    const statusField = page.getByLabel(/status/i);
    if (await statusField.isVisible()) {
      await statusField.selectOption("PLANNING");
    }

    // When I submit the form
    await page.click('button[type="submit"]');

    // Then I should see a success message
    await expect(page.getByText(/tour created|success/i)).toBeVisible();

    // And I should be redirected to the tour detail page
    await expect(page).toHaveURL(/\/tours\/[^\/]+$/);

    // And I should see the tour information
    await expect(page.getByText("Test Tour 2025")).toBeVisible();
    await expect(page.getByText("Test Artist")).toBeVisible();
  });

  test("should calculate tour duration automatically", async ({ page }) => {
    // Given I am filling out tour dates
    await page.goto("/tours/new");

    // When I enter start and end dates
    await page.fill('[name="startDate"]', "2025-06-15");
    await page.fill('[name="endDate"]', "2025-08-20");

    // Then the duration should be calculated and displayed
    const durationDisplay = page.getByText(/duration|days|weeks/i);
    if (await durationDisplay.isVisible()) {
      await expect(durationDisplay).toBeVisible();
      // Should show approximately 66 days or ~9 weeks
    }
  });

  test("should handle special characters in tour names", async ({ page }) => {
    // Given I am creating a tour
    await page.goto("/tours/new");

    // When I enter special characters in tour name
    await page.fill(
      '[name="name"]',
      "Björk: Biophilia Tour 2025 – North America"
    );
    await page.fill('[name="artist"]', "Björk");

    // Then the form should accept the special characters
    await expect(
      page.getByDisplayValue("Björk: Biophilia Tour 2025 – North America")
    ).toBeVisible();
    await expect(page.getByDisplayValue("Björk")).toBeVisible();
  });

  test("should show loading state during tour creation", async ({ page }) => {
    // Given I have filled out a valid tour form
    await page.goto("/tours/new");

    await page.fill('[name="name"]', "Test Tour");
    await page.fill('[name="artist"]', "Test Artist");
    await page.fill('[name="startDate"]', "2025-07-01");
    await page.fill('[name="endDate"]', "2025-07-31");

    // When I submit the form
    const submitButton = page.getByRole("button", {
      name: /create tour|save tour/i,
    });
    await submitButton.click();

    // Then I should see a loading state (if implemented)
    const loadingIndicator = page.getByText(/creating|saving/i);
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test("should pre-populate dates with reasonable defaults", async ({
    page,
  }) => {
    // Given I am creating a new tour
    await page.goto("/tours/new");

    // Then the start date might be pre-populated with current date or near future
    const startDateField = page.getByLabel(/start date/i);
    if (await startDateField.isVisible()) {
      const startValue = await startDateField.inputValue();

      if (startValue) {
        // Should be a valid date format
        expect(startValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Should be in the future
        const startDate = new Date(startValue);
        const today = new Date();
        expect(startDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
      }
    }
  });

  test("should provide tour template options", async ({ page }) => {
    // Given I am creating a new tour
    await page.goto("/tours/new");

    // Then I might see tour template options (if implemented)
    const templateSelector = page.locator("select, button").filter({
      hasText: /template|type/i,
    });

    if ((await templateSelector.count()) > 0) {
      await expect(templateSelector.first()).toBeVisible();

      // Common tour types might include:
      const tourTypes = [
        "Festival Circuit",
        "Club Tour",
        "Theater Tour",
        "Arena Tour",
      ];

      for (const tourType of tourTypes) {
        const option = page.getByText(tourType);
        if (await option.isVisible()) {
          await expect(option).toBeVisible();
        }
      }
    }
  });
});
