export default function manifest() {
  return {
    name: 'Techdoc',
    short_name: 'Techdoc App',
    description: 'Test & Document API faster with Techdoc',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'maskable_icon_x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'maskable_icon_x192.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  };
}
