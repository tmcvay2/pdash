import WeatherService from "@/services/Weather/WeatherSerivce";
import { Weather } from "@/types/Weather";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface WeatherUI {
  style?: object;
}

export function WeatherView({ style }: WeatherUI) {
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

  const weeklyTemp = weather?.daily?.temperature_2m_max;
  const currentTemp = weather?.current?.temperature_2m;

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (weather === null) {
    return <Text>Error fetching weather data</Text>;
  }
  console.log("Daily time array:", weather?.daily?.time);

  const formatDays = weather.daily?.time.map(
    (isoDate: string, index: number) => {
      const zonedDate = toZonedTime(isoDate, "America/Chicago");

      if (index === 0) {
        return "Today";
      }
      return format(zonedDate, "EEE");
    },
  );

  return (
    <View style={[styles.container1, styles.box1, style]}>
      <View style={[styles.box]}>
        <Text style={[styles.cityText]}>Chicago, IL</Text>
        {currentTemp !== undefined && (
          <Text style={[styles.currentTempText]}>{currentTemp} °F</Text>
        )}
      </View>
      <View style={styles.container2}>
        {Array.isArray(weeklyTemp) && Array.isArray(formatDays) ? (
          weeklyTemp.map((num, index) => (
            <View key={index} style={styles.tempBox}>
              <Text style={styles.tempItem}>{formatDays[index]}</Text>
              <Text style={[styles.tempItem]}>{num}°F</Text>
            </View>
          ))
        ) : (
          <Text>{weeklyTemp}°F</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    paddingLeft: 10,
    flexDirection: "row",
  },
  cityText: {
    fontSize: 30,
  },
  currentTempText: {
    fontSize: 48,
  },
  box1: {
    width: "60%",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "black",
  },
  box: {
    width: "20%",
    alignItems: "center",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tempBox: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  tempItem: {
    marginHorizontal: 5,
  },
});
