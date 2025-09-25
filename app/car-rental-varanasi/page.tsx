// app/car-rental-varanasi/page.tsx
import Script from "next/script";
import React from "react";
import Page from "../packages/[slug]/page";
import { SUPPORT_PHONE, SUPPORT_EMAIL } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com";

export async function generateMetadata(): Promise<any> {
  const url = `${siteUrl}/car-rental-varanasi`;
  const title = "Car Rental Varanasi — Self Drive & Chauffeur Driven | BookYourTravell";
  const description =
    "Book car rental in Varanasi — self drive cars, chauffeur-driven taxis, airport pickup, temple tours & outstation trips. Trusted drivers, transparent fares, instant booking support.";
  const keywords = [
    "car rental varanasi",
    "self drive car in varanasi",
    "chauffeur driven taxi varanasi",
    "varanasi airport cab",
    "outstation taxi varanasi",
    "car rental near me",
    "varanasi cab booking",
    "book cab varanasi",
    "luxury car rental varanasi",
    "budget taxi varanasi",
    "sarnath tour taxi",
    "ayodhya trip cab",
    "prayagraj taxi booking",
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
          url: `${siteUrl}/images/og-image.webp`,
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
      images: [`${siteUrl}/images/og-image.webp`],
    },
    robots: { index: true, follow: true },
  };
}

/** Helper: build optimized JSON-LD object */
function buildJsonLd() {
  const pageUrl = `${siteUrl}/car-rental-varanasi`;
  const phone = SUPPORT_PHONE || "+919389971003";
  const email = SUPPORT_EMAIL || "shivam211019@gmail.com";

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CarRental",
    "@id": `${pageUrl}#carrental`,
    name: "BookYourTravell — Car Rental Varanasi",
    image: `${siteUrl}/images/og-image.webp`,
    url: pageUrl,
    telephone: phone,
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "53, Ghodha, Hatiya, Shivapur",
      addressLocality: "Varanasi",
      addressRegion: "UP",
      postalCode: "221003",
      addressCountry: "IN",
    },
    priceRange: "₹699 - ₹5000",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "06:00",
        closes: "23:00",
      },
    ],
    sameAs: [
      `https://wa.me/${phone.replace(/^\+/, "")}`,
      `mailto:${email}`,
    ],
    areaServed: [
      { "@type": "City", name: "Varanasi" },
      { "@type": "AdministrativeArea", name: "Uttar Pradesh" },
    ],
    keywords: [
      "car rental varanasi",
      "self drive car in varanasi",
      "chauffeur driven car varanasi",
      "airport taxi varanasi",
      "local taxi service varanasi",
      "outstation cab booking varanasi",
    ],
    description:
      "BookYourTravell offers car rental in Varanasi — self drive cars, chauffeur driven taxis, airport pickup, local temple tours and outstation travel. Transparent fares, verified drivers, quick booking support.",
  });
}

/** Wrapper */
export default function CarRentalVaranasiPage() {
  const ld = buildJsonLd();

  return (
    <>
      <Script
        id="car-rental-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: ld }}
      />

      {/* Reuse the dynamic package page with slug "self-drive" */}
      <Page params={{ slug: "self-drive" }} />
    </>
  );
}
