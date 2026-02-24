import type {
  WeatherForecast, AvalancheForecast, SnotelData, NwsAlerts,
  StreamFlow, AirQuality, FireProximity,
  ThunderstormRisk, WildlifeSafety, GearRecommendations
} from "./PeakConditions";
import type { SnowPointData } from "./SnowPoint";

export type POIType = 'waterfall' | 'viewpoint' | 'hot_spring' | 'cave' | 'shelter' | 'fire_lookout' | 'picnic_area';

export interface POIConditions {
  weather: WeatherForecast | null;
  nwsAlerts: NwsAlerts | null;
  avalanche: AvalancheForecast | null;
  snotel: SnotelData | null;
  airQuality: AirQuality | null;
  fireProximity: FireProximity | null;
  streamFlow: StreamFlow | null;
  snowPoint: SnowPointData | null;
  thunderstormRisk: ThunderstormRisk | null;
  wildlifeSafety: WildlifeSafety | null;
  gear: GearRecommendations | null;
}

export interface POIFeatureProperties {
  id: number;
  osm_id: number;
  name: string | null;
  poi_type: POIType;
  elevation_m: number | null;
  condition_score?: number;
  condition_label?: string;
  condition_factor?: string;
  condition_daily_scores?: any[];
  condition_hazards?: any[];
  condition_summary?: string;
}

export default interface PointOfInterest {
  id: number;
  osm_id: number;
  name: string | null;
  poi_type: POIType;
  location_coords: [number, number]; // [lng, lat]
  elevation_m: number | null;
  description: string | null;
  wikipedia_url: string | null;
  state: string | null;
  county: string | null;
  country: string | null;
  properties: Record<string, unknown>;
}
