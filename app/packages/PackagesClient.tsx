// app/components/PackageClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER, SUPPORT_PHONE, SUPPORT_EMAIL } from "@/lib/constants";

type Props = {
  pkg: any;
};

/* ---------- Helpers ---------- */
function buildWhatsAppLink(number?: string, pkgTitle?: string, pkgSlug?: string) {
  const num = number || "";
  const clean = num.replace(/^\+/, "");
  const msg = encodeURIComponent(
    `Hi, I want to enquire about the package "${pkgTitle || pkgSlug}". Please help with price & availability.`
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

function buildMailto(email?: string, pkgTitle?: string, pkgSlug?: string) {
  const to = email || "";
  const subject = encodeURIComponent(`Inquiry: ${pkgTitle || pkgSlug}`);
  const body = encodeURIComponent(
    `Hi,\n\nI would like details and booking information for the package "${pkgTitle || pkgSlug}".\n\nThanks,\n`
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

/* ---------- Component ---------- */
export default function PackageClient({ pkg }: Props) {
  const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, pkg.titleHero || pkg.title, pkg.slug);
  const telLink = `tel:${SUPPORT_PHONE || ""}`;
  const mailLink = buildMailto(SUPPORT_EMAIL, pkg.titleHero || pkg.title, pkg.slug);

  return (
    <div className="relative z-10">
      {/* Hero Section */}
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
          {pkg.tagline && (
            <p className="mt-3 text-lg italic opacity-90">{pkg.tagline}</p>
          )}
          <div className="mt-6 flex gap-4">
            {/* Book via WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              Book this trip
            </a>

            <Link
              href="/packages"
              className="bg-white/20 border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              View all packages
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="md:col-span-2 space-y-6">
            {/* Why choose */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  What you’ll get
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Trusted driver & fixed pricing — no surprises</li>
                  <li>✓ On-time pickup aligned to your travel schedule</li>
                  <li>✓ Comfortable vehicle + rest stops en route</li>
                </ul>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Why this trip works
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Local driver insights</li>
                  <li>✓ Easy customization on request</li>
                  <li>✓ Relaxed, family-friendly pacing</li>
                </ul>
              </div>
            </div>

            {/* Overview */}
            {pkg.overview && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition">
                <h2 className="text-2xl font-bold mb-3">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{pkg.overview}</p>
              </div>
            )}

            {/* Attractions */}
            {pkg.attractions && pkg.attractions.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition">
                <h2 className="text-2xl font-bold mb-4 text-orange-600">
                  Top Attractions
                </h2>
                <div className="space-y-4">
                  {pkg.attractions.map((a: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded-lg p-4 hover:bg-orange-50 transition"
                    >
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {a.title || a}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {a.short || "Click to explore full details"}
                        </p>
                      </div>
                      <Link
                        href={`/packages/${pkg.slug}/attractions/${a.slug}`}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600"
                      >
                        Learn more
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="border rounded-xl p-6 bg-gradient-to-br from-orange-50 to-white shadow-md hover:shadow-lg transition">
            <div>
              <div className="text-sm text-gray-600">Starting price</div>
              <div className="text-2xl font-bold mt-1 text-rose-600">
                {pkg.starting}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Primary CTA -> WhatsApp */}
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-lg font-semibold shadow hover:scale-[1.02] transition"
              >
                Book now via WhatsApp
              </a>

              {/* Secondary quick contact row: Call + Email */}
              <div className="flex gap-3 mt-2">
                <a
                  href={telLink}
                  className="flex-1 text-center border rounded-md py-2 px-3 text-sm bg-white hover:bg-gray-50"
                >
                  Call
                  <div className="text-xs text-gray-600 mt-1">
                    {SUPPORT_PHONE}
                  </div>
                </a>

                <a
                  href={mailLink}
                  className="flex-1 text-center border rounded-md py-2 px-3 text-sm bg-white hover:bg-gray-50"
                >
                  Email
                  <div className="text-xs text-gray-600 mt-1">
                    {SUPPORT_EMAIL}
                  </div>
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
  );
}
