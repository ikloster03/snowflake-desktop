<script lang="ts" setup>
import {
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NSelect,
  useMessage,
} from 'naive-ui';
import { useBookStore } from '../book.store';
import { ArrowBackFilled as ArrowBack } from '@vicons/material';
import { RouterLink } from 'vue-router';
import { BOOK_PAGE } from '../book.const';
import { ref } from 'vue';
import type { FormInst } from 'naive-ui';
import type { IBookSeries, IAuthor } from '../book.types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const bookStore = useBookStore();
const formRef = ref<FormInst | null>(null);
const message = useMessage();

interface SeriesForm extends Omit<IBookSeries, 'id' | 'books'> {
  books: string[]; // ID книг в серии
}

const series = ref<SeriesForm>({
  title: '',
  description: '',
  authors: [],
  books: [],
});

const rules = {
  title: {
    required: true,
    message: t('validation.title-required'),
    trigger: ['blur', 'input'],
  },
  description: {
    required: true,
    message: t('validation.description-required'),
    trigger: ['blur', 'input'],
  },
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success(t('messages.series-saved'));
      // TODO: Добавить сохранение серии
    } else {
      message.error(t('messages.validation-error'));
    }
  });
};
</script>

<template>
  <NFlex vertical :x-gap="24">
    <NCard>
      <NFlex align="center" :x-gap="12">
        <RouterLink v-slot="{ navigate }" :to="{ name: BOOK_PAGE.name }">
          <NButton @click="navigate">
            <NIcon><ArrowBack /></NIcon>
          </NButton>
        </RouterLink>
        <h2>{{ t('new-series') }}</h2>
      </NFlex>

      <NForm ref="formRef" :model="series" :rules="rules">
        <NFormItem :label="t('title')" path="title">
          <NInput v-model:value="series.title" maxlength="100" show-count />
        </NFormItem>

        <NFormItem :label="t('description')" path="description">
          <NInput
            v-model:value="series.description"
            type="textarea"
            maxlength="500"
            show-count
          />
        </NFormItem>

        <NFormItem :label="t('authors')" path="authors">
          <NSelect
            v-model:value="series.authors"
            multiple
            :options="bookStore.authors"
            :render-label="(author: IAuthor) => author.titleName"
          />
        </NFormItem>

        <NFormItem :label="t('books')" path="books">
          <NSelect
            v-model:value="series.books"
            multiple
            :options="bookStore.books"
            :render-label="(book) => book.title"
          />
        </NFormItem>

        <NFormItem>
          <NButton type="primary" @click="handleSubmit">
            {{ t('save') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </NFlex>
</template>
