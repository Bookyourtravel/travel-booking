// app/trip-planner/page.tsx
import React from "react";
import Link from "next/link";

export async function generateMetadata(): Promise<any> {
  const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com";
  const path = "/trip-planner";
  const url = new URL(path, ORIGIN).toString();

  const title = "Trip Planner — Custom Tours from Varanasi | BookYourTravell";
  const description =
    "Plan custom trips from Varanasi to Ayodhya, Prayagraj, Lucknow & nearby — budget-friendly packages, temple darshan, local guides and verified cabs. Start your personalized itinerary now.";
  const keywords = [
    "Varanasi trip planner",
    "custom tour Varanasi",
    "Ayodhya trip",
    "Prayagraj tour",
    "Lucknow packages",
    "temple darshan package",
    "Varanasi travel planner",
    "book taxi Varanasi",
    "Varanasi tours",
    "Varanasi packages",
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
          url: `${ORIGIN}/images/og-trip-planner.webp`,
          alt: "Trip Planner from Varanasi - BookYourTravell",
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
      images: [`${ORIGIN}/images/og-trip-planner.webp`],
    },
  };
}

export default function TripPlannerPage() {
  const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "BookYourTravell",
    url: ORIGIN,
    logo: `${ORIGIN}/images/logo.png`,
    image: `${ORIGIN}/images/og-trip-planner.webp`,
    description:
      "Custom trip planner and travel booking service from Varanasi — cabs, temple tours, and curated packages.",
    telephone: "+91-XXXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Varanasi",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    sameAs: ["https://www.facebook.com/YourPage", "https://www.instagram.com/YourProfile"],
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Varanasi Trip Planner</h1>

          <p className="text-gray-700 mb-4">
            Welcome — Trip Planner page is live. अभी हम यहाँ short booking flow और Google Maps integration दिखाएँगे।
            सही काम करने के बाद हम Razorpay checkout और server-side verification भी integrate कर देंगे।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Quick Start</h3>
              <p className="text-sm text-gray-600">Use the trip planner on the homepage or continue to booking.</p>
              <Link href="/" className="inline-block mt-3 bg-amber-600 text-white px-4 py-2 rounded">
                Go to Homepage
              </Link>
            </div>

            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Test Payment (Sandbox)</h3>
              <p className="text-sm text-gray-600">Razorpay test mode enabled. Use demo flow from homepage once form is integrated.</p>
              <Link href="/" className="inline-block mt-3 border px-4 py-2 rounded">
                Open Booking
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Note: यह placeholder page है — अगला step होगा यहाँ Book-by-KM form, Google Maps autocomplete और Razorpay checkout जोड़ना.
          </div>
        </div>
      </main>

      {/* Page-level JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
