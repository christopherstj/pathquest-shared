import type { ApiClient, JsonRequestInit } from "../client";
import type {
  ChallengeProgress,
  ProfileStats,
  ServerActionResult,
  SummitWithPeak,
  User,
  UserPeakWithSummitCount,
  Peak,
} from "../../types";

export type UserProfileResponse = {
  user: User;
  stats: ProfileStats;
  acceptedChallenges: ChallengeProgress[];
  peaksForMap: Peak[];
};

export type SearchUserPeaksFilters = {
  search?: string;
  state?: string;
  minElevation?: number;
  maxElevation?: number;
  hasMultipleSummits?: boolean;
  sortBy?: "summits" | "elevation" | "recent" | "oldest" | "name";
};

export type SearchUserPeaksResult = {
  peaks: UserPeakWithSummitCount[];
  totalCount: number;
};

export type SearchUserSummitsResult = {
  summits: SummitWithPeak[];
  totalCount: number;
};

export async function getUserProfile(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<UserProfileResponse> {
  return await client.fetchJson<UserProfileResponse>(`/users/${userId}/profile`, init);
}

export async function searchUserPeaks(
  client: ApiClient,
  userId: string,
  params: { filters?: SearchUserPeaksFilters; page?: number; pageSize?: number },
  init?: JsonRequestInit
): Promise<SearchUserPeaksResult> {
  const searchParams = new URLSearchParams();
  const filters = params.filters ?? {};
  if (filters.search) searchParams.set("search", filters.search);
  if (filters.state) searchParams.set("state", filters.state);
  if (filters.minElevation !== undefined) searchParams.set("minElevation", String(filters.minElevation));
  if (filters.maxElevation !== undefined) searchParams.set("maxElevation", String(filters.maxElevation));
  if (filters.hasMultipleSummits) searchParams.set("hasMultipleSummits", "true");
  if (filters.sortBy) searchParams.set("sortBy", filters.sortBy);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? 50));

  return await client.fetchJson<SearchUserPeaksResult>(
    `/users/${userId}/peaks?${searchParams.toString()}`,
    init
  );
}

export async function searchUserSummits(
  client: ApiClient,
  userId: string,
  params: { search?: string; page?: number; pageSize?: number },
  init?: JsonRequestInit
): Promise<SearchUserSummitsResult> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? 50));

  return await client.fetchJson<SearchUserSummitsResult>(
    `/users/${userId}/summits?${searchParams.toString()}`,
    init
  );
}


