import type { WeatherForecast, AvalancheForecast, SnotelData, NwsAlerts, StreamFlow, AirQuality, FireProximity } from "./PeakConditions";

export type POIType = 'waterfall' | 'viewpoint' | 'hot_spring' | 'cave' | 'shelter' | 'fire_lookout' | 'picnic_area';

export interface POIConditions {
  weather: WeatherForecast | null;
  nwsAlerts: NwsAlerts | null;
  avalanche: AvalancheForecast | null;
  snotel: SnotelData | null;
  airQuality: AirQuality | null;
  fireProximity: FireProximity | null;
  streamFlow: StreamFlow | null;
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
