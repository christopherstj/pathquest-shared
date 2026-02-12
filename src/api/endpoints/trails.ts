import type { ApiClient, JsonRequestInit } from "../client";

export interface BboxParams {
  nwLat: string;
  nwLng: string;
  seLat: string;
  seLng: string;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, unknown>;
    geometry: Record<string, unknown>;
  }>;
}

export async function searchTrailheads(
  client: ApiClient,
  params: BboxParams,
  init?: JsonRequestInit
): Promise<FeatureCollection> {
  const searchParams = new URLSearchParams();
  searchParams.set("nwLat", params.nwLat);
  searchParams.set("nwLng", params.nwLng);
  searchParams.set("seLat", params.seLat);
  searchParams.set("seLng", params.seLng);
  return await client.fetchJson<FeatureCollection>(
    `/trails/trailheads?${searchParams.toString()}`,
    init
  );
}
