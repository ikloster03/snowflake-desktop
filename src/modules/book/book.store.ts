import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IAuthor, Book } from './book.types';
import { PRIVATE_STORE_PREFIX } from '@/store.const';

export const BOOK_STORE = 'book';

const useBookPrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${BOOK_STORE}`,
  () => {
    const firstName = ref<string>('');
    const middleName = ref<string | null>(null);
    const lastName = ref<string>('');
    const titleName = ref<string>('');

    const annotation = ref<string>('');
    const synopsis = ref<string>('');

    return { firstName, middleName, lastName, titleName, annotation, synopsis };
  }
);

export const useBookStore = defineStore(BOOK_STORE, () => {
  const state = useBookPrivateStore();

  const firstName = computed(() => state.firstName);
  const middleName = computed(() => state.middleName);
  const lastName = computed(() => state.lastName);
  const titleName = computed(() => state.titleName);

  const annotation = computed(() => state.annotation);
  const synopsis = computed(() => state.synopsis);

  const authors = ref<IAuthor[]>([]);
  const books = ref<Book[]>([]);

  const updateAuthor = (author: IAuthor) => {
    state.firstName = author.firstName;
    state.middleName = author.middleName;
    state.lastName = author.lastName;
    state.titleName = author.titleName;
  };

  const patchUpdateAuthor = (author: Partial<IAuthor>) => {
    if (author.firstName !== undefined) {
      state.firstName = author.firstName;
    }

    if (author.middleName !== undefined) {
      state.middleName = author.middleName;
    }

    if (author.middleName === null) {
      state.middleName = author.middleName;
    }

    if (author.lastName !== undefined) {
      state.lastName = author.lastName;
    }
    if (author.titleName !== undefined) {
      state.titleName = author.titleName;
    }
  };

  const updateAnnotation = (annotation: string) => {
    state.annotation = annotation;
  };

  const updateSynopsis = (synopsis: string) => {
    state.synopsis = synopsis;
  };

  return {
    firstName,
    middleName,
    lastName,
    titleName,
    annotation,
    synopsis,
    authors,
    books,
    updateAuthor,
    patchUpdateAuthor,
    updateAnnotation,
    updateSynopsis,
  };
});
