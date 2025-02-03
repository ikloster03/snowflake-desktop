export type EventType = 'battle' | 'meeting' | 'journey' | 'other';

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
