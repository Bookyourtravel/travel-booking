"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------- Types -------------------- */
type CarOption = {
  id: string;
  label: string;
  rate: number; // ₹ per km
  capacity: number; // max passengers
};

/* -------------------- Data -------------------- */
const CAR_OPTIONS: CarOption[] = [
  { id: "amaze", label: "Honda Amaze", rate: 13, capacity: 4 },
  { id: "crysta", label: "Innova Crysta", rate: 19, capacity: 6 },
  { id: "swift", label: "Swift Dzire", rate: 12, capacity: 4 },
];

const PACKAGES = [
  {
    title: "Varanasi → Ayodhya Taxi",
    desc: "Reliable intercity taxi with fixed price and driver guide",
    images: ["/images/ayodhya1.jpg", "/images/ayodhya2.jpg", "/images/ayodhya3.jpg"],
    href: "/packages/ayodhya",
  },
  {
    title: "Local Darshan - Kashi Vishwanath",
    desc: "Temple darshan + guided walk + Ganga Aarti evening experience",
    images: ["/images/kashi1.jpg", "/images/kashi2.jpg", "/images/kashi3.jpg", "/images/kashi4.jpg"],
    href: "/packages/kashi-darshan",
  },
  {
    title: "Lucknow Airport Pickup/Drop",
    desc: "Comfortable sedan / Innova options with flight tracking",
    images: ["/images/airport.jpg"],
    href: "/packages/lucknow-airport",
  },
  {
    title: "Varanasi → Prayagraj (Sangam)",
    desc: "Day trip or overnight packages with hotel add-ons",
    images: ["/images/prayagraj1.jpg", "/images/prayagraj2.jpg", "/images/prayagraj3.jpg"],
    href: "/packages/prayagraj",
  },
  {
    title: "Evening Ganga Aarti Special",
    desc: "Front-row aarti experience with priest and photography",
    images: ["/images/arti1.jpg", "/images/arti2.jpg", "/images/arti3.jpg"],
    href: "/packages/ganga-aarti",
  },
  {
    title: "Self-Drive Cars (Varanasi)",
    desc: "Flexible self-drive hatchbacks & sedans — hourly or daily rentals with easy pickup/drop.",
    images: ["/images/selfdrive1.jpg", "/images/selfdrive2.jpg"],
    href: "/packages/self-drive",
  },
];

const HOMEPAGE_REVIEWS = [
  {
    name: "Anjali, Varanasi",
    rating: 5,
    text: "Sunrise boat ride + aarti package was magical. Driver punctual and very helpful with the temple timings.",
  },
  {
    name: "Rohit, Lucknow",
    rating: 5,
    text: "Transparent pricing and clean car. Good driver, helpful with local food recommendations too.",
  },
  {
    name: "Meera, Kanpur",
    rating: 4,
    text: "Mostly smooth ride; minor delay on pickup but support responded quickly. Overall satisfied.",
  },
];

/* -------------------- Helpers -------------------- */
function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/* ---------------- ImageCarousel (simple) ---------------- */
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

/* ---------------- Background watermark images ---------------- */
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

/* ---------------- BookByKmFormNoLocation (embedded) ---------------- */
function BookByKmFormNoLocation() {
  const [carId, setCarId] = useState<string>(CAR_OPTIONS[2].id); // default Swift
  const [passengers, setPassengers] = useState<number>(1);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");

  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const car = CAR_OPTIONS.find((c) => c.id === carId)!;
    if (passengers > car.capacity) {
      setNotice(`Selected car (${car.label}) supports up to ${car.capacity} passengers. Please choose a different car or reduce passengers.`);
    } else {
      setNotice(null);
    }
  }, [carId, passengers]);

  const selectedCar = CAR_OPTIONS.find((c) => c.id === carId)!;
  const calcFare = () => {
    if (!distanceKm) return null;
    const perKm = selectedCar.rate;
    const raw = distanceKm * perKm;
    return Math.round(raw);
  };

  const handleContinue = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passengers > selectedCar.capacity) {
      setNotice(`Selected car (${selectedCar.label}) supports up to ${selectedCar.capacity} passengers.`);
      return;
    }
    if (!distanceKm || distanceKm <= 0) {
      setNotice("Please enter an approximate distance in kilometres.");
      return;
    }
    // demo behaviour: show a confirm
    alert(`Proceeding: Car ${selectedCar.label}, distance ${distanceKm} km, fare ${formatINR(calcFare() || 0)}. (Demo)`);
  };

  const reset = () => {
    setCarId(CAR_OPTIONS[2].id);
    setPassengers(1);
    setDistanceKm(null);
    setTripType("oneway");
    setNotice(null);
  };

  return (
    <div className="rounded-xl border shadow-sm p-6 bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Book By Distance (Manual)</h3>
        <p className="text-sm text-gray-600">Enter estimated distance in kilometres — no location or maps needed.</p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Car</label>
          <select value={carId} onChange={(e) => setCarId(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
            {CAR_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} (₹{c.rate}/km) — Max {c.capacity}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Number Of Passengers</label>
          <input
            type="number"
            min={1}
            step={1}
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, Number(e.target.value || 1)))}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Approx Distance (km)</label>
          <input
            type="number"
            step="0.1"
            value={distanceKm ?? ""}
            onChange={(e) => setDistanceKm(e.target.value === "" ? null : Number(e.target.value))}
            placeholder="e.g. 100"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          <div className="text-xs text-gray-500 mt-1">Provide an approximate distance — useful when you want a quick quote without sharing locations.</div>
        </div>

        <div>
          <label className="block text-sm font-medium">Trip Type</label>
          <select value={tripType} onChange={(e) => setTripType(e.target.value as any)} className="mt-1 block w-full border rounded px-3 py-2">
            <option value="oneway">One-way</option>
            <option value="round">Round-trip</option>
          </select>
        </div>

        <div>
          <div className="p-3 rounded border bg-gray-50">
            <div className="text-sm text-gray-700">Selected Car: <strong>{selectedCar.label}</strong></div>
            <div className="text-sm text-gray-700">Rate: <strong>₹{selectedCar.rate}/km</strong></div>
            <div className="text-sm text-gray-700 mt-2">Estimated Fare: <strong>{distanceKm ? formatINR(calcFare() || 0) : "—"}</strong></div>
          </div>
        </div>

        {notice && (
          <div className="p-3 rounded border bg-red-50 text-red-700 text-sm">
            {notice}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className={`px-4 py-2 rounded text-white ${notice ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:opacity-95"}`} disabled={!!notice}>
            Continue To Book
          </button>
          <button type="button" className="px-4 py-2 rounded border" onClick={reset}>Reset</button>
        </div>

        <div className="text-xs text-gray-500">
          Note: Toll & parking charges will be borne by the customer. Night charges (After 9pm) may apply (₹350). Final price confirmed on checkout.
        </div>
      </form>
    </div>
  );
}

/* ---------------- HoverBloom component — steam/bubble effect ---------------- */
function HoverBloom({
  trigger,
  items,
  colorSeed,
  maxBubbles = 10,
}: {
  trigger: boolean;
  items: string[];
  colorSeed?: string;
  maxBubbles?: number;
}) {
  // create N bubbles with random properties derived from index & seed
  const bubbles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < Math.min(maxBubbles, items.length); i++) {
      const t = Math.random();
      arr.push({
        id: `${i}-${Math.round(Math.random() * 10000)}`,
        text: items[i],
        size: 36 + Math.round(Math.random() * 30),
        // horizontal offset range -120..120
        x: Math.round((Math.random() - 0.5) * 220),
        // starting vertical offset near center
        yStart: 10 + Math.round(Math.random() * 10),
        // upward distance
        yEnd: -120 - Math.round(Math.random() * 160),
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2.2,
        hue: Math.round(20 + Math.random() * 200), // for color variance
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

/* ---------------- StatsBox with hover => bloom + continuous steam micro-bubbles ---------------- */
function StatsBox() {
  // expanded lists — 50+ unique cities and 50+ unique drivers
  const tripsCities = [
    "Varanasi","Prayagraj","Ujjain","Haridwar","Ayodhya","Lucknow","Kanpur","Mirzapur","Gorakhpur","Jhansi",
    "Allahabad","Mahoba","Amethi","Bhadohi","Sant Kabir Nagar","Gonda","Raebareli","Faizabad","Sultanpur","Banda",
    "Sitapur","Basti","Azamgarh","Ballia","Deoria","Shahjahanpur","Farrukhabad","Mainpuri","Agra","Aligarh",
    "Moradabad","Bareilly","Hapur","Ghaziabad","Noida","Ghazipur","Muzaffarnagar","Saharanpur","Meerut","Mathura",
    "Etawah","Chitrakoot","Sambhal","Rampur","Bareilly","Orai","Bijnor","Bulandshahr","Nadia","RaeBareli","Pilibhit","Uttarpara"
  ].slice(0, 50); // ensure length

  const driverNames = [
    "Sanjay","Ravi","Arun","Manish","Vijay","Ankit","Deepak","Amit","Pooja","Kavita",
    "Neeraj","Ritu","Sunita","Rohit","Meera","Kiran","Vandana","Gaurav","Nitin","Suresh",
    "Pradeep","Alok","Sudeep","Harish","Sachin","Pankaj","Rakesh","Shyam","Kunal","Raghav",
    "Sandeep","Mohit","Akhilesh","Rajesh","Hemant","Devendra","Brijesh","Anurag","Yogesh","Tarun",
    "Prashant","Ashish","Bhupendra","Nilesh","Subhash","Jitendra","Lokesh","Dinesh","Saurabh","Milind"
  ].slice(0, 50);

  // hover state controls
  const [hoverTrips, setHoverTrips] = useState(false);
  const [hoverDrivers, setHoverDrivers] = useState(false);

  // continuous gentle rising micro-bubbles behind the boxes (steam)
  // We'll render small translucent bubbles with random x offsets that animate upward and disappear, repeating while not hovered.
  const [steamTokens, setSteamTokens] = useState<{ id: string; left: number; size: number; delay: number; duration: number; hue: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    const gen = () => {
      // keep a pool of ~8 tokens
      setSteamTokens((prev) => {
        const next = prev.filter(Boolean);
        while (next.length < 8) {
          next.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            left: Math.round(Math.random() * 80) + 10, // percent
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
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative">
      {/* steam micro-bubbles layer (positioned behind) */}
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
        {/* Trips Completed */}
        <div
          className="relative rounded-xl p-6 shadow-lg bg-white/10 backdrop-blur-sm cursor-default overflow-visible"
          onMouseEnter={() => { setHoverTrips(true); }}
          onMouseLeave={() => { setHoverTrips(false); }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">10,000+</p>
          <p className="text-sm text-white/90">Trips Completed</p>

          {/* Hover bloom */}
          <HoverBloom trigger={hoverTrips} items={tripsCities} colorSeed="amber" maxBubbles={10} />
        </div>

        {/* Verified Drivers */}
        <div
          className="relative rounded-xl p-6 shadow-lg bg-white/10 backdrop-blur-sm cursor-default overflow-visible"
          onMouseEnter={() => { setHoverDrivers(true); }}
          onMouseLeave={() => { setHoverDrivers(false); }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
          <p className="text-sm text-white/90">Verified Drivers</p>

          {/* Hover bloom */}
          <HoverBloom trigger={hoverDrivers} items={driverNames} colorSeed="sky" maxBubbles={10} />
        </div>

        {/* Rating */}
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

/* -------------------- Main Page -------------------- */
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
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/kashi.jpg')`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
                Experience Kashi — Sunrise Ganges, Timeless Stories
              </h1>

              <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl">
                Handpicked local experiences, honest fares and drivers who know the city.
                Book temple visits, day trips or multi-stop journeys — tailored to how you travel.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#top-trip-planner"
                  className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg font-semibold shadow"
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
            {/* REPLACED small stats area with StatsBox */}
            <StatsBox />
          </div>
        </div>
      </section>

      {/* TOP TRIP PLANNER */}
      <section id="top-trip-planner" className="py-8 px-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
        <div className="max-w-6xl mx-auto relative">
          <div
            className="rounded-3xl p-6 shadow-2xl bg-gradient-to-r from-yellow-50 to-amber-50 border transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1"
            title="Planner (hover to highlight)"
          >
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
                  Starting Price - @Rs11/Km
                </div>

                <div className="flex flex-col items-start">
                  <button
                    onClick={() => {
                      setPlannerOpen((s) => !s);
                      setTimeout(() => {
                        plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 200);
                    }}
                    className="inline-block bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-amber-700 transform transition-transform duration-150 hover:scale-105"
                  >
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
                    <BookByKmFormNoLocation />
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

                  <a href="/contact" className="block text-center bg-sky-600 text-white py-2 rounded">
                    Contact Us
                  </a>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section id="popular-services" className="py-12 bg-white relative overflow-hidden">
        <BackgroundWatermark images={["/images/bw1.jpg", "/images/bw2.jpg", "/images/bw3.jpg", "/images/bw4.jpg"]} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Popular Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group block rounded-lg border overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-2xl bg-white/95"
                aria-label={`Open ${p.title} package`}
              >
                <div className="flex items-stretch h-full">
                  <div className="w-1/3 min-h-[140px] h-full bg-gray-100 overflow-hidden relative">
                    <ImageCarousel images={(p as any).images || []} />
                  </div>

                  <div
                    className="w-2/3 p-4 flex flex-col justify-between relative transition-colors duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,250,242,0.96), rgba(246,232,210,0.9))",
                      minHeight: 140,
                    }}
                  >
                    <div className="relative z-10">
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.desc}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between relative z-10">
                      <span className="text-sm text-gray-600">Starting ₹999</span>
                      <span className="text-sm text-blue-700 font-medium">View Details →</span>
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  .group:hover div.w-2\\/3 {
                    background: linear-gradient(
                      135deg,
                      rgba(255, 249, 230, 0.98),
                      rgba(255, 230, 150, 0.95)
                    ) !important;
                  }
                `}</style>
              </Link>
            ))}
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
