/* eslint-disable no-unused-vars */
export type Weather = {
  current: {
    time: Date;
    temperature2m: number | number[];
  };
  daily: {
    time?: string[];
    temperature_2m_max: number | number[];
  };
};

export type WeatherRequest = {
  latitude: number;
  longitude: number;
  currentTemp: string;
  temperature_unit?: string;
  daily?: string;
  forcast_days?: string;
  timezone?: string;
};

export interface WeatherService {
  getCurrentTemp(
    weatherRequest: Partial<WeatherRequest>,
  ): Promise<Partial<Weather>>;

  getWeeklyTemp(
    weatherRequest: Partial<WeatherRequest>,
  ): Promise<Partial<Weather>>;
}
