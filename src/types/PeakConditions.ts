import type { CurrentWeather } from "./CurrentWeather";

// ─────────────────────────────────────────────────────────────────────────────
// Weather Forecast
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use CurrentWeather directly */
export type WeatherForecastCurrent = CurrentWeather;

export interface WeatherForecastDaily {
    date: string;
    weatherCode: number | null;
    tempHigh: number | null; // Celsius
    tempLow: number | null; // Celsius
    precipProbability: number | null; // percent
    precipSum: number | null; // mm
    snowfallSum: number | null; // cm
    windSpeed: number | null; // km/h
    windGusts: number | null; // km/h
    windDirection: number | null; // degrees
    cloudCover: number | null; // percent
    sunrise: string | null; // ISO time
    sunset: string | null; // ISO time
    daylightSeconds: number | null;
    uvIndexMax: number | null;
}

export interface WeatherForecast {
    current: CurrentWeather;
    daily: WeatherForecastDaily[];
    timezone: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent Weather (last 7 days observed)
// ─────────────────────────────────────────────────────────────────────────────

export interface RecentWeatherDay {
    date: string;
    tempHigh: number | null; // Celsius
    tempLow: number | null; // Celsius
    precipSum: number | null; // mm
    snowfallSum: number | null; // cm
    weatherCode: number | null;
    windSpeedMax: number | null; // km/h
}

export interface RecentWeather {
    days: RecentWeatherDay[];
    totalPrecipMm: number | null;
    totalSnowfallCm: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Summit Window (7-day climbability scores)
// ─────────────────────────────────────────────────────────────────────────────

export type SummitWindowLabel =
    | "Excellent"
    | "Good"
    | "Marginal"
    | "Poor"
    | "Dangerous";

export interface SummitWindowFactors {
    wind: number; // 0-100
    precipitation: number; // 0-100
    temperature: number; // 0-100
    stormTiming: number; // 0-100
    daylight: number; // 0-100
    cloudCover: number; // 0-100
}

export interface SummitWindowDay {
    date: string;
    score: number; // 0-100
    label: SummitWindowLabel;
    factors: SummitWindowFactors;
    summary: string; // e.g. "Clear with light winds"
}

export interface SummitWindow {
    days: SummitWindowDay[];
    bestDay: string | null; // date of highest-scoring day
    bestScore: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Peak Conditions Response
// ─────────────────────────────────────────────────────────────────────────────

export interface PeakConditions {
    peakId: string;
    weather: WeatherForecast | null;
    recentWeather: RecentWeather | null;
    summitWindow: SummitWindow | null;
    weatherUpdatedAt: string | null; // ISO timestamp
}
