export const CHARACTER_LEVEL = {
  PRIMARY: 'primary', // главный персонаж (протагонист)
  SECONDARY: 'secondary', // вторичный персонаж
  TERTIARY: 'tertiary', // третичный персонаж
} as const;

export const MAIN_CHARACTER_TYPE = {
  PROTAGONIST: 'protagonist', // протагонист
  ANTAGONIST: 'antagonist' // антагонист
} as const;

export const SECONDARY_CHARACTER_TYPE = {
  LOVE_INTEREST: 'love interest', // любовный интерес
  MENTOR: 'mentor', // наставник
  CONFIDANTE: 'confidante', // доверитель
  PLOT_MOVER: 'plot mover', // движущий сюжет
  FOIL: 'foil', // противостояние
  COMIC_RELIEF: 'comic relief', // комический вспомогательный персонаж
} as const;
