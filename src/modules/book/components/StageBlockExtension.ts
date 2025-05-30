import { Node } from '@tiptap/core'

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

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div.stage-block',
      },
    ]
  },

  renderHTML() {
    return [
      'div',
      {
        class: 'stage-block',
        'data-type': 'stage-block',
      },
      [
        'div',
        { class: 'stage-header' },
        [
          'span',
          { style: 'font-size: 20px;' },
          '🎬'
        ],
        [
          'select',
          {
            class: 'stage-selector',
            contenteditable: 'false'
          },
          [
            'option',
            { value: '' },
            'Выберите сцену...'
          ]
        ]
      ],
      [
        'div',
        {
          class: 'stage-content',
          contenteditable: 'true',
        },
        [
          'p',
          {},
          'Описание сцены...'
        ]
      ]
    ]
  },

  addCommands() {
    return {
      setStageBlock: () => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
        })
      },
    }
  },
})
