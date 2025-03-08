/* eslint-disable no-unused-vars */
export type Weather = {
  current: {
    temperature_2m: number | number[];
  };
  daily: {
    temperature_2m_max: number | number[];
    time: string[];
  };
};

export type WeatherRequest = {
  latitude: number;
  longitude: number;
  current: string;
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
