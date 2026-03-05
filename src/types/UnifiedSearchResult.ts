/**
 * Unified search result with relevancy scoring
 * Combines peaks and challenges into a single ranked result set
 */

export interface RelevancyFactors {
  /** Text match quality (exact, prefix, contains, fuzzy) - 0 to 1 */
  textMatch: number;
  /** Geographic proximity to search center - 0 to 1 */
  geoProximity: number;
  /** Popularity based on public summits/activity - 0 to 1 */
  publicPopularity: number;
  /** Personal relevance (user summits, favorites, challenge membership) - 0 to 1 */
  personalRelevance: number;
  /** Challenge membership count for peaks - 0 to 1 */
  challengeMembership: number;
}

export interface UnifiedSearchResultBase {
  /** Composite relevancy score (0 to 1, higher is more relevant) */
  relevancyScore: number;
  /** Breakdown of individual relevancy factors */
  relevancyFactors: RelevancyFactors;
}

export interface PeakSearchResult extends UnifiedSearchResultBase {
  type: "peak";
  id: string;
  name: string;
  elevation?: number;
  county?: string;
  state?: string;
  country?: string;
  location_coords?: [number, number];
  /** Total public summits from all users */
  publicSummits: number;
  /** User's own summit count (if authenticated) */
  userSummits?: number;
  /** Number of challenges this peak belongs to */
  numChallenges: number;
  /** Whether the user has favorited this peak */
  isFavorited?: boolean;
  /** Signed thumbnail URL from hero image (if available) */
  thumbnailUrl?: string;
}

export interface ChallengeSearchResult extends UnifiedSearchResultBase {
  type: "challenge";
  id: string;
  name: string;
  region?: string;
  center_lat?: number;
  center_long?: number;
  /** Total peaks in the challenge */
  numPeaks: number;
  /** User's completed peaks (if authenticated) */
  userCompleted?: number;
  /** Whether the user has favorited/accepted this challenge */
  isFavorited?: boolean;
}

export interface POISearchResult extends UnifiedSearchResultBase {
  type: "poi";
  id: number;
  name: string | null;
  poi_type: string;
  elevation_m?: number;
  state?: string;
  location_coords?: [number, number];
}

export interface PublicLandSearchResult extends UnifiedSearchResultBase {
  type: "public_land";
  objectid: number;
  name: string;
  designation_type?: string;
  manager?: string;
  state?: string;
  acres?: number;
  center_coords?: [number, number];
}

export type UnifiedSearchResult = PeakSearchResult | ChallengeSearchResult | POISearchResult | PublicLandSearchResult;

export interface UnifiedSearchResponse {
  /** Combined and sorted results */
  results: UnifiedSearchResult[];
  /** Total count of matching peaks (before limit) */
  totalPeaks: number;
  /** Total count of matching challenges (before limit) */
  totalChallenges: number;
  /** Total count of matching POIs (before limit) */
  totalPOIs: number;
  /** Total count of matching public lands (before limit) */
  totalPublicLands: number;
}

export interface UnifiedSearchParams {
  /** Search query string */
  query: string;
  /** Center latitude for geographic relevancy */
  lat?: number;
  /** Center longitude for geographic relevancy */
  lng?: number;
  /** Viewport bounds for boosting visible results [minLng, minLat, maxLng, maxLat] */
  bounds?: [number, number, number, number];
  /** Maximum results to return (default 20) */
  limit?: number;
  /** Include peaks in results (default true) */
  includePeaks?: boolean;
  /** Include challenges in results (default true) */
  includeChallenges?: boolean;
  /** Include POIs in results (default true) */
  includePOIs?: boolean;
  /** Include public lands in results (default true) */
  includePublicLands?: boolean;
}
