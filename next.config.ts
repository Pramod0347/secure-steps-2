const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    // domains: ['images.unsplash.com',"akia34amcw3tygg3uboe.s3.amazonaws.com","himalayan-utopia.s3.us-east-1.amazonaws.com","annamalaiuniversity.ac.in","placehold.co","collegedunia.com","img.icons8.com","balasanthosh.tech","plus.unsplash.com","unsplash.com","www.google.com","news.mit.edu","upload.wikimedia.org","via.placeholder.com","example.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'testing-bucket-dev-santhosh.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-1ed7e98a27564218aec0343ef05fbd57.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'r2.securesteps.co.in',
        port: '',
        pathname: '/**',
      }
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  extends:["next/core-web-vitals", "plugin:react-hooks/recommended", "prettier"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  }
};

module.exports = nextConfig;
