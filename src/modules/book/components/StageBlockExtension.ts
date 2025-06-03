import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StageBlockNodeView from './StageBlockNodeView.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    stageBlock: {
      setStageBlock: () => ReturnType
    }
  }
}

export const StageBlock = Node.create({
  name: 'stageBlock',

  group: 'block',

  content: '(paragraph | heading | bulletList | orderedList | blockquote | codeBlock | table | horizontalRule)+',

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      stageId: {
        default: '',
        parseHTML: element => element.getAttribute('data-stage-id'),
        renderHTML: attributes => {
          if (!attributes.stageId) {
            return {}
          }
          return {
            'data-stage-id': attributes.stageId,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.stage-block',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        class: 'stage-block',
        'data-type': 'stage-block',
      },
      0
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(StageBlockNodeView)
  },

  addCommands() {
    return {
      setStageBlock: () => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Описание сцены...'
                }
              ]
            }
          ]
        })
      },
    }
  },
})
