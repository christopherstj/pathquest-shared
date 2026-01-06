export interface DailyForecast {
    date: string;
    weatherCode: number | null;
    tempHigh: number | null; // Celsius
    tempLow: number | null; // Celsius
    precipProbability: number | null; // percent
    windSpeed: number | null; // km/h
    windDirection: number | null; // degrees (meteorological; coming FROM)
    cloudCover: number | null; // percent
    sunrise: string | null; // ISO time for this day
    sunset: string | null; // ISO time for this day
}

export default interface PeakForecast {
    daily: DailyForecast[];
    sunrise: string | null; // ISO time for today
    sunset: string | null; // ISO time for today
    daylightSeconds: number | null;
}

