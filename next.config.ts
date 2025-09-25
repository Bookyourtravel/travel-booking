// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

/**
 * CSP — dev में relaxed (fast-refresh, inline scripts allowed),
 * prod में tighter (unsafe-eval हटाया गया).
 */
const cspDev = `
  default-src 'self';
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com https://www.googleapis.com https://www.recaptcha.net https://www.gstatic.com https://fonts.googleapis.com https://fonts.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  style-src 'self' 'unsafe-inline' https:;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://www.google.com https://www.gstatic.com https://www.recaptcha.net;
  frame-src 'self' https://www.google.com https://www.recaptcha.net;
  frame-ancestors 'self';
`;

const cspProd = `
  default-src 'self';
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com https://www.googleapis.com https://www.recaptcha.net https://www.gstatic.com https://fonts.googleapis.com https://fonts.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  style-src 'self' 'unsafe-inline' https:;
  script-src 'self' https: https://www.google.com https://www.gstatic.com https://www.recaptcha.net;
  frame-src 'self' https://www.google.com https://www.recaptcha.net;
  frame-ancestors 'self';
`;

/* normalize CSP -> single-line, collapse whitespace, trim */
const ContentSecurityPolicy = (isProd ? cspProd : cspDev).replace(/\s+/g, " ").trim();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // silence multiple-lockfile warning by pointing to project root
  outputFileTracingRoot: __dirname,
  // image external hosts you may use
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com", "lh3.googleusercontent.com"],
  },
  async headers() {
    return [
      {
        // apply these headers to all routes
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          // optional: uncomment/report-only mode (advanced)
          // { key: "Content-Security-Policy-Report-Only", value: "<your-report-uri-or-empty>" },
        ],
      },
    ];
  },
};

export default nextConfig;
