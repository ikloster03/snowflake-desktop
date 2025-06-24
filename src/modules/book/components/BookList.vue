<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ISingleBook } from '../book.types';
import { NTag, NDataTable, NButton, NSpace, useMessage } from 'naive-ui';
import { h } from 'vue';
import { useRouter } from 'vue-router';
import { BOOK_EDITOR_PAGE } from '../book.const';
import { useBookStore } from '../book.store';
import { open } from '@tauri-apps/plugin-dialog';

defineProps<{
  books: ISingleBook[];
}>();

const emit = defineEmits<{
  (e: 'delete', bookId: string): void;
}>();

const { t } = useI18n();
const message = useMessage();

const createColumns = () => [
  {
    title: t('book.title'),
    key: 'title',
    render(row: ISingleBook) {
      return h(
        'a',
        {
          href: 'javascript:void(0)',
          onClick: () => handleBookClick(row.id),
        },
        row.title
      );
    },
  },
  {
    title: t('book.genresTitle'),
    key: 'genres',
    render: (row: ISingleBook) => {
      return row.genres.map((genre) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => t(`book.genres.${genre}`),
          }
        );
      });
    },
  },
  {
    title: t('book.statusLabel'),
    key: 'status',
    render: (row: ISingleBook) => t(`book.status.${row.status}`),
  },
  {
    title: t('common.actions'),
    key: 'actions',
    render(row: ISingleBook) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleBookClick(row.id),
              },
              { default: () => t('common.edit') }
            ),
            h(
              NButton,
              {
                secondary: true,
                size: 'small',
                disabled: !bookStore.canExportBook(row.id),
                onClick: () => handleExportBook(row.id),
              },
              { default: () => t('book.export.button') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => emit('delete', row.id),
              },
              { default: () => t('common.delete') }
            ),
          ],
        }
      );
    },
  },
];

const router = useRouter();
const bookStore = useBookStore();

const handleBookClick = (bookId: string) => {
  bookStore.setCurrentBook(bookId);
  router.push({
    name: BOOK_EDITOR_PAGE.name,
    params: { id: bookId },
  });
};

const handleExportBook = async (bookId: string) => {
  try {
    message.loading(t('book.export.loading'), { duration: 0 });

    // Открываем диалог выбора директории
    const selectedDirectory = await open({
      directory: true,
      multiple: false,
      title: t('book.export.saveTitle'),
    });

    // Если пользователь отменил выбор директории
    if (!selectedDirectory) {
      message.destroyAll();
      return;
    }

    await bookStore.exportBookToWord(bookId, selectedDirectory as string);
    message.destroyAll();
    message.success(t('book.export.success'));
  } catch (error) {
    message.destroyAll();
    message.error(error instanceof Error ? error.message : t('book.export.error'));
    console.error('Export error:', error);
  }
};
</script>

<template>
  <NDataTable :columns="createColumns()" :data="books" />
</template>
