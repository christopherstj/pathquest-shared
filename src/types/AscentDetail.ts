import { SummitType } from "./Photo";
import { ConditionTag, Difficulty, ExperienceRating } from "./Summit";

export default interface AscentDetail {
    id: string;
    timestamp: string;
    activity_id?: string;
    peak_id: string;
    notes?: string;
    is_public: boolean;
    timezone?: string;
    difficulty?: Difficulty;
    experience_rating?: ExperienceRating;
    condition_tags?: ConditionTag[];
    custom_condition_tags?: string[];
    /**
     * Indicates whether this ascent came from Strava ("activity") or was manually entered ("manual").
     * Used to determine the correct photo API endpoint.
     */
    summitType?: SummitType;
}
