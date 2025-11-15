import { test, expect } from "@playwright/test";
import { testData } from "../../fixtures/test-data";

test.describe("Weather & Seasonality Intelligence", () => {
  let organizationId: string;
  let tourId: string;
  let outdoorVenueId: string;
  let showId: string;

  test.beforeEach(async ({ page }) => {
    organizationId = testData.organizations.acmeEntertainment.id;
    tourId = testData.tours.northAmericanTour.id;
    outdoorVenueId = "venue_outdoor_123";
    showId = "show_outdoor_123";

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

    // Mock weather API with realistic data
    await page.route("**/api/shows/*/weather", async (route) => {
      const method = route.request().method();

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            show: {
              id: showId,
              weatherScore: 78,
              weatherRiskSummary: "Good conditions with minimal weather risk.",
              weatherDetailJson: {
                reasons: [
                  "Comfortable average high temperature for outdoor shows.",
                  "Low chance of rain compared to other months.",
                  "Some risk of very hot days; consider shade planning.",
                ],
                profile: {
                  avgHighTempC: 26,
                  avgLowTempC: 16,
                  avgPrecipDays: 4,
                  hotDaysPct: 15,
                  coldDaysPct: 0,
                },
                recommendations: [
                  "Monitor weather forecasts closely as show date approaches.",
                  "Have shade areas available for hot day contingency.",
                ],
              },
            },
            venue: {
              id: outdoorVenueId,
              name: "Summer Festival Grounds",
              isOutdoor: true,
              latitude: 40.7128,
              longitude: -74.006,
              weatherNotes:
                "Main stage has partial cover. VIP area fully covered.",
            },
            climateProfile: {
              month: 7,
              avgHighTempC: 26,
              avgLowTempC: 16,
              avgPrecipDays: 4,
              avgWindSpeed: 12,
              avgHumidity: 68,
              hotDaysPct: 15,
              coldDaysPct: 0,
              lastUpdated: new Date().toISOString(),
            },
            isUpdating: false,
          }),
        });
      } else if (method === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            show: {
              id: showId,
              weatherScore: 82,
              weatherRiskSummary: "Excellent conditions for outdoor show.",
              weatherDetailJson: {
                reasons: [
                  "Updated analysis shows improved conditions.",
                  "Recent weather patterns favor outdoor events.",
                ],
              },
            },
            climateProfile: {
              month: 7,
              avgHighTempC: 25,
              avgLowTempC: 17,
              avgPrecipDays: 3,
              lastUpdated: new Date().toISOString(),
            },
            message: "Weather data updated successfully",
          }),
        });
      }
    });

    // Mock show details
    await page.route("**/api/shows/*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: showId,
          date: "2024-07-15",
          venue: {
            id: outdoorVenueId,
            name: "Summer Festival Grounds",
            isOutdoor: true,
          },
        }),
      });
    });

    await page.goto(`/app/shows/${showId}`);
  });

  test("should display weather panel for outdoor venues", async ({ page }) => {
    // Verify weather panel is visible
    await expect(page.locator('[data-testid="weather-panel"]')).toBeVisible();

    // Verify weather panel title
    await expect(
      page.locator('[data-testid="weather-panel"] h3')
    ).toContainText("Weather & Seasonality");

    // Verify venue name in description
    await expect(page.locator('[data-testid="weather-panel"]')).toContainText(
      "Summer Festival Grounds"
    );
  });

  test("should show weather score and summary", async ({ page }) => {
    // Verify weather score badge
    await expect(
      page.locator('[data-testid="weather-score-badge"]')
    ).toContainText("78/100");

    // Verify score badge color (should be yellow/amber for score of 78)
    const scoreBadge = page.locator('[data-testid="weather-score-badge"]');
    await expect(scoreBadge).toHaveClass(/bg-yellow-500/);

    // Verify weather summary
    await expect(page.locator('[data-testid="weather-summary"]')).toContainText(
      "Good conditions with minimal weather risk"
    );
  });

  test("should display detailed weather reasons", async ({ page }) => {
    // Verify reasons list is visible
    await expect(page.locator('[data-testid="weather-reasons"]')).toBeVisible();

    // Check for specific reasons
    await expect(page.locator('[data-testid="weather-reasons"]')).toContainText(
      "Comfortable average high temperature"
    );
    await expect(page.locator('[data-testid="weather-reasons"]')).toContainText(
      "Low chance of rain"
    );
    await expect(page.locator('[data-testid="weather-reasons"]')).toContainText(
      "Some risk of very hot days"
    );
  });

  test("should show climate profile data", async ({ page }) => {
    // Verify climate overview section
    await expect(
      page.locator('[data-testid="climate-overview"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="climate-overview"]')
    ).toContainText("July Climate Overview");

    // Check temperature displays
    await expect(page.locator('[data-testid="avg-high-temp"]')).toContainText(
      "26°C (79°F)"
    );
    await expect(page.locator('[data-testid="avg-low-temp"]')).toContainText(
      "16°C (61°F)"
    );

    // Check precipitation data
    await expect(page.locator('[data-testid="rainy-days"]')).toContainText(
      "4 days"
    );

    // Check wind data
    await expect(page.locator('[data-testid="avg-wind"]')).toContainText(
      "12 km/h"
    );

    // Check extreme weather percentages
    await expect(page.locator('[data-testid="extreme-weather"]')).toContainText(
      "Very hot days (>30°C): 15%"
    );
  });

  test("should display weather recommendations", async ({ page }) => {
    // Verify recommendations section
    await expect(
      page.locator('[data-testid="weather-recommendations"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="weather-recommendations"]')
    ).toContainText("Recommendations");

    // Check for specific recommendations
    await expect(
      page.locator('[data-testid="weather-recommendations"]')
    ).toContainText("Monitor weather forecasts");
    await expect(
      page.locator('[data-testid="weather-recommendations"]')
    ).toContainText("Have shade areas available");
  });

  test("should show venue weather notes", async ({ page }) => {
    // Verify venue notes section
    await expect(
      page.locator('[data-testid="venue-weather-notes"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="venue-weather-notes"]')
    ).toContainText("Venue Notes");
    await expect(
      page.locator('[data-testid="venue-weather-notes"]')
    ).toContainText("Main stage has partial cover");
  });

  test("should allow manual weather data refresh", async ({ page }) => {
    // Click the update weather button
    await page.click('[data-testid="update-weather-button"]');

    // Verify loading state
    await expect(
      page.locator('[data-testid="update-weather-button"]')
    ).toContainText("Update");
    await expect(
      page.locator('[data-testid="update-weather-button"] svg')
    ).toHaveClass(/animate-spin/);

    // Wait for update to complete and verify new score
    await expect(
      page.locator('[data-testid="weather-score-badge"]')
    ).toContainText("82/100");
    await expect(page.locator('[data-testid="weather-summary"]')).toContainText(
      "Excellent conditions"
    );
  });

  test("should show appropriate weather icons", async ({ page }) => {
    // Verify weather icon matches score (should be sun for good weather)
    const scoreIcon = page.locator('[data-testid="weather-score-badge"] svg');
    await expect(scoreIcon).toBeVisible();

    // Check that icon changes based on score
    await expect(
      page.locator('[data-testid="weather-score-badge"]')
    ).toContainText("78");
  });

  test("should handle indoor venues appropriately", async ({ page }) => {
    // Mock indoor venue response
    await page.route("**/api/shows/*/weather", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          show: {
            id: showId,
            weatherScore: null,
            weatherRiskSummary: null,
            weatherDetailJson: null,
          },
          venue: {
            isOutdoor: false,
          },
          message: "Weather data not applicable for indoor venues",
        }),
      });
    });

    await page.reload();

    // Verify appropriate message for indoor venues
    await expect(page.locator('[data-testid="weather-panel"]')).toContainText(
      "Weather intelligence is available for outdoor venues only"
    );
  });

  test("should display weather-aware routing suggestions", async ({ page }) => {
    // Mock routing data with weather scores
    await page.route("**/api/tours/*/routing", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          scenarios: [
            {
              id: "scenario_1",
              name: "Weather-Optimized Route",
              description: "Prioritizes favorable weather conditions",
              totalDriveHours: 45,
              totalRevenue: 250000,
              avgWeatherScore: 82,
              stops: [
                {
                  id: "stop_1",
                  date: "2024-06-15",
                  city: "Austin",
                  state: "TX",
                  venueName: "Outdoor Amphitheater",
                  venueId: "venue_1",
                  driveHours: 8,
                  weatherScore: 85,
                  weatherSummary: "Excellent conditions",
                  isOutdoor: true,
                  estimatedRevenue: 75000,
                },
                {
                  id: "stop_2",
                  date: "2024-06-20",
                  city: "Denver",
                  state: "CO",
                  venueName: "Mountain View Stage",
                  venueId: "venue_2",
                  driveHours: 12,
                  weatherScore: 78,
                  weatherSummary: "Good conditions",
                  isOutdoor: true,
                  estimatedRevenue: 85000,
                },
              ],
            },
          ],
        }),
      });
    });

    // Navigate to routing page
    await page.goto(`/app/tours/${tourId}/routing`);

    // Verify weather-aware routing section
    await expect(
      page.locator('[data-testid="weather-aware-routing"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="weather-aware-routing"] h3')
    ).toContainText("Weather-Aware Routing");

    // Verify scenario with weather data
    await expect(
      page.locator('[data-testid="routing-scenario"]')
    ).toContainText("Weather-Optimized Route");

    // Check weather scores in routing stops
    await expect(
      page.locator('[data-testid="stop-weather-badge"]').first()
    ).toContainText("85");
    await expect(
      page.locator('[data-testid="stop-weather-badge"]').nth(1)
    ).toContainText("78");

    // Verify weather explanation
    await expect(
      page.locator('[data-testid="weather-explanation"]')
    ).toContainText(
      "clusters outdoor shows during historically favorable weather windows"
    );
  });

  test("should sort routing scenarios by weather score", async ({ page }) => {
    await page.goto(`/app/tours/${tourId}/routing`);

    // Click weather sort option
    await page.click('[data-testid="sort-by-weather"]');

    // Verify scenarios are sorted by weather score (highest first)
    const weatherBadges = page.locator(
      '[data-testid="scenario-weather-score"]'
    );
    const firstScore = await weatherBadges.first().textContent();
    const lastScore = await weatherBadges.last().textContent();

    // Parse scores and verify ordering
    const firstScoreNum = parseInt(firstScore?.match(/\d+/)?.[0] || "0");
    const lastScoreNum = parseInt(lastScore?.match(/\d+/)?.[0] || "0");
    expect(firstScoreNum).toBeGreaterThanOrEqual(lastScoreNum);
  });

  test("should handle weather data loading states", async ({ page }) => {
    // Mock slow weather API response
    await page.route("**/api/shows/*/weather", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          show: { weatherScore: null },
          venue: { isOutdoor: true },
          isUpdating: true,
        }),
      });
    });

    await page.reload();

    // Verify loading state
    await expect(page.locator('[data-testid="weather-panel"]')).toContainText(
      "Analyzing weather data"
    );

    // Verify loading animation
    await expect(page.locator('[data-testid="weather-loading"]')).toBeVisible();
  });

  test("should handle weather API errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/shows/*/weather", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Weather service temporarily unavailable",
        }),
      });
    });

    await page.reload();

    // Verify error message
    await expect(page.locator('[data-testid="weather-error"]')).toContainText(
      "Weather service temporarily unavailable"
    );

    // Verify retry button
    await expect(
      page.locator('[data-testid="weather-retry-button"]')
    ).toBeVisible();
  });

  test("should display data source and freshness", async ({ page }) => {
    // Verify data source information
    await expect(page.locator('[data-testid="data-source"]')).toContainText(
      "Data last updated:"
    );

    // Check that date is recent
    const dataSourceText = await page
      .locator('[data-testid="data-source"]')
      .textContent();
    const today = new Date().toLocaleDateString();
    expect(dataSourceText).toContain(today.split("/")[2]); // Contains current year
  });

  test("should be responsive on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify weather panel is still visible and usable
    await expect(page.locator('[data-testid="weather-panel"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="weather-score-badge"]')
    ).toBeVisible();

    // Verify mobile layout adjustments
    const weatherPanel = page.locator('[data-testid="weather-panel"]');
    const boundingBox = await weatherPanel.boundingBox();
    expect(boundingBox?.width).toBeLessThan(400);
  });

  test("should integrate with venue creation workflow", async ({ page }) => {
    // Navigate to venue creation
    await page.goto("/app/venues/new");

    // Fill venue form with outdoor venue data
    await page.fill('[data-testid="venue-name"]', "New Outdoor Festival");
    await page.fill('[data-testid="venue-address"]', "123 Festival Way");
    await page.fill('[data-testid="venue-city"]', "Austin");
    await page.fill('[data-testid="venue-state"]', "TX");
    await page.fill('[data-testid="venue-country"]', "US");
    await page.fill('[data-testid="venue-latitude"]', "30.2672");
    await page.fill('[data-testid="venue-longitude"]', "-97.7431");

    // Mark as outdoor venue
    await page.check('[data-testid="venue-is-outdoor"]');

    // Add weather notes
    await page.fill(
      '[data-testid="venue-weather-notes"]',
      "Open-air stage with emergency cover available"
    );

    // Submit venue
    await page.click('[data-testid="submit-venue"]');

    // Verify success message mentions weather data collection
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Weather data will be collected for this outdoor venue"
    );
  });
});
