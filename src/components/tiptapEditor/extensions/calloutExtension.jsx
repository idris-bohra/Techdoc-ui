import { Node, mergeAttributes } from '@tiptap/core';

const CalloutExtension = Node.create({
  name: 'callout',

  group: 'block',

  content: 'block+',

  addAttributes() {
    return {
      type: {
        parseHTML: (element) => element.getAttribute('type'),
        renderHTML: (attributes) => ({ type: attributes.type }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { type } = HTMLAttributes;
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      tip: '💡',
      important: '📌',
    };

    return [
      'div',
      mergeAttributes(
        {
          'data-callout': '',
          type: type,
          'data-id':
            HTMLAttributes.id || Math.random().toString(36).substr(2, 9), // Unique ID
          class: `callout d-flex align-items-start p-2 my-2 mx-0 callout-${type}`,
        },
        HTMLAttributes
      ),
      [
        'div',
        { class: 'callout-container d-flex w-100 gap-2' },
        [
          'span',
          {
            class: 'callout-icon cursor-pointer',
            'data-icon': type,
          },
          icons[type] || '📌',
        ],
        ['div', { class: 'callout-content flex-wrap overflow-hidden' }, 0],
      ],
    ];
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },
      updateCalloutType:
        (newType) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { type: newType });
        },
    };
  },
});

export default CalloutExtension;
