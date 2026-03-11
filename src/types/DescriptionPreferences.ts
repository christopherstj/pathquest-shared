export interface DescriptionPreferences {
    /** Master toggle — if false, no description updates at all */
    enabled: boolean;
    /** AI-generated funny 1-2 sentence narrative */
    narrative: boolean;
    /** Deterministic condition badges (e.g. Winter Summit, Dawn Patrol) */
    badges: boolean;
    /** Structured summit stats block (peaks, challenges, etc.) */
    stats: boolean;
}

export const DEFAULT_DESCRIPTION_PREFERENCES: DescriptionPreferences = {
    enabled: true,
    narrative: true,
    badges: true,
    stats: true,
};
