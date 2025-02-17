<script lang="ts" setup>
import { NDataTable } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IAuthor } from '../book.types';
import { computed } from 'vue';
import { useBookStore } from '../book.store';

const { t } = useI18n();

const props = defineProps<{
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
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="authors"
    :pagination="{ pageSize: 10 }"
  />
</template>
