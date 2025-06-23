import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import ItemLinkNodeView from './ItemLinkNodeView.vue';

export interface ItemLinkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    itemLink: {
      setItemLink: (options: { itemId: string; text: string }) => ReturnType;
      unsetItemLink: () => ReturnType;
    };
  }
}

export const ItemLink = Node.create<ItemLinkOptions>({
  name: 'itemLink',

  priority: 1000,

  defaultOptions: {
    HTMLAttributes: {},
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      itemId: {
        default: null,
      },
      text: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-item-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-item-id': HTMLAttributes.itemId,
        class: 'item-link',
      }),
      HTMLAttributes.text || '',
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(ItemLinkNodeView as any);
  },

  addCommands() {
    return {
      setItemLink:
        (options) =>
        ({ commands }) => {
          console.log('Выполнение команды setItemLink:', options);
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },

      unsetItemLink:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
