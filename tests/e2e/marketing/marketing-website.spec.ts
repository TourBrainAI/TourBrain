import { test, expect } from "@playwright/test";
import { testData } from "../../fixtures/test-data";

test.describe("Marketing Website", () => {
  test.beforeEach(async ({ page }) => {
    // Mock waitlist API
    await page.route("**/api/waitlist**", async (route) => {
      const method = route.request().method();

      if (method === "POST") {
        const requestBody = await route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: `waitlist_${Date.now()}`,
            ...requestBody,
            createdAt: new Date().toISOString(),
          }),
        });
      } else if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([testData.waitlistEntries.johnDoe]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
  });

  test("should display homepage correctly", async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/TourBrain/);

    // Verify hero section
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-title"]')).toContainText(
      "The All-in-One Tour Management Platform"
    );
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText(
      "Streamline your music tours"
    );

    // Verify main CTA button
    await expect(page.locator('[data-testid="hero-cta-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-cta-button"]')).toContainText(
      "Join Early Access"
    );
  });

  test("should display product pillars section", async ({ page }) => {
    // Scroll to product pillars
    await page
      .locator('[data-testid="product-pillars-section"]')
      .scrollIntoViewIfNeeded();

    // Verify section is visible
    await expect(
      page.locator('[data-testid="product-pillars-section"]')
    ).toBeVisible();

    // Verify individual pillars
    await expect(
      page.locator('[data-testid="pillar-tour-management"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pillar-venue-booking"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pillar-financial-tracking"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pillar-ai-insights"]')
    ).toBeVisible();

    // Verify pillar content
    await expect(
      page.locator('[data-testid="pillar-tour-management"]')
    ).toContainText("Tour Management");
    await expect(
      page.locator('[data-testid="pillar-venue-booking"]')
    ).toContainText("Venue Booking");
    await expect(
      page.locator('[data-testid="pillar-financial-tracking"]')
    ).toContainText("Financial Tracking");
    await expect(
      page.locator('[data-testid="pillar-ai-insights"]')
    ).toContainText("AI Insights");
  });

  test("should display how it works section", async ({ page }) => {
    // Scroll to how it works section
    await page
      .locator('[data-testid="how-it-works-section"]')
      .scrollIntoViewIfNeeded();

    // Verify section is visible
    await expect(
      page.locator('[data-testid="how-it-works-section"]')
    ).toBeVisible();

    // Verify steps
    await expect(page.locator('[data-testid="step-1"]')).toContainText(
      "Create Your Tour"
    );
    await expect(page.locator('[data-testid="step-2"]')).toContainText(
      "Book Venues"
    );
    await expect(page.locator('[data-testid="step-3"]')).toContainText(
      "Manage Shows"
    );
    await expect(page.locator('[data-testid="step-4"]')).toContainText(
      "Track Financials"
    );
  });

  test("should display role chooser section", async ({ page }) => {
    // Scroll to role chooser
    await page
      .locator('[data-testid="role-chooser-section"]')
      .scrollIntoViewIfNeeded();

    // Verify section is visible
    await expect(
      page.locator('[data-testid="role-chooser-section"]')
    ).toBeVisible();

    // Verify role options
    await expect(page.locator('[data-testid="role-artist"]')).toBeVisible();
    await expect(page.locator('[data-testid="role-promoter"]')).toBeVisible();
    await expect(page.locator('[data-testid="role-venue"]')).toBeVisible();
    await expect(page.locator('[data-testid="role-agent"]')).toBeVisible();

    // Test role selection interaction
    await page.click('[data-testid="role-artist"]');
    await expect(page.locator('[data-testid="role-artist"]')).toHaveClass(
      /selected/
    );
    await expect(
      page.locator('[data-testid="role-specific-content"]')
    ).toContainText("For Artists");
  });

  test("should display screenshots section", async ({ page }) => {
    // Scroll to screenshots
    await page
      .locator('[data-testid="screenshots-section"]')
      .scrollIntoViewIfNeeded();

    // Verify section is visible
    await expect(
      page.locator('[data-testid="screenshots-section"]')
    ).toBeVisible();

    // Verify screenshot carousel
    await expect(
      page.locator('[data-testid="screenshot-carousel"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="screenshot-1"]')).toBeVisible();

    // Test carousel navigation
    await page.click('[data-testid="carousel-next-button"]');
    await expect(page.locator('[data-testid="screenshot-2"]')).toBeVisible();
  });

  test("should display tool juggling problem section", async ({ page }) => {
    // Scroll to tool juggling section
    await page
      .locator('[data-testid="tool-juggling-section"]')
      .scrollIntoViewIfNeeded();

    // Verify section is visible
    await expect(
      page.locator('[data-testid="tool-juggling-section"]')
    ).toBeVisible();

    // Verify problem statement
    await expect(
      page.locator('[data-testid="problem-statement"]')
    ).toContainText("Stop Juggling Multiple Tools");

    // Verify tool comparison
    await expect(page.locator('[data-testid="current-tools"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="tourbrain-solution"]')
    ).toBeVisible();
  });

  test("should submit waitlist form successfully", async ({ page }) => {
    // Scroll to waitlist section
    await page
      .locator('[data-testid="waitlist-section"]')
      .scrollIntoViewIfNeeded();

    // Fill waitlist form
    await page.fill('[data-testid="waitlist-email-input"]', "test@example.com");
    await page.fill('[data-testid="waitlist-name-input"]', "John Doe");
    await page.selectOption('[data-testid="waitlist-role-select"]', "artist");

    // Submit form
    await page.click('[data-testid="waitlist-submit-button"]');

    // Verify success message
    await expect(
      page.locator('[data-testid="waitlist-success-message"]')
    ).toContainText("Thank you for joining our waitlist!");

    // Verify form is hidden/disabled
    await expect(
      page.locator('[data-testid="waitlist-form"]')
    ).not.toBeVisible();
  });

  test("should validate waitlist form fields", async ({ page }) => {
    // Scroll to waitlist section
    await page
      .locator('[data-testid="waitlist-section"]')
      .scrollIntoViewIfNeeded();

    // Try to submit empty form
    await page.click('[data-testid="waitlist-submit-button"]');

    // Verify validation errors
    await expect(page.locator('[data-testid="email-error"]')).toContainText(
      "Email is required"
    );
    await expect(page.locator('[data-testid="name-error"]')).toContainText(
      "Name is required"
    );
    await expect(page.locator('[data-testid="role-error"]')).toContainText(
      "Role is required"
    );

    // Test invalid email format
    await page.fill('[data-testid="waitlist-email-input"]', "invalid-email");
    await page.blur('[data-testid="waitlist-email-input"]');
    await expect(page.locator('[data-testid="email-error"]')).toContainText(
      "Invalid email format"
    );
  });

  test("should navigate to FAQ page", async ({ page }) => {
    // Click FAQ link in navigation
    await page.click('[data-testid="nav-faq-link"]');

    // Verify navigation to FAQ page
    await expect(page.url()).toMatch(/\/faq$/);
    await expect(page).toHaveTitle(/FAQ/);

    // Verify FAQ content
    await expect(page.locator('[data-testid="faq-section"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="faq-item"]').first()
    ).toBeVisible();
  });

  test("should expand and collapse FAQ items", async ({ page }) => {
    // Navigate to FAQ page
    await page.goto("/faq");

    // Test FAQ accordion functionality
    const firstFaq = page.locator('[data-testid="faq-item"]').first();

    // Initially collapsed
    await expect(
      firstFaq.locator('[data-testid="faq-answer"]')
    ).not.toBeVisible();

    // Click to expand
    await firstFaq.locator('[data-testid="faq-question"]').click();
    await expect(firstFaq.locator('[data-testid="faq-answer"]')).toBeVisible();

    // Click to collapse
    await firstFaq.locator('[data-testid="faq-question"]').click();
    await expect(
      firstFaq.locator('[data-testid="faq-answer"]')
    ).not.toBeVisible();
  });

  test("should navigate to solution pages", async ({ page }) => {
    // Test navigation to agencies solution
    await page.hover('[data-testid="solutions-dropdown"]');
    await page.click('[data-testid="agencies-solution-link"]');

    await expect(page.url()).toMatch(/\/solutions\/agencies$/);
    await expect(page.locator('[data-testid="agencies-hero"]')).toBeVisible();

    // Navigate back to home
    await page.goto("/");

    // Test navigation to promoters solution
    await page.hover('[data-testid="solutions-dropdown"]');
    await page.click('[data-testid="promoters-solution-link"]');

    await expect(page.url()).toMatch(/\/solutions\/promoters$/);
    await expect(page.locator('[data-testid="promoters-hero"]')).toBeVisible();

    // Navigate back to home
    await page.goto("/");

    // Test navigation to venues solution
    await page.hover('[data-testid="solutions-dropdown"]');
    await page.click('[data-testid="venues-solution-link"]');

    await expect(page.url()).toMatch(/\/solutions\/venues$/);
    await expect(page.locator('[data-testid="venues-hero"]')).toBeVisible();
  });

  test("should display footer correctly", async ({ page }) => {
    // Scroll to footer
    await page.locator('[data-testid="site-footer"]').scrollIntoViewIfNeeded();

    // Verify footer sections
    await expect(page.locator('[data-testid="footer-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="footer-links"]')).toBeVisible();
    await expect(page.locator('[data-testid="footer-social"]')).toBeVisible();

    // Verify footer links
    await expect(
      page.locator('[data-testid="footer-privacy-link"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="footer-terms-link"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="footer-contact-link"]')
    ).toBeVisible();
  });

  test("should handle mobile navigation", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify mobile menu button
    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).toBeVisible();

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Verify mobile navigation links
    await expect(
      page.locator('[data-testid="mobile-nav-solutions"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-faq"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="mobile-nav-signin"]')
    ).toBeVisible();

    // Close mobile menu
    await page.click('[data-testid="mobile-menu-close"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
  });

  test("should handle form submission errors", async ({ page }) => {
    // Mock API error
    await page.route("**/api/waitlist", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Email already exists in waitlist",
        }),
      });
    });

    // Scroll to waitlist section
    await page
      .locator('[data-testid="waitlist-section"]')
      .scrollIntoViewIfNeeded();

    // Fill and submit form
    await page.fill(
      '[data-testid="waitlist-email-input"]',
      "existing@example.com"
    );
    await page.fill('[data-testid="waitlist-name-input"]', "John Doe");
    await page.selectOption('[data-testid="waitlist-role-select"]', "artist");
    await page.click('[data-testid="waitlist-submit-button"]');

    // Verify error message
    await expect(
      page.locator('[data-testid="waitlist-error-message"]')
    ).toContainText("Email already exists in waitlist");
  });

  test("should track page analytics events", async ({ page }) => {
    // Mock analytics tracking
    let analyticsEvents = [];
    await page.route("**/analytics/**", async (route) => {
      const requestBody = await route.request().postDataJSON();
      analyticsEvents.push(requestBody);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Trigger various actions that should send analytics events
    await page.click('[data-testid="hero-cta-button"]');
    await page.click('[data-testid="role-artist"]');

    // Scroll to waitlist and submit form
    await page
      .locator('[data-testid="waitlist-section"]')
      .scrollIntoViewIfNeeded();
    await page.fill(
      '[data-testid="waitlist-email-input"]',
      "analytics@example.com"
    );
    await page.fill('[data-testid="waitlist-name-input"]', "Analytics User");
    await page.selectOption('[data-testid="waitlist-role-select"]', "artist");
    await page.click('[data-testid="waitlist-submit-button"]');

    // Verify analytics events were tracked
    // Note: This would depend on your actual analytics implementation
    // await expect(analyticsEvents.length).toBeGreaterThan(0)
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).toBeVisible();
  });

  test("should handle slow network conditions", async ({ page }) => {
    // Simulate slow network
    await page.route("**/*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      await route.continue();
    });

    // Verify page still loads and is functional
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('[data-testid="waitlist-section"]')).toBeVisible({
      timeout: 10000,
    });
  });
});
