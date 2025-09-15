"use client";

import Link from "next/link";

export default function Home() {
  const packages = [
    {
      title: "Varanasi → Ayodhya Taxi",
      desc: "Reliable intercity taxi with fixed price and driver guide",
      img: "https://images.unsplash.com/photo-1501769214405-5e86c6b27f1b?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b3c0ff7b3d7a9e2a3b4a6d1a8f4a2f4",
      href: "/packages/ayodhya",
    },
    {
      title: "Local Darshan - Kashi Vishwanath",
      desc: "Temple darshan + guided walk + Ganga Aarti evening experience",
      img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=c3dcb6a9a8b4f5a9e7f4b2c1a6d3f2a5",
      href: "/packages/kashi-darshan",
    },
    {
      title: "Lucknow Airport Pickup/Drop",
      desc: "Comfortable sedan / Innova options with flight tracking",
      img: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=0a5c1b2f9d8a6b7c4f2d3e1b6a8c9d0e",
      href: "/packages/lucknow-airport",
    },
    {
      title: "Varanasi → Prayagraj (Sangam)",
      desc: "Day trip or overnight packages with hotel add-ons",
      img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=a9b0f6d3b2c4e5f6a7b8c9d0e1f2a3b4",
      href: "/packages/prayagraj",
    },
    {
      title: "Evening Ganga Aarti Special",
      desc: "Front-row aarti experience with priest and photography",
      img: "https://images.unsplash.com/photo-1509099836639-18ba0b30f5d6?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=5c2a6b8a9f0a1b2c3d4e5f6a7b8c9d0e",
      href: "/packages/ganga-aarti",
    },
    {
      title: "Airport + City Combo",
      desc: "Pickup from airport + half-day city tour package",
      img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=1f2e3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      href: "/packages/combo",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* NAV */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-serif tracking-tight inline-flex items-baseline gap-1">
              <span className="text-sky-700">BookYour</span>
              <span className="text-slate-700">Travell</span>
            </a>
          </Link>

          <nav className="space-x-4 hidden md:flex items-center" aria-label="Main navigation">
            <Link href="/packages" legacyBehavior>
              <a className="text-sm hover:text-sky-600">Packages</a>
            </Link>

            <Link href="/cars" legacyBehavior>
              <a className="text-sm hover:text-sky-600">Cars</a>
            </Link>

            <Link href="/contact" legacyBehavior>
              <a className="text-sm hover:text-sky-600">Contact</a>
            </Link>

            <button className="ml-4 px-4 py-1.5 bg-sky-600 text-white rounded-md text-sm">Login</button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div
          className="h-[48vh] md:h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8e9a5b1b6a4e0f2c7f4c8d607e1e9e2b')",
          }}
        >
          <div className="w-full h-full bg-black/30 flex items-center">
            <div className="max-w-6xl mx-auto px-6 text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">Discover Varanasi &amp; Beyond</h1>
              <p className="mt-3 text-sm md:text-lg opacity-90">Trusted cabs, pilgrimage packages and local tours — curated for Kashi travellers.</p>

              {/* Search / Booking bar (prevent default submit while we wire search later) */}
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 bg-white rounded-xl shadow-lg inline-grid grid-cols-1 md:grid-cols-4 gap-3 p-4 items-center text-sm text-slate-700 w-full md:w-[880px] mx-auto">
                <div>
                  <label className="text-xs text-slate-500">Pickup city</label>
                  <input defaultValue="Varanasi" className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Destination</label>
                  <select className="mt-1 w-full border rounded-md px-3 py-2">
                    <option>Ayodhya</option>
                    <option>Prayagraj (Sangam)</option>
                    <option>Lucknow Airport</option>
                    <option>Local Darshan - Kashi Vishwanath</option>
                    <option>Evening Ganga Aarti special</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500">Date</label>
                  <input type="date" className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>

                <div className="md:ml-2">
                  <label className="text-xs text-transparent">button</label>
                  <button type="submit" className="mt-1 w-full bg-sky-600 hover:bg-sky-700 transition text-white rounded-md px-4 py-2">Search</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold">Popular Services</h2>
        <p className="text-slate-500 mt-1">Handpicked for travellers starting from Varanasi</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((p) => (
            <article key={p.title} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 md:h-44 bg-cover bg-center" style={{ backgroundImage: `url(${p.img})` }} />
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Link href={p.href} legacyBehavior>
                    <a className="text-sm font-medium text-sky-600">View details →</a>
                  </Link>
                  <Link href={p.href} legacyBehavior>
                    <a className="bg-sky-600 text-white px-3 py-1.5 rounded-md text-sm">Book</a>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Why choose BookYourTravell?</h2>
            <p className="mt-2 text-slate-500">Local experts, transparent pricing and special Varanasi-focused experiences.</p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-sky-50 text-sky-700">✓</span>
                <div>
                  <div className="font-medium">Trusted local drivers</div>
                  <div className="text-sm text-slate-500">Verified profiles and background checked drivers.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-sky-50 text-sky-700">💳</span>
                <div>
                  <div className="font-medium">Easy online payments</div>
                  <div className="text-sm text-slate-500">Razorpay integration ready for instant confirmation.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-sky-50 text-sky-700">⏰</span>
                <div>
                  <div className="font-medium">24/7 support</div>
                  <div className="text-sm text-slate-500">Phone + chat support for urgent travel needs.</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1526481280698-3bfa7568a3f3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b8f3e6a5b7c4d2e1f6a8b9c0d2e3f4" alt="Varanasi boat" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-serif">BookYourTravell</div>
            <p className="mt-2 text-sm text-slate-400">Varanasi-based trusted travel services — cabs, tours and pilgrimage packages.</p>
          </div>

          <div>
            <h4 className="font-medium">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/packages" legacyBehavior>
                  <a>Packages</a>
                </Link>
              </li>
              <li>
                <Link href="/cars" legacyBehavior>
                  <a>Cars</a>
                </Link>
              </li>
              <li>
                <Link href="/contact" legacyBehavior>
                  <a>Contact</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Contact</h4>
            <p className="mt-3 text-sm text-slate-400">support@bookyourtravell.com</p>
            <p className="mt-1 text-sm text-slate-400">+91 90000 00000</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-4">
          <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-slate-500 flex justify-between">
            <div>© {new Date().getFullYear()} BookYourTravell</div>
            <div>Terms · Privacy</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
