<script lang="ts" setup>
import { NCard, NSpace } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <NSpace vertical>
    <h1>{{ t('book-editor') }}</h1>
    <div>
      <h2>{{ t('authors') }}</h2>
      <NSpace>
        <NCard> + {{ t('add-new-author') }}</NCard>
      </NSpace>
    </div>
    <div>
      <h2>{{ t('books-series') }}</h2>
      <NSpace>
        <NCard> + {{ t('add-new-book') }}</NCard>
        <NCard> + {{ t('add-new-series') }}</NCard>
      </NSpace>
    </div>
  </NSpace>
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
