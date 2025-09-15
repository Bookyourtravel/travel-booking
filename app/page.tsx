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
    <main>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1920&auto=format')",
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
          </div>
        </div>
      </section>

      {/* ✅ Multi-stop Trip Planner */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <VaranasiTripSelector />
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.title}
                className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
              >
                <img
                  src={pkg.img}
                  alt={pkg.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{pkg.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{pkg.desc}</p>
                  <Link
                    href={pkg.href}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BookYourTravell · Terms · Privacy
        </div>
      </footer>
    </main>
  );
}
