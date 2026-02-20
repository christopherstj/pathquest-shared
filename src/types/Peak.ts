import Summit from "./Summit";
import type { HeroImage } from "./Photo";

export interface PublicLand {
    objectId?: string;
    name: string;
    type: string;
    typeName: string;
    manager: string;
    inGrizzlyRange?: boolean;
}

export interface ConditionDailyScore {
    date: string;
    score: number;
    label: string;
    bestWindowStart: string;
    bestWindowEnd: string;
    factors?: Record<string, number>;
}

export interface ConditionHazardFlag {
    type: "avalanche" | "air_quality" | "fire";
    severity: "caution" | "warning" | "danger";
    message: string;
}

export default interface Peak {
    id: string;
    name?: string;
    location_coords?: [number, number];
    elevation?: number;
    county?: string;
    state?: string;
    country?: string;
    is_favorited?: boolean;
    distance?: number;
    summits?: number;
    public_summits?: number;
    num_challenges?: number;
    ascents?: Summit[];
    publicLand?: PublicLand | null;
    heroImage?: HeroImage | null;
    // Grid condition scores (from conditions_grid)
    condition_score?: number | null;
    condition_label?: string | null;
    condition_daily_scores?: ConditionDailyScore[] | null;
    condition_hazards?: ConditionHazardFlag[] | null;
}
