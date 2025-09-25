// app/packages/page.tsx
import PackagesClient from "./PackagesClient";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.bookyourtravell.com";

export async function generateMetadata(): Promise<any> {
  const url = new URL("/packages", siteUrl).toString();

  const title = "Packages — BookYourTravell | Varanasi Tours, Temple Darshan & Taxi";
  const description =
    "BookYourTravell curated Varanasi packages — temple darshan, Ayodhya & Prayagraj day trips, Ganga Aarti, airport transfers, self-drive and chauffeur-driven cars. Trusted drivers & transparent pricing.";
  const keywords = [
    "Varanasi packages",
    "Varanasi tour packages",
    "temple darshan varanasi",
    "ganga aarti package",
    "ayodhya trip from varanasi",
    "prayagraj tour",
    "varanasi airport transfer",
    "self drive varanasi",
    "chauffeur driven car varanasi",
    "book cab varanasi",
    "tour packages varanasi",
    "kashi darshan package",
    "sarnath tour",
  ];

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "BookYourTravell",
      images: [
        {
          url: `${siteUrl}/images/kashi1.webp`,
          alt: "Varanasi Travel Packages — BookYourTravell",
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/kashi1.webp`],
    },
  };
}

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
