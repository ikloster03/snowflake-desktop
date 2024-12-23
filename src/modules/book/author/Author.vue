<script lang="ts" setup>
import { NCard, NInput } from 'naive-ui';
import { useBookStore } from '../book.store';
import { AuthorKeys } from '../book.types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const bookStore = useBookStore();

const patchUpdateAuthor = (field: AuthorKeys, value: string) => {
  console.log(field, value);
  if (field === 'middleName' && value === '') {
    bookStore.patchUpdateAuthor({
      [field]: null,
    });

    return;
  }

  bookStore.patchUpdateAuthor({
    [field]: value,
  });
};
</script>

<template>
  <NCard>
    <h2>Author</h2>
    <NInput
      :placeholder="t('lastName')"
      :value="bookStore.lastName"
      @update:value="(value: string) => patchUpdateAuthor('lastName', value)"
      maxlength="30"
      show-count
    />
    <NInput
      :placeholder="t('firstName')"
      :value="bookStore.firstName"
      @update:value="(value: string) => patchUpdateAuthor('firstName', value)"
      maxlength="30"
      show-count
    />
    <NInput
      :placeholder="t('middleName')"
      :value="bookStore.middleName"
      @update:value="(value: string) => patchUpdateAuthor('middleName', value)"
      maxlength="30"
      show-count
      clearable
    />
    <NInput
      :placeholder="t('titleName')"
      :value="bookStore.titleName"
      @update:value="(value: string) => patchUpdateAuthor('titleName', value)"
      maxlength="90"
      show-count
    />
  </NCard>
</template>

<i18n>
    {
      "en": {
        "firstName": "Enter author's first name",
        "lastName": "Enter author's last name",
        "middleName": "Enter author's middle name",
        "titleName": "Enter author's name for book's title",
      },
      "ru": {
        "firstName": "Введите имя автора",
        "lastName": "Введите фамилию автора",
        "middleName": "Введите отчество автора",
        "titleName": "Введите имя автора для обложки книги",
      }
    }
</i18n>

<style scoped></style>
