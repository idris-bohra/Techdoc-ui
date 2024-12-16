const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Enables standalone mode for deployment
  output: 'standalone',

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Prevent ESLint errors from failing builds
  },

  // Set asset prefix (useful for custom CDN or asset paths)
  assetPrefix: process.env.NEXT_PUBLIC_UI_URL || '',

  // Custom Webpack configuration
  webpack(config, { isServer }) {
    // Add custom loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'], // Transforms SVG into React components
    });

    // Resolve module alias for "yjs"
    if (!isServer) {
      const path = require('path');
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
    }

    return config;
  },
});
