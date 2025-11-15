import { test, expect } from "@playwright/test";
import { testData } from "../../fixtures/test-data";

test.describe("Financial Tracking & Day Sheet Generation", () => {
  let organizationId: string;
  let tourId: string;

  test.beforeEach(async ({ page }) => {
    organizationId = testData.organizations.acmeEntertainment.id;
    tourId = testData.tours.northAmericanTour.id;

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

    // Mock tours API
    await page.route("**/api/tours**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([testData.tours.northAmericanTour]),
      });
    });

    // Mock shows API with financial data
    await page.route("**/api/shows**", async (route) => {
      const showsWithFinancials = [
        {
          ...testData.shows.madSquareGardenShow,
          guarantee: 50000,
          productionCosts: 15000,
          merchandiseRevenue: 8000,
          merchandiseSplit: 85,
          netProfit: 41800,
        },
      ];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(showsWithFinancials),
      });
    });

    // Mock OpenAI API for day sheet generation
    await page.route("**/api/openai/daysheet**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          daysheet: {
            title: "Day Sheet - Madison Square Garden",
            date: "2024-06-15",
            venue: "Madison Square Garden",
            schedule: [
              {
                time: "14:00",
                activity: "Load In",
                notes: "Crew call at venue loading dock",
              },
              {
                time: "17:00",
                activity: "Sound Check",
                notes: "Full band rehearsal",
              },
              {
                time: "19:00",
                activity: "Doors Open",
                notes: "Security and ushers in position",
              },
              {
                time: "20:00",
                activity: "Show Time",
                notes: "Artist takes stage",
              },
              {
                time: "23:00",
                activity: "Curfew/Load Out",
                notes: "Venue curfew enforced",
              },
            ],
            logistics: {
              loadInTime: "14:00",
              soundcheckTime: "17:00",
              doorsTime: "19:00",
              showTime: "20:00",
              curfewTime: "23:00",
            },
            crew: [
              {
                role: "Production Manager",
                name: "Sarah Johnson",
                contact: "+1-555-0123",
              },
              {
                role: "Sound Engineer",
                name: "Mike Davis",
                contact: "+1-555-0124",
              },
            ],
            notes: "Pyrotechnics approved. Special lighting rig installed.",
          },
        }),
      });
    });

    await page.goto(`/app/tours/${tourId}/financials`);
  });

  test("should display financial dashboard", async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Financial Dashboard/);

    // Verify main sections
    await expect(page.locator('[data-testid="tour-overview"]')).toBeVisible();
    await expect(page.locator('[data-testid="show-breakdown"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="expense-tracking"]')
    ).toBeVisible();
  });

  test("should show tour financial overview", async ({ page }) => {
    // Verify tour totals
    await expect(page.locator('[data-testid="total-revenue"]')).toContainText(
      "$58,000"
    );
    await expect(page.locator('[data-testid="total-costs"]')).toContainText(
      "$15,000"
    );
    await expect(page.locator('[data-testid="net-profit"]')).toContainText(
      "$41,800"
    );
    await expect(page.locator('[data-testid="profit-margin"]')).toContainText(
      "72.1%"
    );

    // Verify revenue breakdown
    await expect(
      page.locator('[data-testid="guarantee-revenue"]')
    ).toContainText("$50,000");
    await expect(
      page.locator('[data-testid="merchandise-revenue"]')
    ).toContainText("$6,800");
  });

  test("should display show-by-show breakdown", async ({ page }) => {
    // Verify show financial cards
    const showCard = page
      .locator('[data-testid="show-financial-card"]')
      .first();

    await expect(showCard.locator('[data-testid="venue-name"]')).toContainText(
      "Madison Square Garden"
    );
    await expect(showCard.locator('[data-testid="show-date"]')).toContainText(
      "June 15, 2024"
    );
    await expect(
      showCard.locator('[data-testid="guarantee-amount"]')
    ).toContainText("$50,000");
    await expect(
      showCard.locator('[data-testid="production-costs"]')
    ).toContainText("$15,000");
    await expect(showCard.locator('[data-testid="show-profit"]')).toContainText(
      "$41,800"
    );
  });

  test("should track and categorize expenses", async ({ page }) => {
    // Navigate to expense tracking
    await page.click('[data-testid="expense-tracking-tab"]');

    // Add new expense
    await page.click('[data-testid="add-expense-button"]');

    // Fill expense form
    await page.selectOption(
      '[data-testid="expense-category"]',
      "transportation"
    );
    await page.fill(
      '[data-testid="expense-description"]',
      "Tour bus rental - Week 1"
    );
    await page.fill('[data-testid="expense-amount"]', "2500");
    await page.fill('[data-testid="expense-date"]', "2024-06-10");

    // Submit expense
    await page.click('[data-testid="save-expense-button"]');

    // Verify expense appears in list
    await expect(page.locator('[data-testid="expense-list"]')).toContainText(
      "Tour bus rental - Week 1"
    );
    await expect(page.locator('[data-testid="expense-list"]')).toContainText(
      "$2,500"
    );
  });

  test("should generate expense reports", async ({ page }) => {
    // Navigate to reports
    await page.click('[data-testid="reports-tab"]');

    // Select date range
    await page.fill('[data-testid="report-start-date"]', "2024-06-01");
    await page.fill('[data-testid="report-end-date"]', "2024-06-30");

    // Generate report
    await page.click('[data-testid="generate-report-button"]');

    // Verify report sections
    await expect(page.locator('[data-testid="revenue-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="expense-summary"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="profit-loss-chart"]')
    ).toBeVisible();

    // Verify expense categories
    await expect(
      page.locator('[data-testid="transportation-expenses"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="production-expenses"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="marketing-expenses"]')
    ).toBeVisible();
  });

  test("should export financial data", async ({ page }) => {
    // Setup download promise
    const downloadPromise = page.waitForEvent("download");

    // Export to Excel
    await page.click('[data-testid="export-excel-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/tour-financials-.*\.xlsx/);
  });

  test("should generate AI-powered day sheets", async ({ page }) => {
    // Navigate to day sheet generation
    await page.click('[data-testid="day-sheet-tab"]');

    // Select show for day sheet
    await page.selectOption(
      '[data-testid="show-select"]',
      testData.shows.madSquareGardenShow.id
    );

    // Generate day sheet
    await page.click('[data-testid="generate-daysheet-button"]');

    // Verify loading state
    await expect(
      page.locator('[data-testid="generating-message"]')
    ).toContainText("Generating day sheet with AI...");

    // Wait for generation to complete
    await page.waitForSelector('[data-testid="daysheet-content"]', {
      timeout: 10000,
    });

    // Verify day sheet sections
    await expect(page.locator('[data-testid="daysheet-title"]')).toContainText(
      "Day Sheet - Madison Square Garden"
    );
    await expect(page.locator('[data-testid="daysheet-date"]')).toContainText(
      "June 15, 2024"
    );
    await expect(
      page.locator('[data-testid="daysheet-schedule"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="daysheet-logistics"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="daysheet-crew"]')).toBeVisible();
  });

  test("should customize day sheet templates", async ({ page }) => {
    // Navigate to day sheet generation
    await page.click('[data-testid="day-sheet-tab"]');

    // Open template customization
    await page.click('[data-testid="customize-template-button"]');

    // Verify template options
    await expect(page.locator('[data-testid="template-modal"]')).toBeVisible();

    // Select custom template
    await page.selectOption('[data-testid="template-select"]', "detailed");

    // Add custom fields
    await page.click('[data-testid="add-custom-field-button"]');
    await page.fill('[data-testid="field-name-input"]', "Catering Notes");
    await page.selectOption('[data-testid="field-type-select"]', "textarea");

    // Save template
    await page.click('[data-testid="save-template-button"]');

    // Generate day sheet with custom template
    await page.selectOption(
      '[data-testid="show-select"]',
      testData.shows.madSquareGardenShow.id
    );
    await page.click('[data-testid="generate-daysheet-button"]');

    // Verify custom field appears
    await page.waitForSelector('[data-testid="daysheet-content"]');
    await expect(
      page.locator('[data-testid="catering-notes-field"]')
    ).toBeVisible();
  });

  test("should export day sheet as PDF", async ({ page }) => {
    // Navigate to day sheet generation
    await page.click('[data-testid="day-sheet-tab"]');

    // Generate day sheet first
    await page.selectOption(
      '[data-testid="show-select"]',
      testData.shows.madSquareGardenShow.id
    );
    await page.click('[data-testid="generate-daysheet-button"]');
    await page.waitForSelector('[data-testid="daysheet-content"]');

    // Setup download promise
    const downloadPromise = page.waitForEvent("download");

    // Export as PDF
    await page.click('[data-testid="export-pdf-button"]');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/daysheet-.*\.pdf/);
  });

  test("should calculate merchandise splits correctly", async ({ page }) => {
    // Navigate to show details
    await page.click('[data-testid="show-financial-card"]');

    // Verify merchandise calculations
    await expect(
      page.locator('[data-testid="merchandise-gross"]')
    ).toContainText("$8,000");
    await expect(
      page.locator('[data-testid="merchandise-split"]')
    ).toContainText("85%");
    await expect(page.locator('[data-testid="artist-share"]')).toContainText(
      "$6,800"
    );
    await expect(page.locator('[data-testid="venue-share"]')).toContainText(
      "$1,200"
    );

    // Update merchandise revenue
    await page.fill('[data-testid="merchandise-revenue-input"]', "10000");
    await page.click('[data-testid="recalculate-button"]');

    // Verify updated calculations
    await expect(page.locator('[data-testid="artist-share"]')).toContainText(
      "$8,500"
    );
    await expect(page.locator('[data-testid="venue-share"]')).toContainText(
      "$1,500"
    );
  });

  test("should track production costs by category", async ({ page }) => {
    // Navigate to expense tracking
    await page.click('[data-testid="expense-tracking-tab"]');

    // Add multiple production expenses
    const expenses = [
      { category: "crew", description: "Local crew hire", amount: "3000" },
      {
        category: "equipment",
        description: "Additional lighting rental",
        amount: "2500",
      },
      {
        category: "catering",
        description: "Artist and crew catering",
        amount: "800",
      },
    ];

    for (const expense of expenses) {
      await page.click('[data-testid="add-expense-button"]');
      await page.selectOption(
        '[data-testid="expense-category"]',
        expense.category
      );
      await page.fill(
        '[data-testid="expense-description"]',
        expense.description
      );
      await page.fill('[data-testid="expense-amount"]', expense.amount);
      await page.fill('[data-testid="expense-date"]', "2024-06-15");
      await page.click('[data-testid="save-expense-button"]');
    }

    // Verify category totals
    await expect(page.locator('[data-testid="crew-total"]')).toContainText(
      "$3,000"
    );
    await expect(page.locator('[data-testid="equipment-total"]')).toContainText(
      "$2,500"
    );
    await expect(page.locator('[data-testid="catering-total"]')).toContainText(
      "$800"
    );
  });

  test("should provide profit margin analysis", async ({ page }) => {
    // Navigate to analytics tab
    await page.click('[data-testid="analytics-tab"]');

    // Verify profit margin metrics
    await expect(page.locator('[data-testid="gross-margin"]')).toContainText(
      "74.1%"
    );
    await expect(page.locator('[data-testid="net-margin"]')).toContainText(
      "72.1%"
    );

    // Verify comparison metrics
    await expect(
      page.locator('[data-testid="industry-benchmark"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="previous-tour-comparison"]')
    ).toBeVisible();

    // Verify margin trend chart
    await expect(
      page.locator('[data-testid="margin-trend-chart"]')
    ).toBeVisible();
  });

  test("should handle currency formatting", async ({ page }) => {
    // Verify all monetary values are properly formatted
    const monetaryElements = [
      '[data-testid="total-revenue"]',
      '[data-testid="total-costs"]',
      '[data-testid="net-profit"]',
      '[data-testid="guarantee-amount"]',
    ];

    for (const selector of monetaryElements) {
      const element = page.locator(selector);
      await expect(element).toHaveText(/\$[\d,]+/);
    }
  });
});
