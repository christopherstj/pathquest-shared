import { ApiClient, JsonRequestInit } from "../client";

/**
 * Response from the timezone endpoint
 */
export interface TimezoneResponse {
  timezone: string;
}

/**
 * Get the IANA timezone for a given latitude/longitude.
 * 
 * @param client - The API client
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns The IANA timezone string (e.g., "America/New_York")
 */
export async function getTimezoneFromCoords(
  client: ApiClient,
  lat: number,
  lng: number,
  init?: JsonRequestInit
): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
  });
  
  const response = await client.fetchJson<TimezoneResponse>(
    `/utils/timezone?${params.toString()}`,
    init
  );
  
  return response.timezone;
}

