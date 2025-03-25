<script lang="ts" setup>
import { NDataTable, NButton, NSpace } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IBookSeries } from '../book.types';
import { computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { SERIES_EDITOR_PAGE } from '../book.const';

const { t } = useI18n();
const router = useRouter();

defineProps<{
  series: IBookSeries[];
}>();

const emit = defineEmits<{
  (e: 'delete', seriesId: string): void;
  (e: 'edit', series: IBookSeries): void;
}>();

const handleEdit = (series: IBookSeries) => {
  router.push({ name: SERIES_EDITOR_PAGE.name, params: { id: series.id } });
};

const handleDelete = (seriesId: string) => {
  emit('delete', seriesId);
};

const columns = computed(() => [
  {
    title: t('book.series.title'),
    key: 'title',
  },
  {
    title: t('book.series.type'),
    key: 'type',
    render: (row: IBookSeries) =>
      t(`book.series.types.${row.type.toLowerCase()}`),
  },
  {
    title: t('book.series.books'),
    key: 'books',
    render: (row: IBookSeries) => row.books.length,
  },
  {
    title: t('book.authors'),
    key: 'authors',
    render: (row: IBookSeries) =>
      row.authors.map((a) => a.titleName).join(', '),
  },
  {
    title: t('common.actions'),
    key: 'actions',
    render: (row: IBookSeries) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(row),
              },
              { default: () => t('common.edit') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => handleDelete(row.id),
              },
              { default: () => t('common.delete') }
            ),
          ],
        }
      );
    },
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
