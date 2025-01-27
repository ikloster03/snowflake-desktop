<script lang="ts" setup>
import { NCard, NIcon, NFlex } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { PlusFilled as Plus } from '@vicons/material';
import { RouterLink } from 'vue-router';
import { AUTHOR_NEW_PAGE } from './author/author.const';
import { BOOK_NEW_PAGE, SERIES_NEW_PAGE } from './book.const';

const { t } = useI18n();
</script>

<template>
  <NFlex vertical>
    <h1>{{ t('book-editor') }}</h1>
    <div>
      <h2>{{ t('authors') }}</h2>
      <NFlex>
        <RouterLink
          v-slot="{ navigate }"
          :to="{ name: AUTHOR_NEW_PAGE.name }"
          style="text-decoration: none"
        >
          <NCard @click="navigate">
            <NIcon><Plus /></NIcon>
            {{ t('add-new-author') }}
          </NCard>
        </RouterLink>
      </NFlex>
    </div>
    <div>
      <h2>{{ t('books-series') }}</h2>
      <NFlex>
        <RouterLink
          v-slot="{ navigate }"
          :to="{ name: BOOK_NEW_PAGE.name }"
          style="text-decoration: none"
        >
          <NCard @click="navigate">
            <NIcon><Plus /></NIcon>
            {{ t('add-new-book') }}
          </NCard>
        </RouterLink>
        <RouterLink
          v-slot="{ navigate }"
          :to="{ name: SERIES_NEW_PAGE.name }"
          style="text-decoration: none"
        >
          <NCard @click="navigate">
            <NIcon><Plus /></NIcon>
            {{ t('add-new-series') }}
          </NCard>
        </RouterLink>
      </NFlex>
    </div>
  </NFlex>
</template>

<i18n>
  {
    "en": {
      "book-editor": "Book's editor",
      "authors": "Authors",
      "books-series": "Books & Series of books",
      "add-new-author": "Add an new author",
      "add-new-book": "Add a new book",
      "add-new-series": "Add a new series of books",
    },
    "ru": {
      "book-editor": "Редактор книг",
      "authors": "Авторы",
      "books-series": "Книги и Серии книг",
      "add-new-author": "Добавить автора",
      "add-new-book": "Добавить книгу",
      "add-new-series": "Добавить серию книг",
    }
  }
</i18n>

<style scoped></style>
