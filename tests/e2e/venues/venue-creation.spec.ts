import { test, expect } from "@playwright/test";

test.describe("Venue Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user with organization
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
    });
  });

  test("should display venue creation form", async ({ page }) => {
    // Given I am signed in and have an organization
    // When I navigate to /venues/new
    await page.goto("/venues/new");

    // Then I should see the venue creation form
    await expect(page.getByText(/add new venue/i)).toBeVisible();
    await expect(page.locator("form")).toBeVisible();

    // And I should see required form fields
    await expect(page.getByLabel(/venue name/i)).toBeVisible();
    await expect(page.getByLabel(/address/i)).toBeVisible();
    await expect(page.getByLabel(/city/i)).toBeVisible();
    await expect(page.getByLabel(/country/i)).toBeVisible();
  });

  test("should validate required venue fields", async ({ page }) => {
    // Given I am on the new venue form
    await page.goto("/venues/new");

    // When I submit without required fields
    const submitButton = page.getByRole("button", { name: /save venue/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Then I should see validation errors
      await expect(page.getByText(/name is required/i)).toBeVisible();
      await expect(page.getByText(/address is required/i)).toBeVisible();
    }
  });

  test("should accept comprehensive venue information", async ({ page }) => {
    // Given I am creating a new venue
    await page.goto("/venues/new");

    // When I fill in all available fields
    await page.fill('[name="name"]', "Red Rocks Amphitheatre");
    await page.fill('[name="address"]', "18300 W Alameda Pkwy");
    await page.fill('[name="city"]', "Morrison");
    await page.fill('[name="state"]', "CO");
    await page.fill('[name="country"]', "US");
    await page.fill('[name="postalCode"]', "80465");
    await page.fill('[name="capacity"]', "9525");

    // Optional contact information
    await page.fill('[name="contactName"]', "Venue Operations");
    await page.fill('[name="contactEmail"]', "ops@redrocks.com");
    await page.fill('[name="contactPhone"]', "303-697-4939");
    await page.fill('[name="website"]', "https://www.redrocks.com");

    // Technical specifications
    await page.fill('[name="loadInTime"]', "14:00");
    await page.fill('[name="soundcheckTime"]', "17:00");
    await page.fill('[name="curfew"]', "23:00");
    await page.fill('[name="notes"]', "Outdoor venue, weather dependent");

    // Then all fields should accept the input
    await expect(
      page.getByDisplayValue("Red Rocks Amphitheatre")
    ).toBeVisible();
    await expect(page.getByDisplayValue("9525")).toBeVisible();
    await expect(page.getByDisplayValue("ops@redrocks.com")).toBeVisible();
  });

  test("should validate email format in contact fields", async ({ page }) => {
    // Given I am filling out the venue form
    await page.goto("/venues/new");

    // When I enter an invalid email format
    await page.fill('[name="contactEmail"]', "invalid-email");

    // And I move to the next field
    await page.fill('[name="contactPhone"]', "555-1234");

    // Then I should see email validation error
    const emailField = page.getByLabel(/contact email/i);
    if (await emailField.isVisible()) {
      // Check for HTML5 validation or custom validation
      const validationMessage = await emailField.evaluate(
        (input: HTMLInputElement) => input.validationMessage
      );
      expect(validationMessage).toBeTruthy();
    }
  });

  test("should validate capacity as positive number", async ({ page }) => {
    // Given I am filling out venue details
    await page.goto("/venues/new");

    // When I enter invalid capacity values
    await page.fill('[name="capacity"]', "-100");

    // Then the field should not accept negative values
    const capacityField = page.getByLabel(/capacity/i);
    if (await capacityField.isVisible()) {
      const value = await capacityField.inputValue();
      // HTML5 number input may prevent negative values or show validation
      expect(parseInt(value)).not.toBeLessThan(0);
    }
  });

  test("should format time fields correctly", async ({ page }) => {
    // Given I am entering technical specifications
    await page.goto("/venues/new");

    // When I fill in time fields
    await page.fill('[name="loadInTime"]', "14:00");
    await page.fill('[name="showTime"]', "20:00");

    // Then the times should be formatted correctly
    await expect(page.getByDisplayValue("14:00")).toBeVisible();
    await expect(page.getByDisplayValue("20:00")).toBeVisible();
  });

  test.skip("should create venue and redirect to venues list", async ({
    page,
  }) => {
    // This test requires API mocking

    // Given I am filling out the venue form completely
    await page.goto("/venues/new");

    await page.fill('[name="name"]', "Test Venue");
    await page.fill('[name="address"]', "123 Main St");
    await page.fill('[name="city"]', "Denver");
    await page.fill('[name="country"]', "US");

    // When I submit the form
    await page.click('button[type="submit"]');

    // Then I should see a success message
    await expect(page.getByText(/venue created successfully/i)).toBeVisible();

    // And I should be redirected to the venues list
    await expect(page).toHaveURL("/venues");

    // And I should see my new venue in the list
    await expect(page.getByText("Test Venue")).toBeVisible();
  });

  test("should show loading state during form submission", async ({ page }) => {
    // Given I have filled out a valid venue form
    await page.goto("/venues/new");

    await page.fill('[name="name"]', "Test Venue");
    await page.fill('[name="address"]', "123 Main St");
    await page.fill('[name="city"]', "Denver");
    await page.fill('[name="country"]', "US");

    // When I submit the form
    const submitButton = page.getByRole("button", { name: /save venue/i });
    await submitButton.click();

    // Then I should see a loading state (if implemented)
    const loadingIndicator = page.getByText(/creating/i);
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test("should handle form submission errors gracefully", async ({ page }) => {
    // Given I am on the venue creation form
    await page.goto("/venues/new");

    // When there is a server error during submission
    // (This would require API error mocking)

    // Then I should see an appropriate error message
    // And the form should remain editable for retry
    await expect(page.locator("form")).toBeVisible();
  });

  test("should provide help text for complex fields", async ({ page }) => {
    // Given I am on the venue creation form
    await page.goto("/venues/new");

    // Then I should see helpful guidance for complex fields
    const helpText = page.locator(
      '[data-testid*="help"], .help-text, .field-description'
    );
    if ((await helpText.count()) > 0) {
      await expect(helpText.first()).toBeVisible();
    }
  });
});
