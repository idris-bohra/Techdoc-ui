import { Node } from '@tiptap/core';

const Breadcrumb = Node.create({
  name: 'breadcrumb',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      path: {
        default: [],
      },
      pathName: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-breadcrumb]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { path, pathName } = HTMLAttributes;
    if (!Array.isArray(path) || !Array.isArray(pathName)) {
      return ['div', { 'data-breadcrumb': '', class: 'breadcrumb-container' }];
    }
    const breadcrumbElements = [];
    path.forEach((segment, index) => {
      let segmentName;
      if (segment === 'undefined') {
        segmentName = 'untitled';
      } else {
        segmentName = pathName[index] || segment;
      }

      breadcrumbElements.push([
        'button',
        {
          class: 'breadcrumb-segment',
          id: index === 0 ? `collection/${segment}` : `pages/${segment}`,
        },
        segmentName,
      ]);

      if (index < path?.length - 1) {
        breadcrumbElements.push([
          'span',
          { class: 'breadcrumb-separator' },
          ' / ',
        ]);
      }
    });

    return [
      'div',
      { 'data-breadcrumb': '', class: 'breadcrumb-container' },
      ...breadcrumbElements,
    ];
  },

  addCommands() {
    return {
      setBreadcrumb:
        (pathData, pathName) =>
        ({ commands }) => {
          const breadcrumbSegments = Array.isArray(pathData)
            ? pathData
            : pathData.split('/');
          const breadcrumbNames = Array.isArray(pathName)
            ? pathName
            : pathName.split('/');
          return commands.insertContent({
            type: this.name,
            attrs: {
              path: breadcrumbSegments,
              pathName: breadcrumbNames,
            },
          });
        },
    };
  },
});

export default Breadcrumb;
