"use client";

import VaranasiTripSelector from "./components/VaranasiTripSelector.jsx";
import Link from "next/link";

export default function Home() {
  const packages = [
    {
      title: "Varanasi → Ayodhya Taxi",
      desc: "Reliable intercity taxi with fixed price and driver guide",
      img: "https://images.unsplash.com/photo-1501769214405-5e86c6b27fb1?q=80&w=900&auto=format",
      href: "/packages/ayodhya",
    },
    {
      title: "Local Darshan - Kashi Vishwanath",
      desc: "Temple darshan + guided walk + Ganga Aarti evening experience",
      img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=900&auto=format",
      href: "/packages/kashi-darshan",
    },
    {
      title: "Lucknow Airport Pickup/Drop",
      desc: "Comfortable sedan / Innova options with flight tracking",
      img: "https://images.unsplash.com/photo-1543262567-b07e54538573?q=80&w=900&auto=format",
      href: "/packages/lucknow-airport",
    },
    {
      title: "Varanasi → Prayagraj (Sangam)",
      desc: "Day trip or overnight packages with hotel add-ons",
      img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=900&auto=format",
      href: "/packages/prayagraj",
    },
    {
      title: "Evening Ganga Aarti Special",
      desc: "Front-row aarti experience with priest and photography",
      img: "https://images.unsplash.com/photo-150999836639-18aba0e30f5d?q=80&w=900&auto=format",
      href: "/packages/ganga-aarti",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* ---------- Hero ---------- */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1920&auto=format&fit=crop')",
        }}
      >
        <div className="bg-black/40">
          <div className="max-w-6xl mx-auto px-6 py-28 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Varanasi & Beyond
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Trusted cabs, pilgrimage packages, hotels and local tours — curated
              for Kashi travellers.
            </p>
            {/* Optional CTA: anchor to services */}
            <a
              href="#services"
              className="inline-block bg-amber-400 text-slate-900 px-6 py-2 rounded-md font-medium shadow hover:opacity-95"
            >
              Plan your trip
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Popular Services (keeps visible) ---------- */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.title}
                className="rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={pkg.img}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{pkg.title}</h3>
                  <p className="text-sm text-gray-600 my-2">{pkg.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Link
                      href={pkg.href}
                      className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md"
                    >
                      Book
                    </Link>
                    <div className="text-xs text-gray-500">Starting ₹999</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services section (TRIP PLANNER IS HERE) ---------- */}
      <section id="services" className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Plan Your Trip</h2>
              <p className="text-gray-600 mt-1">
                Select destinations in order, get instant price estimate and
                book — all from Varanasi.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Pro tip: add stops in the exact order you want to travel.
            </div>
          </div>

          {/* Attractive card wrapper */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: planner (full-width on mobile) */}
              <div className="lg:col-span-2">
                <VaranasiTripSelector />
              </div>

              {/* Right: perks / features and CTA */}
              <aside className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Why book with us</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Trusted drivers & verified cabs</li>
                    <li>• Transparent pricing & instant estimate</li>
                    <li>• Local guide option available</li>
                    <li>• Easy cancellations & support</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg flex flex-col gap-3">
                  <div className="text-sm text-gray-600">Need help?</div>
                  <a
                    href="/contact"
                    className="block bg-sky-600 text-white text-center py-2 rounded-md"
                  >
                    Contact us
                  </a>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full border rounded-md py-2"
                  >
                    Back to top
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 border">
                  <div className="text-xs text-gray-600">Special offer</div>
                  <div className="font-semibold mt-1">10% off on 2+ stops</div>
                  <div className="text-sm text-gray-600 mt-2">Use code: KASHI10</div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BookYourTravell · Terms · Privacy
        </div>
      </footer>
    </main>
  );
}
