export interface PublicActivityEntry {
    startTime: string;
    timezone?: string;
    displayTitle?: string;
    tripReport?: string;
    conditionTags?: string[];
    isManualGroup: boolean;
    user: { id: string; name: string };
    summits: PublicActivityFeedSummit[];
}

export interface PublicActivityFeedSummit {
    id: string;
    timestamp: string;
    timezone?: string;
    notes?: string;
    difficulty?: string;
    experienceRating?: string;
    conditionTags?: string[];
    customConditionTags?: string[];
    temperature?: number;
    weatherCode?: number;
    windSpeed?: number;
    summitType: "activity" | "manual";
    photos?: { thumbnailUrl: string; fullUrl: string }[];
    peak?: {
        id: string;
        name: string;
        elevation?: number;
        state?: string;
    };
}

export interface PublicActivityFeedResult {
    entries: PublicActivityEntry[];
    nextCursor: string | null;
    totalCount: number;
}
