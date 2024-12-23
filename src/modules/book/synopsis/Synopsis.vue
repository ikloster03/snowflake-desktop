<script lang="ts" setup>
import { NCard, NInput } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useBookStore } from '../book.store';

const { t } = useI18n();
const bookStore = useBookStore();
</script>

<template>
  <NCard>
    <h2>Synopsis</h2>
    <NInput
      type="textarea"
      :placeholder="t('synopsis')"
      :value="bookStore.synopsis"
      @update:value="(value: string) => bookStore.updateSynopsis(value)"
      maxlength="3000"
      show-count
    />
  </NCard>
</template>

<i18n>
    {
      "en": {
        "synopsis": "Enter synopsis",
      },
      "ru": {
        "synopsis": "Введите синопсис книги",
      }
    }
</i18n>

<style scoped></style>
