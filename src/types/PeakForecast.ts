export interface DailyForecast {
    date: string;
    weatherCode: number | null;
    tempHigh: number | null; // Celsius
    tempLow: number | null; // Celsius
    precipProbability: number | null; // percent
    windSpeed: number | null; // km/h
    cloudCover: number | null; // percent
}

export default interface PeakForecast {
    daily: DailyForecast[];
    sunrise: string | null; // ISO time for today
    sunset: string | null; // ISO time for today
    daylightSeconds: number | null;
}

