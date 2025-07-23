const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.ictbangla.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "postimg.cc",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },

      {
        protocol: "https",
        hostname: "ictbangla.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "securepay.sslcommerz.com",
      },
      {
        protocol: "https",
        hostname: "ictbangla-files.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "5657-103-78-226-92.ngrok-free.app",
      },
      
    ],
  }
};
module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     unoptimized: true, 
//   },
// };

// module.exports = nextConfig;
