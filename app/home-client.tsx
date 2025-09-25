// app/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

/* ---------- Replace support values if needed ---------- */
const SUPPORT_PHONE = "+919389971003";
const SUPPORT_EMAIL = "shivam211019@gmail.com";

/* ----------------- Page-level metadata (for app router) ----------------- */
/* Note: app router prefers server-exported metadata; keeping this const here
   so it's visible to you — app/layout.tsx already sets site-wide metadata.
   If you want fully server-side metadata, we'll move this to a server page later. */
export const metadata = {
  title: "Car Rental Varanasi | Self Drive Car in Varanasi — BookYourTravell",
  description:
    "Car rental Varanasi — Self drive cars, chauffeur-driven taxis, airport pick-up and local temple tours. BookYourTravell provides trusted car booking & travel services in Varanasi.",
  keywords: [
    "car rental varanasi",
    "self drive car in varanasi",
    "travel services in varanasi",
    "car booking",
    "car rental near me",
    "varanasi taxi",
    "kashi car rental",
  ],
  alternates: {
    canonical: "https://bookyourtravell.com/",
  },
  openGraph: {
    title: "Car Rental Varanasi | BookYourTravell",
    description:
      "Self drive & chauffeur-driven car rental in Varanasi. Airport transfer, temple tours, and local travel services — easy booking.",
    url: "https://bookyourtravell.com",
    siteName: "BookYourTravell",
    images: [
      {
        url: "https://bookyourtravell.com/images/og-image.webp",
        alt: "Car Rental Varanasi - BookYourTravell",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Rental Varanasi — BookYourTravell",
    description:
      "Self drive & chauffeur-driven car rental in Varanasi. Book taxi, book car, travel services near you.",
    images: ["https://bookyourtravell.com/images/og-image.webp"],
  },
};

/* -------------------- Data -------------------- */
const PACKAGES = [
  {
    title: "Varanasi → Ayodhya Taxi",
    desc: "Reliable intercity taxi with fixed price and driver guide",
    images: ["/images/ayodhya1.webp", "/images/ayodhya2.webp", "/images/ayodhya3.webp"],
    href: "/packages/ayodhya",
    starting: "₹1,850 (4 pax)",
  },
  {
    title: "Local Darshan - Kashi Vishwanath",
    desc: "Temple darshan + guided walk + Ganga Aarti evening experience",
    images: ["/images/kashi1.webp", "/images/kashi2.webp", "/images/kashi3.webp", "/images/kashi4.webp"],
    href: "/packages/kashi-darshan",
    starting: "₹3,800 (4 pax)",
  },
  {
    title: "Airport Pickup/Drop",
    desc: "Comfortable sedan / Innova options with flight tracking",
    images: ["/images/lucknow-airport.webp"],
    href: "/packages/lucknow-airport",
    starting: "₹699 (Pickup)",
  },
  {
    title: "Varanasi → Prayagraj (Sangam)",
    desc: "Day trip or overnight packages with hotel add-ons",
    images: ["/images/prayagraj1.webp", "/images/prayagraj2.webp", "/images/prayagraj3.webp"],
    href: "/packages/prayagraj",
    starting: "₹2,900 (4 pax)",
  },
  {
    title: "Evening Ganga Aarti Special",
    desc: "Front-row aarti experience with priest and photography",
    images: ["/images/arti1.webp", "/images/arti2.webp", "/images/arti3.webp"],
    href: "/packages/ganga-aarti",
    starting: "₹1,599 (per person)",
  },
  {
    title: "Self-Drive Cars (Varanasi)",
    desc: "Flexible self-drive hatchbacks & sedans — hourly or daily rentals with easy pickup/drop.",
    images: ["/images/selfdrive1.webp", "/images/selfdrive2.webp"],
    href: "/packages/self-drive",
    starting: "₹1,850 / day",
  },
];

/* -------------------- Helpers (ImageCarousel, Watermark, HoverBloom, StatsBox) -------------------- */

function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images]);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 140, height: "100%" }}>
      {images && images.length ? (
        images.map((src, i) => {
          const active = i === idx;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`slide-${i}`}
              loading="lazy"
              decoding="async"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 900ms ease, filter 900ms ease, transform 900ms ease",
                opacity: active ? 1 : 0,
                filter: active ? "blur(0px)" : "blur(6px)",
                transform: active ? "scale(1)" : "scale(1.03)",
              }}
            />
          );
        })
      ) : (
        <div className="w-full h-full bg-gray-100" />
      )}

      {images && images.length > 1 && (
        <div className="absolute left-3 bottom-3 flex gap-2 z-20">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-opacity ${i === idx ? "opacity-100" : "opacity-50"}`}
              style={{ background: i === idx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BackgroundWatermark({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 22000);
    return () => clearInterval(t);
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {images.map((src, i) => {
        const active = i === idx;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: active ? 0.12 : 0,
              filter: "blur(2px)",
              transition: "opacity 8000ms ease-in-out, filter 8000ms ease-in-out",
            }}
          />
        );
      })}
    </div>
  );
}

function HoverBloom({ trigger, items, maxBubbles = 10 }: { trigger: boolean; items: string[]; maxBubbles?: number; }) {
  const bubbles = React.useMemo(() => {
    const arr: any[] = [];
    for (let i = 0; i < Math.min(maxBubbles, items.length); i++) {
      arr.push({
        id: `${i}-${Math.round(Math.random() * 10000)}`,
        text: items[i],
        size: 36 + Math.round(Math.random() * 30),
        x: Math.round((Math.random() - 0.5) * 220),
        yStart: 10 + Math.round(Math.random() * 10),
        yEnd: -120 - Math.round(Math.random() * 160),
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2.2,
        hue: Math.round(20 + Math.random() * 200),
      });
    }
    return arr;
  }, [items, maxBubbles]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <AnimatePresence>
        {trigger &&
          bubbles.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: b.yStart, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0.9], y: b.yEnd, scale: [0.9, 1, 1.05] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: b.duration, delay: b.delay, ease: "easeOut" }}
              style={{
                left: `calc(50% + ${b.x}px)`,
                top: `calc(50% + ${b.yStart}px)`,
                position: "absolute",
                transform: "translate(-50%, -50%)",
                borderRadius: 9999,
                padding: "6px 10px",
                fontSize: Math.max(11, Math.round(b.size / 6)),
                whiteSpace: "nowrap",
                backdropFilter: "blur(6px)",
                background: `linear-gradient(180deg, hsla(${b.hue},80%,55%,0.95), hsla(${(b.hue + 40) % 360},70%,45%,0.85))`,
                color: "white",
                boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
              }}
            >
              {b.text}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

function StatsBox() {
  const tripsCities = [
    "Varanasi","Prayagraj","Ujjain","Haridwar","Ayodhya","Lucknow","Kanpur","Mirzapur","Gorakhpur","Jhansi",
    "Allahabad","Mahoba","Amethi","Bhadohi","Sant Kabir Nagar","Gonda","Raebareli","Faizabad","Sultanpur","Banda",
    "Sitapur","Basti","Azamgarh","Ballia","Deoria","Shahjahanpur","Farrukhabad","Mainpuri","Agra","Aligarh",
    "Moradabad","Bareilly","Hapur","Ghaziabad","Noida","Ghazipur","Muzaffarnagar","Saharanpur","Meerut","Mathura",
    "Etawah","Chitrakoot","Sambhal","Rampur","Bareilly","Orai","Bijnor","Bulandshahr","Nadia","RaeBareli","Pilibhit","Uttarpara"
  ].slice(0, 50);

  const driverNames = [
    "Sanjay","Ravi","Arun","Manish","Vijay","Ankit","Deepak","Amit","Pooja","Kavita",
    "Neeraj","Ritu","Sunita","Rohit","Meera","Kiran","Vandana","Gaurav","Nitin","Suresh",
  ].slice(0, 50);

  const [hoverTrips, setHoverTrips] = useState(false);
  const [hoverDrivers, setHoverDrivers] = useState(false);
  const [steamTokens, setSteamTokens] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const gen = () => {
      setSteamTokens((prev) => {
        const next = prev.filter(Boolean);
        while (next.length < 8) {
          next.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            left: Math.round(Math.random() * 80) + 10,
            size: Math.round(12 + Math.random() * 28),
            delay: Math.random() * 1.5,
            duration: 3 + Math.random() * 4,
            hue: Math.round(20 + Math.random() * 200),
          });
        }
        return next;
      });
      if (!mounted) return;
      setTimeout(gen, 2200 + Math.random() * 1600);
    };
    gen();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        {steamTokens.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30, scale: 0.6 }}
            animate={{ opacity: [0, 0.6, 0], y: -120, scale: 1.1 }}
            transition={{ delay: s.delay, duration: s.duration, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: `${s.left}%`,
              bottom: 12,
              width: s.size * 1.6,
              height: s.size * 1.6,
              borderRadius: 9999,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(255,255,255,0.02))`,
              transform: "translateX(-50%)",
              filter: "blur(6px)",
              boxShadow: "inset 0 -6px 18px rgba(0,0,0,0.08)",
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-10 items-center relative z-10">
        <div
          className="relative rounded-xl p-6 shadow-lg bg-white/10 backdrop-blur-sm cursor-default overflow-visible"
          onMouseEnter={() => { setHoverTrips(true); }}
          onMouseLeave={() => { setHoverTrips(false); }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">10,000+</p>
          <p className="text-sm text-white/90">Trips Completed</p>
          <HoverBloom trigger={hoverTrips} items={tripsCities} maxBubbles={10} />
        </div>

        <div
          className="relative rounded-xl p-6 shadow-lg bg-white/10 backdrop-blur-sm cursor-default overflow-visible"
          onMouseEnter={() => { setHoverDrivers(true); }}
          onMouseLeave={() => { setHoverDrivers(false); }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
          <p className="text-sm text-white/90">Verified Drivers</p>
          <HoverBloom trigger={hoverDrivers} items={driverNames} maxBubbles={10} />
        </div>

        <Link
          href="/reviews"
          className="rounded-xl p-6 shadow-lg bg-white/10 backdrop-blur-sm hover:scale-105 transition-transform"
        >
          <p className="text-2xl sm:text-3xl font-bold text-amber-400">4.8 ★</p>
          <p className="text-sm text-white/90">Average Rating</p>
          <span className="text-xs text-white/80 mt-1">(Read reviews)</span>
        </Link>
      </div>
    </div>
  );
}

/* -------------------- Dynamic import of external form component -------------------- */
const BookByKmForm = dynamic(() => import("./components/BookByKmForm"), { ssr: false });

/* -------------------- Main Page (full) -------------------- */
export default function HomePage() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const plannerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="min-h-screen font-sans">
      {/* ===== HERO ===== */}
      <section
        className="relative w-full text-white"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/kashi.webp')`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              {/* Keyword-rich H1 for on-page SEO */}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
                Car Rental Varanasi — Self Drive & Chauffeur Driven Car Booking
              </h1>

              <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl">
                BookYourTravell offers trusted car rental in Varanasi: self-drive cars, chauffeur-driven taxis, airport transfers and local travel services.
                Fast quotes, verified drivers, and easy online car booking — ideal for travellers searching “car rental near me” or “self drive car in Varanasi”.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#top-trip-planner"
                  className="inline-flex items-center gap-3 bg-amber-600/90 hover:bg-amber-700/90 text-white px-5 py-3 rounded-lg font-semibold shadow"
                >
                  + Book Now
                </a>

                <a
                  href="#popular-services"
                  className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition"
                >
                  Explore Packages
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white/10 rounded-2xl p-5 text-white shadow-lg backdrop-blur-sm">
                <div className="text-sm text-white/80 mb-1">Trusted by travellers</div>
                <div className="text-lg font-semibold">Local guides • Verified Drivers</div>
                <div className="mt-2 text-xs text-white/70">Temple trips, airport transfers & customised routes</div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <StatsBox />
          </div>
        </div>
      </section>

      {/* TOP TRIP PLANNER */}
      <section id="top-trip-planner" className="py-8 px-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
        <div className="max-w-6xl mx-auto relative">
          <div className="rounded-3xl p-6 shadow-2xl bg-gradient-to-r from-yellow-50 to-amber-50 border transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1" title="Planner (hover to highlight)">
            <div className="mb-2">
              <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">Per-Km Booking • Nationwide</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="md:flex-1">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">Varanasi Trip Planner — Best Quotes & Curated Routes</h2>
                <p className="text-sm md:text-lg text-gray-700 mb-2 max-w-2xl">
                  Our Flagship Service — Personalised Itinerary, Verified Drivers, Temple Darshan Support, And The Best While-You-Are-In-Kashi Prices.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="inline-block px-4 py-2 bg-white border border-amber-200 rounded-lg font-semibold text-amber-800 shadow-sm">
                  Starting Price - Rs. 11/Km* (Contact for quote)
                </div>

                <div className="flex flex-col items-start">
                  <button onClick={() => { setPlannerOpen((s) => !s); setTimeout(() => { plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 200); }} className="inline-block bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-amber-700 transform transition-transform duration-150 hover:scale-105">
                    Book Now
                  </button>
                  <div className="text-xs text-gray-600 mt-2">Book From Varanasi To Anywhere In India</div>
                </div>
              </div>
            </div>

            <div ref={plannerRef} className={`mt-6 overflow-hidden transition-[max-height] duration-700 ease-in-out ${plannerOpen ? "max-h-[1400px]" : "max-h-0"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border">
                    {/* replaced inline form with external client component */}
                    <BookByKmForm />
                  </div>
                </div>

                <aside className="w-full">
                  <div className="border rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">Why Book With Us</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Verified Drivers And Reliable Cars</li>
                      <li>• Transparent Pricing</li>
                      <li>• Local Guides & Temple Darshan Support</li>
                      <li>• Easy Refunds And 24/7 Support</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-600">Special Offer</div>
                    <div className="font-semibold mt-2">10% Off On 2+ Stops</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Use Code: <span className="font-mono">KASHI10</span>
                    </div>
                  </div>

                  <a href="/contact" className="block text-center bg-sky-600 text-white py-2 rounded">Contact Us</a>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section id="popular-services" className="py-12 bg-white relative overflow-hidden">
        <BackgroundWatermark images={["/images/bw1.webp", "/images/bw2.webp", "/images/bw3.webp", "/images/bw4.webp"]} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Popular Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((p) => (
              <Link key={p.title} href={p.href} className="group block rounded-lg border overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-2xl bg-white/95" aria-label={`Open ${p.title} package`}>
                <div className="flex items-stretch h-full min-h-[180px]">
                  <div className="w-1/3 min-h-[140px] h-full bg-gray-100 overflow-hidden relative">
                    <ImageCarousel images={(p as any).images || []} />
                  </div>

                  <div className="w-2/3 p-4 flex flex-col justify-between relative transition-colors duration-500" style={{ background: "linear-gradient(135deg, rgba(255,250,242,0.96), rgba(246,232,210,0.9))", minHeight: 140 }}>
                    <div className="relative z-10">
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.desc}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between relative z-10">
                      <div className="text-sm text-gray-600">Starting</div>
                      <div className="text-sm text-blue-700 font-medium">{p.starting || "₹999"}</div>
                      <div className="text-sm text-blue-700 font-medium">View Details →</div>
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  .group:hover div.w-2\\/3 {
                    background: linear-gradient(135deg, rgba(255, 249, 230, 0.98), rgba(255, 230, 150, 0.95)) !important;
                  }
                `}</style>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-WIDTH black stripe under Popular Services (flush) */}
      <section className="w-full bg-black text-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Why Choose Us</h4>
            <ul className="text-sm space-y-1">
              <li>• Verified drivers & background-checked</li>
              <li>• Transparent pricing — no hidden charges</li>
              <li>• Local guides for temple visits</li>
              <li>• 24/7 support & quick refunds</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm space-y-1">
              <li><a href="/terms" className="underline">Terms & Conditions</a></li>
              <li><a href="/privacy" className="underline">Privacy Policy</a></li>
              <li><a href="/cancellation" className="underline">Cancellation & Refunds</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Contact & Support</h4>
            <div className="text-sm space-y-2">
              <div>WhatsApp: <button onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE.replace(/^\+/, "")}`, "_blank")} className="underline">{SUPPORT_PHONE}</button></div>
              <div>Call: <a href={`tel:${SUPPORT_PHONE}`} className="underline">{SUPPORT_PHONE}</a></div>
              <div>Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a></div>
              <div className="mt-2"><Link href="/contact" className="inline-block bg-amber-600 px-3 py-2 rounded text-white">Contact Page</Link></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-0">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500 bg-white">
          © {new Date().getFullYear()} BookYourTravell · Terms · Privacy
        </div>
      </footer>
    </main>
  );
}
