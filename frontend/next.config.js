const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co"
      }
    ]
  }
};

module.exports = nextConfig;
