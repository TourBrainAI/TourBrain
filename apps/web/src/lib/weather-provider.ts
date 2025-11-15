import { WeatherProvider, ClimateStats } from "../lib/weather";

/**
 * OpenMeteo Weather Provider
 * Uses the free Open-Meteo Historical Weather API
 * Documentation: https://open-meteo.com/en/docs/historical-weather-api
 */
export class OpenMeteoWeatherProvider implements WeatherProvider {
  private readonly baseUrl = "https://archive-api.open-meteo.com/v1/archive";

  async getMonthlyClimate(
    latitude: number,
    longitude: number,
    month: number
  ): Promise<ClimateStats> {
    // Use last 10 years of data for statistical accuracy
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;

    try {
      const promises = [];

      // Fetch data for the target month across multiple years
      for (let year = startYear; year < currentYear; year++) {
        const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
        const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Last day of month

        const url = new URL(this.baseUrl);
        url.searchParams.set("latitude", latitude.toString());
        url.searchParams.set("longitude", longitude.toString());
        url.searchParams.set("start_date", startDate);
        url.searchParams.set("end_date", endDate);
        url.searchParams.set(
          "daily",
          "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,relativehumidity_2m_mean"
        );
        url.searchParams.set("timezone", "auto");

        promises.push(
          fetch(url.toString()).then((response) => {
            if (!response.ok) {
              throw new Error(`OpenMeteo API error: ${response.status}`);
            }
            return response.json();
          })
        );
      }

      const results = await Promise.all(promises);

      // Aggregate data across all years
      let allMaxTemps: number[] = [];
      let allMinTemps: number[] = [];
      let allPrecip: number[] = [];
      let allWindSpeeds: number[] = [];
      let allHumidity: number[] = [];

      results.forEach((data) => {
        if (data.daily) {
          allMaxTemps.push(
            ...data.daily.temperature_2m_max.filter((t: any) => t !== null)
          );
          allMinTemps.push(
            ...data.daily.temperature_2m_min.filter((t: any) => t !== null)
          );
          allPrecip.push(
            ...data.daily.precipitation_sum.filter((p: any) => p !== null)
          );
          allWindSpeeds.push(
            ...data.daily.windspeed_10m_max.filter((w: any) => w !== null)
          );
          allHumidity.push(
            ...data.daily.relativehumidity_2m_mean.filter(
              (h: any) => h !== null
            )
          );
        }
      });

      if (allMaxTemps.length === 0) {
        throw new Error(
          `No weather data available for coordinates ${latitude}, ${longitude} in month ${month}`
        );
      }

      // Calculate statistics
      const avgHighTempC = this.average(allMaxTemps);
      const avgLowTempC = this.average(allMinTemps);
      const avgWindSpeed =
        allWindSpeeds.length > 0 ? this.average(allWindSpeeds) : undefined;
      const avgHumidity =
        allHumidity.length > 0 ? this.average(allHumidity) : undefined;

      // Calculate precipitation days (days with > 0.1mm precipitation)
      const precipDays = allPrecip.filter((p) => p > 0.1).length;
      const totalDays = allPrecip.length;
      const avgPrecipDays =
        (precipDays / totalDays) * this.getDaysInMonth(month);

      // Calculate extreme temperature percentages
      const hotDays = allMaxTemps.filter((t) => t > 30).length; // > 30°C / 86°F
      const coldDays = allMinTemps.filter((t) => t < 5).length; // < 5°C / 41°F
      const hotDaysPct = (hotDays / allMaxTemps.length) * 100;
      const coldDaysPct = (coldDays / allMinTemps.length) * 100;

      return {
        avgHighTempC,
        avgLowTempC,
        avgPrecipDays,
        avgWindSpeed,
        avgHumidity,
        hotDaysPct,
        coldDaysPct,
      };
    } catch (error) {
      console.error("Error fetching weather data from OpenMeteo:", error);
      throw new Error(
        `Failed to fetch climate data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private average(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  private getDaysInMonth(month: number): number {
    // Use a non-leap year for consistency
    return new Date(2023, month, 0).getDate();
  }
}

/**
 * Mock Weather Provider for testing
 */
export class MockWeatherProvider implements WeatherProvider {
  async getMonthlyClimate(
    latitude: number,
    longitude: number,
    month: number
  ): Promise<ClimateStats> {
    // Generate consistent mock data based on coordinates and month
    const latFactor = Math.abs(latitude) / 90;
    const seasonFactor = Math.cos(((month - 1) * Math.PI) / 6); // Seasonal variation

    const baseTemp = 20 - latFactor * 15 + seasonFactor * 10;

    return {
      avgHighTempC: baseTemp + 5,
      avgLowTempC: baseTemp - 5,
      avgPrecipDays: 5 + Math.sin((month * Math.PI) / 6) * 3,
      avgWindSpeed: 10 + Math.random() * 5,
      avgHumidity: 60 + Math.random() * 20,
      hotDaysPct: Math.max(0, (baseTemp - 25) * 4),
      coldDaysPct: Math.max(0, (5 - baseTemp) * 4),
    };
  }
}

// Export the default provider
export const weatherProvider =
  process.env.NODE_ENV === "test"
    ? new MockWeatherProvider()
    : new OpenMeteoWeatherProvider();
