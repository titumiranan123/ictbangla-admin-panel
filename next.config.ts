// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "ictbangla.s3.eu-north-1.amazonaws.com",
//         pathname: "/admin/course-category/images/**",
//       },
//       {
//         protocol: "https",
//         hostname: "ictbangla-files.s3.eu-north-1.amazonaws.com",
//         pathname: "/**",
//       },
//       { protocol: "https", hostname: "api.ictbangla.com", pathname: "/**" },
//       { protocol: "https", hostname: "i.postimg.cc", pathname: "/**" },
//       { protocol: "https", hostname: "postimg.cc", pathname: "/**" },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "securepay.sslcommerz.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "5657-103-78-226-92.ngrok-free.app",
//         pathname: "/**",
//       },
//       { protocol: "https", hostname: "example.com", pathname: "/**" },
//     ],
//     // optional: দীর্ঘ ক্যাশ
//     minimumCacheTTL: 60,
//   },
// };
// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
