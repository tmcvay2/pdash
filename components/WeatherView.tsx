import WeatherService from "@/services/Weather/WeatherSerivce";
import { Weather } from "@/types/Weather";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
          current: "temperature_2m",
          temperature_unit: "fahrenheit",
          daily: "temperature_2m_max",
          timezone: "America/Chicago",
        };
        const [currentTemp, weeklytemp] = await Promise.all([
          weatherService.getCurrentTemp(weatherRequest),
          weatherService.getWeeklyTemp(weatherRequest),
        ]);
        setWeather({
          ...currentTemp,
          ...weeklytemp,
        });
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
  const weeklyTemp = weather?.daily?.temperature_2m_max;
  const currentTemp = weather?.current?.temperature_2m;

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (weather === null) {
    return <Text>Error fetching weather data</Text>;
  }
  return (
    <View>
      <Text>Chicago, IL</Text>
      {currentTemp !== undefined && <Text>Current Temp: {currentTemp} °F</Text>}
      {Array.isArray(weeklyTemp) ? (
        weeklyTemp.map((num, index) => <Text key={index}>{num}°F</Text>)
      ) : (
        <Text>{weeklyTemp}°F</Text>
      )}
    </View>
  );
}
