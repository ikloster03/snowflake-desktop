<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NFormItem, NInput, FormInst } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IAuthor } from '../book.types';
import { PROJECT_LIMITS } from '@/modules/settings/settings.limits';
import { createID } from '@/core/id';

const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const props = defineProps<{
  initialData?: Partial<IAuthor>;
}>();

const emit = defineEmits<{
  (e: 'submit', author: IAuthor): void;
}>();

const formData = ref({
  id: createID(),
  firstName: '',
  middleName: null as string | null,
  lastName: '',
  titleName: '',
  ...props.initialData,
});

const rules = {
  firstName: {
    required: true,
    message: t('book.validation.firstNameRequired'),
    trigger: ['blur', 'input']
  },
  lastName: {
    required: true,
    message: t('book.validation.lastNameRequired'),
    trigger: ['blur', 'input']
  },
  titleName: {
    required: true,
    message: t('book.validation.titleNameRequired'),
    trigger: ['blur', 'input']
  }
};

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('submit', formData.value as IAuthor);
    }
  });
};
</script>

<template>
  <NForm
    ref="formRef"
    id="author-form"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <NFormItem :label="t('book.author.firstName')" path="firstName">
      <NInput
        v-model:value="formData.firstName"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_AUTHOR_NAME_LENGTH"
        :placeholder="t('book.placeholders.firstName')"
      />
    </NFormItem>

    <NFormItem :label="t('book.author.middleName')" path="middleName">
      <NInput
        v-model:value="formData.middleName"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_AUTHOR_NAME_LENGTH"
        :placeholder="t('book.placeholders.middleName')"
      />
    </NFormItem>

    <NFormItem :label="t('book.author.lastName')" path="lastName">
      <NInput
        v-model:value="formData.lastName"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_AUTHOR_NAME_LENGTH"
        :placeholder="t('book.placeholders.lastName')"
      />
    </NFormItem>

    <NFormItem :label="t('book.author.titleName')" path="titleName">
      <NInput
        v-model:value="formData.titleName"
        :maxlength="PROJECT_LIMITS.BOOKS.MAX_AUTHOR_NAME_LENGTH"
        :placeholder="t('book.placeholders.titleName')"
      />
    </NFormItem>
  </NForm>
</template>
