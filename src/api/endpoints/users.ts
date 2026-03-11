import type { ApiClient, JsonRequestInit } from "../client";
import type {
  Challenge,
  ChallengeProgress,
  DescriptionPreferences,
  ProfileStats,
  ServerActionResult,
  StravaCreds,
  SummitWithPeak,
  User,
  UserPeakWithSummitCount,
  Peak,
} from "../../types";

export type UserProfileResponse = {
  user: User;
  stats: ProfileStats;
  acceptedChallenges: ChallengeProgress[];
  completedChallenges: ChallengeProgress[];
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
  params: { search?: string; state?: string; page?: number; pageSize?: number },
  init?: JsonRequestInit
): Promise<SearchUserSummitsResult> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.state) searchParams.set("state", params.state);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? 50));

  return await client.fetchJson<SearchUserSummitsResult>(
    `/users/${userId}/summits?${searchParams.toString()}`,
    init
  );
}

export async function getUser(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<User> {
  return await client.fetchJson<User>(`/users/${encodeURIComponent(userId)}`, init);
}

export type CreateUserRequest = {
  id: string | number;
  name?: string | null;
  email?: string | null;
  pic?: string | null;
  stravaCreds: StravaCreds;
};

export type CreateUserResponse = {
  user: User;
};

export async function createUser(
  client: ApiClient,
  data: CreateUserRequest,
  init?: JsonRequestInit
): Promise<CreateUserResponse> {
  return await client.fetchJson<CreateUserResponse>(`/auth/signup`, {
    ...init,
    method: "POST",
    json: {
      id: data.id.toString(),
      name: data.name,
      email: data.email ?? null,
      pic: data.pic ?? null,
      stravaCreds: data.stravaCreds,
    },
  });
}

export type UpdateUserData = {
  name?: string;
  email?: string;
  pic?: string;
  city?: string;
  state?: string;
  country?: string;
  location_coords?: [number, number] | null;
  update_description?: boolean;
  description_preferences?: DescriptionPreferences;
  is_public?: boolean;
  units?: "imperial" | "metric";
};

export async function updateUser(
  client: ApiClient,
  userId: string,
  data: UpdateUserData,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/users/${encodeURIComponent(userId)}`, {
    ...init,
    method: "PUT",
    json: data,
  });
}

export async function deleteUser(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/users/${encodeURIComponent(userId)}`, {
    ...init,
    method: "DELETE",
  });
}

export type CreateUserInterestRequest = {
  userId: string;
  challengeId: string;
};

export async function createUserInterest(
  client: ApiClient,
  data: CreateUserInterestRequest,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/users/${encodeURIComponent(data.userId)}/interests`, {
    ...init,
    method: "POST",
    json: { challengeId: data.challengeId },
  });
}

export async function getActivitiesProcessing(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<{ numProcessing: number }> {
  return await client.fetchJson<{ numProcessing: number }>(
    `/users/${encodeURIComponent(userId)}/activities-processing`,
    init
  );
}

export type ImportStatus = {
  totalActivities: number;
  processedActivities: number;
  pendingActivities: number;
  skippedActivities: number;
  summitsFound: number;
  percentComplete: number;
  estimatedHoursRemaining: number | null;
  status: "not_started" | "processing" | "complete";
  message: string;
};

export async function getImportStatus(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<ImportStatus> {
  return await client.fetchJson<ImportStatus>(`/users/${encodeURIComponent(userId)}/import-status`, init);
}

export type UserChallengeData = {
  challenge: Challenge;
  progress: {
    total: number;
    completed: number;
    lastProgressDate: string | null;
    lastProgressCount: number;
  };
  peaks: Array<Peak & { is_summited: boolean; summit_date: string | null; summits: number }>;
  user: {
    id: string;
    name: string;
    pic?: string;
  };
  isOwner: boolean;
};

export async function getUserChallengeProgress(
  client: ApiClient,
  userId: string,
  challengeId: string,
  init?: JsonRequestInit
): Promise<UserChallengeData> {
  return await client.fetchJson<UserChallengeData>(
    `/users/${encodeURIComponent(userId)}/challenges/${encodeURIComponent(challengeId)}`,
    init
  );
}

export async function getUserSummitStates(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<{ states: string[] }> {
  return await client.fetchJson<{ states: string[] }>(
    `/users/${encodeURIComponent(userId)}/peaks/states`,
    init
  );
}

export async function getIsUserSubscribed(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<{ isSubscribed: boolean }> {
  return await client.fetchJson<{ isSubscribed: boolean }>(
    `/users/${encodeURIComponent(userId)}/is-subscribed`,
    init
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity-First Journal
// ─────────────────────────────────────────────────────────────────────────────

export type { ActivityJournalResult, ActivityJournalFilters } from "../../types";

export async function getUserActivityJournal(
  client: ApiClient,
  userId: string,
  params: {
    cursor?: string;
    limit?: number;
    search?: string;
    year?: number;
    hasReport?: boolean;
    hasSummits?: boolean;
    sport?: string;
    peakId?: string;
  } = {},
  init?: JsonRequestInit
) {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.year) searchParams.set("year", String(params.year));
  if (params.hasReport !== undefined) searchParams.set("hasReport", String(params.hasReport));
  if (params.hasSummits !== undefined) searchParams.set("hasSummits", String(params.hasSummits));
  if (params.sport) searchParams.set("sport", params.sport);
  if (params.peakId) searchParams.set("peakId", params.peakId);
  const qs = searchParams.toString();

  // Import the type locally to avoid circular imports
  type Result = import("../../types").ActivityJournalResult;
  return await client.fetchJson<Result>(
    `/users/${encodeURIComponent(userId)}/journal${qs ? `?${qs}` : ""}`,
    init
  );
}

export async function processHistoricalData(
  client: ApiClient,
  userId: string,
  init?: JsonRequestInit
): Promise<void> {
  await client.fetchJson<void>(`/historical-data`, {
    ...init,
    method: "POST",
    json: { userId: userId.toString() },
  });
}


