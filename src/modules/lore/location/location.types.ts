import { LocationID } from "@/core/id";

export type LocationType =
  | 'city'
  | 'village'
  | 'dungeon'
  | 'wilderness'
  | 'other';

export interface ILocation {
  id: LocationID;
  name: string;
  description: string;
  type: LocationType;
  coordinates?: {
    x: number;
    y: number;
  };
}
