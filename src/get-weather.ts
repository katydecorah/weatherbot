import fetch from "node-fetch";
import { getInput } from "@actions/core";

export default async function getWeather() {
  try {
    const response = await fetch(
      `https://api.darksky.net/forecast/${getInput(
        "DarkSkySecretKey"
      )}/${getInput("Latitude")},${getInput("Longitude")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return (await response.json()) as Weather;
  } catch (error) {
    throw new Error(error);
  }
}

export type Datum = {
  time: number;
  summary: string;
  icon: string;
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  precipAccumulation: number;
  precipIntensity: number;
  precipIntensityMax: number;
  precipProbability: number;
  temperature: number;
  temperatureMin: number;
  temperatureMinTime: number;
  temperatureMax: number;
  temperatureMaxTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;
  dewPoint: number;
  humidity: number;
  windSpeed: number;
  windBearing: number;
  visibility: number;
  cloudCover: number;
  pressure: number;
  ozone: number;
  precipIntensityMaxTime?: number;
  precipType: string;
};

export interface Currently extends Datum {
  time: number;
  summary: string;
  icon: string;
}

export interface Interval {
  summary: string;
  icon: string;
  data: Datum[];
}

export interface Alerts {
  title: string;
  regions: string[];
  severity: string;
  time: number;
  expires: number;
  description: string;
  uri: string;
}

export type Weather = {
  latitude: number;
  longitude: number;
  timezone: string;
  offset: number;
  currently: Currently;
  minutely: Interval;
  hourly: Interval;
  daily: Interval;
  flags: {
    sources: string[];
    "lamp-stations": string[];
    "isd-stations": string[];
    "madis-stations": string[];
    units: string;
  };
  alerts: Alerts[];
};
