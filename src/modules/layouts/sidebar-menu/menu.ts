import { BOOK_PAGE } from '@/modules/book/book.const';
import { LORE_PAGE } from '@/modules/lore/lore.const';
import {
  CHARACTER_MAP_PAGE,
  PLAN_PAGE,
  TIMELINE_PAGE,
} from '@/modules/projection/projection.const';
import {
  Book20Filled as BookIcon,
  PeopleCommunity20Filled as CharactersIcon,
  Timeline20Filled as TimelineIcon
} from '@vicons/fluent';
import { Notes as NotesIcon, World as WorldIcon } from '@vicons/tabler';
import { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { renderIcon, renderLink } from './menu.tools';

const menuOptions: MenuMixedOption[] = [
  // {
  //   label: renderLink(HOME_PAGE),
  //   key: HOME_PAGE.name,
  //   icon: renderIcon(HomeIcon),
  // },
  {
    label: renderLink(BOOK_PAGE),
    key: BOOK_PAGE.name,
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLink(PLAN_PAGE),
    key: PLAN_PAGE.name,
    icon: renderIcon(NotesIcon),
  },
  {
    label: renderLink(LORE_PAGE),
    key: LORE_PAGE.name,
    icon: renderIcon(WorldIcon),
  },
  {
    label: renderLink(TIMELINE_PAGE),
    key: TIMELINE_PAGE.name,
    icon: renderIcon(TimelineIcon),
  },
  {
    label: renderLink(CHARACTER_MAP_PAGE),
    key: CHARACTER_MAP_PAGE.name,
    icon: renderIcon(CharactersIcon),
  },
];

export default menuOptions;
