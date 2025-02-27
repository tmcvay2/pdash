/* eslint-disable no-unused-vars */
export type Weather = {
  current: {
    time: Date;
    temperature2m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
  };
};

export type WeatherRequest = {
  latitude: number;
  longitude: number;
  currentTemp: string;
  temperature_unit: string;
};

export interface WeatherService {
  getCurrentTemp(weatherRequest: WeatherRequest): Promise<Partial<Weather>>;
}
