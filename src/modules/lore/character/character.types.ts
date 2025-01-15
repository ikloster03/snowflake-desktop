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
}

interface IMainCharacter extends IBaseCharacter {
  level: "primary";
  type: MainCharacterType;
}

interface ISecondaryCharacter extends IBaseCharacter {
  level: "secondary";
  type: SecondaryCharacterType;
}

export type Character = IMainCharacter | ISecondaryCharacter;
