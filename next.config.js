module.exports = {
    async rewrites() {
      return [
        {
          source: '/payment/:path*',
          destination: 'http://localhost:8080/payment/:path*' // Proxy to Backend
        }
      ];
    },
  };
