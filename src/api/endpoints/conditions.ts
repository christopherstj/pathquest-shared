import type { ApiClient, JsonRequestInit } from "../client";
import type {
    SnotelStationDetail,
    StreamGaugeDetail,
    AqiSiteDetail,
    NwsZoneDetail,
    AvalancheZoneDetail,
    ChallengeConditions,
    PublicLandConditions,
    PeakConditionsHistory,
    ConditionsHistoryRange,
} from "../../types/ConditionsApi";
import type { SnowPointData } from "../../types/SnowPoint";
import type { FireDetail } from "../../types/FireDetail";
import type { PublicLandDetail, PublicLandPeaksResult } from "../../types/PublicLandDetail";

/** Minimal GeoJSON FeatureCollection shape (avoids @types/geojson dependency) */
interface FeatureCollection {
    type: "FeatureCollection";
    features: { type: "Feature"; geometry: any; properties: any }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ISR Catalog Endpoints (for static generation)
// ─────────────────────────────────────────────────────────────────────────────

export type PublicLandCatalogItem = { objectId: string };
export type AvalancheZoneCatalogItem = { centerId: string; zoneId: string };

/** Public lands ≥1000 acres that contain at least one peak */
export async function getPublicLandCatalog(
    client: ApiClient,
    init?: JsonRequestInit
): Promise<PublicLandCatalogItem[]> {
    return await client.fetchJson<PublicLandCatalogItem[]>(
        "/map/public-lands/catalog",
        init
    );
}

/** All avalanche zone center_id/zone_id pairs */
export async function getAvalancheZoneCatalog(
    client: ApiClient,
    init?: JsonRequestInit
): Promise<AvalancheZoneCatalogItem[]> {
    return await client.fetchJson<AvalancheZoneCatalogItem[]>(
        "/conditions/avalanche/catalog",
        init
    );
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

export async function getMapAvalanches(
    client: ApiClient,
    bbox: string,
    init?: JsonRequestInit
): Promise<FeatureCollection> {
    return await client.fetchJson<FeatureCollection>(
        `/map/avalanche?bbox=${encodeURIComponent(bbox)}`,
        init
    );
}

export async function getMapFires(
    client: ApiClient,
    bbox: string,
    init?: JsonRequestInit
): Promise<FeatureCollection> {
    return await client.fetchJson<FeatureCollection>(
        `/map/fires?bbox=${encodeURIComponent(bbox)}`,
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

export async function getNwsZoneDetail(
    client: ApiClient,
    zoneId: string,
    init?: JsonRequestInit
): Promise<NwsZoneDetail> {
    return await client.fetchJson<NwsZoneDetail>(
        `/conditions/nws/${encodeURIComponent(zoneId)}`,
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

// ─────────────────────────────────────────────────────────────────────────────
// Snow Analysis (NOHRSC)
// ─────────────────────────────────────────────────────────────────────────────

export async function getSnowPoint(
    client: ApiClient,
    params: { lat: number; lng: number },
    init?: JsonRequestInit
): Promise<SnowPointData> {
    const searchParams = new URLSearchParams();
    searchParams.set("lat", String(params.lat));
    searchParams.set("lng", String(params.lng));
    return await client.fetchJson<SnowPointData>(
        `/snow/point?${searchParams.toString()}`,
        init
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fire Detail
// ─────────────────────────────────────────────────────────────────────────────

export async function getFireDetail(
    client: ApiClient,
    incidentId: string,
    init?: JsonRequestInit
): Promise<FireDetail> {
    return await client.fetchJson<FireDetail>(
        `/fires/${encodeURIComponent(incidentId)}`,
        init
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Land Detail + Peaks
// ─────────────────────────────────────────────────────────────────────────────

export async function getPublicLandDetail(
    client: ApiClient,
    objectId: string,
    params?: { fields?: "minimal" },
    init?: JsonRequestInit
): Promise<PublicLandDetail> {
    const qs = params?.fields ? `?fields=${params.fields}` : "";
    return await client.fetchJson<PublicLandDetail>(
        `/map/public-lands/${encodeURIComponent(objectId)}${qs}`,
        init
    );
}

export async function getPublicLandPeaks(
    client: ApiClient,
    objectId: string,
    params?: { page?: number; limit?: number },
    init?: JsonRequestInit
): Promise<PublicLandPeaksResult> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return await client.fetchJson<PublicLandPeaksResult>(
        `/map/public-lands/${encodeURIComponent(objectId)}/peaks${qs ? `?${qs}` : ""}`,
        init
    );
}
