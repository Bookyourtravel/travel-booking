// app/packages/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Script from "next/script";
import PACKAGES_DATA from "@/lib/packages-data";
import BackgroundSlideshowClient from "../BackgroundSlideshowClient";
import { SUPPORT_PHONE, WHATSAPP_NUMBER, SUPPORT_EMAIL } from "@/lib/constants";

// ---- generateMetadata ----
export async function generateMetadata(props: any) {
  const params = (props && props.params) as { slug: string };
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return {};

  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
  const pageUrl = `${siteOrigin}/packages/${pkg.slug}`;
  const titleBase = pkg.titleHero || pkg.title || "Package";
  const title = `${titleBase} — BookYourTravell`;

  const description =
    (pkg.overview && pkg.overview.replace(/\s+/g, " ").trim().slice(0, 155)) ||
    pkg.short ||
    `${titleBase} from BookYourTravell — trusted drivers, transparent fares and easy booking.`;

  const primaryImage = pkg.heroImage || (pkg.images && pkg.images[0]) || "/images/og-image.webp";
  const imageFull = primaryImage.startsWith("http") ? primaryImage : `${siteOrigin}${primaryImage}`;

  const keywords = [
    "Varanasi packages",
    "tour package " + (pkg.slug || ""),
    "temple darshan",
    "Varanasi taxi",
    "self drive car",
    "airport transfer",
    "Ayodhya trip",
    "Prayagraj trip",
    "Ganga Aarti",
    "book cab varanasi",
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteOrigin),
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "BookYourTravell",
      images: [
        {
          url: imageFull,
          alt: `${titleBase} — BookYourTravell`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageFull],
    },
    robots: { index: true, follow: true },
  } as any;
}

// ---- JSON-LD Builder ----
function buildJsonLdObject(pkg: any) {
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
  const pageUrl = `${siteOrigin}/packages/${pkg.slug}`;

  const business = {
    "@type": "LocalBusiness",
    "@id": `${siteOrigin}#business`,
    name: "BookYourTravell",
    url: siteOrigin,
    telephone: SUPPORT_PHONE,
    email: SUPPORT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "53, Ghodha, Hatiya, Shivapur",
      addressLocality: "Varanasi",
      addressRegion: "UP",
      postalCode: "221003",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    image: `${siteOrigin}/images/og-image.webp`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "120",
    },
  };

  const service: any = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: pkg.titleHero || pkg.title,
    description: pkg.overview || pkg.short || "",
    provider: { "@id": `${siteOrigin}#business` },
    areaServed: { "@type": "City", name: "Varanasi" },
  };

  if (pkg.starting) {
    const priceStr = String(pkg.starting).replace(/[^\d.]/g, "");
    if (priceStr) {
      service.offers = {
        "@type": "Offer",
        url: pageUrl,
        priceCurrency: "INR",
        price: priceStr,
        availability: "https://schema.org/InStock",
      };
    }
  }

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
      { "@type": "ListItem", position: 2, name: "Packages", item: `${siteOrigin}/packages` },
      { "@type": "ListItem", position: 3, name: pkg.titleHero || pkg.title, item: pageUrl },
    ],
  };

  const faqs = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "क्या self-drive cars के लिए ड्राइवर की ज़रूरत होती है?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "नहीं — self-drive विकल्प में आप खुद गाड़ी चला सकते हैं।",
        },
      },
      {
        "@type": "Question",
        name: "क्या fuel और toll charges कीमत में शामिल हैं?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ज्यादातर packages में fuel/toll अलग होते हैं। Details booking page पर लिखे होते हैं।",
        },
      },
      {
        "@type": "Question",
        name: "क्या online payment और refund विकल्प उपलब्ध हैं?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "हाँ — Razorpay से online payment और cancellation policy के हिसाब से refund उपलब्ध है।",
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [business, service, breadcrumb, faqs],
  };
}

// ---- Page Component ----
export default function PackagePage(props: any) {
  const params = (props && props.params) as { slug: string };
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return notFound();

  const jsonLdObject = buildJsonLdObject(pkg);

  const waClean = (WHATSAPP_NUMBER || "").replace(/^\+/, "");
  const waLink = `https://wa.me/${waClean}?text=${encodeURIComponent(`Hi, I want info for "${pkg.titleHero || pkg.title}"`)}`;
  const telLink = `tel:${SUPPORT_PHONE}`;
  const mailLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Inquiry: ${pkg.titleHero || pkg.title}`)}`;

  return (
    <main className="relative min-h-screen font-sans">
      <BackgroundSlideshowClient />

      <Script
        id={`pkg-jsonld-${pkg.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdObject) }}
      />

      <div className="relative z-10">
        <section
          className="relative py-24 text-white"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${pkg.heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
              {pkg.titleHero}
            </h1>
            {pkg.tagline && <p className="mt-3 text-lg italic opacity-90">{pkg.tagline}</p>}
            <div className="mt-6 flex gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
              >
                Book this trip
              </a>
              <a
                href="/packages"
                className="bg-white/20 border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
              >
                View all packages
              </a>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">What you'll get</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Trusted driver & fixed pricing — no surprises</li>
                    <li>✓ On-time pickup aligned to your travel schedule</li>
                    <li>✓ Comfortable vehicle + rest stops en route</li>
                  </ul>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Why this trip works</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Local driver insights</li>
                    <li>✓ Easy customization on request</li>
                    <li>✓ Family-friendly pacing</li>
                  </ul>
                </div>
              </div>

              {pkg.overview && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold mb-3">Overview</h2>
                  <p className="text-gray-700 leading-relaxed">{pkg.overview}</p>
                </div>
              )}

              {pkg.attractions && pkg.attractions.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-orange-600">Top Attractions</h2>
                  <div className="space-y-4">
                    {pkg.attractions.map((a: any) => (
                      <div
                        key={a.slug}
                        className="flex items-center justify-between border rounded-lg p-4 hover:bg-orange-50 transition"
                      >
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{a.title}</h3>
                          <p className="text-gray-600 text-sm">{a.short}</p>
                        </div>
                        <a
                          href={`/packages/${pkg.slug}/attractions/${a.slug}`}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Learn more
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="border rounded-xl p-6 bg-gradient-to-br from-orange-50 to-white shadow-md">
              <div>
                <div className="text-sm text-gray-600">Starting price</div>
                <div className="text-2xl font-bold mt-1 text-rose-600">{pkg.starting}</div>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-lg font-semibold"
                >
                  Book now via WhatsApp
                </a>

                <div className="flex gap-3 mt-2">
                  <a
                    href={telLink}
                    className="flex-1 text-center border rounded-md py-2 px-3 text-sm bg-white hover:bg-gray-50"
                  >
                    Call<div className="text-xs text-gray-600 mt-1">{SUPPORT_PHONE}</div>
                  </a>
                  <a
                    href={mailLink}
                    className="flex-1 text-center border rounded-md py-2 px-3 text-sm bg-white hover:bg-gray-50"
                  >
                    Email<div className="text-xs text-gray-600 mt-1">{SUPPORT_EMAIL}</div>
                  </a>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p>✅ Hassle-free booking process</p>
                <p>✅ Trusted drivers with experience</p>
                <p>✅ Flexible cancellation options</p>
              </div>

              <div className="mt-5 text-xs text-gray-500 border-t pt-3">
                Trusted local operator · Safe travel guarantee
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
