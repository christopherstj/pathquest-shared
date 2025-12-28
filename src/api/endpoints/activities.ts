import type { ApiClient, JsonRequestInit } from "../client";
import type { Activity, ActivityStart, SummitWithPeak } from "../../types";

export type ActivityDetailsResponse = {
  activity: Activity;
  summits: SummitWithPeak[];
};

export type ActivityCoordsResponse = {
  coords: [number, number][];
};

export async function getActivityDetails(
  client: ApiClient,
  activityId: string,
  init?: JsonRequestInit
): Promise<ActivityDetailsResponse> {
  return await client.fetchJson<ActivityDetailsResponse>(`/activities/${activityId}`, init);
}

export async function getActivityCoords(
  client: ApiClient,
  activityId: string,
  init?: JsonRequestInit
): Promise<ActivityCoordsResponse> {
  return await client.fetchJson<ActivityCoordsResponse>(`/activities/${activityId}/coords`, init);
}

export async function getRecentActivities(
  client: ApiClient,
  params?: { summitsOnly?: boolean },
  init?: JsonRequestInit
): Promise<ActivityStart[]> {
  const qs = params?.summitsOnly ? "?summitsOnly=true" : "";
  return await client.fetchJson<ActivityStart[]>(`/activities/recent${qs}`, init);
}

export async function deleteActivity(
  client: ApiClient,
  activityId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/activities/${encodeURIComponent(activityId)}`, {
    ...init,
    method: "DELETE",
  });
}

export async function reprocessActivity(
  client: ApiClient,
  activityId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/activities/reprocess`, {
    ...init,
    method: "POST",
    json: { activityId },
  });
}

export async function searchNearestActivities(
  client: ApiClient,
  params: { lat: number; lng: number; page: number; search?: string },
  init?: JsonRequestInit
): Promise<ActivityStart[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("lat", String(params.lat));
  searchParams.set("lng", String(params.lng));
  searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  return await client.fetchJson<ActivityStart[]>(`/activities/search/nearest?${searchParams.toString()}`, init);
}

export async function getActivityStarts(
  client: ApiClient,
  params?: {
    bounds?: { northwest: [number, number]; southeast: [number, number] };
    search?: string;
  },
  init?: JsonRequestInit
): Promise<ActivityStart[]> {
  const searchParams = new URLSearchParams();
  if (params?.bounds) {
    searchParams.set("northWestLat", String(params.bounds.northwest[0]));
    searchParams.set("northWestLng", String(params.bounds.northwest[1]));
    searchParams.set("southEastLat", String(params.bounds.southeast[0]));
    searchParams.set("southEastLng", String(params.bounds.southeast[1]));
  }
  if (params?.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  return await client.fetchJson<ActivityStart[]>(`/activities/search${qs ? `?${qs}` : ""}`, init);
}


