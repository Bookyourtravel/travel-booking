// app/sitemap.xml/route.ts
import PACKAGES_DATA from "@/lib/packages-data";

const DEFAULT_SITE_ORIGIN = "https://bookyourtravell.com";

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || DEFAULT_SITE_ORIGIN).replace(/\/$/, "");
  const pages: string[] = [
    "/",
    "/packages",
    "/about",
    "/contact",
    "/reviews",
    "/terms",
    "/privacy",
  ];

  // add package pages
  Object.keys(PACKAGES_DATA).forEach((slug) => {
    pages.push(`/packages/${slug}`);
    const pkg = (PACKAGES_DATA as any)[slug];
    // add attractions pages if present
    if (pkg?.attractions && Array.isArray(pkg.attractions)) {
      pkg.attractions.forEach((a: any) => {
        pages.push(`/packages/${slug}/attractions/${a.slug}`);
      });
    }
  });

  // dedupe and build xml
  const unique = Array.from(new Set(pages));
  const lastMod = new Date().toISOString();

  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  unique.forEach((p) => {
    const url = `${siteOrigin}${p}`;
    xmlParts.push(
      '<url>',
      `<loc>${escapeXml(url)}</loc>`,
      `<lastmod>${lastMod}</lastmod>`,
      `<changefreq>weekly</changefreq>`,
      `<priority>${p === "/" ? "1.0" : p.startsWith("/packages/") ? "0.8" : "0.6"}</priority>`,
      '</url>'
    );
  });

  xmlParts.push("</urlset>");
  const sitemap = xmlParts.join("\n");

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600", // cache on CDN for 1 hour
    },
  });
}
