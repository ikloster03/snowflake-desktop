export interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

export const slashCommands: SlashCommandItem[] = [
  {
    title: 'Заголовок 1',
    description: 'Большой заголовок раздела',
    icon: 'H1',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run();
    },
  },
  {
    title: 'Заголовок 2',
    description: 'Средний заголовок подраздела',
    icon: 'H2',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run();
    },
  },
  {
    title: 'Заголовок 3',
    description: 'Маленький заголовок',
    icon: 'H3',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run();
    },
  },
  {
    title: 'Маркированный список',
    description: 'Создать простой маркированный список',
    icon: '•',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
  {
    title: 'Нумерованный список',
    description: 'Создать список с номерами',
    icon: '1.',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run();
    },
  },
  {
    title: 'Цитата',
    description: 'Выделить важную цитату',
    icon: '"',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run();
    },
  },
  {
    title: 'Таблица',
    description: 'Вставить таблицу 3x3',
    icon: '⊞',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: 'Горизонтальная линия',
    description: 'Разделить контент линией',
    icon: '—',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        .run();
    },
  },
];
