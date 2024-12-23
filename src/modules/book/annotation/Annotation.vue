<script lang="ts" setup>
import { NCard, NInput } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useBookStore } from '../book.store';

const { t } = useI18n();
const bookStore = useBookStore();
</script>

<template>
  <NCard>
    <h2>Annotation</h2>
    <NInput
      type="textarea"
      :placeholder="t('annotation')"
      :value="bookStore.annotation"
      @update:value="(value: string) => bookStore.updateAnnotation(value)"
      maxlength="300"
      show-count
    />
  </NCard>
</template>

<i18n>
    {
      "en": {
        "annotation": "Enter annotation",
      },
      "ru": {
        "annotation": "Введите аннотацию книги",
      }
    }
</i18n>

<style scoped></style>
