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
  NSpin,
  useMessage,
} from 'naive-ui';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { IProfileForm } from './profile.types';
import { useProfileStore } from './profile.store';

const { t } = useI18n();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const profileStore = useProfileStore();

const profileForm = ref<IProfileForm>({
  email: '',
  displayName: '',
  avatar: undefined,
});

const loading = ref(false);
const saving = ref(false);

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

// Загрузка профиля при монтировании компонента
onMounted(async () => {
  loading.value = true;
  try {
    const profile = await profileStore.getOrCreateProfile();
    profileForm.value = {
      email: profile.email,
      displayName: profile.displayName,
      avatar: profile.avatar,
    };
  } catch (error) {
    console.error('Failed to load profile:', error);
    message.error(t('profile.messages.loadError'));
  } finally {
    loading.value = false;
  }
});

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      saving.value = true;
      try {
        await profileStore.updateProfile({
          email: profileForm.value.email,
          displayName: profileForm.value.displayName,
          avatar: profileForm.value.avatar,
        });
        message.success(t('profile.messages.success'));
      } catch (error) {
        console.error('Failed to save profile:', error);
        message.error(t('profile.messages.error'));
      } finally {
        saving.value = false;
      }
    }
  });
};
</script>

<template>
  <NCard>
    <h1>{{ t('profile.title') }}</h1>

    <NSpin :show="loading">
      <NForm
        ref="formRef"
        :model="profileForm"
        :rules="rules"
        label-placement="left"
        label-width="120"
        require-mark-placement="right-hanging"
        :disabled="saving"
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
          <NButton
            type="primary"
            :loading="saving"
            @click="handleSubmit"
          >
            {{ t('profile.save') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NSpin>
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
