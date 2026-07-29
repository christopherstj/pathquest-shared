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
}
