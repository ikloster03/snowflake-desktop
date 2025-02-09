import { ValueOf } from '@/core';
import {
  CHARACTER_LEVEL,
  MAIN_CHARACTER_TYPE,
  SECONDARY_CHARACTER_TYPE,
} from './character.const';

export type CharacterLevel = ValueOf<typeof CHARACTER_LEVEL>;
export type MainCharacterType = ValueOf<typeof MAIN_CHARACTER_TYPE>;
export type SecondaryCharacterType = ValueOf<typeof SECONDARY_CHARACTER_TYPE>;

interface IBaseCharacter {
  id: string;
  name: string;
  description?: string;
}

interface IMainCharacter extends IBaseCharacter {
  level: "primary";
  type: MainCharacterType;
}

interface ISecondaryCharacter extends IBaseCharacter {
  level: "secondary";
  type: SecondaryCharacterType;
}

interface ITertiaryCharacter extends IBaseCharacter {
  level: "tertiary";
  type: SecondaryCharacterType;
}

export type Character = IMainCharacter | ISecondaryCharacter | ITertiaryCharacter;

export interface CharacterTypeOption {
  label: string;
  value: Character['type'];
}

export interface Edge {
  source: string
  target: string
  relation: string
  id: string // добавляем id для связи
}

// Добавляем типы отношений
export const RELATION_TYPES = {
  LOVE: 'любовь',
  MARRIAGE: 'брак',
  FAMILY: 'родственники',
  FRIENDSHIP: 'дружба',
  ENEMY: 'враги',
  MENTOR: 'наставник',
  STUDENT: 'ученик',
  COLLEAGUE: 'коллеги',
} as const;

export type RelationType = typeof RELATION_TYPES[keyof typeof RELATION_TYPES];
