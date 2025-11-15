import { test, expect } from "@playwright/test";

test.describe("User Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean state
    await page.context().clearCookies();
  });

  test("should redirect unauthenticated user to sign-in", async ({ page }) => {
    // Given I am not signed in
    // When I try to visit a protected route
    await page.goto("/dashboard");

    // Then I should be redirected to the sign-in page
    await expect(page).toHaveURL(/.*sign-in/);

    // And I should see the sign-in form
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByText(/sign in/i)).toBeVisible();
  });

  test("should redirect unauthenticated user from venues page", async ({
    page,
  }) => {
    // Given I am not signed in
    // When I try to visit /venues
    await page.goto("/venues");

    // Then I should be redirected to the sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test("should redirect unauthenticated user from tours page", async ({
    page,
  }) => {
    // Given I am not signed in
    // When I try to visit /tours
    await page.goto("/tours");

    // Then I should be redirected to the sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test("should allow access to marketing pages without authentication", async ({
    page,
  }) => {
    // Given I am not signed in
    // When I visit the marketing homepage
    await page.goto("/");

    // Then I should see the marketing content
    await expect(page).toHaveURL("/");
    await expect(page.getByText(/TourBrain/i)).toBeVisible();

    // And I should be able to navigate to other marketing pages
    await page.goto("/solutions/venues");
    await expect(page).toHaveURL("/solutions/venues");

    await page.goto("/faq");
    await expect(page).toHaveURL("/faq");
  });

  // Note: Clerk authentication testing would require test environment setup
  // with Clerk test keys and mock authentication flows
  test.skip("should authenticate user with valid credentials", async ({
    page,
  }) => {
    // This test would require Clerk test environment setup
    // Given I have valid credentials
    // When I visit the sign-in page
    await page.goto("/sign-in");

    // And I enter my credentials
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "testpassword");

    // And I submit the form
    await page.click('button[type="submit"]');

    // Then I should be redirected to the dashboard
    await expect(page).toHaveURL("/dashboard");

    // And I should see authenticated content
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test.skip("should show error for invalid credentials", async ({ page }) => {
    // This test would require Clerk test environment setup
    // Given I have invalid credentials
    // When I visit the sign-in page
    await page.goto("/sign-in");

    // And I enter invalid credentials
    await page.fill('[name="email"]', "invalid@example.com");
    await page.fill('[name="password"]', "wrongpassword");

    // And I submit the form
    await page.click('button[type="submit"]');

    // Then I should see an error message
    await expect(page.getByText(/invalid/i)).toBeVisible();

    // And I should remain on the sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });
});
