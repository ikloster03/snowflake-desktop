import { ValueOf } from "@/core";
import { CHARACTER_LEVEL, MAIN_CHARACTER_TYPE, SECONDARY_CHARACTER_TYPE } from "./character.const";

export type CharacterLevel = ValueOf<typeof CHARACTER_LEVEL>;
export type MainCharacterType = ValueOf<typeof MAIN_CHARACTER_TYPE>;
export type SecondaryCharacterType = ValueOf<typeof SECONDARY_CHARACTER_TYPE>;

export interface ICharacter {
  name: string;
  level: CharacterLevel;
}

export interface IMainCharacter extends ICharacter {
  level: 'primary';
  type: MainCharacterType;
}

export interface ISecondaryCharacter extends ICharacter {
  level: 'secondary';
  type: SecondaryCharacterType;
}

export type Character = IMainCharacter | ISecondaryCharacter;
