<script lang="ts" setup>
import {
  FormInst,
  FormRules,
  NAvatar,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { IProfileForm } from './profile.types';

const { t } = useI18n();
const message = useMessage();
const formRef = ref<FormInst | null>(null);

const profileForm = ref<IProfileForm>({
  email: 'user@example.com', // Здесь должны быть реальные данные из стора
  displayName: 'User Name',
  avatar: undefined,
});

const rules: FormRules = {
  email: {
    required: true,
    type: 'email',
    trigger: ['blur', 'input'],
  },
  displayName: {
    required: true,
    trigger: ['blur', 'input'],
  },
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        // Здесь должно быть обновление профиля
        message.success(t('profile.messages.success'));
      } catch (error) {
        message.error(t('profile.messages.error'));
      }
    }
  });
};
</script>

<template>
  <NCard>
    <h1>{{ t('profile.title') }}</h1>
    <NForm
      ref="formRef"
      :model="profileForm"
      :rules="rules"
      label-placement="left"
      label-width="120"
      require-mark-placement="right-hanging"
    >
      <NFormItem>
        <div class="flex justify-center mb-4">
          <NAvatar
            :src="profileForm.avatar"
            :fallback-src="'/default-avatar.png'"
            :size="64"
            round
          />
        </div>
      </NFormItem>

      <NFormItem :label="t('profile.email')" path="email">
        <NInput v-model:value="profileForm.email" />
      </NFormItem>

      <NFormItem :label="t('profile.displayName')" path="displayName">
        <NInput v-model:value="profileForm.displayName" />
      </NFormItem>

      <NFormItem>
        <NButton type="primary" @click="handleSubmit">
          {{ t('profile.save') }}
        </NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
