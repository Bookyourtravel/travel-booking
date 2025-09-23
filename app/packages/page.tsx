// app/packages/page.tsx
import PackagesClient from "./PackagesClient";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.bookyourtravell.com";

export const metadata = {
  title: "Packages — BookYourTravell | Varanasi Tours & Taxi",
  description:
    "BookYourTravell offers curated Varanasi travel packages — temple darshan, day tours to Ayodhya, Prayagraj, evening Ganga Aarti, airport transfers and more. Trusted drivers, transparent pricing.",
  alternates: {
    canonical: `${siteUrl}/packages`,
  },
  openGraph: {
    title: "Packages — BookYourTravell | Varanasi Tours & Taxi",
    description:
      "Curated Varanasi tours, temple darshan, Ganga Aarti, Ayodhya & Prayagraj trips, airport transfers and more. Book trusted drivers with BookYourTravell.",
    url: `${siteUrl}/packages`,
    siteName: "BookYourTravell",
    images: [
      {
        url: `${siteUrl}/images/kashi1.jpg`,
        width: 1200,
        height: 630,
        alt: "Varanasi Travel Packages",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Packages — BookYourTravell | Varanasi Tours",
    description:
      "Explore curated Varanasi packages: Ayodhya, Prayagraj, Ganga Aarti & more. Trusted drivers, transparent pricing with BookYourTravell.",
    images: [`${siteUrl}/images/kashi1.jpg`],
  },
};

/* ---------- JSON-LD Structured Data ---------- */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "BookYourTravell Packages",
  description:
    "Curated travel packages from Varanasi — temple trips, day tours, airport transfers and self-drive options.",
  url: `${siteUrl}/packages`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Varanasi → Ayodhya Taxi",
      url: `${siteUrl}/packages/ayodhya`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Local Darshan - Kashi Vishwanath",
      url: `${siteUrl}/packages/kashi-darshan`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Airport Pickup/Drop",
      url: `${siteUrl}/packages/lucknow-airport`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Varanasi → Prayagraj (Sangam)",
      url: `${siteUrl}/packages/prayagraj`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Evening Ganga Aarti Special",
      url: `${siteUrl}/packages/ganga-aarti`,
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Self-Drive Cars (Varanasi)",
      url: `${siteUrl}/packages/self-drive`,
    },
  ],
};

export default function PackagesPage() {
  return (
    <>
      {/* Inject JSON-LD for SEO */}
      <Script
        id="packages-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackagesClient />
    </>
  );
}
