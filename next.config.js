const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      { source: '/portfolio', destination: '/crafts', permanent: true },
      { source: '/uses', destination: '/hardware', permanent: true },
      { source: '/blog', destination: '/notes', permanent: true },
      { source: '/blog/:slug', destination: '/notes/:slug', permanent: true },
      { source: '/guestbook', destination: '/wall', permanent: true },
      { source: '/utilities', destination: '/tools', permanent: true },
    ];
  },
};

module.exports = nextConfig;
