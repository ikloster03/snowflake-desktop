<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NForm, NFormItem, NInput, NButton, NFlex, NCard } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from './project.store';

const { t } = useI18n();
const router = useRouter();
const projectStore = useProjectStore();

const formRef = ref(null);
const formModel = ref({
  name: '',
  description: '',
  path: '',
});

const rules = {
  name: {
    required: true,
    message: t('project-name-required'),
    trigger: 'blur',
  },
  path: {
    required: true,
    message: t('project-path-required'),
    trigger: 'blur',
  },
};

const handleSubmit = async () => {
  try {
    await projectStore.createProject({
      name: formModel.value.name,
      description: formModel.value.description,
      path: formModel.value.path,
      authors: [],
      books: [],
      series: [],
    });
    router.push({ name: 'project-page' });
  } catch (error) {
    console.error('Failed to create project:', error);
  }
};

const selectDirectory = async () => {
  // TODO: Использовать Tauri API для выбора директории
  // const path = await open({
  //   directory: true,
  //   multiple: false
  // });
  // if (path) {
  //   formModel.value.path = path;
  // }
};
</script>

<template>
  <NCard>
    <h1>{{ t('create-new-project') }}</h1>
    <NForm
      ref="formRef"
      :model="formModel"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <NFormItem :label="t('project-name')" path="name">
        <NInput v-model:value="formModel.name" />
      </NFormItem>

      <NFormItem :label="t('project-description')" path="description">
        <NInput
          v-model:value="formModel.description"
          type="textarea"
          :rows="3"
        />
      </NFormItem>

      <NFormItem :label="t('project-location')" path="path">
        <NFlex :x-gap="12">
          <NInput v-model:value="formModel.path" readonly />
          <NButton @click="selectDirectory">
            {{ t('select-directory') }}
          </NButton>
        </NFlex>
      </NFormItem>

      <NFlex justify="end" :x-gap="12">
        <NButton @click="router.push({ name: 'project-page' })">
          {{ t('cancel') }}
        </NButton>
        <NButton type="primary" attr-type="submit">
          {{ t('create') }}
        </NButton>
      </NFlex>
    </NForm>
  </NCard>
</template>
