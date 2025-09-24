// app/packages/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import PACKAGES_DATA from "@/lib/packages-data";
import PackagesClient from "../PackagesClient"; // relative import - client listing component
import BackgroundSlideshowClient from "../BackgroundSlideshowClient";
import { SUPPORT_PHONE, WHATSAPP_NUMBER, SUPPORT_EMAIL } from "@/lib/constants";

interface Props {
  params: { slug: string };
}

// ✅ generateMetadata (पहले जैसा)
export async function generateMetadata({ params }: Props) {
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
  const imageCandidates: { url: string; width?: number; height?: number; alt?: string }[] = [
    { url: primaryImage.startsWith("http") ? primaryImage : `${siteOrigin}${primaryImage}`, width: 1200, height: 630, alt: titleBase },
  ];
  if (pkg.images && Array.isArray(pkg.images)) {
    pkg.images.slice(0, 3).forEach((p) => {
      const url = p.startsWith("http") ? p : `${siteOrigin}${p}`;
      if (!imageCandidates.find((c) => c.url === url)) {
        imageCandidates.push({ url, width: 1200, height: 630 });
      }
    });
  }

  const keywords = [
    "Varanasi car rental",
    "self drive car varanasi",
    "Varanasi taxi",
    "car rental varanasi",
    ...(pkg.title ? [pkg.title.replace(/\s+/g, " ")] : []),
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pageUrl },
    metadataBase: new URL(siteOrigin),
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "BookYourTravell",
      images: imageCandidates,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageCandidates.map((i) => i.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "package-slug": pkg.slug,
      "structured-data-needed": true,
    },
  } as any;
}

export default function PackagePage({ params }: Props) {
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return notFound();

  // build quick links for sidebar CTA
  const waClean = WHATSAPP_NUMBER.replace(/^\+/, "");
  const waLink = `https://wa.me/${waClean}?text=${encodeURIComponent(`Hi, I want info for "${pkg.titleHero || pkg.title}"`)}`;
  const telLink = `tel:${SUPPORT_PHONE}`;
  const mailLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Inquiry: ${pkg.titleHero || pkg.title}`)}`;

  // ====== Structured data (JSON-LD) for this package page ======
  // LocalBusiness details (site-wide / business-level)
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
  const business = {
    "@type": "LocalBusiness",
    "@id": `${siteOrigin}#business`,
    "name": "BookYourTravell",
    "image": `${siteOrigin}/images/og-image.webp`,
    "telephone": "+91-9389971003",
    "email": "shivam211019@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "53, Dhodha, Hatiya, Shivpur",
      "addressLocality": "Varanasi",
      "addressRegion": "UP",
      "postalCode": "221003",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "url": siteOrigin,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "120" // adjust if you have exact count
    }
  };

  // Service/Offer for this package
  const serviceForPackage: any = {
    "@type": "Service",
    "@id": `${siteOrigin}/packages/${pkg.slug}#service`,
    "name": pkg.titleHero || pkg.title,
    "description": pkg.overview || pkg.short || `${pkg.title} by BookYourTravell.`,
    "provider": { "@id": business["@id"] },
    "areaServed": { "@type": "City", "name": "Varanasi" },
  };

  // Offer (starting price if present)
  if (pkg.starting) {
    serviceForPackage.offers = {
      "@type": "Offer",
      "price": pkg.starting.replace(/[^\d.]/g, "") || undefined,
      "priceCurrency": "INR",
      "url": `${siteOrigin}/packages/${pkg.slug}`,
      "availability": "https://schema.org/InStock"
    };
  }

  // Breadcrumb
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteOrigin },
      { "@type": "ListItem", "position": 2, "name": "Packages", "item": `${siteOrigin}/packages` },
      { "@type": "ListItem", "position": 3, "name": pkg.titleHero || pkg.title, "item": `${siteOrigin}/packages/${pkg.slug}` }
    ]
  };

  // FAQ (4 Q/A — change as you like)
  const faqs = {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "क्या self-drive cars के लिए ड्राइवर की ज़रूरत होती है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "नहीं — self-drive विकल्प में आप खुद गाड़ी चला सकते हैं। हमारी टीम pickup/drop और जरूरी paperwork में सहायता करेगी।"
        }
      },
      {
        "@type": "Question",
        "name": "क्या fuel और toll charges कीमत में शामिल हैं?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "कुछ packages में fuel शामिल होता है — पर ज्यादातर इंटरसिटी और self-drive bookings में fuel/toll अलग से चार्ज होते हैं। पेज पर 'starting price' के विवरण में यह लिखा होगा।"
        }
      },
      {
        "@type": "Question",
        "name": "क्या online payment और refund विकल्प उपलब्ध हैं?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "हाँ — Razorpay के माध्यम से online payment उपलब्ध है। cancellation policy के हिसाब से full/partial refund दिया जा सकता है।"
        }
      },
      {
        "@type": "Question",
        "name": "क्या हम गाड़ी को किसी और शहर में drop कर सकते हैं (one-way)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "हां, कुछ routes और vehicle types के लिए one-way drop possible है — इसके लिए अलग charges लागू हो सकते हैं। Booking से पहले details confirm कर लें।"
        }
      }
    ]
  };

  const graph = [business, serviceForPackage, breadcrumb, faqs];
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  // ===============================================================

  return (
    <main className="relative min-h-screen font-sans">
      <BackgroundSlideshowClient />

      {/* Insert structured data JSON-LD for crawlers (server-rendered script) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                    {pkg.attractions.map((a) => (
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
