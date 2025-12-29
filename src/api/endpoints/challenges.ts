import type { ApiClient, JsonRequestInit } from "../client";
import type { Activity, Challenge, ChallengeProgress, Peak, UserChallengeFavorite } from "../../types";

export type ChallengeProgressInfo = {
  total: number;
  completed: number;
  lastProgressDate: string | null;
  lastProgressCount: number;
};

export type PublicChallengeDetailsResponse = {
  challenge: Challenge;
  peaks: Peak[];
  progress?: ChallengeProgressInfo;
  activityCoords?: { id: string; coords: Activity["coords"] }[];
};

export async function getPublicChallengeDetails(
  client: ApiClient,
  challengeId: string | number,
  init?: JsonRequestInit
): Promise<PublicChallengeDetailsResponse> {
  return await client.fetchJson<PublicChallengeDetailsResponse>(
    `/challenges/${challengeId}/details`,
    init
  );
}

export async function getAllChallengeIds(
  client: ApiClient,
  init?: JsonRequestInit
): Promise<{ id: string }[]> {
  const challenges = await client.fetchJson<Challenge[]>(`/challenges?perPage=1000`, init);
  return challenges.map((c) => ({ id: c.id }));
}

export async function addChallengeFavorite(
  client: ApiClient,
  challengeId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/challenges/favorite`, {
    ...init,
    method: "POST",
    json: { challengeId },
  });
}

export async function deleteChallengeFavorite(
  client: ApiClient,
  challengeId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/challenges/favorite/${encodeURIComponent(challengeId)}`, {
    ...init,
    method: "DELETE",
  });
}

export async function updateChallengeFavorite(
  client: ApiClient,
  favorite: UserChallengeFavorite,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/challenges/favorite`, {
    ...init,
    method: "PUT",
    json: favorite,
  });
}

export type ChallengeDetailsResponse = {
  challenge: Challenge;
  peaks: Peak[];
  progress: ChallengeProgressInfo;
  activityCoords: {
    id: string;
    coords: Activity["coords"];
  }[];
};

export async function getChallengeDetails(
  client: ApiClient,
  challengeId: string,
  init?: JsonRequestInit
): Promise<ChallengeDetailsResponse> {
  return await client.fetchJson<ChallengeDetailsResponse>(`/challenges/${challengeId}/details`, init);
}

export type ChallengeActivityResponse = {
  weeklyActiveUsers: number;
  weeklySummits: number;
  recentCompletions: {
    userId: string;
    userName: string | null;
    completedAt: string;
  }[];
};

export async function getChallengeActivity(
  client: ApiClient,
  challengeId: string,
  init?: JsonRequestInit
): Promise<ChallengeActivityResponse> {
  return await client.fetchJson<ChallengeActivityResponse>(`/challenges/${challengeId}/activity`, init);
}

export type NextPeakSuggestionResponse = {
  closestPeak: {
    id: string;
    name: string;
    elevation: number;
    latitude: number;
    longitude: number;
    distance: number;
  } | null;
  easiestPeak: {
    id: string;
    name: string;
    elevation: number;
    latitude: number;
    longitude: number;
  } | null;
  totalRemaining: number;
};

export async function getNextPeakSuggestion(
  client: ApiClient,
  challengeId: string,
  params?: { lat?: number; lng?: number },
  init?: JsonRequestInit
): Promise<NextPeakSuggestionResponse> {
  const searchParams = new URLSearchParams();
  if (params?.lat !== undefined) searchParams.set("lat", String(params.lat));
  if (params?.lng !== undefined) searchParams.set("lng", String(params.lng));
  const qs = searchParams.toString();
  return await client.fetchJson<NextPeakSuggestionResponse>(
    `/challenges/${challengeId}/next-peak${qs ? `?${qs}` : ""}`,
    init
  );
}

export async function getChallenges(
  client: ApiClient,
  params: { page: number; perPage: number; search?: string },
  init?: JsonRequestInit
): Promise<Challenge[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("perPage", String(params.perPage));
  if (params.search) searchParams.set("search", params.search);
  return await client.fetchJson<Challenge[]>(`/challenges?${searchParams.toString()}`, init);
}

export type SearchChallengesParams = {
  northWestLat?: string;
  northWestLng?: string;
  southEastLat?: string;
  southEastLng?: string;
  search?: string;
  favoritesOnly?: boolean;
  types?: ("completed" | "in-progress" | "not-started")[];
};

export async function searchChallenges(
  client: ApiClient,
  params?: SearchChallengesParams,
  init?: JsonRequestInit
): Promise<ChallengeProgress[]> {
  const searchParams = new URLSearchParams();
  const types = params?.types ?? ["completed", "in-progress", "not-started"];
  searchParams.set("type", types.join(","));
  if (params?.northWestLat) searchParams.set("northWestLat", params.northWestLat);
  if (params?.northWestLng) searchParams.set("northWestLng", params.northWestLng);
  if (params?.southEastLat) searchParams.set("southEastLat", params.southEastLat);
  if (params?.southEastLng) searchParams.set("southEastLng", params.southEastLng);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.favoritesOnly) searchParams.set("favoritesOnly", "true");
  return await client.fetchJson<ChallengeProgress[]>(`/challenges/search?${searchParams.toString()}`, init);
}

export async function getAllChallenges(
  client: ApiClient,
  params: {
    type: "completed" | "in-progress" | "not-started";
    bounds?: { northwest: [number, number]; southeast: [number, number] };
    search?: string;
  },
  init?: JsonRequestInit
): Promise<ChallengeProgress[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("type", params.type);
  if (params.bounds) {
    searchParams.set("northWestLat", String(params.bounds.northwest[0]));
    searchParams.set("northWestLng", String(params.bounds.northwest[1]));
    searchParams.set("southEastLat", String(params.bounds.southeast[0]));
    searchParams.set("southEastLng", String(params.bounds.southeast[1]));
  }
  if (params.search) searchParams.set("search", params.search);
  return await client.fetchJson<ChallengeProgress[]>(`/challenges/search?${searchParams.toString()}`, init);
}

export async function getIncompleteChallenges(
  client: ApiClient,
  params?: { bounds?: { northwest: [number, number]; southeast: [number, number] }; search?: string },
  init?: JsonRequestInit
): Promise<ChallengeProgress[]> {
  return getAllChallenges(client, { type: "in-progress", ...params }, init);
}

export async function getFavoriteChallenges(
  client: ApiClient,
  init?: JsonRequestInit
): Promise<ChallengeProgress[]> {
  // Use search endpoint with favoritesOnly=true
  return searchChallenges(client, { favoritesOnly: true }, init);
}


