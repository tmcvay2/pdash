import { Weather, WeatherRequest, WeatherService } from "@/types/Weather";
import { cutDecimal } from "@/util/cutDecimal";
import { fetchWeatherApi } from "openmeteo";

export default class MateoWeatherService implements WeatherService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getCurrentTemp(
    weatherRequest: WeatherRequest,
  ): Promise<Partial<Weather>> {
    const params = {
      latitude: weatherRequest.latitude,
      longitude: weatherRequest.longitude,
      current: weatherRequest.currentTemp,
      temperature_unit: weatherRequest.temperature_unit,
    };

    const url = this.apiUrl;

    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: cutDecimal(current.variables(0)!.value(), 0),
      },
    };

    return {
      current: {
        temperature2m: weatherData.current.temperature2m,
        time: weatherData.current.time,
      },
    };
  }
  public async getWeeklyTemp(
    weatherRequest: WeatherRequest,
  ): Promise<Partial<Weather>> {
    const params = {
      latitude: weatherRequest.latitude,
      longitude: weatherRequest.longitude,
      temperature_unit: weatherRequest.temperature_unit,
      daily: weatherRequest.daily,
      forcast_days: weatherRequest.forcast_days,
      timezone: weatherRequest.timezone,
    };
    const url = this.apiUrl;
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const daily = response.daily()!;

    const weatherData = {
      daily: {
        temperature2mMax: cutDecimal(
          Array.from(daily.variables(0)!.valuesArray()!),
          0,
        ),
      },
    };
    console.log(weatherData);

    return {
      daily: {
        temperature_2m_max: weatherData.daily.temperature2mMax,
      },
    };
  }

  //getWeeklyWeatherForcast(weatherRequest: WeatherRequest): Promise <Partial<Weather>> {
  // Logic to check response if rain_sum, precipitation_sum, or snowfall_sum is not null...
  // if it is not null it will render a weather icon of the type of precipitation it is based on response
  //}
}
