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
    startCoords: [number, number] | null; // [lng, lat]
    coords?: [number, number][]; // [lng, lat][] — only in detail response
}

export interface ElevationPoint {
    distanceM: number;
    elevationM: number;
}

export interface SurfaceSegment {
    startM: number;
    endM: number;
    type: "trail" | "paved" | "unpaved" | "off_trail";
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
    dischargeCfs: number | null;
    gageHeightFt: number | null;
    streamflowPercentile: number | null;
    streamflowStatus: string | null;
    gaugeName: string | null;
    gaugeSiteId: string | null;
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
    hourly: HourlyForecastPoint[] | null;
    hazards: { type: string; severity: string; message: string }[] | null;
}

export interface HourlyForecastPoint {
    time: string;       // ISO e.g. "2026-03-12T10:00"
    tempC: number;
    windSpeedKmh: number;
    windGustsKmh: number;
    precipProb: number;
    precipMm: number;
    cloudCover: number;
    cape: number;
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
    elevationM: number | null;
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
    conditionScore: number | null;
    conditionLabel: string | null;
    conditionFactor: string | null;
    publicSummitCount: number;
    thumbnailUrl: string | null;
}

export interface RoutePOIAlongRoute {
    poiId: number;
    name: string | null;
    poiType: string;
    distanceFromRouteM: number;
    distanceAlongM: number;
    lat: number;
    lng: number;
    conditionScore: number | null;
    conditionLabel: string | null;
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
        pavedM: number;
        unpavedM: number;
        offTrailM: number;
        trailPct: number;
        pavedPct: number;
        unpavedPct: number;
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

export interface ListRoutePlansResponse {
    plans: RoutePlan[];
    total: number;
}

export interface CreateRoutePlanResponse {
    id: string;
    name: string;
    analysisStatus: AnalysisStatus;
}

export interface RouteConditionsResponse {
    conditionsSamples: ConditionSample[];
}

export interface StravaRouteListItem {
    id: string;
    name: string;
    description: string;
    distance: number;
    elevationGain: number;
    type: number;
    starred: boolean;
    createdAt: string;
    summaryPolyline: string | null;
    estimatedMovingTime: number | null;
}

export interface ListStravaRoutesResponse {
    routes: StravaRouteListItem[];
}

export interface CreateRoutePlanFromStravaRouteBody {
    stravaRouteId: string;
    name?: string;
    plannedDate?: string;
    plannedDays?: number;
}

// ---------------------------------------------------------------------------
// Route generation (AI candidates)
// ---------------------------------------------------------------------------

export type RouteFormat = "loop" | "point_to_point" | "out_and_back";

export interface RouteConstraints {
    distanceM?: number;
    elevationGainM?: number;
    surface?: "trail" | "road" | "any";
}

export interface CandidateConditions {
    avalancheZones: { centerId: string; zoneId: string; zoneName: string; danger: unknown }[];
    nwsAlerts: { event: string; severity: string; headline: string | null }[];
    fireProximity: { name: string | null; distanceKm: number; acres: number | null }[];
    maxWindGustKmh: number | null;
    hazardFlags: string[];
}

export interface RouteCandidate {
    candidateId: number;
    coords: [number, number][];         // simplified [lng, lat] for preview
    fullCoordCount: number;
    distanceM: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    elevationProfile: ElevationPoint[] | null;
    estimatedTimeMin: number | null;
    constraintScore: number;            // 0-100, how well it matches constraints
    conditions: CandidateConditions | null;
}

export interface GenerateRoutePlanBody {
    start?: { lat: number; lng: number };
    mapCenter?: { lat: number; lng: number };
    userLocation?: { lat: number; lng: number };
    format?: RouteFormat;
    constraints?: RouteConstraints;
    waypoints?: { lat: number; lng: number }[];
    destination?: { lat: number; lng: number };
    candidateCount?: number;
    includeConditions?: boolean;
    prompt?: string;
}

export interface GenerateRoutePlanResponse {
    sessionId: string;
    candidates: RouteCandidate[];
}

/** SSE event types streamed by POST /route-plans/generate */
export type GenerateRouteEvent =
    | { event: "status"; data: { message: string } }
    | { event: "result"; data: GenerateRoutePlanResponse }
    | { event: "error"; data: { message: string } };

export interface CreateFromGeometryBody {
    sessionId?: string;
    candidateId?: number;
    coords?: [number, number][];
    name: string;
    sourceType?: string;
    plannedDate?: string;
    plannedDays?: number;
}
