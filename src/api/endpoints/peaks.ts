import type { ApiClient, JsonRequestInit } from "../client";
import type {
  Activity,
  AscentDetail,
  Challenge,
  CurrentWeather,
  ManualPeakSummit,
  Peak,
  PeakActivity,
  PeakConditions,
  PeakForecast,
  Summit,
  SummitWindow,
  UnconfirmedSummit,
} from "../../types";

export type PeakDetailsPublicResponse = {
  peak: Peak;
  publicSummits: Summit[];
  challenges: Challenge[];
};

export type TopPeak = {
  id: string;
  public_summits: number;
};

export async function getPeakDetailsPublic(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<PeakDetailsPublicResponse> {
  return await client.fetchJson<PeakDetailsPublicResponse>(`/peaks/${peakId}`, init);
}

export async function getTopPeaks(
  client: ApiClient,
  params?: { limit?: number },
  init?: JsonRequestInit
): Promise<TopPeak[]> {
  const limit = params?.limit ?? 1000;
  return await client.fetchJson<TopPeak[]>(`/peaks/top?limit=${encodeURIComponent(String(limit))}`, init);
}

export async function toggleFavoritePeak(
  client: ApiClient,
  params: { peakId: string; newValue: boolean },
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/peaks/favorite`, {
    ...init,
    method: "PUT",
    json: { peakId: params.peakId, newValue: params.newValue },
  });
}

export async function addManualPeakSummit(
  client: ApiClient,
  summit: ManualPeakSummit,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/peaks/summits/manual`, {
    ...init,
    method: "POST",
    json: summit,
  });
}

export async function updateAscent(
  client: ApiClient,
  ascent: AscentDetail,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/peaks/ascent/${encodeURIComponent(ascent.id)}`, {
    ...init,
    method: "PUT",
    json: { ascent },
  });
}

export async function deleteAscent(
  client: ApiClient,
  ascentId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/peaks/ascent/${encodeURIComponent(ascentId)}`, {
    ...init,
    method: "DELETE",
  });
}

export type PeakDetailsResponse = {
  peak: Peak;
  publicSummits: Summit[];
  challenges: Challenge[];
  activities?: Activity[];
};

export async function getPeakDetails(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<PeakDetailsResponse> {
  return await client.fetchJson<PeakDetailsResponse>(`/peaks/${peakId}`, init);
}

export type SearchPeaksParams = {
  northWestLat?: string;
  northWestLng?: string;
  southEastLat?: string;
  southEastLng?: string;
  search?: string;
  page?: string;
  perPage?: string;
  showSummittedPeaks?: string;
};

export async function searchPeaks(
  client: ApiClient,
  params?: SearchPeaksParams,
  init?: JsonRequestInit
): Promise<Peak[]> {
  const searchParams = new URLSearchParams();
  if (params?.northWestLat) searchParams.set("northWestLat", params.northWestLat);
  if (params?.northWestLng) searchParams.set("northWestLng", params.northWestLng);
  if (params?.southEastLat) searchParams.set("southEastLat", params.southEastLat);
  if (params?.southEastLng) searchParams.set("southEastLng", params.southEastLng);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", params.page);
  if (params?.perPage) searchParams.set("perPage", params.perPage);
  if (params?.showSummittedPeaks) searchParams.set("showSummittedPeaks", params.showSummittedPeaks);
  const qs = searchParams.toString();
  return await client.fetchJson<Peak[]>(`/peaks/search${qs ? `?${qs}` : ""}`, init);
}

export async function getPeaks(
  client: ApiClient,
  params: { page: number; perPage: number; search?: string },
  init?: JsonRequestInit
): Promise<Peak[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("perPage", String(params.perPage));
  if (params.search) searchParams.set("search", params.search);
  return await client.fetchJson<Peak[]>(`/peaks?${searchParams.toString()}`, init);
}

export async function getIsPeakFavorited(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<{ isFavorited: boolean }> {
  return await client.fetchJson<{ isFavorited: boolean }>(`/peaks/favorite?peakId=${encodeURIComponent(peakId)}`, init);
}

export async function getPeakSummits(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<Peak[]> {
  return await client.fetchJson<Peak[]>(`/peaks/summits/${encodeURIComponent(userId)}`, init);
}

export async function getRecentSummits(
  client: ApiClient,
  params?: { limit?: number },
  init?: JsonRequestInit
): Promise<Summit[]> {
  const limit = params?.limit ?? 10;
  return await client.fetchJson<Summit[]>(`/peaks/summits/recent?limit=${encodeURIComponent(String(limit))}`, init);
}

export async function getUnclimbedPeaks(
  client: ApiClient,
  init?: JsonRequestInit
): Promise<Peak[]> {
  return await client.fetchJson<Peak[]>(`/peaks/summits/unclimbed/nearest`, init);
}

export async function getUnclimbedPeaksWithBounds(
  client: ApiClient,
  params: { bounds: { northwest: [number, number]; southeast: [number, number] }; search?: string; showSummittedPeaks?: boolean },
  init?: JsonRequestInit
): Promise<Peak[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("northWestLat", String(params.bounds.northwest[0]));
  searchParams.set("northWestLng", String(params.bounds.northwest[1]));
  searchParams.set("southEastLat", String(params.bounds.southeast[0]));
  searchParams.set("southEastLng", String(params.bounds.southeast[1]));
  if (params.search) searchParams.set("search", params.search);
  if (params.showSummittedPeaks) searchParams.set("showSummittedPeaks", "true");
  return await client.fetchJson<Peak[]>(`/peaks/summits/unclimbed?${searchParams.toString()}`, init);
}

export async function getFavoritePeaks(
  client: ApiClient,
  init?: JsonRequestInit
): Promise<Peak[]> {
  return await client.fetchJson<Peak[]>(`/peaks/summits/favorites`, init);
}

export type AscentDetailsResponse = {
  ascent: AscentDetail;
  peak: Peak;
};

export async function getAscentDetails(
  client: ApiClient,
  ascentId: string,
  init?: JsonRequestInit
): Promise<AscentDetailsResponse> {
  return await client.fetchJson<AscentDetailsResponse>(`/peaks/ascent/${encodeURIComponent(ascentId)}`, init);
}

export async function getPeakWeather(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<CurrentWeather> {
  return await client.fetchJson<CurrentWeather>(`/peaks/${encodeURIComponent(peakId)}/weather`, init);
}

export async function getPeakActivity(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<PeakActivity> {
  return await client.fetchJson<PeakActivity>(`/peaks/${encodeURIComponent(peakId)}/activity`, init);
}

export type PublicSummit = Summit & {
  user_id?: string;
  user_name?: string;
};

export type PeakPublicSummitsCursorResponse = {
  summits: PublicSummit[];
  nextCursor: string | null;
  totalCount: number;
};

export async function getPeakPublicSummitsCursor(
  client: ApiClient,
  params: { peakId: string; cursor?: string; limit?: number },
  init?: JsonRequestInit
): Promise<PeakPublicSummitsCursorResponse> {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return await client.fetchJson<PeakPublicSummitsCursorResponse>(
    `/peaks/${encodeURIComponent(params.peakId)}/public-summits${qs ? `?${qs}` : ""}`,
    init
  );
}

export async function searchNearestPeaks(
  client: ApiClient,
  params: { lat: number; lng: number; page: number; search?: string },
  init?: JsonRequestInit
): Promise<Peak[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("lat", String(params.lat));
  searchParams.set("lng", String(params.lng));
  searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  return await client.fetchJson<Peak[]>(`/peaks/search/nearest?${searchParams.toString()}`, init);
}

export async function getPeakForecast(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<PeakForecast> {
  return await client.fetchJson<PeakForecast>(`/peaks/${encodeURIComponent(peakId)}/forecast`, init);
}

// ─────────────────────────────────────────────────────────────────────────────
// Summit Review (Unconfirmed Summits)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get unconfirmed summits that need user review.
 * These are low-confidence summits detected from Strava activities.
 *
 * GET /peaks/summits/unconfirmed
 */
export async function getUnconfirmedSummits(
  client: ApiClient,
  params?: { limit?: number },
  init?: JsonRequestInit
): Promise<UnconfirmedSummit[]> {
  const searchParams = new URLSearchParams();
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }
  const qs = searchParams.toString();
  return await client.fetchJson<UnconfirmedSummit[]>(
    `/peaks/summits/unconfirmed${qs ? `?${qs}` : ""}`,
    init
  );
}

/**
 * Confirm a single unconfirmed summit.
 * Changes the summit status from 'unconfirmed' to 'user_confirmed'.
 *
 * POST /peaks/summits/:id/confirm
 */
export async function confirmSummit(
  client: ApiClient,
  summitId: string,
  init?: JsonRequestInit
): Promise<{ message: string }> {
  return await client.fetchJson<{ message: string }>(
    `/peaks/summits/${encodeURIComponent(summitId)}/confirm`,
    {
      ...init,
      method: "POST",
    }
  );
}

/**
 * Deny a single unconfirmed summit.
 * Changes the summit status from 'unconfirmed' to 'denied'.
 *
 * POST /peaks/summits/:id/deny
 */
export async function denySummit(
  client: ApiClient,
  summitId: string,
  init?: JsonRequestInit
): Promise<{ message: string }> {
  return await client.fetchJson<{ message: string }>(
    `/peaks/summits/${encodeURIComponent(summitId)}/deny`,
    {
      ...init,
      method: "POST",
    }
  );
}

/**
 * Confirm all unconfirmed summits at once.
 * Useful for users who trust the detection algorithm.
 *
 * POST /peaks/summits/confirm-all
 */
export async function confirmAllSummits(
  client: ApiClient,
  init?: JsonRequestInit
): Promise<{ message: string; count: number }> {
  return await client.fetchJson<{ message: string; count: number }>(
    `/peaks/summits/confirm-all`,
    {
      ...init,
      method: "POST",
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Community Data (No Auth Required)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recent public summit from the community feed.
 * Includes user and peak info for display.
 */
export type RecentPublicSummit = Summit & {
  user_id?: string;
  user_name?: string;
  peak_id: string;
  peak_name: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Peak Conditions (Enhanced Weather + Summit Window)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get full conditions for a peak (weather, recent weather, summit window).
 * Public endpoint - no auth required. Data is cached and refreshed every 2hr.
 *
 * GET /peaks/:id/conditions
 */
export async function getPeakConditions(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<PeakConditions> {
  return await client.fetchJson<PeakConditions>(
    `/peaks/${encodeURIComponent(peakId)}/conditions`,
    init
  );
}

/**
 * Get 7-day summit window scoring for a peak.
 * Public endpoint - no auth required.
 *
 * GET /peaks/:id/summit-window
 */
export async function getPeakSummitWindow(
  client: ApiClient,
  peakId: string,
  init?: JsonRequestInit
): Promise<SummitWindow> {
  return await client.fetchJson<SummitWindow>(
    `/peaks/${encodeURIComponent(peakId)}/summit-window`,
    init
  );
}

/**
 * Get recent public summits across the entire community.
 * Public endpoint - no auth required.
 *
 * GET /peaks/summits/public/recent
 */
export async function getRecentPublicSummits(
  client: ApiClient,
  params?: { limit?: number },
  init?: JsonRequestInit
): Promise<RecentPublicSummit[]> {
  const limit = params?.limit ?? 5;
  return await client.fetchJson<RecentPublicSummit[]>(
    `/peaks/summits/public/recent?limit=${encodeURIComponent(String(limit))}`,
    init
  );
}