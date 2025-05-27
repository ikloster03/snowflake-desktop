<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
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

const lowlight = createLowlight();

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
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      emit('update:modelValue', html);
      emit('change', html);
    },
  });
});

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
</style>
