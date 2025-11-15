import { test, expect } from "@playwright/test";
import { testData } from "../../fixtures/test-data";

test.describe("Show Management", () => {
  let organizationId: string;
  let tourId: string;
  let venueId: string;
  let artistId: string;

  test.beforeEach(async ({ page }) => {
    // Set up test organization and dependencies
    organizationId = testData.organizations.acmeEntertainment.id;
    tourId = testData.tours.northAmericanTour.id;
    venueId = testData.venues.madisonSquareGarden.id;
    artistId = testData.artists.johnDoe.id;

    // Mock authentication
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: testData.users.johnDoe,
          organizationId,
        }),
      });
    });

    // Mock shows API
    await page.route("**/api/shows**", async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (method === "GET" && url.includes(`/api/shows?tourId=${tourId}`)) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([testData.shows.madSquareGardenShow]),
        });
      } else if (method === "POST") {
        const requestBody = await route.request().postDataJSON();
        const newShow = {
          id: `show_${Date.now()}`,
          ...requestBody,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newShow),
        });
      } else {
        await route.continue();
      }
    });

    // Mock venues API
    await page.route("**/api/venues**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([testData.venues.madisonSquareGarden]),
      });
    });

    // Mock tours API
    await page.route("**/api/tours**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([testData.tours.northAmericanTour]),
      });
    });

    await page.goto(`/app/tours/${tourId}/shows`);
  });

  test("should display show management interface", async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Show Management/);

    // Verify shows list header
    await expect(page.locator("h1")).toContainText("Shows");

    // Verify add show button
    await expect(page.locator('[data-testid="add-show-button"]')).toBeVisible();

    // Verify shows list
    await expect(page.locator('[data-testid="shows-list"]')).toBeVisible();
  });

  test("should create new show with valid data", async ({ page }) => {
    // Click add show button
    await page.click('[data-testid="add-show-button"]');

    // Verify show creation form appears
    await expect(page.locator('[data-testid="show-form"]')).toBeVisible();

    // Fill in show details
    await page.selectOption('[data-testid="venue-select"]', venueId);
    await page.fill('[data-testid="show-date-input"]', "2024-06-15");
    await page.fill('[data-testid="show-time-input"]', "20:00");
    await page.selectOption('[data-testid="show-status-select"]', "confirmed");

    // Fill in deal information
    await page.fill('[data-testid="guarantee-input"]', "50000");
    await page.fill('[data-testid="merchandise-split-input"]', "85");
    await page.fill('[data-testid="production-costs-input"]', "15000");

    // Submit form
    await page.click('[data-testid="submit-show-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Show created successfully"
    );

    // Verify redirect to shows list
    await expect(page.url()).toMatch(/\/tours\/.*\/shows$/);
  });

  test("should validate required fields", async ({ page }) => {
    // Click add show button
    await page.click('[data-testid="add-show-button"]');

    // Try to submit empty form
    await page.click('[data-testid="submit-show-button"]');

    // Verify validation errors
    await expect(page.locator('[data-testid="venue-error"]')).toContainText(
      "Venue is required"
    );
    await expect(page.locator('[data-testid="date-error"]')).toContainText(
      "Show date is required"
    );
    await expect(page.locator('[data-testid="time-error"]')).toContainText(
      "Show time is required"
    );
    await expect(page.locator('[data-testid="guarantee-error"]')).toContainText(
      "Guarantee amount is required"
    );
  });

  test("should validate date constraints", async ({ page }) => {
    // Click add show button
    await page.click('[data-testid="add-show-button"]');

    // Fill in past date
    await page.fill('[data-testid="show-date-input"]', "2020-01-01");
    await page.blur('[data-testid="show-date-input"]');

    // Verify error message
    await expect(page.locator('[data-testid="date-error"]')).toContainText(
      "Show date cannot be in the past"
    );

    // Fill in valid future date
    await page.fill('[data-testid="show-date-input"]', "2024-12-31");
    await page.blur('[data-testid="show-date-input"]');

    // Verify error is cleared
    await expect(page.locator('[data-testid="date-error"]')).not.toBeVisible();
  });

  test("should validate financial data formats", async ({ page }) => {
    // Click add show button
    await page.click('[data-testid="add-show-button"]');

    // Test invalid guarantee amount
    await page.fill('[data-testid="guarantee-input"]', "invalid");
    await page.blur('[data-testid="guarantee-input"]');
    await expect(page.locator('[data-testid="guarantee-error"]')).toContainText(
      "Must be a valid number"
    );

    // Test negative guarantee
    await page.fill('[data-testid="guarantee-input"]', "-1000");
    await page.blur('[data-testid="guarantee-input"]');
    await expect(page.locator('[data-testid="guarantee-error"]')).toContainText(
      "Must be a positive number"
    );

    // Test invalid merchandise split
    await page.fill('[data-testid="merchandise-split-input"]', "150");
    await page.blur('[data-testid="merchandise-split-input"]');
    await expect(
      page.locator('[data-testid="merchandise-split-error"]')
    ).toContainText("Must be between 0 and 100");
  });

  test("should update show status", async ({ page }) => {
    // Wait for shows to load
    await page.waitForSelector('[data-testid="show-item"]');

    // Click on first show
    await page.click('[data-testid="show-item"]:first-child');

    // Verify show details page
    await expect(page.locator('[data-testid="show-details"]')).toBeVisible();

    // Change status
    await page.selectOption('[data-testid="status-select"]', "on_sale");
    await page.click('[data-testid="update-status-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Show status updated"
    );

    // Verify status badge updated
    await expect(page.locator('[data-testid="status-badge"]')).toContainText(
      "On Sale"
    );
  });

  test("should handle show logistics", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-item"]:first-child');

    // Navigate to logistics tab
    await page.click('[data-testid="logistics-tab"]');

    // Fill in logistics information
    await page.fill('[data-testid="load-in-time-input"]', "14:00");
    await page.fill('[data-testid="soundcheck-time-input"]', "17:00");
    await page.fill('[data-testid="doors-time-input"]', "19:00");
    await page.fill('[data-testid="show-time-input"]', "20:00");
    await page.fill('[data-testid="curfew-time-input"]', "23:00");

    // Add production notes
    await page.fill(
      '[data-testid="production-notes-textarea"]',
      "Pyrotechnics cleared with venue. Special lighting rig required."
    );

    // Save logistics
    await page.click('[data-testid="save-logistics-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Logistics updated successfully"
    );
  });

  test("should manage show crew assignments", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-item"]:first-child');

    // Navigate to crew tab
    await page.click('[data-testid="crew-tab"]');

    // Add crew member
    await page.click('[data-testid="add-crew-member-button"]');

    // Fill crew member details
    await page.fill('[data-testid="crew-name-input"]', "Mike Johnson");
    await page.selectOption(
      '[data-testid="crew-role-select"]',
      "sound_engineer"
    );
    await page.fill('[data-testid="crew-rate-input"]', "500");

    // Save crew assignment
    await page.click('[data-testid="save-crew-assignment-button"]');

    // Verify crew member appears in list
    await expect(page.locator('[data-testid="crew-list"]')).toContainText(
      "Mike Johnson"
    );
    await expect(page.locator('[data-testid="crew-list"]')).toContainText(
      "Sound Engineer"
    );
  });

  test("should calculate show financials", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-item"]:first-child');

    // Navigate to financials tab
    await page.click('[data-testid="financials-tab"]');

    // Verify financial calculations
    await expect(page.locator('[data-testid="gross-revenue"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="production-costs"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="net-profit"]')).toBeVisible();

    // Update production costs
    await page.fill('[data-testid="production-costs-input"]', "18000");
    await page.click('[data-testid="recalculate-button"]');

    // Verify calculations update
    await expect(page.locator('[data-testid="net-profit"]')).not.toContainText(
      "$32,000"
    );
  });

  test("should handle show cancellation", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-item"]:first-child');

    // Click cancel show button
    await page.click('[data-testid="cancel-show-button"]');

    // Verify confirmation dialog
    await expect(
      page.locator('[data-testid="confirmation-dialog"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="confirmation-message"]')
    ).toContainText("Are you sure you want to cancel this show?");

    // Add cancellation reason
    await page.fill(
      '[data-testid="cancellation-reason-textarea"]',
      "Artist illness - doctor advised rest"
    );

    // Confirm cancellation
    await page.click('[data-testid="confirm-cancel-button"]');

    // Verify show status updated
    await expect(page.locator('[data-testid="status-badge"]')).toContainText(
      "Cancelled"
    );

    // Verify cancellation reason displayed
    await expect(
      page.locator('[data-testid="cancellation-reason"]')
    ).toContainText("Artist illness - doctor advised rest");
  });

  test("should export show details", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-item"]:first-child');

    // Setup download promise
    const downloadPromise = page.waitForEvent("download");

    // Click export button
    await page.click('[data-testid="export-show-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/show-details-.*\.pdf/);
  });

  test("should handle show duplication", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-item"]:first-child');

    // Click duplicate show button
    await page.click('[data-testid="duplicate-show-button"]');

    // Verify duplication form with pre-filled data
    await expect(page.locator('[data-testid="show-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="venue-select"]')).toHaveValue(
      venueId
    );
    await expect(page.locator('[data-testid="guarantee-input"]')).toHaveValue(
      "50000"
    );

    // Update date for duplicate
    await page.fill('[data-testid="show-date-input"]', "2024-06-16");

    // Submit duplicate
    await page.click('[data-testid="submit-show-button"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Show duplicated successfully"
    );
  });

  test("should filter and search shows", async ({ page }) => {
    // Wait for shows to load
    await page.waitForSelector('[data-testid="shows-list"]');

    // Test status filter
    await page.selectOption('[data-testid="status-filter"]', "confirmed");
    await expect(page.locator('[data-testid="show-item"]')).toHaveCount(1);

    // Test venue search
    await page.fill('[data-testid="venue-search"]', "Madison");
    await expect(page.locator('[data-testid="show-item"]')).toContainText(
      "Madison Square Garden"
    );

    // Test date range filter
    await page.fill('[data-testid="date-from"]', "2024-06-01");
    await page.fill('[data-testid="date-to"]', "2024-06-30");
    await page.click('[data-testid="apply-filters-button"]');

    // Verify filtered results
    await expect(page.locator('[data-testid="show-item"]')).toHaveCount(1);
  });
});
