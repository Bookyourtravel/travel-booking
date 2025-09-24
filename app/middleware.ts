// app/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Global security headers + HTTPS redirect
 * - HSTS
 * - Content-Security-Policy (CSP) (conservative, adjust for external scripts)
 * - X-Frame-Options
 * - Referrer-Policy
 * - Permissions-Policy
 *
 * IMPORTANT:
 * - Adjust CSP if you load third-party scripts (Google Maps, reCAPTCHA) — I've allowed them minimally.
 * - If you use inline styles/scripts you may need nonce or 'unsafe-inline' (avoid if possible).
 */

const PUBLIC_ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
const IS_DEV = process.env.NODE_ENV !== "production";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Force HTTPS in production
  if (!IS_DEV && req.nextUrl.protocol === "http:") {
    url.protocol = "https";
    return NextResponse.redirect(url);
  }

  const resp = NextResponse.next();

  // Content Security Policy — keep it restrictive; adjust if external resources break.
  // Allows:
  //  - self for scripts/styles/images
  //  - cdn for fonts if needed
  //  - google recaptcha and maps hostnames are whitelisted below
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
    "worker-src 'self' blob:",
    "connect-src 'self' https://www.google.com https://www.gstatic.com https://www.google-analytics.com",
    "img-src 'self' data: https://www.google.com https://maps.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-src https://www.google.com https://www.recaptcha.net https://www.google.com/maps",
  ].join("; ");

  // HSTS — long max-age, includeSubDomains and preload candidate
  const hsts = "max-age=63072000; includeSubDomains; preload";

  resp.headers.set("Strict-Transport-Security", hsts);
  resp.headers.set("Content-Security-Policy", csp);
  resp.headers.set("X-Frame-Options", "DENY");
  resp.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
  resp.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  resp.headers.set("X-Content-Type-Options", "nosniff");
  resp.headers.set("X-XSS-Protection", "0"); // modern browsers ignore this; CSP handles XSS
  resp.headers.set("Cache-Control", "public, max-age=0, must-revalidate");

  // Optional security/privacy header to restrict where site can be embedded (same-origin)
  // resp.headers.set("Frame-Options", "DENY"); // duplicate of X-Frame-Options

  return resp;
}

// Configure middleware matcher if you want to exclude certain paths (api, static, _next)
export const config = {
  // run for all paths
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
