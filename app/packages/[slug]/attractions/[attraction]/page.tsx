// app/packages/[slug]/attractions/[attraction]/page.tsx
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import PACKAGES_DATA from "@/lib/packages-data";
import BackgroundSlideshowClient from "@/app/packages/BackgroundSlideshowClient";
import { SUPPORT_PHONE, SUPPORT_EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";

function makeWhatsappLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export async function generateMetadata({ params }: { params: { slug: string; attraction: string } }) {
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return {};

  const attraction = pkg.attractions?.find((a: any) => a.slug === params.attraction);
  if (!attraction) return {};

  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
  const pageUrl = `${siteOrigin}/packages/${pkg.slug}/attractions/${attraction.slug}`;
  const titleBase = attraction.title || attraction.short || pkg.title || "Attraction";
  const title = `${titleBase} — ${pkg.title || "BookYourTravell"}`;

  const description =
    (attraction.long && attraction.long.replace(/\s+/g, " ").trim().slice(0, 155)) ||
    attraction.short ||
    pkg.short ||
    `${titleBase} — details, timings and booking from BookYourTravell.`;

  const heroImage =
    (attraction.images && attraction.images[0]) ||
    (pkg.images && pkg.images[0]) ||
    "/images/ayodhya3.webp";
  const imageFull = heroImage.startsWith("http") ? heroImage : `${siteOrigin}${heroImage}`;

  const keywords = [
    "Varanasi attractions",
    `${attraction.slug || titleBase} attractions`,
    `${pkg.slug || "package"} attraction`,
    "temple darshan",
    "Ganga aarti",
    "Ayodhya visit",
    "Prayagraj sightseeing",
    "Varanasi tour",
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

function buildJsonLd(pkg: any, attraction: any) {
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
  const pageUrl = `${siteOrigin}/packages/${pkg.slug}/attractions/${attraction.slug}`;

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
  };

  const attractionLd = {
    "@type": "TouristAttraction",
    name: attraction.title,
    description: (attraction.short || "").slice(0, 300),
    url: pageUrl,
    image: attraction.images && attraction.images.length ? attraction.images[0] : `${siteOrigin}/images/ayodhya3.webp`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Varanasi",
      addressRegion: "UP",
      addressCountry: "IN",
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
      { "@type": "ListItem", position: 2, name: "Packages", item: `${siteOrigin}/packages` },
      { "@type": "ListItem", position: 3, name: pkg.title || "Package", item: `${siteOrigin}/packages/${pkg.slug}` },
      { "@type": "ListItem", position: 4, name: attraction.title || "Attraction", item: pageUrl },
    ],
  };

  const faqs = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "क्या यहाँ पहुँचने के लिए guide उपलब्ध है?",
        acceptedAnswer: { "@type": "Answer", text: "हाँ — local guide request पर arrange किया जा सकता है।" },
      },
      {
        "@type": "Question",
        name: "क्या यहाँ parking और restrooms उपलब्ध हैं?",
        acceptedAnswer: { "@type": "Answer", text: "अधिकतर attractions पर basic facilities उपलब्ध हैं; विवरण attraction page पर दिया गया है।" },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [business, attractionLd, breadcrumb, faqs],
  };
}

export default function AttractionPage({ params }: { params: { slug: string; attraction: string } }) {
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return notFound();

  const attractionSlug = params.attraction;
  const attraction = pkg.attractions?.find((a) => a.slug === attractionSlug);
  if (!attraction) return notFound();

  const bookText = `Hi, I want to book *${pkg.title}* — attraction: ${attraction.title}. Please help.`;
  const whatsappLink = makeWhatsappLink(WHATSAPP_NUMBER || SUPPORT_PHONE || "", bookText);
  const telLink = `tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`;
  const mailLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Booking request: ${pkg.title} - ${attraction.title}`)}`;

  const heroImage =
    (attraction.images && attraction.images[0]) ||
    (pkg.images && pkg.images[0]) ||
    "/images/ayodhya3.webp";

  const jsonLdObject = buildJsonLd(pkg, attraction);

  return (
    <main className="relative min-h-screen font-sans bg-white">
      {/* watermark slideshow behind content */}
      <BackgroundSlideshowClient />

      {/* structured data */}
      <Script id={`attraction-jsonld-${pkg.slug}-${attraction.slug}`} type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdObject) }} />

      {/* hero with dark overlay to keep text readable (matches existing site look) */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.48), rgba(0,0,0,0.38)), url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-md">
            {attraction.title}
          </h1>
          <p className="mt-3 text-lg opacity-90 italic">
            {attraction.short || pkg.short}
          </p>
        </div>
      </section>

      {/* main content */}
      <section className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* left: content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-orange-50">
              <h2 className="text-2xl font-bold mb-4">About {attraction.title}</h2>

              {/* render long description (split paragraphs on double newlines) */}
              {attraction.long ? (
                attraction.long
                  .split(/\n{2,}/g)
                  .map((para, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))
              ) : (
                <p className="text-gray-600">
                  No detailed description available yet. Contact us for more info.
                </p>
              )}

              {/* images (grid) */}
              {attraction.images?.length ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attraction.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${attraction.title} ${i + 1}`}
                      className="rounded-lg shadow-sm object-cover w-full h-48"
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* back link */}
            <div className="pt-6">
              <Link href={`/packages/${pkg.slug}`} className="text-orange-500">
                ← Back to package
              </Link>
            </div>
          </div>

          {/* right: booking / contact */}
          <aside className="border rounded-xl p-6 bg-gradient-to-br from-orange-50 to-white shadow-md">
            <div>
              <div className="text-sm text-gray-600">Interested in visiting</div>
              <div className="text-2xl font-bold mt-1 text-rose-600">
                {pkg.starting}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold shadow hover:from-orange-600 hover:to-red-600 transition"
              >
                Book via WhatsApp
              </a>

              <a className="block w-full text-center border rounded-md py-2 text-sm text-gray-700" href={telLink}>
                Call: {SUPPORT_PHONE}
              </a>
              <a className="block w-full text-center border rounded-md py-2 text-sm text-gray-700" href={mailLink}>
                Email: {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium">We can arrange:</p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                <li>Private car with experienced driver</li>
                <li>Local guide on request</li>
                <li>Flexible pickup & drop</li>
              </ul>
            </div>

            <div className="mt-5 text-xs text-gray-500 border-t pt-3">
              Trusted local operator · Safe travel guarantee
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
