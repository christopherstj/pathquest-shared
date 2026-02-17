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

export type HazardType = "avalanche" | "air_quality" | "fire";
export type HazardSeverity = "caution" | "warning" | "danger";

export interface HazardFlag {
    type: HazardType;
    severity: HazardSeverity;
    message: string;
}

export interface SummitWindowDay {
    date: string;
    score: number; // 0-100
    label: SummitWindowLabel;
    factors: SummitWindowFactors;
    summary: string; // e.g. "Clear with light winds"
    hazards?: HazardFlag[]; // present when non-weather hazards affect this day
}

export interface SummitWindow {
    days: SummitWindowDay[];
    bestDay: string | null; // date of highest-scoring day
    bestScore: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Avalanche Forecast
// ─────────────────────────────────────────────────────────────────────────────

/** 0=No Rating, 1=Low, 2=Moderate, 3=Considerable, 4=High, 5=Extreme */
export type AvalancheDangerLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface AvalancheDangerRating {
    date: string;
    upper: AvalancheDangerLevel;
    middle: AvalancheDangerLevel;
    lower: AvalancheDangerLevel;
}

export interface AvalancheProblem {
    name: string;
    likelihood: string;
    size: string;
    aspects: string[];
    elevationBand: string;
}

export interface AvalancheForecast {
    danger: AvalancheDangerRating[];
    problems: AvalancheProblem[];
    summary: string | null;
    forecastUrl: string | null;
    publishedAt: string | null;
    expiresAt: string | null;
    zoneId: string;
    zoneName: string;
    centerId: string;
    centerName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SNOTEL Data
// ─────────────────────────────────────────────────────────────────────────────

export interface SnotelStationCurrent {
    snowDepthIn: number | null;
    sweIn: number | null;
    temperatureF: number | null;
    snowDepthChange24hIn: number | null;
}

export interface SnotelHistoryDay {
    date: string;
    snowDepthIn: number | null;
    sweIn: number | null;
    temperatureF: number | null;
}

export interface SnotelStation {
    stationId: string;
    name: string;
    distanceM: number;
    elevationM: number | null;
    current: SnotelStationCurrent;
    history7d: SnotelHistoryDay[];
}

export type SnotelTrend = "increasing" | "decreasing" | "stable" | "unknown";

export interface SnotelData {
    stations: SnotelStation[];
    nearestStation: string | null;
    snowTrend: SnotelTrend;
}

// ─────────────────────────────────────────────────────────────────────────────
// NWS Alerts
// ─────────────────────────────────────────────────────────────────────────────

export type AlertSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";

export interface NwsAlertZone {
    id: string;
    name: string;
}

export interface NwsAlert {
    id: string;
    event: string;
    severity: AlertSeverity;
    urgency: string;
    certainty: string;
    headline: string;
    description: string;
    instruction: string | null;
    onset: string | null;
    expires: string | null;
    zones: NwsAlertZone[];
}

export interface NwsAlerts {
    alerts: NwsAlert[];
    activeCount: number;
    maxSeverity: AlertSeverity | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stream Flow
// ─────────────────────────────────────────────────────────────────────────────

export type StreamFlowStatus = "low" | "normal" | "high" | "flood" | "unknown";

export interface StreamGaugeCurrent {
    dischargeCfs: number | null;
    gageHeightFt: number | null;
    dateTime: string | null;
}

export interface StreamGauge {
    siteId: string;
    siteName: string;
    distanceM: number;
    current: StreamGaugeCurrent;
    percentile: number | null;
    status: StreamFlowStatus;
}

export interface StreamFlow {
    gauges: StreamGauge[];
    nearestGauge: string | null;
    crossingAlert: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Air Quality
// ─────────────────────────────────────────────────────────────────────────────

export interface AirQualityCurrent {
    aqi: number;
    category: string;
    categoryNumber: number;
    pm25: number | null;
    ozone: number | null;
    dominantPollutant: string | null;
    reportingArea: string | null;
    dateObserved: string | null;
}

export interface AirQualityForecastDay {
    date: string;
    aqi: number;
    category: string;
    categoryNumber: number;
}

export type SmokeImpact = "none" | "possible" | "likely" | "active";

export interface AirQuality {
    current: AirQualityCurrent;
    forecast: AirQualityForecastDay[];
    smokeImpact: SmokeImpact;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fire Proximity
// ─────────────────────────────────────────────────────────────────────────────

export type SmokeRisk = "none" | "possible" | "likely" | "active";

export interface NearbyFire {
    incidentId?: string;
    name: string;
    acres: number | null;
    containmentPercent: number | null;
    distanceKm: number;
    direction: string;
    incidentType: string | null;
    state: string | null;
}

export interface FireProximity {
    nearbyFires: NearbyFire[];
    closestFireKm: number | null;
    activeFiresWithin50km: number;
    smokeRisk: SmokeRisk;
}

// ─────────────────────────────────────────────────────────────────────────────
// Road Access
// ─────────────────────────────────────────────────────────────────────────────

export type RoadStatus = "open" | "chains_required" | "closed" | "unknown";

export interface RoadSegment {
    routeName: string;
    segmentDescription: string | null;
    status: RoadStatus;
    conditions: string | null;
    travelAdvisory: string | null;
    closureReason: string | null;
    expectedReopening: string | null;
    lastUpdated: string | null;
}

export interface RoadAccess {
    roads: RoadSegment[];
    anyClosures: boolean;
    anyChainLaw: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Trail Conditions
// ─────────────────────────────────────────────────────────────────────────────

export interface TrailAlert {
    source: string;
    title: string;
    description: string;
    category: string;
    areaName: string | null;
    url: string | null;
    publishedAt: string | null;
}

export interface TrailClosure {
    title: string;
    description: string;
    areaName: string | null;
    url: string | null;
}

export interface FireRestrictions {
    level: number;
    description: string;
}

export interface TrailConditions {
    alerts: TrailAlert[];
    closures: TrailClosure[];
    fireRestrictions: FireRestrictions | null;
    activeClosure: boolean;
    activeAlertCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gear Recommendations
// ─────────────────────────────────────────────────────────────────────────────

export type GearPriority = "required" | "recommended" | "optional";

export interface GearItem {
    name: string;
    category: string;
    reason: string;
    priority: GearPriority;
}

export interface GearRecommendations {
    items: GearItem[];
    conditionsSummary: string | null;
    updatedAt: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Peak Conditions Response
// ─────────────────────────────────────────────────────────────────────────────

export interface PeakConditions {
    peakId: string;

    // Phase 1: Weather
    weather: WeatherForecast | null;
    recentWeather: RecentWeather | null;
    summitWindow: SummitWindow | null;
    weatherUpdatedAt: string | null;

    // Phase 2: Snow & Avalanche
    avalanche: AvalancheForecast | null;
    avalancheUpdatedAt: string | null;
    snotel: SnotelData | null;
    snotelUpdatedAt: string | null;

    // Phase 3: NWS Alerts
    nwsAlerts: NwsAlerts | null;
    nwsAlertsUpdatedAt: string | null;

    // Phase 4: Water & Trails
    streamFlow: StreamFlow | null;
    streamFlowUpdatedAt: string | null;
    trailConditions: TrailConditions | null;
    trailConditionsUpdatedAt: string | null;

    // Phase 5: Air Quality & Fire
    airQuality: AirQuality | null;
    airQualityUpdatedAt: string | null;
    fireProximity: FireProximity | null;
    fireProximityUpdatedAt: string | null;

    // Phase 6: Access
    roadAccess: RoadAccess | null;
    roadAccessUpdatedAt: string | null;

    // Aggregate
    gearRecommendations: GearRecommendations | null;
    gearUpdatedAt: string | null;
}
