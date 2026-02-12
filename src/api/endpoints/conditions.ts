import type { ApiClient, JsonRequestInit } from "../client";
import type {
    SnotelStationDetail,
    StreamGaugeDetail,
    AqiSiteDetail,
    AvalancheZoneDetail,
    ChallengeConditions,
    PublicLandConditions,
    PeakConditionsHistory,
    ConditionsHistoryRange,
} from "../../types/ConditionsApi";

/** Minimal GeoJSON FeatureCollection shape (avoids @types/geojson dependency) */
interface FeatureCollection {
    type: "FeatureCollection";
    features: { type: "Feature"; geometry: any; properties: any }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Map Layer Bbox Endpoints
// ─────────────────────────────────────────────────────────────────────────────

export async function getMapSnotel(
    client: ApiClient,
    bbox: string,
    init?: JsonRequestInit
): Promise<FeatureCollection> {
    return await client.fetchJson<FeatureCollection>(
        `/map/snotel?bbox=${encodeURIComponent(bbox)}`,
        init
    );
}

export async function getMapStreamflow(
    client: ApiClient,
    bbox: string,
    init?: JsonRequestInit
): Promise<FeatureCollection> {
    return await client.fetchJson<FeatureCollection>(
        `/map/streamflow?bbox=${encodeURIComponent(bbox)}`,
        init
    );
}

export async function getMapAqi(
    client: ApiClient,
    bbox: string,
    init?: JsonRequestInit
): Promise<FeatureCollection> {
    return await client.fetchJson<FeatureCollection>(
        `/map/aqi?bbox=${encodeURIComponent(bbox)}`,
        init
    );
}

export async function getMapAlerts(
    client: ApiClient,
    bbox: string,
    init?: JsonRequestInit
): Promise<FeatureCollection> {
    return await client.fetchJson<FeatureCollection>(
        `/map/alerts?bbox=${encodeURIComponent(bbox)}`,
        init
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Area Conditions (Challenge + Public Land)
// ─────────────────────────────────────────────────────────────────────────────

export async function getChallengeConditions(
    client: ApiClient,
    challengeId: string | number,
    init?: JsonRequestInit
): Promise<ChallengeConditions> {
    return await client.fetchJson<ChallengeConditions>(
        `/challenges/${challengeId}/conditions`,
        init
    );
}

export async function getPublicLandConditions(
    client: ApiClient,
    objectId: string,
    init?: JsonRequestInit
): Promise<PublicLandConditions> {
    return await client.fetchJson<PublicLandConditions>(
        `/map/public-lands/${encodeURIComponent(objectId)}/conditions`,
        init
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual Source Detail Endpoints
// ─────────────────────────────────────────────────────────────────────────────

export async function getSnotelStationDetail(
    client: ApiClient,
    stationId: string,
    params?: { history?: string },
    init?: JsonRequestInit
): Promise<SnotelStationDetail> {
    const searchParams = new URLSearchParams();
    if (params?.history) searchParams.set("history", params.history);
    const qs = searchParams.toString();
    return await client.fetchJson<SnotelStationDetail>(
        `/conditions/snotel/${encodeURIComponent(stationId)}${qs ? `?${qs}` : ""}`,
        init
    );
}

export async function getStreamGaugeDetail(
    client: ApiClient,
    siteId: string,
    params?: { history?: string },
    init?: JsonRequestInit
): Promise<StreamGaugeDetail> {
    const searchParams = new URLSearchParams();
    if (params?.history) searchParams.set("history", params.history);
    const qs = searchParams.toString();
    return await client.fetchJson<StreamGaugeDetail>(
        `/conditions/streamflow/${encodeURIComponent(siteId)}${qs ? `?${qs}` : ""}`,
        init
    );
}

export async function getAqiSiteDetail(
    client: ApiClient,
    siteId: string,
    params?: { history?: string },
    init?: JsonRequestInit
): Promise<AqiSiteDetail> {
    const searchParams = new URLSearchParams();
    if (params?.history) searchParams.set("history", params.history);
    const qs = searchParams.toString();
    return await client.fetchJson<AqiSiteDetail>(
        `/conditions/aqi/${encodeURIComponent(siteId)}${qs ? `?${qs}` : ""}`,
        init
    );
}

export async function getAvalancheZoneDetail(
    client: ApiClient,
    centerId: string,
    zoneId: string,
    init?: JsonRequestInit
): Promise<AvalancheZoneDetail> {
    return await client.fetchJson<AvalancheZoneDetail>(
        `/conditions/avalanche/${encodeURIComponent(centerId)}/${encodeURIComponent(zoneId)}`,
        init
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Peak Conditions History
// ─────────────────────────────────────────────────────────────────────────────

export async function getPeakConditionsHistory(
    client: ApiClient,
    peakId: string,
    params?: { range?: ConditionsHistoryRange; sources?: string[] },
    init?: JsonRequestInit
): Promise<PeakConditionsHistory> {
    const searchParams = new URLSearchParams();
    if (params?.range) searchParams.set("range", params.range);
    if (params?.sources?.length) searchParams.set("sources", params.sources.join(","));
    const qs = searchParams.toString();
    return await client.fetchJson<PeakConditionsHistory>(
        `/peaks/${encodeURIComponent(peakId)}/conditions/history${qs ? `?${qs}` : ""}`,
        init
    );
}
