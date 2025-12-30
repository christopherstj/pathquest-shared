import type { ApiClient, JsonRequestInit } from "../client";
import type { DashboardStats } from "../../types";

// Re-export DashboardStats from types
export type { DashboardStats };

/**
 * Weather information for the suggested peak
 */
export type SuggestedPeakWeather = {
  summary: string;
  temp_f: number | null;
  feels_like_f: number | null;
  wind_mph: number | null;
  precipitation_mm: number | null;
  conditions_icon: string;
};

/**
 * Suggested peak - either from user's challenges or a nearby exploration suggestion
 */
export type SuggestedPeak = {
  peak_id: string;
  peak_name: string;
  peak_elevation: number; // meters
  peak_coords: { lat: number; lng: number };
  distance_miles: number;
  suggestion_type: 'challenge' | 'explore'; // 'challenge' = from favorited challenge, 'explore' = nearby tall peak
  challenge_id: string | null;
  challenge_name: string | null;
  challenge_remaining: number | null;
  weather: SuggestedPeakWeather;
};

/**
 * Parameters for getting suggested peak
 */
export type GetSuggestedPeakParams = {
  lat: number;
  lng: number;
  maxDistanceMiles?: number;
};

/**
 * Get dashboard stats for the authenticated user
 */
export async function getDashboardStats(
  client: ApiClient,
  init?: JsonRequestInit
): Promise<DashboardStats> {
  return await client.fetchJson<DashboardStats>("/dashboard/stats", init);
}

/**
 * Get a suggested next peak from the user's favorited challenges.
 * Returns the closest unclimbed peak with current weather conditions.
 * Returns null if no suggestion is available.
 */
export async function getSuggestedPeak(
  client: ApiClient,
  params: GetSuggestedPeakParams,
  init?: JsonRequestInit
): Promise<SuggestedPeak | null> {
  const searchParams = new URLSearchParams();
  searchParams.set("lat", String(params.lat));
  searchParams.set("lng", String(params.lng));
  if (params.maxDistanceMiles !== undefined) {
    searchParams.set("maxDistanceMiles", String(params.maxDistanceMiles));
  }

  // The API returns 204 (no content) if no suggestion available
  // Our client handles this by returning undefined
  const result = await client.fetchJson<SuggestedPeak | undefined>(
    `/dashboard/suggested-peak?${searchParams.toString()}`,
    init
  );

  return result ?? null;
}

