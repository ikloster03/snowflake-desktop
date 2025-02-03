import type { EventType } from './event.const';

export interface IEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: EventType;
  chapterId?: string;
  stageId?: string;
  characterIds?: string[];
}
