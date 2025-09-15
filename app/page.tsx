"use client";

import VaranasiTripSelector from "./components/VaranasiTripSelector.jsx";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroVideos = [
    "/videos/ganga.mp4",
    "/videos/sarnath.mp4",
    "/videos/varanasi-spots.mp4",
  ];
  // auto rotate hero video every 8s (soft)
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroVideos.length), 8000);
    return () => clearInterval(t);
  }, []);

  const packages = [
    { title: "Varanasi → Ayodhya Taxi", desc: "Reliable intercity taxi with fixed price and driver guide", img: "/images/ayodhya.jpg", href: "/packages/ayodhya" },
    { title: "Local Darshan - Kashi Vishwanath", desc: "Temple darshan + guided walk + Ganga Aarti evening experience", img: "/images/kashi.jpg", href: "/packages/kashi-darshan" },
    { title: "Lucknow Airport Pickup/Drop", desc: "Comfortable sedan / Innova options with flight tracking", img: "/images/lucknow.jpg", href: "/packages/lucknow-airport" },
    { title: "Varanasi → Prayagraj (Sangam)", desc: "Day trip or overnight packages with hotel add-ons", img: "/images/prayagraj.jpg", href: "/packages/prayagraj" },
    { title: "Evening Ganga Aarti Special", desc: "Front-row aarti experience with priest and photography", img: "/images/ganga.jpg", href: "/packages/ganga-aarti" },
  ];

  return (
    <main className="min-h-screen font-sans">
      {/* HERO with video carousel */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <video key={heroIndex} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline loop>
          <source src={heroVideos[heroIndex]} type="video/mp4" />
          {/* fallback image if video missing */}
          <img src="/images/hero-fallback.jpg" alt="Varanasi" />
        </video>

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">Discover Varanasi & Beyond</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">Trusted cabs, pilgrimage packages, local tours and curated experiences — handpicked for Kashi travellers.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="#services" className="bg-amber-400 text-slate-900 px-5 py-2 rounded-md font-medium shadow hover:opacity-95">Plan your trip</a>
            <Link href="/packages" className="border border-white/30 text-white px-4 py-2 rounded-md">Browse packages</Link>
          </div>
          {/* small attractions strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/90">
            <div className="bg-black/30 px-3 py-2 rounded">Ganga Aarti Experience</div>
            <div className="bg-black/30 px-3 py-2 rounded">Sarnath Heritage Walk</div>
            <div className="bg-black/30 px-3 py-2 rounded">Pilgrimage Packages</div>
            <div className="bg-black/30 px-3 py-2 rounded">Custom Cab Tours</div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((p) => (
              <div key={p.title} className="rounded-xl overflow-hidden border hover:shadow-lg transition bg-white">
                <div className="h-44 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{p.desc}</p>
                  <div className="flex items-center justify-between mt-4">
                    <Link href={p.href} className="bg-blue-600 text-white px-3 py-2 rounded">Book</Link>
                    <div className="text-sm text-gray-500">Starting ₹999</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Trip Planner */}
      <section id="services" className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Varanasi Trip Planner</h2>
              <p className="text-gray-600 mb-6">Choose stops (order matters), get instant price estimate and book. Designed for Kashi travellers.</p>

              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <VaranasiTripSelector />
              </div>
            </div>

            <aside className="w-72 hidden lg:block">
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">Why book with us</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Verified drivers and reliable cars</li>
                  <li>• Transparent pricing</li>
                  <li>• Local guides & temple darshan support</li>
                  <li>• Easy refunds and 24/7 support</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600">Special offer</div>
                <div className="font-semibold mt-2">10% off on 2+ stops</div>
                <div className="text-sm text-gray-600 mt-1">Use code: <span className="font-mono">KASHI10</span></div>
              </div>

              <a href="/contact" className="block text-center bg-sky-600 text-white py-2 rounded">Contact us</a>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BookYourTravell · Terms · Privacy
        </div>
      </footer>
    </main>
  );
}
