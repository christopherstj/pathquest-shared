import type { Difficulty } from "./Summit";

export interface PublicActivityUser {
    id: string;
    name: string;
    avatar?: string;
}

export interface PublicActivitySummit {
    id: string;
    timestamp: string;
    peak: {
        id: string;
        name: string;
        elevation?: number;
        state?: string;
        country?: string;
    };
    // Only included if summit is_public
    notes?: string;
    difficulty?: Difficulty;
}

export default interface PublicActivity {
    id: string;
    display_title?: string;
    trip_report?: string;
    condition_tags?: string[];
    start_time: string;
    timezone?: string;
    user?: PublicActivityUser;
    summits: PublicActivitySummit[];
}
