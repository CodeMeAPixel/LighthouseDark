/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.gstatic.com", // PSI screenshots
      "lh3.googleusercontent.com", // Google assets
    ],
    formats: ["image/webp", "image/avif"],
  },
  headers: async () => [
    {
      source: "/api/(.*)",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type" },
      ],
    },
  ]
};

export default nextConfig;