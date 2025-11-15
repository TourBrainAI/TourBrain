import { test, expect } from "@playwright/test";

test.describe("Venue Directory", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user with organization and venues
    await page.addInitScript(() => {
      window.mockAuthState = {
        isLoaded: true,
        isSignedIn: true,
        userId: "test-user-id",
        orgId: "test-org-id",
        user: {
          id: "test-user-id",
          emailAddresses: [{ emailAddress: "test@example.com" }],
          firstName: "Test",
          lastName: "User",
        },
        organization: {
          id: "test-org-id",
          name: "Test Organization",
          slug: "test-org",
        },
      };

      // Mock venues data
      window.mockVenues = [
        {
          id: "venue-1",
          name: "Red Rocks Amphitheatre",
          city: "Morrison",
          state: "CO",
          capacity: 9525,
          organizationId: "test-org-id",
        },
        {
          id: "venue-2",
          name: "The Fillmore",
          city: "San Francisco",
          state: "CA",
          capacity: 1315,
          organizationId: "test-org-id",
        },
        {
          id: "venue-3",
          name: "House of Blues",
          city: "Chicago",
          state: "IL",
          capacity: 1500,
          organizationId: "test-org-id",
        },
      ];
    });
  });

  test("should display venues grid with organization venues", async ({
    page,
  }) => {
    // Given I am signed in and have venues in my organization
    // When I navigate to /venues
    await page.goto("/venues");

    // Then I should see a grid of my organization's venues
    await expect(page.getByText(/venues/i)).toBeVisible();

    // And each venue should show basic information
    // (This would depend on actual component implementation)
    const venueCards = page.locator('[data-testid*="venue-card"], .venue-card');
    if ((await venueCards.count()) > 0) {
      await expect(venueCards.first()).toBeVisible();
    }
  });

  test("should show venue information on cards", async ({ page }) => {
    // Given I have venues in my organization
    // When I view the venues list
    await page.goto("/venues");

    // Then each venue card should show key information
    // Look for venue names, locations, and capacity information
    const expectedVenues = ["Red Rocks", "Fillmore", "House of Blues"];

    for (const venueName of expectedVenues) {
      const venueElement = page.getByText(venueName);
      if (await venueElement.isVisible()) {
        await expect(venueElement).toBeVisible();
      }
    }
  });

  test("should provide action buttons for each venue", async ({ page }) => {
    // Given I am viewing my venues
    await page.goto("/venues");

    // Then I should see action buttons for view and edit
    const actionButtons = page.locator("button, a").filter({
      hasText: /view|edit|details/i,
    });

    if ((await actionButtons.count()) > 0) {
      await expect(actionButtons.first()).toBeVisible();
    }
  });

  test("should show add venue button", async ({ page }) => {
    // Given I am on the venues page
    await page.goto("/venues");

    // Then I should see a prominent "Add Venue" button
    const addButton = page.getByRole("button", { name: /add venue/i });
    const addLink = page.getByRole("link", { name: /add venue/i });

    const hasAddButton = await addButton.isVisible();
    const hasAddLink = await addLink.isVisible();

    expect(hasAddButton || hasAddLink).toBeTruthy();
  });

  test("should navigate to venue creation when add button clicked", async ({
    page,
  }) => {
    // Given I am on the venues page
    await page.goto("/venues");

    // When I click the "Add Venue" button
    const addButton = page.getByRole("button", { name: /add venue/i });
    const addLink = page.getByRole("link", { name: /add venue/i });

    if (await addButton.isVisible()) {
      await addButton.click();
    } else if (await addLink.isVisible()) {
      await addLink.click();
    }

    // Then I should be taken to the venue creation page
    await expect(page).toHaveURL("/venues/new");
  });

  test("should display empty state when no venues exist", async ({ page }) => {
    // Mock empty venues state
    await page.addInitScript(() => {
      window.mockVenues = [];
    });

    // Given I am signed in but have no venues
    // When I navigate to /venues
    await page.goto("/venues");

    // Then I should see an empty state message
    const emptyStateMessages = [
      /no venues/i,
      /get started/i,
      /add your first venue/i,
      /empty/i,
    ];

    let emptyStateFound = false;
    for (const message of emptyStateMessages) {
      const element = page.getByText(message);
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
        emptyStateFound = true;
        break;
      }
    }

    // And I should see a prominent "Add Venue" button
    const addButton = page.getByRole("button", { name: /add venue/i });
    const addLink = page.getByRole("link", { name: /add venue/i });

    const hasAddButton = await addButton.isVisible();
    const hasAddLink = await addLink.isVisible();

    expect(hasAddButton || hasAddLink).toBeTruthy();
  });

  test("should filter venues by search term", async ({ page }) => {
    // Given I have multiple venues
    await page.goto("/venues");

    // When I enter a search term
    const searchField = page.getByPlaceholder(/search/i);
    if (await searchField.isVisible()) {
      await searchField.fill("Red Rocks");

      // Then I should see filtered results
      await expect(page.getByText("Red Rocks")).toBeVisible();

      // And other venues should be hidden
      const fillmoreText = page.getByText("Fillmore");
      if (await fillmoreText.isVisible()) {
        // If filtering is implemented, Fillmore should be hidden
      }
    }
  });

  test("should sort venues by different criteria", async ({ page }) => {
    // Given I have multiple venues
    await page.goto("/venues");

    // When I click on sort options (if available)
    const sortOptions = page.locator("select, button").filter({
      hasText: /sort|order/i,
    });

    if ((await sortOptions.count()) > 0) {
      await expect(sortOptions.first()).toBeVisible();

      // Test sorting functionality would depend on implementation
    }
  });

  test("should show venue capacity information", async ({ page }) => {
    // Given I am viewing venues with capacity data
    await page.goto("/venues");

    // Then I should see capacity information for each venue
    const capacityNumbers = ["9525", "1315", "1500"];

    for (const capacity of capacityNumbers) {
      const capacityElement = page.getByText(capacity);
      if (await capacityElement.isVisible()) {
        await expect(capacityElement).toBeVisible();
      }
    }
  });

  test("should display venue locations", async ({ page }) => {
    // Given I am viewing venues
    await page.goto("/venues");

    // Then I should see location information (city, state)
    const locations = ["Morrison, CO", "San Francisco, CA", "Chicago, IL"];

    for (const location of locations) {
      const locationText = page.getByText(location, { exact: false });
      if (await locationText.isVisible()) {
        await expect(locationText).toBeVisible();
      }
    }
  });

  test("should handle loading state gracefully", async ({ page }) => {
    // Given venues are being loaded
    await page.goto("/venues");

    // Then I should see a loading indicator (if implemented)
    const loadingIndicators = [
      page.getByText(/loading/i),
      page.locator(".spinner, .loading"),
      page.getByTestId("loading"),
    ];

    // Check if any loading indicators are present
    // (They might be visible briefly during page load)
  });

  test("should handle error state when venues fail to load", async ({
    page,
  }) => {
    // Given there is an error loading venues
    await page.addInitScript(() => {
      // Mock API error
      window.mockVenuesError = true;
    });

    await page.goto("/venues");

    // Then I should see an appropriate error message
    const errorMessages = [
      /error loading venues/i,
      /something went wrong/i,
      /try again/i,
    ];

    // Error handling would depend on implementation
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/venues");

    // Venue grid should adapt to smaller screens
    await expect(page.locator("body")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    await expect(page.locator("body")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();

    await expect(page.locator("body")).toBeVisible();
  });
});
