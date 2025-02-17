<script lang="ts" setup>
import { NDataTable } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IBookSeries } from '../book.types';
import { computed } from 'vue';

const { t } = useI18n();

const props = defineProps<{
  series: IBookSeries[];
}>();

const columns = computed(() => [
  {
    title: t('book.series.title'),
    key: 'title',
  },
  {
    title: t('book.series.type'),
    key: 'type',
    render: (row: IBookSeries) => t(`book.series.types.${row.type}`),
  },
  {
    title: t('book.series.books'),
    key: 'books',
    render: (row: IBookSeries) => row.books.length,
  },
  {
    title: t('book.authors'),
    key: 'authors',
    render: (row: IBookSeries) => row.authors.map(a => a.titleName).join(', '),
  },
]);
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="series"
    :pagination="{ pageSize: 10 }"
  />
</template>
