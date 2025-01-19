export type EventType = 'battle' | 'meeting' | 'journey' | 'other';

export interface IEvent {
  title: string;
  description: string;
  time: string;
  type: EventType;
}
