// weatherService.js
// Uses Open-Meteo — 100% free, no API key required.
// Accepts lat/lon for precision (works great with Nominatim output).

const WMO_CODES = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Icy fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers", 81: "Showers", 82: "Heavy showers",
  85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ heavy hail",
};

/**
 * Fetch current weather for a lat/lon coordinate.
 * Returns { tempF, tempC, conditions, windMph, humidity, weatherCode }
 */
export async function fetchWeatherByCoords(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather fetch failed");

  const data = await res.json();
  const c = data.current;

  return {
    tempF: Math.round(c.temperature_2m),
    tempC: Math.round((c.temperature_2m - 32) * 5 / 9),
    windMph: Math.round(c.wind_speed_10m),
    humidity: c.relative_humidity_2m,
    weatherCode: c.weather_code,
    conditions: WMO_CODES[c.weather_code] ?? "Unknown",
    fetchedAt: new Date().toISOString(),
  };
}
