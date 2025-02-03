export const EVENT_TYPE = {
  BATTLE: 'battle',
  MEETING: 'meeting',
  JOURNEY: 'journey',
  OTHER: 'other',
} as const;

export const EVENT_TYPE_MAP = {
  [EVENT_TYPE.BATTLE]: 'warning',
  [EVENT_TYPE.MEETING]: 'info',
  [EVENT_TYPE.JOURNEY]: 'success',
  [EVENT_TYPE.OTHER]: 'default',
} as const;

export type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];
