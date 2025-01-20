export type ItemType =
  | 'weapon'
  | 'armor'
  | 'artifact'
  | 'consumable'
  | 'quest'
  | 'other';

export interface IItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  properties?: string[];
}
