<script lang="ts" setup>
import { NDataTable } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { ISingleBook } from '../book.types';
import { computed } from 'vue';

const { t } = useI18n();

const props = defineProps<{
  books: ISingleBook[];
}>();

const columns = computed(() => [
  {
    title: t('book.title'),
    key: 'title',
  },
  {
    title: t('book.authors'),
    key: 'authors',
    render: (row: ISingleBook) =>
      row.authors.map((a) => a.titleName).join(', '),
  },
  {
    title: t('book.genres'),
    key: 'genres',
    render: (row: ISingleBook) =>
      row.genres.map((g) => t(`book.genres.${g}`)).join(', '),
  },
  {
    title: t('book.status'),
    key: 'status',
    render: (row: ISingleBook) => t(`book.status.${row.status}`),
  },
]);
</script>

<template>
  <div>
    <NDataTable
      :columns="columns"
      :data="books"
      :pagination="{ pageSize: 10 }"
    />
  </div>
</template>
