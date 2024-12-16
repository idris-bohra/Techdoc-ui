import { Node } from '@tiptap/core';

const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      isEmbed: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, isEmbed } = HTMLAttributes;

    if (isEmbed) {
      return [
        'iframe',
        {
          src,
          width: '560',
          height: '315',
          frameborder: '0',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: 'true',
        },
      ];
    }

    return [
      'video',
      {
        controls: true,
        width: '560',
        height: '315',
        ...HTMLAttributes,
      },
    ];
  },

  addCommands() {
    return {
      setVideo:
        (url) =>
        ({ commands }) => {
          let isEmbed = false;
          const youtubeMatch = url.match(
            /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/
          );
          const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
          const viasocketMatch = url.match(
            /https?:\/\/video-faq\.viasocket\.com\/(?:embed|demo)\/[a-zA-Z0-9_-]+/
          );

          if (youtubeMatch) {
            isEmbed = true;
            url = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
          } else if (vimeoMatch) {
            isEmbed = true;
            url = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
          } else if (viasocketMatch) {
            isEmbed = true;
          } else {
            const videoExtensions = ['.mp4', '.webm', '.ogg'];
            const isVideoFile = videoExtensions.some((ext) =>
              url.endsWith(ext)
            );

            if (!isVideoFile) {
              alert(
                'Unsupported video format. Please provide a valid video URL.'
              );
              return false;
            }
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: url,
              isEmbed,
            },
          });
        },
    };
  },
});

export default Video;
