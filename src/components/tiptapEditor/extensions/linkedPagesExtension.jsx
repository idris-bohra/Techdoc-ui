import { Node } from '@tiptap/core';

const LinkedPage = Node.create({
  name: 'linkedPage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      pageId: {
        default: null,
      },
      pageTitle: {
        default: 'Untitled Page',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-linked-page]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { pageId, pageTitle } = HTMLAttributes;

    if (!pageId) {
      return [
        'div',
        { 'data-linked-page': '', class: 'linked-page-container' },
      ];
    }

    return [
      'div',
      {
        'data-linked-page': '',
        class: 'linked-page-container linked-page',
        'data-page-id': pageId,
      },
      pageTitle,
    ];
  },

  addCommands() {
    return {
      setLinkedPage:
        (pageId, pageTitle) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              pageId,
              pageTitle: pageTitle || 'Untitled Page',
            },
          });
        },
    };
  },
});

export default LinkedPage;
