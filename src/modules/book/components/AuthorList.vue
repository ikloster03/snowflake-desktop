<script lang="ts" setup>
import { NDataTable } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IAuthor } from '../book.types';
import { computed } from 'vue';
import { useBookStore } from '../book.store';

const { t } = useI18n();

defineProps<{
  authors: IAuthor[];
}>();

const bookStore = useBookStore();

const columns = computed(() => [
  {
    title: t('book.author.titleName'),
    key: 'titleName',
  },
  {
    title: t('book.author.fullName'),
    key: 'fullName',
  },
  {
    title: t('book.author.booksTitle'),
    key: 'books',
    render: (row: IAuthor) => bookStore.findBooksByAuthor(row.id).length,
  },
  {
    title: t('book.author.seriesTitle'),
    key: 'series',
    render: (row: IAuthor) => bookStore.findSeriesByAuthor(row.id).length,
  },
]);

// Раскомментируйте этот код, если события действительно используются в компоненте
/*
const emit = defineEmits<{
  (e: 'delete', authorId: string): void;
  (e: 'edit', author: IAuthor): void;
}>();
*/
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="authors"
    :pagination="{ pageSize: 10 }"
  />
</template>
