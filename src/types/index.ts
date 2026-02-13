// Re-export shared domain/request/response types.
// Use `export type` to avoid emitting runtime JS for type-only modules.

export type { default as Activity } from "./Activity";
export type { ActivityStart } from "./ActivityStart";
export type {
  default as PublicActivity,
  PublicActivityUser,
  PublicActivitySummit,
} from "./PublicActivity";
export type { default as AscentDetail } from "./AscentDetail";
export type { default as Challenge } from "./Challenge";
export type { default as ChallengeProgress } from "./ChallengeProgress";
export type { CurrentWeather } from "./CurrentWeather";
export type { default as DashboardStats } from "./DashboardStats";
export type { JournalEntry, JournalFilters, JournalResult } from "./JournalEntry";
export type { default as ManualPeakSummit } from "./ManualPeakSummit";
export type { default as Peak, PublicLand } from "./Peak";
export type { default as PeakActivity } from "./PeakActivity";
export type { default as PeakForecast, DailyForecast } from "./PeakForecast";
export type {
  SummitType,
  SummitPhoto,
  PublicPeakPhoto,
  PhotoUploadUrlResponse,
  PhotoCompleteResponse,
  PhotoUpdateResponse,
  PhotoDeleteResponse,
  PeakPhotosResponse,
  SummitPhotosResponse,
  PublicSummitPhoto,
  PublicSummitPhotosResponse,
} from "./Photo";
export type { default as ProductDisplay } from "./ProductDisplay";
export type { ClimbingStreak, ProfileStats } from "./ProfileStats";
export type { default as ServerActionResult } from "./ServerActionResult";
export type { StravaCreds } from "./StravaCreds";
export type {
  ConditionTag,
  Difficulty,
  ExperienceRating,
  default as Summit,
} from "./Summit";
export type { default as SummitWithPeak } from "./SummitWithPeak";
export type { UnconfirmedSummit } from "./UnconfirmedSummit";
export type { default as User } from "./User";
export type { default as UserChallengeFavorite } from "./UserChallengeFavorite";
export type { UserPeakWithSummitCount } from "./UserPeakWithSummitCount";
export type {
  RelevancyFactors,
  UnifiedSearchResultBase,
  PeakSearchResult,
  ChallengeSearchResult,
  UnifiedSearchResult,
  UnifiedSearchResponse,
  UnifiedSearchParams,
} from "./UnifiedSearchResult";
export type { UnreviewedActivity } from "./UnreviewedActivity";
export type { Trailhead } from "./Trail";
export type {
  PeakConditions,
  WeatherForecast,
  WeatherForecastCurrent,
  WeatherForecastDaily,
  RecentWeather,
  RecentWeatherDay,
  SummitWindow,
  SummitWindowDay,
  SummitWindowLabel,
  SummitWindowFactors,
  HazardFlag,
  HazardType,
  HazardSeverity,
  AvalancheForecast,
  AvalancheDangerLevel,
  AvalancheDangerRating,
  AvalancheProblem,
  SnotelData,
  SnotelStation,
  SnotelStationCurrent,
  SnotelHistoryDay,
  SnotelTrend,
  NwsAlerts,
  NwsAlert,
  AlertSeverity,
  StreamFlow,
  StreamGauge,
  StreamGaugeCurrent,
  StreamFlowStatus,
  AirQuality,
  AirQualityCurrent,
  AirQualityForecastDay,
  SmokeImpact,
  FireProximity,
  NearbyFire,
  SmokeRisk,
  RoadAccess,
  RoadSegment,
  RoadStatus,
  TrailConditions,
  TrailAlert,
  TrailClosure,
  FireRestrictions,
  GearRecommendations,
  GearItem,
  GearPriority,
} from "./PeakConditions";
export type {
  SnotelMapProperties,
  StreamflowMapProperties,
  AqiMapProperties,
  AlertMapAlert,
  AlertMapProperties,
  SourceNearbyPeak,
  SnotelStationDetail,
  SnotelHistoryRecord,
  StreamGaugeDetail,
  StreamflowHistoryRecord,
  AqiSiteDetail,
  AqiHistoryRecord,
  AvalancheZoneDetail,
  AreaConditionsSummary,
  ChallengeConditions,
  PublicLandConditions,
  ConditionsHistoryRange,
  PeakConditionsHistory,
} from "./ConditionsApi";
export type { SnowPointData } from "./SnowPoint";
export type { FireDetail, AffectedPublicLand } from "./FireDetail";
export type { PublicLandDetail, PublicLandPeaksResult } from "./PublicLandDetail";

