<script lang="ts" setup>
import {
  FormInst,
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  useMessage,
} from 'naive-ui';
import { useBookStore } from '../book.store';
import { AuthorKeys, IAuthor } from '../book.types';
import { useI18n } from 'vue-i18n';
import { ArrowBackFilled as ArrowBack } from '@vicons/material';
import { RouterLink } from 'vue-router';
import { BOOK_PAGE } from '../book.const';
import { ref } from 'vue';

const { t } = useI18n();
const bookStore = useBookStore();
const formAuthorRef = ref<FormInst | null>(null);
const message = useMessage();
const author = ref<IAuthor>({
  lastName: '', // bookStore.lastName,
  firstName: '', // bookStore.firstName,
  middleName: '', // bookStore.middleName,
  titleName: '', // bookStore.titleName,
});

const rules = {
  lastName: {
    required: true,
    message: 'Please input your lastName',
    trigger: ['input'],
  },
  firstName: {
    required: true,
    message: 'Please input your firstName',
    trigger: ['input'],
  },
  middleName: {
    required: false,
    message: 'Please input your middleName',
    trigger: ['input'],
  },
  titleName: {
    required: true,
    message: 'Please input your titleName',
    trigger: ['input'],
  },
};

// const patchUpdateAuthor = (field: AuthorKeys, value: string) => {
//   console.log(field, value);
//   if (field === 'middleName' && value === '') {
//     bookStore.patchUpdateAuthor({
//       [field]: null,
//     });

//     return;
//   }

//   bookStore.patchUpdateAuthor({
//     [field]: value,
//   });
// };

const submit = (e: MouseEvent) => {
  e.preventDefault();
  formAuthorRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Valid');
      bookStore.updateAuthor(author.value);
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
};
</script>

<template>
  <NCard>
    <NFlex align="center">
      <RouterLink v-slot="{ navigate }" :to="{ name: BOOK_PAGE.name }">
        <NButton @click="navigate">
          <NIcon><ArrowBack /></NIcon>
        </NButton>
      </RouterLink>
      <h2>Author</h2>
    </NFlex>
    <NForm ref="formAuthorRef" :rules="rules" :model="author">
      <NFormItem label="lastName" path="lastName">
        <NInput
          :placeholder="t('lastName')"
          v-model:value="author.lastName"
          maxlength="30"
          show-count
        />
      </NFormItem>
      <NFormItem label="firstName" path="firstName">
        <NInput
          :placeholder="t('firstName')"
          v-model:value="author.firstName"
          maxlength="30"
          show-count
        />
      </NFormItem>
      <NFormItem label="middleName" path="middleName">
        <NInput
          :placeholder="t('middleName')"
          v-model:value="author.middleName"
          maxlength="30"
          show-count
          clearable
        />
      </NFormItem>
      <NFormItem label="titleName" path="titleName">
        <NInput
          :placeholder="t('titleName')"
          v-model:value="author.titleName"
          maxlength="90"
          show-count
        />
      </NFormItem>
      <NFormItem>
        <NButton @click="submit">Save</NButton>
      </NFormItem>
    </NForm>
    <pre>
      {{ JSON.stringify(author, null, 2) }}
    </pre>
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
