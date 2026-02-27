const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather data not found");
  }

  const data = await response.json();

  return {
    temperature: data.main.temp,
    conditions: data.weather[0].description,
    wind: data.wind.speed,
    location: data.name
  };
}