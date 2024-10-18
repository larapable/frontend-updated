module.exports = {
    async rewrites() {
      return [
        {
          source: '/payment/:path*',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/:path*` // Proxy to Backend
        }
      ];
    },
  };
