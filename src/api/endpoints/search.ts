import type { ApiClient, JsonRequestInit } from "../client";
import type {
  UnifiedSearchResponse,
  UnifiedSearchParams,
} from "../../types";

/**
 * Unified relevancy-based search for peaks and challenges
 * 
 * Combines peaks and challenges into a single ranked result set
 * based on text match, geographic proximity, and public popularity.
 * 
 * @param client - API client instance
 * @param params - Search parameters
 * @param init - Optional request init overrides
 * @returns Unified search response with ranked results
 * 
 * @example
 * ```ts
 * const results = await unifiedSearch(client, {
 *   query: "mount washington",
 *   lat: 44.27,
 *   lng: -71.30,
 *   limit: 10,
 * });
 * ```
 */
export async function unifiedSearch(
  client: ApiClient,
  params: UnifiedSearchParams,
  init?: JsonRequestInit
): Promise<UnifiedSearchResponse> {
  const searchParams = new URLSearchParams();
  
  // Required param
  searchParams.set("q", params.query);
  
  // Optional params
  if (params.lat !== undefined) {
    searchParams.set("lat", String(params.lat));
  }
  if (params.lng !== undefined) {
    searchParams.set("lng", String(params.lng));
  }
  if (params.bounds) {
    searchParams.set("bounds", params.bounds.join(","));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  if (params.includePeaks !== undefined) {
    searchParams.set("includePeaks", String(params.includePeaks));
  }
  if (params.includeChallenges !== undefined) {
    searchParams.set("includeChallenges", String(params.includeChallenges));
  }

  const qs = searchParams.toString();
  return await client.fetchJson<UnifiedSearchResponse>(
    `/search${qs ? `?${qs}` : ""}`,
    init
  );
}
