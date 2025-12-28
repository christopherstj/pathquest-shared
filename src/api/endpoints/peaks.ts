import type { ApiClient, JsonRequestInit } from "../client";
import type { AscentDetail, Challenge, ManualPeakSummit, Peak, Summit } from "../../types";

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


