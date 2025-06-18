import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import CharacterLinkNodeView from './CharacterLinkNodeView.vue';

export interface CharacterLinkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    characterLink: {
      setCharacterLink: (options: { characterId: string; text: string }) => ReturnType;
      unsetCharacterLink: () => ReturnType;
    };
  }
}

export const CharacterLink = Node.create<CharacterLinkOptions>({
  name: 'characterLink',

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
      characterId: {
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
        tag: 'span[data-character-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-character-id': HTMLAttributes.characterId,
        class: 'character-link',
      }),
      HTMLAttributes.text || '',
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(CharacterLinkNodeView as any);
  },

  addCommands() {
    return {
      setCharacterLink:
        (options) =>
        ({ commands }) => {
          console.log('Выполнение команды setCharacterLink:', options);
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },

      unsetCharacterLink:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
