import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import EventLinkNodeView from './EventLinkNodeView.vue';

export interface EventLinkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    eventLink: {
      setEventLink: (options: { eventId: string; text: string }) => ReturnType;
      unsetEventLink: () => ReturnType;
    };
  }
}

export const EventLinkExtension = Node.create<EventLinkOptions>({
  name: 'eventLink',

  priority: 1000,

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      eventId: {
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
        tag: 'span[data-event-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-event-id': HTMLAttributes.eventId,
        class: 'event-link',
      }),
      HTMLAttributes.text || '',
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(EventLinkNodeView as any);
  },

  addCommands() {
    return {
      setEventLink: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
