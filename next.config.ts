// next.config.js
const { withNetlify } = require("@netlify/next");

const nextConfig = {
  // Your Next.js config options here
  reactStrictMode: true,
  images: {
    domains: ["example.com"],
  },
};

module.exports = withNetlify(nextConfig);
