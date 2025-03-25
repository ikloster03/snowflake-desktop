<script lang="ts" setup>
import { ref, defineExpose } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NInputNumber,
  FormInst,
  FormRules,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { ISingleBook, BookStatus, BookGenre } from '../book.types';
import { BOOK_GENRES, BOOK_STATUS } from '../book.const';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { createID } from '@/core/id';

const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const props = defineProps<{
  initialData?: Partial<ISingleBook>;
}>();

const emit = defineEmits<{
  (e: 'submit', book: ISingleBook): void;
}>();

const formData = ref({
  id: createID(),
  title: '',
  description: '',
  genres: [] as BookGenre[],
  status: BOOK_STATUS.DRAFT as BookStatus,
  authors: [],
  publicationDate: '',
  ...props.initialData,
});

const rules: FormRules = {
  title: {
    required: true,
    message: t('book.validation.titleRequired'),
    trigger: ['blur', 'input'],
  },
};

const handleSubmit = () => {
  console.log('BookForm: handleSubmit called');
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('BookForm: validation passed, emitting submit event');
      emit('submit', formData.value as ISingleBook);
    } else {
      console.log('BookForm: validation failed', errors);
    }
  });
};

const submitForm = () => {
  console.log('BookForm: submitForm called directly');
  handleSubmit();
};

// Экспозируем метод для внешнего вызова
defineExpose({
  submitForm,
});
</script>

<template>
  <NForm
    ref="formRef"
    id="book-form"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <NFormItem :label="t('book.title')" path="title">
      <NInput
        v-model:value="formData.title"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_BOOK_TITLE_LENGTH"
        :placeholder="t('book.placeholders.title')"
      />
    </NFormItem>

    <NFormItem :label="t('book.description')" path="description">
      <NInput
        v-model:value="formData.description"
        type="textarea"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_BOOK_DESCRIPTION_LENGTH"
        :placeholder="t('book.placeholders.description')"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </NFormItem>

    <NFormItem :label="t('book.genresTitle')" path="genres">
      <NSelect
        v-model:value="formData.genres"
        multiple
        :options="
          Object.entries(BOOK_GENRES).map(([key, value]) => ({
            label: t(`book.genres.${key.toLowerCase()}`),
            value,
          }))
        "
        :max-tag-count="PROJECT_LIMITS.BOOKS.MAX_GENRES_PER_BOOK"
        :placeholder="t('book.placeholders.genres')"
      />
    </NFormItem>

    <NFormItem :label="t('book.statusLabel')" path="status">
      <NSelect
        v-model:value="formData.status"
        :options="
          Object.entries(BOOK_STATUS).map(([key, value]) => ({
            label: t(`book.status.${key.toLowerCase()}`),
            value,
          }))
        "
        :placeholder="t('book.placeholders.status')"
      />
    </NFormItem>
  </NForm>
</template>
