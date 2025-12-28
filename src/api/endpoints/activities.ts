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


