// app/packages/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import PACKAGES_DATA from "@/lib/packages-data";
import BackgroundSlideshowClient from "../BackgroundSlideshowClient";
import PackageClient from "@/app/components/PackageClient"; // client wrapper (interactive UI)

/**
 * Server component: only metadata + data lookup + render client wrapper.
 * This keeps SEO fast and page load optimized.
 */

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com";
  const url = `${siteUrl}/packages/${pkg.slug}`;

  return {
    title: `${pkg.titleHero || pkg.title} — BookYourTravell`,
    description:
      pkg.overview ||
      `${pkg.title} with BookYourTravell. Trusted drivers, fixed fares, easy booking.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${pkg.titleHero || pkg.title} — BookYourTravell`,
      description:
        pkg.overview ||
        `${pkg.title} with BookYourTravell. Trusted drivers, fixed fares, easy booking.`,
      url,
      siteName: "BookYourTravell",
      images: [
        {
          url: `${siteUrl}${pkg.heroImage || pkg.images?.[0] || "/images/og-image.jpg"}`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.titleHero || pkg.title} — BookYourTravell`,
      description:
        pkg.overview ||
        `${pkg.title} with BookYourTravell. Trusted drivers, fixed fares, easy booking.`,
      images: [
        `${siteUrl}${pkg.heroImage || pkg.images?.[0] || "/images/og-image.jpg"}`,
      ],
    },
  };
}

export default function PackagePage({ params }: Props) {
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return notFound();

  return (
    <main className="relative min-h-screen font-sans">
      {/* Background slideshow (client) */}
      <BackgroundSlideshowClient />

      {/* Client-side interactive UI */}
      <PackageClient pkg={pkg} />
    </main>
  );
}
