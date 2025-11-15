import { computeWeatherScore } from "../../../apps/web/src/lib/weather";
import {
  OpenMeteoWeatherProvider,
  MockWeatherProvider,
} from "../../../apps/web/src/lib/weather-provider";

describe("Weather Intelligence", () => {
  describe("computeWeatherScore", () => {
    it("should give perfect score for ideal conditions", () => {
      const idealProfile = {
        avgHighTempC: 25,
        avgLowTempC: 15,
        avgPrecipDays: 2,
        avgWindSpeed: 10,
        avgHumidity: 65,
        hotDaysPct: 5,
        coldDaysPct: 0,
      };

      const result = computeWeatherScore(idealProfile);

      expect(result.score).toBeGreaterThan(90);
      expect(result.summary).toContain("Excellent");
      expect(result.detail.reasons).toContain(
        "Ideal temperature range for outdoor events."
      );
      expect(result.detail.reasons).toContain(
        "Low chance of rain - excellent for outdoor events."
      );
    });

    it("should penalize very hot conditions", () => {
      const hotProfile = {
        avgHighTempC: 38,
        avgLowTempC: 25,
        avgPrecipDays: 1,
        avgWindSpeed: 5,
        avgHumidity: 40,
        hotDaysPct: 80,
        coldDaysPct: 0,
      };

      const result = computeWeatherScore(hotProfile);

      expect(result.score).toBeLessThan(70);
      expect(result.detail.reasons).toContain(
        "Typically very hot temperatures for an outdoor show."
      );
      expect(result.detail.reasons).toContain(
        "Frequent very hot days (>30°C/86°F)."
      );
      expect(result.detail.recommendations).toContain(
        "Ensure adequate shade, hydration stations, and cooling areas."
      );
    });

    it("should penalize very cold conditions", () => {
      const coldProfile = {
        avgHighTempC: 2,
        avgLowTempC: -5,
        avgPrecipDays: 8,
        avgWindSpeed: 15,
        avgHumidity: 70,
        hotDaysPct: 0,
        coldDaysPct: 90,
      };

      const result = computeWeatherScore(coldProfile);

      expect(result.score).toBeLessThan(50);
      expect(result.detail.reasons).toContain(
        "Typically cold temperatures for an outdoor show."
      );
      expect(result.detail.reasons).toContain(
        "Frequent very cold days (<5°C/41°F)."
      );
      expect(result.detail.recommendations).toContain(
        "Consider heated areas or indoor alternatives."
      );
    });

    it("should penalize high precipitation", () => {
      const rainyProfile = {
        avgHighTempC: 20,
        avgLowTempC: 10,
        avgPrecipDays: 20,
        avgWindSpeed: 12,
        avgHumidity: 85,
        hotDaysPct: 0,
        coldDaysPct: 5,
      };

      const result = computeWeatherScore(rainyProfile);

      expect(result.score).toBeLessThan(80);
      expect(result.detail.reasons).toContain(
        "High chance of rain this month."
      );
      expect(result.detail.recommendations).toContain(
        "Have covered areas and weather backup plan ready."
      );
    });

    it("should penalize windy conditions", () => {
      const windyProfile = {
        avgHighTempC: 22,
        avgLowTempC: 12,
        avgPrecipDays: 5,
        avgWindSpeed: 25,
        avgHumidity: 60,
        hotDaysPct: 10,
        coldDaysPct: 0,
      };

      const result = computeWeatherScore(windyProfile);

      expect(result.detail.reasons).toContain("Typically windy conditions.");
      expect(result.detail.recommendations).toContain(
        "Secure all equipment and signage. Consider wind-resistant setup."
      );
    });

    it("should handle moderate conditions appropriately", () => {
      const moderateProfile = {
        avgHighTempC: 18,
        avgLowTempC: 8,
        avgPrecipDays: 6,
        avgWindSpeed: 12,
        avgHumidity: 70,
        hotDaysPct: 5,
        coldDaysPct: 15,
      };

      const result = computeWeatherScore(moderateProfile);

      expect(result.score).toBeGreaterThan(50);
      expect(result.score).toBeLessThan(85);
      expect(result.summary).toMatch(/(Good|Generally|acceptable)/i);
    });

    it("should ensure score stays within 0-100 range", () => {
      const extremeProfile = {
        avgHighTempC: 50,
        avgLowTempC: -20,
        avgPrecipDays: 30,
        avgWindSpeed: 50,
        avgHumidity: 100,
        hotDaysPct: 100,
        coldDaysPct: 100,
      };

      const result = computeWeatherScore(extremeProfile);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe("MockWeatherProvider", () => {
    let provider: MockWeatherProvider;

    beforeEach(() => {
      provider = new MockWeatherProvider();
    });

    it("should generate consistent data for same location and month", async () => {
      const result1 = await provider.getMonthlyClimate(40.7128, -74.006, 6); // NYC, June
      const result2 = await provider.getMonthlyClimate(40.7128, -74.006, 6); // Same location, same month

      expect(result1).toEqual(result2);
    });

    it("should vary by latitude (temperature correlation)", async () => {
      const arctic = await provider.getMonthlyClimate(70, -74.006, 6); // Arctic
      const tropical = await provider.getMonthlyClimate(10, -74.006, 6); // Tropical

      expect(tropical.avgHighTempC).toBeGreaterThan(arctic.avgHighTempC);
    });

    it("should show seasonal variation", async () => {
      const winter = await provider.getMonthlyClimate(40.7128, -74.006, 1); // January
      const summer = await provider.getMonthlyClimate(40.7128, -74.006, 7); // July

      expect(summer.avgHighTempC).toBeGreaterThan(winter.avgHighTempC);
    });

    it("should return valid climate data structure", async () => {
      const result = await provider.getMonthlyClimate(40.7128, -74.006, 6);

      expect(result).toHaveProperty("avgHighTempC");
      expect(result).toHaveProperty("avgLowTempC");
      expect(result).toHaveProperty("avgPrecipDays");
      expect(result).toHaveProperty("hotDaysPct");
      expect(result).toHaveProperty("coldDaysPct");

      expect(typeof result.avgHighTempC).toBe("number");
      expect(typeof result.avgLowTempC).toBe("number");
      expect(typeof result.avgPrecipDays).toBe("number");
      expect(typeof result.hotDaysPct).toBe("number");
      expect(typeof result.coldDaysPct).toBe("number");
    });
  });

  describe("OpenMeteoWeatherProvider", () => {
    let provider: OpenMeteoWeatherProvider;

    beforeEach(() => {
      provider = new OpenMeteoWeatherProvider();
    });

    it("should handle invalid coordinates gracefully", async () => {
      await expect(provider.getMonthlyClimate(999, 999, 6)).rejects.toThrow();
    });

    it("should handle invalid months gracefully", async () => {
      await expect(
        provider.getMonthlyClimate(40.7128, -74.006, 13)
      ).rejects.toThrow();
    });

    it("should validate month parameter", async () => {
      await expect(
        provider.getMonthlyClimate(40.7128, -74.006, 0)
      ).rejects.toThrow();
    });

    // Note: These tests would require internet access and might be slow
    // In a real environment, you'd want to mock the HTTP requests
    it("should return realistic temperature ranges", async () => {
      // Mock fetch for testing
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              temperature_2m_max: [20, 22, 25, 24, 21],
              temperature_2m_min: [10, 12, 15, 14, 11],
              precipitation_sum: [0, 0.2, 5.1, 0, 0.8],
              windspeed_10m_max: [10, 12, 8, 15, 11],
              relativehumidity_2m_mean: [60, 65, 70, 58, 62],
            },
          }),
      });

      const result = await provider.getMonthlyClimate(40.7128, -74.006, 6);

      expect(result.avgHighTempC).toBeGreaterThan(-50);
      expect(result.avgHighTempC).toBeLessThan(60);
      expect(result.avgLowTempC).toBeLessThan(result.avgHighTempC);
      expect(result.avgPrecipDays).toBeGreaterThanOrEqual(0);
      expect(result.avgPrecipDays).toBeLessThanOrEqual(31);
    });
  });

  describe("Weather Score Integration", () => {
    it("should produce realistic scores for known good weather locations", () => {
      // San Diego in May - known for great weather
      const sanDiegoMay = {
        avgHighTempC: 22,
        avgLowTempC: 15,
        avgPrecipDays: 2,
        avgWindSpeed: 8,
        avgHumidity: 65,
        hotDaysPct: 5,
        coldDaysPct: 0,
      };

      const result = computeWeatherScore(sanDiegoMay);
      expect(result.score).toBeGreaterThan(80);
    });

    it("should produce poor scores for challenging weather locations", () => {
      // Minnesota in January - harsh winter conditions
      const minnesotaJan = {
        avgHighTempC: -8,
        avgLowTempC: -18,
        avgPrecipDays: 8,
        avgWindSpeed: 18,
        avgHumidity: 75,
        hotDaysPct: 0,
        coldDaysPct: 95,
      };

      const result = computeWeatherScore(minnesotaJan);
      expect(result.score).toBeLessThan(40);
    });

    it("should provide actionable recommendations", () => {
      const challengingConditions = {
        avgHighTempC: 35,
        avgLowTempC: 22,
        avgPrecipDays: 15,
        avgWindSpeed: 22,
        avgHumidity: 80,
        hotDaysPct: 70,
        coldDaysPct: 0,
      };

      const result = computeWeatherScore(challengingConditions);

      expect(result.detail.recommendations).toBeDefined();
      expect(result.detail.recommendations?.length).toBeGreaterThan(0);
      expect(
        result.detail.recommendations?.some(
          (r) =>
            r.includes("shade") ||
            r.includes("hydration") ||
            r.includes("backup")
        )
      ).toBe(true);
    });
  });
});
