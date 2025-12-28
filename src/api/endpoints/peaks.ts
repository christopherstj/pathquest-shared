import type { ApiClient, JsonRequestInit } from "../client";
import type { Challenge, Peak, Summit } from "../../types";

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


