<script lang="ts" setup>
import { ref, defineExpose } from 'vue';
import { NForm, NFormItem, NInput, NSelect, FormInst } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IBookSeries, SeriesType } from '../book.types';
import { SERIES_TYPES } from '../book.const';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { createID } from '@/core/id';

const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const props = defineProps<{
  initialData?: Partial<IBookSeries>;
}>();

const emit = defineEmits<{
  (e: 'submit', series: IBookSeries): void;
}>();

const formData = ref({
  id: createID(),
  title: '',
  description: '',
  type: SERIES_TYPES.SERIES as SeriesType,
  authors: [],
  books: [],
  ...props.initialData,
});

const rules = {
  title: {
    required: true,
    message: t('book.validation.titleRequired'),
    trigger: ['blur', 'input'],
  },
  type: {
    required: true,
    message: t('book.validation.typeRequired'),
    trigger: ['blur', 'change'],
  },
};

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('submit', formData.value as IBookSeries);
    }
  });
};

const submitForm = () => {
  console.log('SeriesForm: submitForm called directly');
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
    id="series-form"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <NFormItem :label="t('book.series.title')" path="title">
      <NInput
        v-model:value="formData.title"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_BOOK_TITLE_LENGTH"
        :placeholder="t('book.placeholders.seriesTitle')"
      />
    </NFormItem>

    <NFormItem :label="t('book.series.description')" path="description">
      <NInput
        v-model:value="formData.description"
        type="textarea"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_BOOK_DESCRIPTION_LENGTH"
        :placeholder="t('book.placeholders.seriesDescription')"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </NFormItem>

    <NFormItem :label="t('book.series.type')" path="type">
      <NSelect
        v-model:value="formData.type"
        :options="
          Object.entries(SERIES_TYPES).map(([key, value]) => ({
            label: t(`book.series.types.${key.toLowerCase()}`),
            value,
          }))
        "
        :placeholder="t('book.placeholders.seriesType')"
      />
    </NFormItem>
  </NForm>
</template>
