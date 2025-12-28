import type { ApiClient, JsonRequestInit } from "../client";
import type { Activity, Challenge, Peak, UserChallengeFavorite } from "../../types";

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


