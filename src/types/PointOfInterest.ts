import type {
  WeatherForecast, AvalancheForecast, SnotelData, NwsAlerts,
  StreamFlow, AirQuality, FireProximity, RecentWeather, SummitWindow,
  ThunderstormRisk, WildlifeSafety, GearRecommendations
} from "./PeakConditions";
import type { PublicLand } from "./Peak";
import type { SnowPointData } from "./SnowPoint";

export type POIType = 'waterfall' | 'viewpoint' | 'hot_spring' | 'spring' | 'cave' | 'shelter' | 'fire_lookout' | 'picnic_area' | 'camp_site';

export const POI_TYPES: POIType[] = ['waterfall', 'viewpoint', 'hot_spring', 'spring', 'cave', 'shelter', 'fire_lookout', 'picnic_area', 'camp_site'];

export const POI_TYPE_LABELS: Record<POIType, string> = {
  waterfall: "Waterfalls",
  viewpoint: "Viewpoints",
  hot_spring: "Hot Springs",
  spring: "Springs",
  cave: "Caves",
  shelter: "Shelters",
  fire_lookout: "Fire Lookouts",
  picnic_area: "Picnic Areas",
  camp_site: "Campsites",
};

export interface POIConditions {
  weather: WeatherForecast | null;
  recentWeather: RecentWeather | null;
  summitWindow: SummitWindow | null;
  weatherUpdatedAt: string | null;
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
  publicLand?: PublicLand | null;
}
