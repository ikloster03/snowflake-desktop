<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ISingleBook } from '../book.types';
import { NTag, NDataTable, NButton, NSpace } from 'naive-ui';
import { computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { BOOK_EDITOR_PAGE, PLAN_PAGE } from '../book.const';
import { useBookStore } from '../book.store';

const props = defineProps<{
  books: ISingleBook[];
}>();

const emit = defineEmits<{
  (e: 'delete', bookId: string): void;
}>();

const { t } = useI18n();

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
</script>

<template>
  <NDataTable :columns="createColumns()" :data="books" />
</template>
