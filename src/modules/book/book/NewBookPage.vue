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
  NDatePicker,
  NInputNumber,
  useMessage,
} from 'naive-ui';
import { useBookStore } from '../book.store';
import { ArrowBackFilled as ArrowBack } from '@vicons/material';
import { RouterLink } from 'vue-router';
import { BOOK_GENRES, BOOK_PAGE, BOOK_STATUS } from '../book.const';
import { ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { ISingleBook } from '../book.types';
import { useI18n } from 'vue-i18n';
import Annotation from '../annotation/Annotation.vue';
import Synopsis from '../synopsis/Synopsis.vue';
import type { Value } from 'naive-ui/es/date-picker/src/interface';

const { t } = useI18n();
const bookStore = useBookStore();
const formRef = ref<FormInst | null>(null);
const message = useMessage();

interface BookForm extends Omit<ISingleBook, 'id' | 'publicationDate'> {
  publicationDate: Value;
}

const book = ref<BookForm>({
  title: '',
  description: '',
  authors: [],
  publicationDate: new Date().getTime(),
  pages: 0,
  genres: [],
  status: BOOK_STATUS.DRAFT,
});

const genreOptions = Object.entries(BOOK_GENRES).map(([key, value]) => ({
  label: t(`genreList.${key}`),
  value,
}));

const statusOptions = Object.entries(BOOK_STATUS).map(([key, value]) => ({
  label: t(`statusList.${key}`),
  value,
}));

const rules = {
  title: {
    required: true,
    message: t('validation.title-required'),
    trigger: ['input', 'blur'],
  },
  description: {
    required: true,
    message: t('validation.description-required'),
    trigger: ['input', 'blur'],
  },
  pages: {
    required: true,
    message: t('validation.pages-required'),
    trigger: ['input', 'blur'],
  },
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success(t('messages.book-saved'));
      // TODO: Добавить сохранение книги
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
        <h2>{{ t('new-book') }}</h2>
      </NFlex>

      <NForm ref="formRef" :model="book" :rules="rules">
        <NFormItem :label="t('title')" path="title">
          <NInput v-model:value="book.title" maxlength="100" show-count />
        </NFormItem>

        <NFormItem :label="t('description')" path="description">
          <NInput
            v-model:value="book.description"
            type="textarea"
            maxlength="500"
            show-count
          />
        </NFormItem>

        <NFormItem :label="t('publication-date')" path="publicationDate">
          <NDatePicker
            v-model:value="book.publicationDate"
            type="date"
            clearable
          />
        </NFormItem>

        <NFormItem :label="t('pages')" path="pages">
          <NInputNumber v-model:value="book.pages" :min="0" />
        </NFormItem>

        <NFormItem :label="t('genres')" path="genres">
          <NSelect
            v-model:value="book.genres"
            :options="genreOptions"
            multiple
            filterable
            tag
          />
        </NFormItem>

        <NFormItem :label="t('status')" path="status">
          <NSelect v-model:value="book.status" :options="statusOptions" />
        </NFormItem>

        <NFormItem>
          <NButton type="primary" @click="handleSubmit">
            {{ t('save') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>

    <Annotation />
    <Synopsis />
  </NFlex>
</template>
