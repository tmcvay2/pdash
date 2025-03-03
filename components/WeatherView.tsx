import WeatherService from "@/services/Weather/WeatherSerivce";
import { Weather } from "@/types/Weather";
import { useEffect, useState } from "react";

export function WeatherView() {
  const [weather, setWeather] = useState<Partial<Weather> | null>(null);
  const [loading, setLoading] = useState(true);

  const weatherService = new WeatherService(
    "https://api.open-meteo.com/v1/forecast",
  );

  useEffect(() => {
    async function fetchWeather() {
      try {
        const weatherRequest = {
          latitude: 41.8542,
          longitude: -87.6233,
          currentTemp: "temperature_2m",
          temperature_unit: "fahrenheit",
          daily: "temperature_2m_max",
         timezone: "America/Chicago"
        };
        const data = await weatherService.getWeeklyTemp(weatherRequest);
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);
  // if (weather?.daily === undefined){
  //   throw new Error(`there is an error fetching ${weather?.daily}`)
  // }
  const weatherTemp = weather?.daily?.temperature_2m_max
  

  if (loading) {
    return <div>Loading...</div>;
  }
  if (weather === null) {
    return <div>Error fetching weather data</div>;
  }
  return (
    <div>
       <h1>Chicago, IL</h1>
    {Array.isArray(weatherTemp) ? (
      weatherTemp.map((num, index) => (
        <p key={index}>{num}°F</p>
      ))
    ) : (
      <p>{weatherTemp}°F</p> // Handle case where it's a single number
    )}
    </div>
  );
}
