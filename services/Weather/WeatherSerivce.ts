import { Weather, WeatherRequest, WeatherService } from "@/types/Weather";
import { cutDecimal } from "@/util/cutDecimal";

export default class MateoWeatherService implements WeatherService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getCurrentTemp(
    weatherRequest: WeatherRequest,
  ): Promise<Partial<Weather>> {
    const url = `${this.apiUrl}?latitude=${weatherRequest.latitude}&longitude=${weatherRequest.longitude}&current=temperature_2m&current_weather=true&temperature_unit=${weatherRequest.temperature_unit}&timezone=${weatherRequest.timezone}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "pdash_app",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch current weather: ${response.statusText}`,
      );
    }
    const data = await response.json();
    console.log(JSON.stringify(data));

    const weatherData = {
      current: {
        temperature_2m: cutDecimal(data.current_weather.temperature, 0),
      },
    };

    return {
      current: {
        temperature_2m: weatherData.current.temperature_2m,
      },
    };
  }
  public async getWeeklyTemp(
    weatherRequest: WeatherRequest,
  ): Promise<Partial<Weather>> {
    const url = `${this.apiUrl}?latitude=${weatherRequest.latitude}&longitude=${weatherRequest.longitude}&daily=temperature_2m_max&temperature_unit=${weatherRequest.temperature_unit}&timezone=${weatherRequest.timezone}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Unable to fetch weekly temperatures: ${response.statusText}`,
      );
    }
    const data = await response.json();

    const weatherData = {
      daily: {
        temperature2mMax: cutDecimal(
          Array.from(data.daily.temperature_2m_max),
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
