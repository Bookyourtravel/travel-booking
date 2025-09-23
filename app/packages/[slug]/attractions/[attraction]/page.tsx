// app/packages/[slug]/attractions/[attraction]/page.tsx
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PACKAGES_DATA from "@/lib/packages-data";
import BackgroundSlideshowClient from "@/app/packages/BackgroundSlideshowClient";
import { SUPPORT_PHONE, SUPPORT_EMAIL } from "@/lib/constants";

type Props = {
  params: { slug: string; attraction: string };
};

function makeWhatsappLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export default function AttractionPage({ params }: Props) {
  const pkg = PACKAGES_DATA[params.slug];
  if (!pkg) return notFound();

  const attractionSlug = params.attraction;
  const attraction = pkg.attractions?.find((a) => a.slug === attractionSlug);
  if (!attraction) return notFound();

  const bookText = `Hi, I want to book *${pkg.title}* — attraction: ${attraction.title}. Please help.`;
  const whatsappLink = makeWhatsappLink(SUPPORT_PHONE, bookText);
  const telLink = `tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`;
  const mailLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `Booking request: ${pkg.title} - ${attraction.title}`
  )}&body=${encodeURIComponent(
    `Hi,\n\nI want to book ${pkg.title} (attraction: ${attraction.title}). Please contact me.\n\nThanks.`
  )}`;

  // hero background: use first attraction image if present, else fallback to package image
  const heroImage =
    (attraction.images && attraction.images[0]) ||
    (pkg.images && pkg.images[0]) ||
    "/images/ayodhya3.jpg";

  return (
    <main className="relative min-h-screen font-sans bg-white">
      {/* watermark slideshow behind content */}
      <BackgroundSlideshowClient />

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
