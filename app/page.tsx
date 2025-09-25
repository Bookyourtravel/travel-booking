// app/page.tsx
import React from "react";
import HomeClient from "./home-client";

// SEO Metadata (dynamic for flexibility)
export async function generateMetadata(): Promise<any> {
  const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com";
  const url = new URL("/", ORIGIN).toString();

  const title = "Car Rental Varanasi | Self Drive Car & Taxi Booking — BookYourTravell";
  const description =
    "Varanasi car rental — self drive cars, chauffeur-driven taxis, airport transfers, temple tours, outstation trips & local sightseeing. Trusted travel service with verified drivers & best prices.";
  const keywords = [
    "car rental varanasi",
    "self drive car in varanasi",
    "taxi booking varanasi",
    "varanasi airport taxi",
    "cab service varanasi",
    "kashi vishwanath tour taxi",
    "varanasi to ayodhya cab",
    "varanasi to prayagraj taxi",
    "outstation taxi varanasi",
    "luxury car rental varanasi",
    "budget car booking varanasi",
    "book cab varanasi",
    "car hire varanasi",
    "tempo traveller varanasi",
    "sarnath taxi service",
    "banaras car rental",
    "car rental near me",
    "tour package varanasi",
    "travel agency varanasi"
  ];

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(ORIGIN),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "BookYourTravell",
      images: [
        {
          url: `${ORIGIN}/images/og-image.webp`,
          alt: "Car Rental Varanasi - BookYourTravell",
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
      images: [`${ORIGIN}/images/og-image.webp`],
    },
  };
}

export default function Page() {
  const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "BookYourTravell",
    url: ORIGIN,
    logo: `${ORIGIN}/images/logo.png`,
    image: `${ORIGIN}/images/og-image.webp`,
    description:
      "BookYourTravell offers car rental in Varanasi — self drive, chauffeur-driven taxis, airport transfers, sightseeing and tour packages.",
    telephone: "+91-XXXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Varanasi",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.facebook.com/YourPage",
      "https://www.instagram.com/YourProfile",
    ],
  };

  return (
    <>
      <HomeClient />
      {/* Page-level JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
