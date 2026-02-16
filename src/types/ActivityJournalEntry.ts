export interface ActivityJournalEntry {
    activityId: string | null; // null for orphan manual summits
    startTime: string;
    timezone?: string;
    // Display title is PRIMARY (PathQuest-owned, always visible)
    displayTitle?: string; // user-set title, shown first everywhere
    // Strava data - owner-only except where noted
    title?: string; // Strava title (fallback if no displayTitle, owner-only)
    sport?: string; // owner-only
    distance?: number; // owner-only
    gain?: number; // owner-only
    stravaUrl?: string; // "View in Strava" link (visible to everyone)
    tripReport?: string;
    tripReportIsPublic?: boolean;
    conditionTags?: string[];
    isReviewed?: boolean;
    isManualGroup: boolean;
    summits: ActivityJournalSummit[];
}

export interface ActivityJournalSummit {
    id: string;
    timestamp: string;
    timezone?: string;
    summitNumber: number;
    hasReport: boolean;
    notes?: string;
    difficulty?: "easy" | "moderate" | "hard" | "expert";
    experienceRating?: "amazing" | "good" | "tough" | "epic";
    conditionTags?: string[];
    customConditionTags?: string[];
    isPublic?: boolean;
    temperature?: number;
    weatherCode?: number;
    cloudCover?: number;
    windSpeed?: number;
    summitType: "activity" | "manual";
    peak: {
        id: string;
        name: string;
        elevation?: number;
        state?: string;
        country?: string;
    };
}

export interface ActivityJournalFilters {
    cursor?: string; // ISO timestamp for pagination
    limit?: number;
    search?: string; // Peak name OR activity title search
    year?: number;
    hasReport?: boolean; // activity-level OR summit-level
    hasSummits?: boolean;
    sport?: string;
    peakId?: string;
}

export interface ActivityJournalResult {
    entries: ActivityJournalEntry[];
    nextCursor: string | null;
    totalCount: number; // total activities matching filters
    totalSummitCount: number; // total summits matching filters
}
