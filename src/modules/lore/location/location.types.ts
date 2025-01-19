export type LocationType = 'city' | 'village' | 'dungeon' | 'wilderness' | 'other';

export interface ILocation {
  name: string;
  description: string;
  type: LocationType;
  coordinates?: {
    x: number;
    y: number;
  };
}
