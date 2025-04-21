import { EventID, ChapterID, StageID, CharacterID } from '@/core/id';
import type { EventType } from './event.const';

export interface IEvent {
  id: EventID;
  order: number;
  title: string;
  description: string;
  time: string;
  type: EventType;
  chapterId?: ChapterID;
  stageId?: StageID;
  characterIds?: CharacterID[];
}
