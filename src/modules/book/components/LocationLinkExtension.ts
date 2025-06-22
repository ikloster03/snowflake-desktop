import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import LocationLinkNodeView from './LocationLinkNodeView.vue';

export interface LocationLinkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    locationLink: {
      setLocationLink: (options: { locationId: string; text: string }) => ReturnType;
      unsetLocationLink: () => ReturnType;
    };
  }
}

export const LocationLinkExtension = Node.create<LocationLinkOptions>({
  name: 'locationLink',

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
      locationId: {
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
        tag: 'span[data-location-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-location-id': HTMLAttributes.locationId,
        class: 'location-link',
      }),
      HTMLAttributes.text || '',
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(LocationLinkNodeView as any);
  },

  addCommands() {
    return {
      setLocationLink:
        (options) =>
        ({ commands }) => {
          console.log('Executing setLocationLink with options:', options);
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      unsetLocationLink:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
