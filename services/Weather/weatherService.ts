import { fetchWeatherApi } from "openmeteo";

export const weatherService = async (
  latitude: number,
  longitude: number,
  currentTemp: string,
  temperature_unit: string,
) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    current: currentTemp,
    temperature_unit: temperature_unit,
  };

  const url = "https://api.open-meteo.com/v1/forecast";

  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!;
  // console.log(current);
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
    },
  };
  console.log(weatherData);

  //   return current;
};
weatherService(41.8542, -87.6233, "temperature_2m", "fahrenheit");
export default weatherService;
