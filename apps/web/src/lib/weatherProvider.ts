// apps/web/src/lib/weatherProvider.ts

import type { ClimateStats } from "./weatherScore";

export interface MonthlyClimateStats extends ClimateStats {
  // Optional extras
  avgWindSpeed?: number | null;
  avgHumidity?: number | null;
  source?: string;
}

export interface WeatherProvider {
  getMonthlyClimate(
    latitude: number,
    longitude: number,
    month: number
  ): Promise<MonthlyClimateStats>;
}

// Dummy / placeholder provider for development and testing
class DummyWeatherProvider implements WeatherProvider {
  async getMonthlyClimate(
    latitude: number,
    longitude: number,
    month: number
  ): Promise<MonthlyClimateStats> {
    console.log(
      "DummyWeatherProvider.getMonthlyClimate",
      latitude,
      longitude,
      month
    );

    // Simulate realistic regional and seasonal variations
    const isNorthernHemisphere = latitude > 0;
    const isSummer = isNorthernHemisphere
      ? month >= 6 && month <= 8
      : month === 12 || month <= 2;
    const isWinter = isNorthernHemisphere
      ? month === 12 || month <= 2
      : month >= 6 && month <= 8;

    // Latitude-based climate adjustment
    const latitudeFactor = Math.abs(latitude) / 90;
    const temperatureRange = 30 * (1 - latitudeFactor * 0.7);

    if (isSummer) {
      const baseTemp = 25 - latitudeFactor * 10;
      return {
        avgHighTempC: Math.round((baseTemp + temperatureRange * 0.3) * 10) / 10,
        avgLowTempC: Math.round((baseTemp - 5) * 10) / 10,
        avgPrecipDays: latitude > 40 ? 8 : 4, // More rain in northern regions
        hotDaysPct: Math.min(60, 20 + (30 - latitudeFactor * 30)),
        coldDaysPct: Math.max(0, latitudeFactor * 10),
        avgHumidity: 55 + latitudeFactor * 15,
        avgWindSpeed: 8 + Math.random() * 6,
        source: "dummy-summer",
      };
    } else if (isWinter) {
      const baseTemp = 5 - latitudeFactor * 15;
      return {
        avgHighTempC: Math.round(baseTemp * 10) / 10,
        avgLowTempC: Math.round((baseTemp - 8) * 10) / 10,
        avgPrecipDays: 10 + latitudeFactor * 5,
        hotDaysPct: Math.max(0, 5 - latitudeFactor * 5),
        coldDaysPct: Math.min(70, 20 + latitudeFactor * 40),
        avgHumidity: 65 + latitudeFactor * 10,
        avgWindSpeed: 12 + Math.random() * 8,
        source: "dummy-winter",
      };
    } else {
      // Spring/Fall
      const baseTemp = 15 - latitudeFactor * 8;
      return {
        avgHighTempC: Math.round((baseTemp + temperatureRange * 0.2) * 10) / 10,
        avgLowTempC: Math.round((baseTemp - 5) * 10) / 10,
        avgPrecipDays: 6 + latitudeFactor * 3,
        hotDaysPct: Math.max(0, 15 - latitudeFactor * 10),
        coldDaysPct: Math.max(0, 10 + latitudeFactor * 15),
        avgHumidity: 60 + latitudeFactor * 10,
        avgWindSpeed: 10 + Math.random() * 4,
        source: "dummy-shoulder",
      };
    }
  }
}

// Real weather provider implementation (example using Open-Meteo API)
class OpenMeteoWeatherProvider implements WeatherProvider {
  private readonly baseUrl = "https://archive-api.open-meteo.com/v1/era5";

  async getMonthlyClimate(
    latitude: number,
    longitude: number,
    month: number
  ): Promise<MonthlyClimateStats> {
    try {
      // Calculate date range for 10-year historical average
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 10;

      // Get data for the specified month across multiple years
      const promises = [];
      for (let year = startYear; year < currentYear; year++) {
        const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
        const daysInMonth = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month
          .toString()
          .padStart(2, "0")}-${daysInMonth.toString().padStart(2, "0")}`;

        const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=UTC`;

        promises.push(fetch(url).then((response) => response.json()));
      }

      const responses = await Promise.all(promises);

      // Aggregate the data
      let totalMaxTemp = 0;
      let totalMinTemp = 0;
      let totalPrecipDays = 0;
      let totalDays = 0;
      let hotDays = 0;
      let coldDays = 0;
      let totalWindSpeed = 0;

      for (const data of responses) {
        if (data.daily) {
          const maxTemps = data.daily.temperature_2m_max;
          const minTemps = data.daily.temperature_2m_min;
          const precipitations = data.daily.precipitation_sum;
          const windSpeeds = data.daily.windspeed_10m_max;

          for (let i = 0; i < maxTemps.length; i++) {
            if (maxTemps[i] != null && minTemps[i] != null) {
              totalMaxTemp += maxTemps[i];
              totalMinTemp += minTemps[i];
              totalDays++;

              if (maxTemps[i] > 30) hotDays++;
              if (maxTemps[i] < 5) coldDays++;

              if (precipitations[i] > 0.1) totalPrecipDays++;
              if (windSpeeds[i] != null) totalWindSpeed += windSpeeds[i];
            }
          }
        }
      }

      const avgHighTempC = totalDays > 0 ? totalMaxTemp / totalDays : null;
      const avgLowTempC = totalDays > 0 ? totalMinTemp / totalDays : null;
      const avgPrecipDays = totalDays > 0 ? totalPrecipDays / 10 : null; // Per month average
      const hotDaysPct = totalDays > 0 ? (hotDays / totalDays) * 100 : null;
      const coldDaysPct = totalDays > 0 ? (coldDays / totalDays) * 100 : null;
      const avgWindSpeed = totalDays > 0 ? totalWindSpeed / totalDays : null;

      return {
        avgHighTempC: avgHighTempC ? Math.round(avgHighTempC * 10) / 10 : null,
        avgLowTempC: avgLowTempC ? Math.round(avgLowTempC * 10) / 10 : null,
        avgPrecipDays: avgPrecipDays
          ? Math.round(avgPrecipDays * 10) / 10
          : null,
        hotDaysPct: hotDaysPct ? Math.round(hotDaysPct * 10) / 10 : null,
        coldDaysPct: coldDaysPct ? Math.round(coldDaysPct * 10) / 10 : null,
        avgHumidity: null, // Open-Meteo doesn't provide humidity in free tier
        avgWindSpeed: avgWindSpeed ? Math.round(avgWindSpeed * 10) / 10 : null,
        source: "open-meteo-era5",
      };
    } catch (error) {
      console.error("Error fetching weather data from Open-Meteo:", error);
      throw new Error("Failed to fetch weather data");
    }
  }
}

// Export the weather provider instance
// Switch between implementations based on environment or configuration
const useRealWeatherProvider =
  process.env.NODE_ENV === "production" &&
  process.env.WEATHER_PROVIDER_ENABLED === "true";

export const weatherProvider: WeatherProvider = useRealWeatherProvider
  ? new OpenMeteoWeatherProvider()
  : new DummyWeatherProvider();

// Export classes for testing
export { DummyWeatherProvider, OpenMeteoWeatherProvider };
