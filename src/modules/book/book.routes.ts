import { RouteRecordRaw } from 'vue-router';
import BookPage from './BookPage.vue';
import BookEditor from './components/book-editor/BookEditor.vue';
import SeriesEditor from './components/series-editor/SeriesEditor.vue';
import { BOOK_PAGE, BOOK_EDITOR_PAGE, SERIES_EDITOR_PAGE } from './book.const';

export const routes: RouteRecordRaw[] = [
  {
    path: BOOK_PAGE.path,
    name: BOOK_PAGE.name,
    component: BookPage,
  },
  {
    path: BOOK_EDITOR_PAGE.path,
    name: BOOK_EDITOR_PAGE.name,
    component: BookEditor,
  },
  {
    path: SERIES_EDITOR_PAGE.path,
    name: SERIES_EDITOR_PAGE.name,
    component: SeriesEditor,
  },
];
