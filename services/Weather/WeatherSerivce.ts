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
  //TODO: Get daily 7 day temp()
}
