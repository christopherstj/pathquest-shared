/**
 * Activity that needs trip report review.
 * Returned by GET /api/activities/unreviewed
 */
export interface UnreviewedActivity {
    id: string;
    display_title: string | null;
    title: string;
    start_time: string;
    timezone: string | null;
    sport: string | null;
    summit_count: number;
    peak_names: string[];
}
