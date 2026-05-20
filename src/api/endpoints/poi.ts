import type { ApiClient, JsonRequestInit } from "../client";
import type { PointOfInterest, POIConditions } from "../../types";
import type { BboxParams } from "./trails";

interface FeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, unknown>;
    geometry: Record<string, unknown>;
  }>;
}

export async function searchPOI(
  client: ApiClient,
  params: BboxParams & { types?: string },
  init?: JsonRequestInit
): Promise<FeatureCollection> {
  const searchParams = new URLSearchParams();
  searchParams.set("nwLat", params.nwLat);
  searchParams.set("nwLng", params.nwLng);
  searchParams.set("seLat", params.seLat);
  searchParams.set("seLng", params.seLng);
  if (params.types) {
    searchParams.set("types", params.types);
  }
  return await client.fetchJson<FeatureCollection>(
    `/poi/search?${searchParams.toString()}`,
    init
  );
}

export async function getPOIDetails(
  client: ApiClient,
  poiId: string,
  init?: JsonRequestInit
): Promise<{ poi: PointOfInterest }> {
  return await client.fetchJson<{ poi: PointOfInterest }>(
    `/poi/${poiId}`,
    init
  );
}

export async function getTopPOI(
  client: ApiClient,
  params: { limit?: number },
  init?: JsonRequestInit
): Promise<PointOfInterest[]> {
  const searchParams = new URLSearchParams();
  if (params.limit) {
    searchParams.set("limit", params.limit.toString());
  }
  const query = searchParams.toString();
  return await client.fetchJson<PointOfInterest[]>(
    `/poi/top${query ? `?${query}` : ""}`,
    init
  );
}

export async function getPOIConditions(
  client: ApiClient,
  poiId: string,
  init?: JsonRequestInit
): Promise<POIConditions> {
  return await client.fetchJson<POIConditions>(
    `/poi/${encodeURIComponent(poiId)}/conditions`,
    init
  );
}
