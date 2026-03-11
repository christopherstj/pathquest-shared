export type RoutePlanSourceType =
    | "gpx_upload"
    | "geojson_upload"
    | "strava_activity"
    | "strava_route";

export type AnalysisStatus = "pending" | "analyzing" | "completed" | "failed";

export interface RoutePlan {
    id: string;
    sourceType: RoutePlanSourceType;
    sourceId: string | null;
    name: string;
    distanceM: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    elevationProfile: ElevationPoint[] | null;
    plannedDate: string | null;
    plannedDays: number;
    analysisStatus: AnalysisStatus;
    analyzedAt: string | null;
    createdAt: string;
    coords?: [number, number][]; // [lng, lat][] — only in detail response
}

export interface ElevationPoint {
    distanceM: number;
    elevationM: number;
}

export interface SurfaceSegment {
    startM: number;
    endM: number;
    type: "trail" | "road" | "off_trail";
    subtype: string | null; // footway, track, path, secondary, etc.
    surface: string | null; // paved, gravel, dirt, etc.
    name: string | null;
}

export interface WaterCrossing {
    distanceM: number;
    name: string | null;
    waterwayType: string | null;
    lat: number;
    lng: number;
}

export interface ConditionSample {
    distanceM: number;
    lat: number;
    lng: number;
    elevationM: number | null;
    score: number;
    label: string;
    factor: string | null;
    dailyScores: ConditionSampleDay[] | null;
    hazards: { type: string; severity: string; message: string }[] | null;
}

export interface ConditionSampleDay {
    date: string;
    score: number;
    label: string;
    factor: string | null;
    summary: string | null;
    weather: ConditionSampleWeather | null;
}

export interface ConditionSampleWeather {
    tempHighC: number;
    tempLowC: number;
    windSpeedKmh: number;
    windGustsKmh: number;
    precipProb: number;
    precipSumMm: number;
    cloudCover: number;
}

export interface SnowpackSample {
    distanceM: number;
    lat: number;
    lng: number;
    snowDepthIn: number | null;
    sweIn: number | null;
}

export interface RoutePeakAlongRoute {
    peakId: string;
    name: string;
    elevationM: number;
    distanceFromRouteM: number;
    distanceAlongM: number;
    lat: number;
    lng: number;
}

export interface RoutePOIAlongRoute {
    poiId: number;
    name: string;
    poiType: string;
    distanceFromRouteM: number;
    distanceAlongM: number;
    lat: number;
    lng: number;
}

export interface RouteAvalancheZone {
    centerId: string;
    zoneId: string;
    zoneName: string;
    centerName: string;
    danger: unknown;
    problems: unknown;
    summary: string | null;
}

export interface RouteNwsAlert {
    alertId: string;
    event: string;
    severity: string;
    headline: string;
    description: string | null;
}

export interface RouteFireProximity {
    incidentId: string;
    name: string;
    distanceKm: number;
    acres: number | null;
    containment: number | null;
}

export interface RouteAqiObservation {
    siteId: string;
    aqi: number;
    category: string;
    distanceKm: number;
}

export interface RouteSnotelStation {
    stationId: string;
    name: string;
    distanceKm: number;
    snowDepthIn: number | null;
    sweIn: number | null;
}

export interface RouteThunderstormDay {
    day: number;
    riskLevel: string;
    riskLabel: string;
}

export interface RouteWildlifeSafety {
    inGrizzlyRange: boolean;
    ecosystems: string[];
}

export interface RouteAnalysis {
    surfaceBreakdown: {
        trailM: number;
        roadM: number;
        offTrailM: number;
        trailPct: number;
        roadPct: number;
        offTrailPct: number;
    };
    surfaceSegments: SurfaceSegment[] | null;
    waterCrossings: WaterCrossing[] | null;
    conditionsSamples: ConditionSample[] | null;
    avalancheZones: RouteAvalancheZone[] | null;
    nwsAlerts: RouteNwsAlert[] | null;
    fireProximity: RouteFireProximity[] | null;
    aqiObservations: RouteAqiObservation[] | null;
    snotelStations: RouteSnotelStation[] | null;
    thunderstormRisk: RouteThunderstormDay[] | null;
    snowpackSamples: SnowpackSample[] | null;
    peaksAlongRoute: RoutePeakAlongRoute[] | null;
    poisAlongRoute: RoutePOIAlongRoute[] | null;
    wildlifeSafety: RouteWildlifeSafety | null;
    overallScore: number | null;
    overallLabel: string | null;
    hazardSummary: string[] | null;
    gearRecommendations: { items: unknown[] } | null;
    computedAt: string;
}

export interface RoutePlanWithAnalysis extends RoutePlan {
    analysis: RouteAnalysis | null;
}

export interface CreateRoutePlanBody {
    fileContent: string; // base64 encoded
    fileName: string;
    name: string;
    plannedDate?: string;
    plannedDays?: number;
}

export interface CreateRoutePlanFromActivityBody {
    activityId: string;
    name?: string;
    plannedDate?: string;
    plannedDays?: number;
}

export interface CreateRoutePlanResponse {
    id: string;
    name: string;
    analysisStatus: AnalysisStatus;
}
