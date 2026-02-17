// ─────────────────────────────────────────────────────────────────────────────
// Map Layer GeoJSON Property Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SnotelMapProperties {
    stationId: string;
    name: string;
    elevationM: number | null;
    snowDepthIn: number | null;
    sweIn: number | null;
    temperatureF: number | null;
    snowDepthChange24hIn: number | null;
    snowTrend: string | null;
    fetchedAt: string | null;
}

export interface StreamflowMapProperties {
    siteId: string;
    name: string;
    dischargeCfs: number | null;
    gageHeightFt: number | null;
    observedAt: string | null;
    status: string;
}

export interface AqiMapProperties {
    siteId: string;
    siteName: string;
    aqi: number | null;
    category: string | null;
    categoryNumber: number | null;
    dominantPollutant: string | null;
    smokeImpact: string | null;
    observedAt: string | null;
}

export interface AlertMapAlert {
    alertId: string;
    event: string;
    severity: string;
    headline: string;
    onset: string | null;
    expires: string | null;
}

export interface AlertMapProperties {
    zoneId: string;
    zoneName: string;
    state: string;
    alerts: AlertMapAlert[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Source Nearby Peak (shared by detail endpoints)
// ─────────────────────────────────────────────────────────────────────────────

export interface SourceNearbyPeak {
    id: string;
    name: string;
    distanceM: number;
    elevation?: number | null;
    state?: string | null;
    public_summits?: number;
    summits?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual Source Detail Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SnotelStationDetail {
    stationId: string;
    name: string;
    location: [number, number]; // [lng, lat]
    elevationM: number | null;
    current: {
        snowDepthIn: number | null;
        sweIn: number | null;
        temperatureF: number | null;
        snowDepthChange24hIn: number | null;
    } | null;
    snowTrend: string | null;
    history: SnotelHistoryRecord[];
    fetchedAt: string | null;
    nearbyPeaks: SourceNearbyPeak[];
}

export interface SnotelHistoryRecord {
    date: string;
    snowDepthIn: number | null;
    sweIn: number | null;
    tempAvgC: number | null;
    tempMinC: number | null;
    tempMaxC: number | null;
    precipAccumIn: number | null;
}

export interface StreamGaugeDetail {
    siteId: string;
    name: string;
    location: [number, number];
    current: {
        dischargeCfs: number | null;
        gageHeightFt: number | null;
        observedAt: string | null;
    };
    status: string;
    history: StreamflowHistoryRecord[];
    fetchedAt: string | null;
    nearbyPeaks: SourceNearbyPeak[];
}

export interface StreamflowHistoryRecord {
    date: string;
    dischargeCfs: number | null;
    gageHeightFt: number | null;
}

export interface AqiSiteDetail {
    siteId: string;
    siteName: string;
    location: [number, number];
    current: {
        aqi: number;
        category: string;
        categoryNumber: number;
        pm25: number | null;
        ozone: number | null;
        dominantPollutant: string | null;
    };
    smokeImpact: string | null;
    history: AqiHistoryRecord[];
    fetchedAt: string | null;
}

export interface AqiHistoryRecord {
    date: string;
    aqi: number | null;
    pm25Aqi: number | null;
    ozoneAqi: number | null;
    dominantPollutant: string | null;
    category: string | null;
    categoryNumber: number | null;
}

export interface NwsZoneDetail {
    zoneId: string;
    zoneName: string;
    state: string | null;
    zoneType: string | null;
    alerts: {
        alertId: string;
        event: string;
        severity: string;
        urgency: string;
        certainty: string;
        headline: string;
        description: string;
        instruction: string | null;
        onset: string | null;
        expires: string | null;
    }[];
    activeAlertCount: number;
    maxSeverity: string | null;
    nearbyPeaks: SourceNearbyPeak[];
    geometry?: any;
    centroid?: [number, number];
    affectedPublicLands?: { objectId: string; name: string; designationType: string; manager: string; acres: number | null }[];
}

export interface AvalancheZoneDetail {
    centerId: string;
    zoneId: string;
    zoneName: string;
    centerName: string;
    danger: any;
    problems: any;
    summary: string | null;
    forecastUrl: string | null;
    publishedAt: string | null;
    expiresAt: string | null;
    nearbyPeaks: SourceNearbyPeak[];
    geometry?: any;
    centroid?: [number, number];
    affectedPublicLands?: { objectId: string; name: string; designationType: string; manager: string; acres: number | null }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Area Conditions Summary (Challenge + Public Land)
// ─────────────────────────────────────────────────────────────────────────────

export interface AreaConditionsSummary {
    peakCount: number;
    peaksWithConditions: number;
    weather: {
        tempRangeCelsius: { min: number; max: number } | null;
        worstWeatherCode: number | null;
        maxWindSpeedKmh: number | null;
        maxPrecipProbability: number | null;
    } | null;
    bestSummitWindow: {
        peakId: string;
        peakName: string;
        bestDay: string;
        bestScore: number;
    } | null;
    avalanche: {
        maxDangerLevel: number;
        zonesWithConsiderable: number;
        zones: { centerId: string; zoneId: string; zoneName: string; maxDanger: number }[];
    } | null;
    nwsAlerts: {
        totalActiveAlerts: number;
        maxSeverity: string;
        events: string[];
        alerts?: { event: string; severity: string; headline: string | null }[];
    } | null;
    airQuality: {
        worstAqi: number;
        worstCategory: string;
        smokeImpact: string;
    } | null;
    fireProximity: {
        closestFireKm: number;
        totalFiresWithin50km: number;
        smokeRisk: string;
        fires?: { incidentId: string; name: string; acres: number | null; percentContained: number | null; distanceKm: number }[];
    } | null;
    snotel: {
        maxSnowDepthIn: number;
        avgSnowDepthIn: number;
        snowTrend: string;
    } | null;
    streamFlow: {
        anyHighWater: boolean;
        anyCrossingAlert: boolean;
    } | null;
    updatedAt: string;
}

export interface ChallengeConditions extends AreaConditionsSummary {
    challengeId: number;
}

export interface PublicLandConditions extends AreaConditionsSummary {
    publicLandId: string;
    publicLandName: string;
    designationType: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Peak Conditions History
// ─────────────────────────────────────────────────────────────────────────────

export type ConditionsHistoryRange = "30d" | "90d" | "1y";

export interface PeakConditionsHistory {
    peakId: string;
    range: ConditionsHistoryRange;
    snotel: {
        stationId: string;
        stationName: string;
        history: SnotelHistoryRecord[];
    }[] | null;
    streamFlow: {
        siteId: string;
        siteName: string;
        history: StreamflowHistoryRecord[];
    }[] | null;
    airQuality: {
        siteId: string;
        siteName: string;
        history: {
            date: string;
            aqi: number | null;
            pm25Aqi: number | null;
            ozoneAqi: number | null;
            category: string | null;
        }[];
    }[] | null;
}
