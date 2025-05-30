<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { createLowlight } from 'lowlight';
import { NButton, NSpace, NTooltip, NDropdown, NIcon } from 'naive-ui';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListNumbers,
  H1,
  H2,
  H3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Highlight as HighlightIcon,
  Minus
} from '@vicons/tabler';
import { slashCommands, type SlashCommandItem } from './SlashCommands';
import SlashCommandsList from './SlashCommandsList.vue';
import { StageBlock } from './StageBlockExtension';

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

// Состояние для слэш-команд
const showSlashCommands = ref(false);
const slashCommandsPosition = ref({ top: 0, left: 0 });
const slashCommandsQuery = ref('');
const slashCommandsRange = ref<{ from: number; to: number } | null>(null);
const slashCommandsListRef = ref<InstanceType<typeof SlashCommandsList> | null>(null);
const slashCommandsMaxHeight = ref(300);

const lowlight = createLowlight();

// Функции для слэш-команд
const filteredSlashCommands = computed(() => {
  if (!slashCommandsQuery.value) {
    return slashCommands;
  }
  return slashCommands.filter(item =>
    item.title.toLowerCase().includes(slashCommandsQuery.value.toLowerCase())
  );
});

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
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      emit('update:modelValue', html);
      emit('change', html);

      // Проверяем слэш-команды
      checkForSlashCommands();
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

        return false;
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
  margin: 24px 0;
  padding: 20px;
  border: 2px solid #18a058;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fffe 0%, #f0fdf9 100%);
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.1);
  position: relative;
  transition: all 0.2s ease;
}

:deep(.stage-block::before) {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #18a058, #22c55e);
  border-radius: 12px;
  z-index: -1;
  opacity: 0.1;
}

:deep(.stage-block:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(24, 160, 88, 0.15);
}

:deep(.stage-block .stage-header) {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(24, 160, 88, 0.2);
}

:deep(.stage-block .stage-header span) {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

:deep(.stage-block .stage-selector) {
  flex: 1;
  max-width: 300px;
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.stage-block .stage-selector:focus) {
  outline: none;
  border-color: #18a058;
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.1);
}

:deep(.stage-block .stage-content) {
  min-height: 80px;
  padding: 16px;
  border: 2px dashed rgba(24, 160, 88, 0.3);
  border-radius: 8px;
  background: white;
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.2s ease;
}

:deep(.stage-block .stage-content:hover) {
  border-color: rgba(24, 160, 88, 0.5);
  background: #fafffe;
}

:deep(.stage-block .stage-content p) {
  margin: 8px 0;
  color: #374151;
}

:deep(.stage-block .stage-content:focus) {
  outline: none;
  border-color: #18a058;
  border-style: solid;
  background: white;
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.1);
}
</style>
