<script lang="ts" setup>
import type { Character } from '@/modules/lore/character/character.types';
import type { IEvent } from '@/modules/lore/event/event.types';
import type { ILocation } from '@/modules/lore/location/location.types';
import type { IItem } from '@/modules/lore/item/item.types';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  H1,
  H2,
  H3,
  Highlight as HighlightIcon,
  Italic,
  List,
  ListNumbers,
  Minus,
  Quote,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon
} from '@vicons/tabler';
import { createLowlight } from 'lowlight';
import { NButton, NDropdown, NIcon, NSpace, NTooltip } from 'naive-ui';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { CharacterLink } from './CharacterLinkExtension';
import { EventLinkExtension } from './EventLinkExtension';
import { LocationLinkExtension } from './LocationLinkExtension';
import { ItemLink } from './ItemLinkExtension';
import CharacterSelectionPopup from './CharacterSelectionPopup.vue';
import EventSelectionPopup from './EventSelectionPopup.vue';
import LocationSelectionPopup from './LocationSelectionPopup.vue';
import ItemSelectionPopup from './ItemSelectionPopup.vue';
import FloatingCharacterButton from './FloatingCharacterButton.vue';
import FloatingEventButton from './FloatingEventButton.vue';
import FloatingLocationButton from './FloatingLocationButton.vue';
import FloatingItemButton from './FloatingItemButton.vue';
import { slashCommands, type SlashCommandItem } from './SlashCommands';
import SlashCommandsList from './SlashCommandsList.vue';
import { StageBlock } from './StageBlockExtension';
import type { StageID } from '@/core/id';

interface Props {
  modelValue: string;
  placeholder?: string;
  readonly?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Начните писать...',
  readonly: false,
});

const emit = defineEmits<Emits>();

const editor = ref<Editor | null>(null);

// Отслеживание текущей сцены
const currentStageId = ref<StageID | null>(null);

// Состояние для слэш-команд
const showSlashCommands = ref(false);
const slashCommandsPosition = ref({ top: 0, left: 0 });
const slashCommandsQuery = ref('');
const slashCommandsRange = ref<{ from: number; to: number } | null>(null);
const slashCommandsListRef = ref<InstanceType<typeof SlashCommandsList> | null>(null);
const slashCommandsMaxHeight = ref(300);

// Состояние для плавающей кнопки персонажа
const showFloatingButton = ref(false);
const floatingButtonPosition = ref({ x: 0, y: 0 });
const selectedTextForCharacter = ref('');
const characterSelectionRange = ref<{ from: number; to: number } | null>(null);
const savedSelection = ref<{ from: number; to: number } | null>(null);

// Состояние для выбора персонажа
const showCharacterSelection = ref(false);
const characterSelectionPosition = ref({ x: 0, y: 0 });

// Состояние для выбора события
const showEventSelection = ref(false);
const eventSelectionPosition = ref({ x: 0, y: 0 });
const selectedTextForEvent = ref('');
const eventSelectionRange = ref<{ from: number; to: number } | null>(null);

// Состояние для плавающих кнопок событий
const showFloatingEventButton = ref(false);
const floatingEventButtonPosition = ref({ x: 0, y: 0 });

// Состояние для выбора локации
const showLocationSelection = ref(false);
const locationSelectionPosition = ref({ x: 0, y: 0 });
const selectedTextForLocation = ref('');
const locationSelectionRange = ref<{ from: number; to: number } | null>(null);

// Состояние для плавающей кнопки локации
const showFloatingLocationButton = ref(false);
const floatingLocationButtonPosition = ref({ x: 0, y: 0 });

// Состояние для выбора предмета
const showItemSelection = ref(false);
const itemSelectionPosition = ref({ x: 0, y: 0 });
const selectedTextForItem = ref('');
const itemSelectionRange = ref<{ from: number; to: number } | null>(null);

// Состояние для плавающей кнопки предмета
const showFloatingItemButton = ref(false);
const floatingItemButtonPosition = ref({ x: 0, y: 0 });

const lowlight = createLowlight();

// Функции для слэш-команд
const filteredSlashCommands = computed(() => {
  let commands = slashCommands;

  // Проверяем, находимся ли мы внутри блока сцены
  if (editor.value) {
    const { $from } = editor.value.state.selection;

    // Проверяем все родительские узлы
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'stageBlock') {
        // Если мы внутри блока сцены, исключаем команду блока сцены
        commands = commands.filter(item => item.title !== 'Блок сцены');
        break;
      }
    }
  }

  if (!slashCommandsQuery.value) {
    return commands;
  }
  return commands.filter(item =>
    item.title.toLowerCase().includes(slashCommandsQuery.value.toLowerCase())
  );
});

// Функция для получения ID текущей сцены
const getCurrentStageId = (): StageID | null => {
  if (!editor.value) return null;

  const { $from } = editor.value.state.selection;

  // Проверяем все родительские узлы
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'stageBlock') {
      return (node.attrs.stageId as StageID) || null;
    }
  }

  return null;
};

const executeSlashCommand = (item: SlashCommandItem) => {
  if (editor.value && slashCommandsRange.value) {
    item.command({
      editor: editor.value,
      range: slashCommandsRange.value,
    });
    hideSlashCommands();
  }
};

const showSlashCommandsMenu = (query: string, range: { from: number; to: number }) => {
  slashCommandsQuery.value = query;
  slashCommandsRange.value = range;

  nextTick(() => {
    if (editor.value) {
      const { view } = editor.value;
      const { from } = range;
      const start = view.coordsAtPos(from);

      // Размеры списка команд
      const menuWidth = 280;
      const itemHeight = 60; // Примерная высота одного элемента
      const padding = 20; // Отступы контейнера
      const maxItemsToShow = filteredSlashCommands.value.length;

      // Размеры окна
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Начальная позиция
      let top = start.top + 20;
      let left = start.left;

      // Проверяем правую границу
      if (left + menuWidth > windowWidth) {
        left = windowWidth - menuWidth - 10;
      }

      // Проверяем левую границу
      if (left < 10) {
        left = 10;
      }

      // Вычисляем доступное место снизу и сверху
      const spaceBelow = windowHeight - top - 10;
      const spaceAbove = start.top - 10;

      let maxHeight = 300;
      let finalTop = top;

      // Определяем оптимальную позицию и высоту
      if (spaceBelow >= itemHeight * maxItemsToShow + padding) {
        // Достаточно места снизу
        maxHeight = Math.min(300, itemHeight * maxItemsToShow + padding);
        finalTop = top;
      } else if (spaceAbove >= itemHeight * maxItemsToShow + padding) {
        // Показываем сверху
        maxHeight = Math.min(300, itemHeight * maxItemsToShow + padding);
        finalTop = start.top - maxHeight - 10;
      } else {
        // Выбираем сторону с большим пространством
        if (spaceBelow > spaceAbove) {
          maxHeight = Math.max(100, spaceBelow - 10);
          finalTop = top;
        } else {
          maxHeight = Math.max(100, spaceAbove - 10);
          finalTop = start.top - maxHeight - 10;
        }
      }

      // Устанавливаем максимальную высоту
      slashCommandsMaxHeight.value = maxHeight;

      slashCommandsPosition.value = {
        top: finalTop,
        left,
      };

      showSlashCommands.value = true;
    }
  });
};

const hideSlashCommands = () => {
  showSlashCommands.value = false;
  slashCommandsQuery.value = '';
  slashCommandsRange.value = null;
};

const handleSlashCommandKeyDown = (event: KeyboardEvent) => {
  if (showSlashCommands.value && slashCommandsListRef.value) {
    return slashCommandsListRef.value.onKeyDown(event);
  }
  return false;
};

// Функции для работы с плавающей кнопкой персонажа
const updateFloatingButton = () => {
  if (!editor.value) return;

  // Обновляем текущую сцену
  currentStageId.value = getCurrentStageId();

  // Если попап выбора персонажа или события открыт, не обновляем плавающую кнопку
  if (showCharacterSelection.value || showEventSelection.value || showLocationSelection.value || showItemSelection.value) return;

  const { selection } = editor.value.state;
  const { from, to } = selection;

  console.log('Обновление плавающей кнопки:', { from, to, hasSelection: from !== to, currentStageId: currentStageId.value });

  // Показываем кнопки только если есть выделенный текст
  if (from === to) {
    hideFloatingButton();
    return;
  }

  const selectedText = editor.value.state.doc.textBetween(from, to);
  selectedTextForCharacter.value = selectedText;
  characterSelectionRange.value = { from, to };

  console.log('Выделенный текст:', selectedText);

  // Вычисляем позицию кнопок
  const { view } = editor.value;
  const coords = view.coordsAtPos(from);

  // Кнопка персонажа слева
  floatingButtonPosition.value = {
    x: coords.left + (coords.right - coords.left) / 2 - 60,
    y: coords.top,
  };

  // Кнопка события в центре-слева
  floatingEventButtonPosition.value = {
    x: coords.left + (coords.right - coords.left) / 2 - 20,
    y: coords.top,
  };

  // Кнопка локации в центре-справа
  floatingLocationButtonPosition.value = {
    x: coords.left + (coords.right - coords.left) / 2 + 20,
    y: coords.top,
  };

  // Кнопка предмета справа
  floatingItemButtonPosition.value = {
    x: coords.left + (coords.right - coords.left) / 2 + 60,
    y: coords.top,
  };

  console.log('Позиция кнопок:', {
    character: floatingButtonPosition.value,
    event: floatingEventButtonPosition.value,
    location: floatingLocationButtonPosition.value,
    item: floatingItemButtonPosition.value
  });

  showFloatingButton.value = true;
  showFloatingEventButton.value = true;
  showFloatingLocationButton.value = true;
  showFloatingItemButton.value = true;
};

const hideFloatingButton = () => {
  showFloatingButton.value = false;
  showFloatingEventButton.value = false;
  showFloatingLocationButton.value = false;
  showFloatingItemButton.value = false;
  selectedTextForCharacter.value = '';
  characterSelectionRange.value = null;
};

const handleFloatingButtonClick = () => {
  console.log('Клик по плавающей кнопке');
  console.log('Диапазон выделения:', characterSelectionRange.value);

  if (!characterSelectionRange.value || !editor.value) {
    console.log('Нет диапазона выделения');
    return;
  }

  // Сохраняем текущее выделение
  savedSelection.value = characterSelectionRange.value;

  const { from } = characterSelectionRange.value;
  const { view } = editor.value;
  const coords = view.coordsAtPos(from);

  characterSelectionPosition.value = {
    x: coords.left,
    y: coords.top + 25,
  };

  console.log('Позиция попапа выбора персонажа:', characterSelectionPosition.value);

  // Сначала открываем попап, затем добавляем подсветку
  showCharacterSelection.value = true;

  // Добавляем визуальную подсветку после открытия попапа
  setTimeout(() => {
    if (editor.value && savedSelection.value) {
      const { from, to } = savedSelection.value;
      editor.value
        .chain()
        .setTextSelection({ from, to })
        .setHighlight({ color: '#3b82f680' })
        .run();
    }
  }, 10);

  hideFloatingButton();
};

const handleCharacterSelect = (character: Character) => {
  console.log('Обработка выбора персонажа:', character);
  console.log('Сохраненное выделение:', savedSelection.value);

  if (!editor.value || !savedSelection.value) {
    console.log('Нет редактора или сохраненного выделения');
    return;
  }

  const { from, to } = savedSelection.value;

  // Получаем текущий текст из диапазона (может быть изменен пользователем)
  const currentText = editor.value.state.doc.textBetween(from, to);

  console.log('Создание ссылки на персонажа:', { from, to, currentText, characterId: character.id });

  // Удаляем временную подсветку и заменяем выделенный текст ссылкой на персонажа
  editor.value
    .chain()
    .setTextSelection({ from, to })
    .unsetHighlight()
    .setCharacterLink({
      characterId: character.id,
      text: currentText, // Используем текущий текст из диапазона
    })
    .run();

  hideCharacterSelection();
};

const hideCharacterSelection = () => {
  showCharacterSelection.value = false;

  // Удаляем временную подсветку если она есть
  if (editor.value && savedSelection.value) {
    const { from, to } = savedSelection.value;
    editor.value
      .chain()
      .setTextSelection({ from, to })
      .unsetHighlight()
      .run();
  }

  // Очищаем сохраненные данные
  selectedTextForCharacter.value = '';
  characterSelectionRange.value = null;
  savedSelection.value = null;
};

// Функции для работы с событиями
const showEventSelectionPopup = () => {
  if (!editor.value) return;

  const selection = editor.value.state.selection;
  const { from, to } = selection;

  if (from === to) return; // Нет выделения

  const text = editor.value.state.doc.textBetween(from, to);
  console.log('Показать выбор события для текста:', text);

  selectedTextForEvent.value = text;
  eventSelectionRange.value = { from, to };
  savedSelection.value = eventSelectionRange.value;

  const { from: selectionFrom } = eventSelectionRange.value;
  const { view } = editor.value;
  const coords = view.coordsAtPos(selectionFrom);

  eventSelectionPosition.value = {
    x: coords.left,
    y: coords.top + 25,
  };

  console.log('Позиция попапа выбора события:', eventSelectionPosition.value);

  // Сначала открываем попап, затем добавляем подсветку
  showEventSelection.value = true;

  // Добавляем визуальную подсветку после открытия попапа
  setTimeout(() => {
    if (editor.value && savedSelection.value) {
      const { from, to } = savedSelection.value;
      editor.value
        .chain()
        .setTextSelection({ from, to })
        .setHighlight({ color: '#22c55e80' })
        .run();
    }
  }, 10);

  hideFloatingButton();
};

const handleEventSelect = (event: IEvent) => {
  console.log('Обработка выбора события:', event);
  console.log('Сохраненное выделение:', savedSelection.value);

  if (!editor.value || !savedSelection.value) {
    console.log('Нет редактора или сохраненного выделения');
    return;
  }

  const { from, to } = savedSelection.value;

  // Получаем текущий текст из диапазона (может быть изменен пользователем)
  const currentText = editor.value.state.doc.textBetween(from, to);

  console.log('Создание ссылки на событие:', { from, to, currentText, eventId: event.id });

  // Удаляем временную подсветку и заменяем выделенный текст ссылкой на событие
  editor.value
    .chain()
    .setTextSelection({ from, to })
    .unsetHighlight()
    .setEventLink({
      eventId: event.id,
      text: currentText, // Используем текущий текст из диапазона
    })
    .run();

  hideEventSelection();
};

const hideEventSelection = () => {
  showEventSelection.value = false;

  // Удаляем временную подсветку если она есть
  if (editor.value && savedSelection.value) {
    const { from, to } = savedSelection.value;
    editor.value
      .chain()
      .setTextSelection({ from, to })
      .unsetHighlight()
      .run();
  }

  // Очищаем сохраненные данные для событий
  selectedTextForEvent.value = '';
  eventSelectionRange.value = null;
  savedSelection.value = null;
};

// Функции для работы с локациями
const showLocationSelectionPopup = () => {
  if (!editor.value) return;

  const { view } = editor.value;
  const { from, to } = view.state.selection;

  if (from === to) return; // Нет выделения

  // Сохраняем выделенный текст и диапазон
  selectedTextForLocation.value = view.state.doc.textBetween(from, to);
  locationSelectionRange.value = { from, to };
  savedSelection.value = { from, to };

  // Вычисляем позицию для попапа
  const coords = view.coordsAtPos(from);
  locationSelectionPosition.value = {
    x: coords.left,
    y: coords.top + 25,
  };

  showLocationSelection.value = true;

  // Добавляем визуальную подсветку после открытия попапа
  setTimeout(() => {
    if (editor.value && savedSelection.value) {
      const { from, to } = savedSelection.value;
      editor.value
        .chain()
        .setTextSelection({ from, to })
        .setHighlight({ color: '#fbbf2480' })
        .run();
    }
  }, 10);

  hideFloatingButton();
};

const handleLocationSelect = (location: ILocation) => {
  console.log('Обработка выбора локации:', location);
  console.log('Сохраненное выделение:', savedSelection.value);

  if (!editor.value || !savedSelection.value) {
    console.log('Нет редактора или сохраненного выделения');
    return;
  }

  const { from, to } = savedSelection.value;

  // Получаем текущий текст из диапазона (может быть изменен пользователем)
  const currentText = editor.value.state.doc.textBetween(from, to);

  console.log('Создание ссылки на локацию:', { from, to, currentText, locationId: location.id });

  // Удаляем временную подсветку и заменяем выделенный текст ссылкой на локацию
  editor.value
    .chain()
    .setTextSelection({ from, to })
    .unsetHighlight()
    .deleteSelection()
    .setLocationLink({
      locationId: location.id,
      text: currentText, // Используем текущий текст из диапазона
    })
    .run();

  hideLocationSelection();
};

const hideLocationSelection = () => {
  showLocationSelection.value = false;

  // Удаляем временную подсветку если она есть
  if (editor.value && savedSelection.value) {
    const { from, to } = savedSelection.value;
    editor.value
      .chain()
      .setTextSelection({ from, to })
      .unsetHighlight()
      .run();
  }

  // Очищаем сохраненные данные для локаций
  selectedTextForLocation.value = '';
  locationSelectionRange.value = null;
  savedSelection.value = null;
};

// Функции для работы с предметами
const showItemSelectionPopup = () => {
  if (!editor.value) return;

  const { view } = editor.value;
  const { from, to } = view.state.selection;

  if (from === to) return; // Нет выделения

  // Сохраняем выделенный текст и диапазон
  selectedTextForItem.value = view.state.doc.textBetween(from, to);
  itemSelectionRange.value = { from, to };
  savedSelection.value = { from, to };

  // Вычисляем позицию для попапа
  const coords = view.coordsAtPos(from);
  itemSelectionPosition.value = {
    x: coords.left,
    y: coords.top + 25,
  };

  showItemSelection.value = true;

  // Добавляем визуальную подсветку после открытия попапа
  setTimeout(() => {
    if (editor.value && savedSelection.value) {
      const { from, to } = savedSelection.value;
      editor.value
        .chain()
        .setTextSelection({ from, to })
        .setHighlight({ color: '#10b98180' })
        .run();
    }
  }, 10);

  hideFloatingButton();
};

const handleItemSelect = (item: IItem) => {
  console.log('Обработка выбора предмета:', item);
  console.log('Сохраненное выделение:', savedSelection.value);

  if (!editor.value || !savedSelection.value) {
    console.log('Нет редактора или сохраненного выделения');
    return;
  }

  const { from, to } = savedSelection.value;

  // Получаем текущий текст из диапазона (может быть изменен пользователем)
  const currentText = editor.value.state.doc.textBetween(from, to);

  console.log('Создание ссылки на предмет:', { from, to, currentText, itemId: item.id });

  // Удаляем временную подсветку и заменяем выделенный текст ссылкой на предмет
  editor.value
    .chain()
    .setTextSelection({ from, to })
    .unsetHighlight()
    .deleteSelection()
    .setItemLink({
      itemId: item.id,
      text: currentText, // Используем текущий текст из диапазона
    })
    .run();

  hideItemSelection();
};

const hideItemSelection = () => {
  showItemSelection.value = false;

  // Удаляем временную подсветку если она есть
  if (editor.value && savedSelection.value) {
    const { from, to } = savedSelection.value;
    editor.value
      .chain()
      .setTextSelection({ from, to })
      .unsetHighlight()
      .run();
  }

  // Очищаем сохраненные данные для предметов
  selectedTextForItem.value = '';
  itemSelectionRange.value = null;
  savedSelection.value = null;
};

// Инициализация редактора
onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    editable: !props.readonly,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Отключаем стандартный code block, используем lowlight
      }),
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Subscript,
      Superscript,
      HorizontalRule,
      StageBlock,
      CharacterLink,
      EventLinkExtension,
      LocationLinkExtension,
      ItemLink,
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      emit('update:modelValue', html);
      emit('change', html);

      // Проверяем слэш-команды
      checkForSlashCommands();
    },
    onSelectionUpdate: () => {
      // Обновляем плавающую кнопку при изменении выделения
      // Но только если попап выбора персонажа не открыт
      if (!showCharacterSelection.value) {
        updateFloatingButton();
      }
    },
    editorProps: {
      handleKeyDown: (_view, event) => {
        // Обрабатываем клавиши для слэш-команд
        if (handleSlashCommandKeyDown(event)) {
          return true;
        }

        // Скрываем слэш-команды при Escape
        if (event.key === 'Escape' && showSlashCommands.value) {
          hideSlashCommands();
          return true;
        }

        // Скрываем выбор персонажей при Escape
        if (event.key === 'Escape' && showCharacterSelection.value) {
          hideCharacterSelection();
          return true;
        }

        // Скрываем выбор событий при Escape
        if (event.key === 'Escape' && showEventSelection.value) {
          hideEventSelection();
          return true;
        }

        // Скрываем выбор локаций при Escape
        if (event.key === 'Escape' && showLocationSelection.value) {
          hideLocationSelection();
          return true;
        }

        // Скрываем выбор предметов при Escape
        if (event.key === 'Escape' && showItemSelection.value) {
          hideItemSelection();
          return true;
        }

        return false;
      },
      handleClick: (_view, _pos, event) => {
        // Если попап выбора персонажа открыт, проверяем клик вне его
        if (showCharacterSelection.value) {
          const popup = document.querySelector('.character-selection-popup');
          const target = event.target as HTMLElement;

          // Если клик не внутри попапа, закрываем его
          if (!popup || !popup.contains(target)) {
            hideCharacterSelection();
            return true; // Предотвращаем обработку клика редактором
          }
          return false; // Позволяем попапу обработать клик
        }

        // Если попап выбора события открыт, проверяем клик вне его
        if (showEventSelection.value) {
          const popup = document.querySelector('.event-selection-popup');
          const target = event.target as HTMLElement;

          // Если клик не внутри попапа, закрываем его
          if (!popup || !popup.contains(target)) {
            hideEventSelection();
            return true; // Предотвращаем обработку клика редактором
          }
          return false; // Позволяем попапу обработать клик
        }

        // Если попап выбора локации открыт, проверяем клик вне его
        if (showLocationSelection.value) {
          const popup = document.querySelector('.location-selection-popup');
          const target = event.target as HTMLElement;

          // Если клик не внутри попапа, закрываем его
          if (!popup || !popup.contains(target)) {
            hideLocationSelection();
            return true; // Предотвращаем обработку клика редактором
          }
          return false; // Позволяем попапу обработать клик
        }

        // Если попап выбора предмета открыт, проверяем клик вне его
        if (showItemSelection.value) {
          const popup = document.querySelector('.item-selection-popup');
          const target = event.target as HTMLElement;

          // Если клик не внутри попапа, закрываем его
          if (!popup || !popup.contains(target)) {
            hideItemSelection();
            return true; // Предотвращаем обработку клика редактором
          }
          return false; // Позволяем попапу обработать клик
        }

        // Обычное поведение - обновляем плавающую кнопку
        setTimeout(() => {
          updateFloatingButton();
        }, 10);

        return false; // Позволяем редактору обработать клик как обычно
      },
    },
  });
});

// Проверка слэш-команд
const checkForSlashCommands = () => {
  if (!editor.value) return;

  const { selection } = editor.value.state;
  const { $from } = selection;

  if (selection.from !== selection.to) {
    hideSlashCommands();
    return;
  }

  const currentNode = $from.parent;
  const textInNode = currentNode.textContent;
  const posInNode = $from.parentOffset;
  const textBeforeCursor = textInNode.slice(0, posInNode);

  const match = textBeforeCursor.match(/\/([^/\s]*)$/);

  if (match) {
    const query = match[1];
    const from = selection.from - match[0].length;
    const to = selection.from;

    showSlashCommandsMenu(query, { from, to });
  } else {
    hideSlashCommands();
  }
};

// Очистка при размонтировании
onBeforeUnmount(() => {
  editor.value?.destroy();
});

// Отслеживание изменений modelValue
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue);
  }
});

// Команды форматирования текста
const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run();
};

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run();
};

const toggleUnderline = () => {
  editor.value?.chain().focus().toggleUnderline().run();
};

const toggleStrike = () => {
  editor.value?.chain().focus().toggleStrike().run();
};

const toggleCode = () => {
  editor.value?.chain().focus().toggleCode().run();
};

const toggleHighlight = () => {
  editor.value?.chain().focus().toggleHighlight().run();
};

// Команды форматирования заголовков
const setHeading = (level: 1 | 2 | 3) => {
  editor.value?.chain().focus().toggleHeading({ level }).run();
};

// Команды списков
const toggleBulletList = () => {
  editor.value?.chain().focus().toggleBulletList().run();
};

const toggleOrderedList = () => {
  editor.value?.chain().focus().toggleOrderedList().run();
};

// Команды блоков
const toggleBlockquote = () => {
  editor.value?.chain().focus().toggleBlockquote().run();
};

const insertHorizontalRule = () => {
  editor.value?.chain().focus().setHorizontalRule().run();
};

// Команды выравнивания текста
const setTextAlign = (alignment: 'left' | 'center' | 'right') => {
  editor.value?.chain().focus().setTextAlign(alignment).run();
};

// Команды таблицы
const insertTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
};

// Проверка активности команд
const isActive = (name: string, attributes?: Record<string, any>) => {
  return editor.value?.isActive(name, attributes) || false;
};

// Опции для выпадающих меню
const headingOptions = [
  { label: 'Обычный текст', key: 'paragraph' },
  { label: 'Заголовок 1', key: 'h1' },
  { label: 'Заголовок 2', key: 'h2' },
  { label: 'Заголовок 3', key: 'h3' },
];

const handleHeadingSelect = (key: string) => {
  if (key === 'paragraph') {
    editor.value?.chain().focus().setParagraph().run();
  } else if (key === 'h1') {
    setHeading(1);
  } else if (key === 'h2') {
    setHeading(2);
  } else if (key === 'h3') {
    setHeading(3);
  }
};
</script>

<template>
  <div class="notion-editor">
    <!-- Панель инструментов -->
    <div class="toolbar" v-if="!readonly">
      <NSpace>
        <!-- Заголовки -->
        <NDropdown
          trigger="click"
          :options="headingOptions"
          @select="handleHeadingSelect"
        >
          <NButton size="small">
            <template #icon>
              <NIcon>
                <H1 v-if="isActive('heading', { level: 1 })" />
                <H2 v-else-if="isActive('heading', { level: 2 })" />
                <H3 v-else-if="isActive('heading', { level: 3 })" />
                <H1 v-else />
              </NIcon>
            </template>
          </NButton>
        </NDropdown>

        <!-- Форматирование текста -->
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('bold') ? 'primary' : 'default'"
              @click="toggleBold"
            >
              <template #icon>
                <NIcon><Bold /></NIcon>
              </template>
            </NButton>
          </template>
          Жирный
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('italic') ? 'primary' : 'default'"
              @click="toggleItalic"
            >
              <template #icon>
                <NIcon><Italic /></NIcon>
              </template>
            </NButton>
          </template>
          Курсив
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('underline') ? 'primary' : 'default'"
              @click="toggleUnderline"
            >
              <template #icon>
                <NIcon><UnderlineIcon /></NIcon>
              </template>
            </NButton>
          </template>
          Подчеркивание
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('strike') ? 'primary' : 'default'"
              @click="toggleStrike"
            >
              <template #icon>
                <NIcon><Strikethrough /></NIcon>
              </template>
            </NButton>
          </template>
          Зачеркивание
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('code') ? 'primary' : 'default'"
              @click="toggleCode"
            >
              <template #icon>
                <NIcon><Code /></NIcon>
              </template>
            </NButton>
          </template>
          Код
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('highlight') ? 'primary' : 'default'"
              @click="toggleHighlight"
            >
              <template #icon>
                <NIcon><HighlightIcon /></NIcon>
              </template>
            </NButton>
          </template>
          Выделение
        </NTooltip>

        <!-- Списки -->
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('bulletList') ? 'primary' : 'default'"
              @click="toggleBulletList"
            >
              <template #icon>
                <NIcon><List /></NIcon>
              </template>
            </NButton>
          </template>
          Маркированный список
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('orderedList') ? 'primary' : 'default'"
              @click="toggleOrderedList"
            >
              <template #icon>
                <NIcon><ListNumbers /></NIcon>
              </template>
            </NButton>
          </template>
          Нумерованный список
        </NTooltip>

        <!-- Блоки -->
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              :type="isActive('blockquote') ? 'primary' : 'default'"
              @click="toggleBlockquote"
            >
              <template #icon>
                <NIcon><Quote /></NIcon>
              </template>
            </NButton>
          </template>
          Цитата
        </NTooltip>

        <!-- Выравнивание -->
        <NDropdown
          trigger="click"
          :options="[
            { label: 'По левому краю', key: 'left' },
            { label: 'По центру', key: 'center' },
            { label: 'По правому краю', key: 'right' },
          ]"
          @select="(key: string) => setTextAlign(key as 'left' | 'center' | 'right')"
        >
          <NButton size="small">
            <template #icon>
              <NIcon>
                <AlignLeft v-if="isActive('paragraph', { textAlign: 'left' }) || isActive('heading', { textAlign: 'left' })" />
                <AlignCenter v-else-if="isActive('paragraph', { textAlign: 'center' }) || isActive('heading', { textAlign: 'center' })" />
                <AlignRight v-else-if="isActive('paragraph', { textAlign: 'right' }) || isActive('heading', { textAlign: 'right' })" />
                <AlignLeft v-else />
              </NIcon>
            </template>
          </NButton>
        </NDropdown>

        <!-- Таблица -->
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              @click="insertTable"
            >
              <template #icon>
                <NIcon><TableIcon /></NIcon>
              </template>
            </NButton>
          </template>
          Вставить таблицу
        </NTooltip>

        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              size="small"
              @click="insertHorizontalRule"
            >
              <template #icon>
                <NIcon><Minus /></NIcon>
              </template>
            </NButton>
          </template>
          Горизонтальная линия
        </NTooltip>
      </NSpace>
    </div>

    <!-- Редактор -->
    <div class="editor-content">
      <EditorContent :editor="editor as any" v-if="editor" />

      <!-- Слэш-команды -->
      <Teleport to="body">
        <div
          v-if="showSlashCommands"
          class="slash-commands-container"
          :style="{
            position: 'fixed',
            top: slashCommandsPosition.top + 'px',
            left: slashCommandsPosition.left + 'px',
            zIndex: 1000,
          }"
        >
          <SlashCommandsList
            ref="slashCommandsListRef"
            :items="filteredSlashCommands"
            :command="executeSlashCommand"
            :max-height="slashCommandsMaxHeight"
          />
        </div>
      </Teleport>

      <!-- Плавающая кнопка персонажа -->
      <FloatingCharacterButton
        :visible="showFloatingButton"
        :position="floatingButtonPosition"
        @click="handleFloatingButtonClick"
      />

      <!-- Выбор персонажа -->
      <CharacterSelectionPopup
        :visible="showCharacterSelection"
        :position="characterSelectionPosition"
        :selected-text="selectedTextForCharacter"
        :current-stage-id="currentStageId"
        @select="handleCharacterSelect"
        @close="hideCharacterSelection"
      />

      <!-- Плавающая кнопка события -->
      <FloatingEventButton
        :visible="showFloatingEventButton"
        :position="floatingEventButtonPosition"
        @click="showEventSelectionPopup"
      />

      <!-- Плавающая кнопка локации -->
      <FloatingLocationButton
        :visible="showFloatingLocationButton"
        :position="floatingLocationButtonPosition"
        :has-selection="!!selectedTextForLocation"
        @click="showLocationSelectionPopup"
      />

      <!-- Плавающая кнопка предмета -->
      <FloatingItemButton
        :visible="showFloatingItemButton"
        :position="floatingItemButtonPosition"
        @click="showItemSelectionPopup"
      />

      <!-- Выбор события -->
      <EventSelectionPopup
        :visible="showEventSelection"
        :position="eventSelectionPosition"
        :selected-text="selectedTextForEvent"
        :current-stage-id="currentStageId"
        @select="handleEventSelect"
        @close="hideEventSelection"
      />

      <!-- Выбор локации -->
      <LocationSelectionPopup
        :visible="showLocationSelection"
        :position="locationSelectionPosition"
        :selected-text="selectedTextForLocation"
        :current-stage-id="currentStageId"
        @select="handleLocationSelect"
        @close="hideLocationSelection"
      />

      <!-- Выбор предмета -->
      <ItemSelectionPopup
        :visible="showItemSelection"
        :position="itemSelectionPosition"
        :selected-text="selectedTextForItem"
        :current-stage-id="currentStageId"
        @select="handleItemSelect"
        @close="hideItemSelection"
      />
    </div>
  </div>
</template>

<style scoped>
.notion-editor {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-color);
}

.editor-content {
  min-height: 200px;
}

:deep(.ProseMirror) {
  padding: 16px;
  outline: none;
  min-height: 200px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--placeholder-color);
  pointer-events: none;
  height: 0;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  padding-left: 1.5em;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid var(--primary-color);
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
}

:deep(.ProseMirror code) {
  background-color: var(--code-color);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

:deep(.ProseMirror pre) {
  background-color: var(--code-color);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

:deep(.ProseMirror mark) {
  background-color: yellow;
  padding: 0.1em 0.2em;
  border-radius: 2px;
}

:deep(.ProseMirror table) {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

:deep(.ProseMirror table td, .ProseMirror table th) {
  border: 1px solid var(--border-color);
  padding: 0.5em;
  text-align: left;
}

:deep(.ProseMirror table th) {
  background-color: var(--card-color);
  font-weight: bold;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid var(--border-color);
  margin: 2em 0;
}

:deep(.ProseMirror ul[data-type="taskList"]) {
  list-style: none;
  padding-left: 0;
}

:deep(.ProseMirror ul[data-type="taskList"] li) {
  display: flex;
  align-items: flex-start;
}

:deep(.ProseMirror ul[data-type="taskList"] li > label) {
  margin-right: 0.5em;
  user-select: none;
}

:deep(.ProseMirror ul[data-type="taskList"] li > div) {
  flex: 1;
}

/* Стили для слэш-команд */
.slash-commands-container {
  position: fixed;
  z-index: 1000;
}

:deep(.slash-command-decoration) {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border-radius: 3px;
  padding: 0 2px;
}

/* Стили для блока сцены */
:deep(.stage-block) {
  margin: 8px 0;
  padding: 8px;
  border: 1px solid #18a058;
  border-radius: 8px;
  background: #fafffe;
  position: relative;
  transition: all 0.2s ease;
}

:deep(.stage-block:hover) {
  border-color: #22c55e;
  background: #f0fdf9;
  box-shadow: 0 2px 8px rgba(24, 160, 88, 0.08);
}

:deep(.stage-block .stage-header) {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(24, 160, 88, 0.15);
}

:deep(.stage-block .stage-header span) {
  font-size: 16px;
  color: #18a058;
  font-weight: 500;
}

:deep(.stage-block .stage-selector) {
  flex: 1;
  max-width: 280px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
}

:deep(.stage-block .stage-selector:focus) {
  outline: none;
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.1);
}

:deep(.stage-block .stage-content) {
  min-height: 60px;
  padding: 12px;
  border: 1px dashed rgba(24, 160, 88, 0.25);
  border-radius: 6px;
  background: white;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s ease;
}

:deep(.stage-block .stage-content:hover) {
  border-color: rgba(24, 160, 88, 0.4);
  background: #fafffe;
}

:deep(.stage-block .stage-content p) {
  margin: 6px 0;
  color: #374151;
}

:deep(.stage-block .stage-content:focus) {
  outline: none;
  border-color: #18a058;
  border-style: solid;
  background: white;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.1);
}

/* Стили для ссылок на персонажей */
:deep(.character-link) {
  display: inline;
  padding: 2px 6px;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.character-link:hover) {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.character-link.selected) {
  background-color: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.7);
}

:deep(.character-link.missing) {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

:deep(.character-link.missing:hover) {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Стили для временной подсветки при выборе персонажа */
:deep(.ProseMirror mark[data-color="#3b82f680"]) {
  background-color: rgba(59, 130, 246, 0.5) !important;
  border-radius: 3px;
  padding: 1px 2px;
  animation: pulse 1.5s infinite;
}

:deep(.ProseMirror mark) {
  border-radius: 3px;
  padding: 1px 2px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
}

/* Стили для ссылок на события */
:deep(.event-link) {
  display: inline;
  padding: 2px 6px;
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 4px;
  color: #22c55e;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.event-link:hover) {
  background-color: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.5);
}

:deep(.event-link.selected) {
  background-color: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.7);
}

:deep(.event-link.missing) {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

:deep(.event-link.missing:hover) {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Стили для временной подсветки при выборе события */
:deep(.ProseMirror mark[data-color="#22c55e80"]) {
  background-color: rgba(34, 197, 94, 0.5) !important;
  border-radius: 3px;
  padding: 1px 2px;
  animation: pulse 1.5s infinite;
}

/* Стили для ссылок на предметы */
:deep(.item-link) {
  display: inline;
  padding: 2px 6px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 4px;
  color: #10b981;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.item-link:hover) {
  background-color: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
}

:deep(.item-link.selected) {
  background-color: rgba(16, 185, 129, 0.3);
  border-color: rgba(16, 185, 129, 0.7);
}

:deep(.item-link.missing) {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

:deep(.item-link.missing:hover) {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Стили для временной подсветки при выборе предмета */
:deep(.ProseMirror mark[data-color="#10b98180"]) {
  background-color: rgba(16, 185, 129, 0.5) !important;
  border-radius: 3px;
  padding: 1px 2px;
  animation: pulse 1.5s infinite;
}
</style>
