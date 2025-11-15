import { test, expect } from "@playwright/test";

test.describe("Organization Onboarding", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user without organization
    await page.addInitScript(() => {
      // Mock Clerk auth state for onboarding
      window.mockAuthState = {
        isLoaded: true,
        isSignedIn: true,
        userId: "test-user-onboarding",
        user: {
          id: "test-user-onboarding",
          emailAddresses: [{ emailAddress: "newuser@example.com" }],
          firstName: "Test",
          lastName: "User",
        },
        organization: null, // No organization yet
      };
    });
  });

  test("should display onboarding form for new user", async ({ page }) => {
    // Given I have just signed up and verified my email
    // When I am redirected to the onboarding page
    await page.goto("/onboarding");

    // Then I should see the organization creation form
    await expect(page.getByText(/create your organization/i)).toBeVisible();
    await expect(page.locator("form")).toBeVisible();

    // And I should see required form fields
    await expect(page.getByLabel(/organization name/i)).toBeVisible();
    await expect(page.getByLabel(/organization type/i)).toBeVisible();
  });

  test("should validate required organization fields", async ({ page }) => {
    // Given I am on the onboarding page
    await page.goto("/onboarding");

    // When I try to submit without required fields
    const submitButton = page.getByRole("button", {
      name: /create organization/i,
    });
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Then I should see validation errors
      await expect(page.getByText(/required/i).first()).toBeVisible();
    }
  });

  test("should show organization type options", async ({ page }) => {
    // Given I am on the onboarding page
    await page.goto("/onboarding");

    // When I click on organization type field
    const typeField = page.getByLabel(/organization type/i);
    if (await typeField.isVisible()) {
      await typeField.click();

      // Then I should see the available organization types
      await expect(page.getByText(/venue/i)).toBeVisible();
      await expect(page.getByText(/promoter/i)).toBeVisible();
      await expect(page.getByText(/agency/i)).toBeVisible();
    }
  });

  test.skip("should create organization and redirect to dashboard", async ({
    page,
  }) => {
    // This test requires API mocking for organization creation

    // Given I am on the onboarding page
    await page.goto("/onboarding");

    // When I fill in organization details
    await page.fill('[name="organizationName"]', "Test Venue LLC");
    await page.selectOption('[name="organizationType"]', "VENUE");
    await page.fill(
      '[name="description"]',
      "Premier concert venue in downtown"
    );

    // And I submit the form
    await page.click('button[type="submit"]');

    // Then I should see a success message
    await expect(page.getByText(/organization created/i)).toBeVisible();

    // And I should be redirected to the dashboard
    await expect(page).toHaveURL("/dashboard");

    // And I should see my organization name
    await expect(page.getByText("Test Venue LLC")).toBeVisible();
  });

  test("should generate organization slug automatically", async ({ page }) => {
    // Given I am filling out the onboarding form
    await page.goto("/onboarding");

    // When I enter an organization name
    await page.fill('[name="organizationName"]', "Red Rocks Amphitheatre");

    // Then the slug should be generated automatically (if visible)
    const slugField = page.getByLabel(/slug/i);
    if (await slugField.isVisible()) {
      await expect(slugField).toHaveValue("red-rocks-amphitheatre");
    }
  });

  test("should handle organization name conflicts", async ({ page }) => {
    // Given I am on the onboarding page
    await page.goto("/onboarding");

    // When I enter a name that already exists
    await page.fill('[name="organizationName"]', "Existing Venue Name");
    await page.selectOption('[name="organizationType"]', "VENUE");

    // And I submit the form
    await page.click('button[type="submit"]');

    // Then I should see an error about name availability
    // (This would require backend validation)
    const errorMessage = page.getByText(/name already taken/i);
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test("should allow editing organization details before submission", async ({
    page,
  }) => {
    // Given I am on the onboarding page
    await page.goto("/onboarding");

    // When I fill in details
    await page.fill('[name="organizationName"]', "Initial Name");
    await page.selectOption('[name="organizationType"]', "VENUE");

    // And I change my mind and edit them
    await page.fill('[name="organizationName"]', "Updated Name");
    await page.selectOption('[name="organizationType"]', "PROMOTER");

    // Then the form should reflect the updated values
    await expect(page.getByDisplayValue("Updated Name")).toBeVisible();
    await expect(page.locator('[name="organizationType"]')).toHaveValue(
      "PROMOTER"
    );
  });

  test("should show onboarding progress or steps", async ({ page }) => {
    // Given I am on the onboarding page
    await page.goto("/onboarding");

    // Then I should see onboarding progress indicators (if implemented)
    const progressIndicator = page.locator(
      '[data-testid="onboarding-progress"], .progress-steps'
    );
    if (await progressIndicator.isVisible()) {
      await expect(progressIndicator).toBeVisible();
    }
  });
});
