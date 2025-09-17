"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";

/* -------------------- Types -------------------- */
type CarOption = {
  id: string;
  label: string;
  rate: number; // ₹ per km
  capacity: number; // max passengers
};

type PlaceResultLite = { address: string; lat: number; lng: number } | null;

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

/* -------------------- Helper -------------------- */
function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/* ---------------- ImageCarousel ---------------- */
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
            <img
              key={i}
              src={src}
              alt={`slide-${i}`}
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

/* ---------------- BackgroundWatermark ---------------- */
function BackgroundWatermark({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 22000); // slow fade
    return () => clearInterval(t);
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {images.map((src, i) => {
        const active = i === idx;
        return (
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

/* -------------------- BookByKmForm -------------------- */
function BookByKmForm() {
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const [pickup, setPickup] = useState<PlaceResultLite>(null);
  const [drop, setDrop] = useState<PlaceResultLite>(null);

  const pickupRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLInputElement | null>(null);

  const [carId, setCarId] = useState<string>(CAR_OPTIONS[2].id); // default Swift
  const [passengers, setPassengers] = useState<number>(1);
  const [distanceKm, setDistanceKm] = useState<number | null>(null); // calculated
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");

  const [notice, setNotice] = useState<string | null>(null);
  const [loadingCalc, setLoadingCalc] = useState(false);

  useEffect(() => {
    const car = CAR_OPTIONS.find((c) => c.id === carId)!;
    if (passengers > car.capacity) {
      setNotice(`Selected car (${car.label}) supports up to ${car.capacity} passengers. Please choose a different car or reduce passengers.`);
    } else {
      setNotice(null);
    }
  }, [carId, passengers]);

  // init autocomplete AFTER Google maps script loaded
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = setInterval(() => {
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
        setMapsLoaded(true);
        clearInterval(check);
      }
    }, 400);
    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    if (!mapsLoaded) return;
    const g = (window as any).google;
    if (!g) return;
    const pickupEl = pickupRef.current;
    const dropEl = dropRef.current;
    if (!pickupEl || !dropEl) return;

    // restrict suggestions to India only (country: "IN")
    const pAC = new g.maps.places.Autocomplete(pickupEl, { types: ["geocode", "establishment"], componentRestrictions: { country: "IN" } });
    const dAC = new g.maps.places.Autocomplete(dropEl, { types: ["geocode", "establishment"], componentRestrictions: { country: "IN" } });

    pAC.addListener("place_changed", () => {
      const place = pAC.getPlace();
      if (!place.geometry) {
        setPickup({ address: place.name || pickupEl.value, lat: 0, lng: 0 });
        return;
      }
      setPickup({ address: place.formatted_address || place.name || pickupEl.value, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    });

    dAC.addListener("place_changed", () => {
      const place = dAC.getPlace();
      if (!place.geometry) {
        setDrop({ address: place.name || dropEl.value, lat: 0, lng: 0 });
        return;
      }
      setDrop({ address: place.formatted_address || place.name || dropEl.value, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    });

    return () => {};
  }, [mapsLoaded]);

  useEffect(() => {
    async function compute() {
      setDistanceKm(null);
      if (!mapsLoaded) return;
      if (!pickup || !drop) return;
      if (pickup.lat === 0 && drop.lat === 0) return;
      setLoadingCalc(true);
      const g = (window as any).google;
      if (!g) {
        setLoadingCalc(false);
        return;
      }
      const directionsService = new g.maps.DirectionsService();
      try {
        const resp = await new Promise<any>((resolve, reject) => {
          directionsService.route(
            {
              origin: { lat: pickup.lat, lng: pickup.lng },
              destination: { lat: drop.lat, lng: drop.lng },
              travelMode: g.maps.TravelMode.DRIVING,
            },
            (result: any, status: any) => {
              if (status === "OK") resolve(result);
              else reject(status);
            }
          );
        });

        let meters = 0;
        if (resp && resp.routes && resp.routes[0]) {
          const legs = resp.routes[0].legs || [];
          for (const leg of legs) {
            meters += leg.distance?.value || 0;
          }
        }
        const km = Math.round((meters / 1000) * 100) / 100;
        setDistanceKm(km);
      } catch (err) {
        console.error("Directions error", err);
        setDistanceKm(null);
      } finally {
        setLoadingCalc(false);
      }
    }
    compute();
  }, [pickup, drop, mapsLoaded]);

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
    if (!distanceKm) {
      setNotice("Distance not calculated. Please enter pickup & drop using map or enter Approx distance manually.");
      return;
    }
    alert(`Proceeding: Car ${selectedCar.label}, distance ${distanceKm} km, fare ${formatINR(calcFare() || 0)}. (Demo)`);
  };

  return (
    <div className="rounded-xl border shadow-sm p-6 bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Book By Distance (Estimate)</h3>
        <p className="text-sm text-gray-600">Select car, passengers, pickup & drop. Distance auto-calculates from Google Directions when you pick places.</p>
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
          <label className="block text-sm font medium">Pickup Location</label>
          <input ref={pickupRef} placeholder="Hotel / Railway Station / Address" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Drop Location</label>
          <input ref={dropRef} placeholder="Drop Address" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Approx Distance (km) — (Edit If Auto Not Available)</label>
          <input
            type="number"
            step="0.1"
            value={distanceKm ?? ""}
            onChange={(e) => setDistanceKm(e.target.value === "" ? null : Number(e.target.value))}
            placeholder="e.g. 100"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          <div className="text-xs text-gray-500 mt-1">Auto-calculated when both pickup & drop selected (If Maps Loaded). {loadingCalc ? "Calculating..." : ""}</div>
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
          <button type="button" className="px-4 py-2 rounded border" onClick={() => {
            setPickup(null); setDrop(null);
            if (pickupRef.current) pickupRef.current.value = "";
            if (dropRef.current) dropRef.current.value = "";
            setDistanceKm(null);
            setPassengers(1);
            setCarId(CAR_OPTIONS[2].id);
            setTripType("oneway");
            setNotice(null);
          }}>Reset</button>
        </div>

        <div className="text-xs text-gray-500">
          Note: Toll & parking charges will be borne by the customer. Night charges (After 9pm) may apply (₹350). Final price confirmed on checkout.
        </div>
      </form>
    </div>
  );
}

/* -------------------- Main Page -------------------- */
export default function HomePage() {
  const [mapsReady, setMapsReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = setInterval(() => {
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
        setMapsReady(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const [plannerOpen, setPlannerOpen] = useState(false);
  const plannerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="min-h-screen font-sans">
      <Script
        strategy="afterInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`}
      />

      {/* ===== HERO (upgraded — replaced only this block) ===== */}
      <section
        className="relative w-full"
        style={{
          minHeight: "72vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.45), rgba(8,8,8,0.45)), url('/images/kashi.jpg')`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* decorative overlay (no external css required) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
          background: "radial-gradient(1200px 600px at 10% 30%, rgba(0,0,0,0.45), transparent 20%), radial-gradient(1000px 500px at 90% 70%, rgba(0,0,0,0.35), transparent 20%)"
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold" style={{ fontFamily: "Merriweather, serif", textShadow: "0 6px 20px rgba(0,0,0,0.55)" }}>
            Discover Varanasi — Curated Journeys, Trusted Drivers
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            Handpicked local experiences, transparent per-km pricing and 24/7 support — for travellers who want the essence of Kashi with comfort and trust.
          </p>

          {/* small badges */}
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <span style={{ padding: "0.35rem .9rem", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, fontSize: ".875rem" }}>Per-Km Pricing</span>
            <span style={{ padding: "0.35rem .9rem", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, fontSize: ".875rem" }}>Verified Drivers</span>
            <span style={{ padding: "0.35rem .9rem", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, fontSize: ".875rem" }}>Instant Quotes</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#top-trip-planner"
              className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
              style={{ boxShadow: "0 10px 30px rgba(217,119,6,0.18)", transform: "translateY(0)", transition: "transform .35s cubic-bezier(.2,.9,.3,1), box-shadow .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Book Now
            </a>

            <a
              href="#popular-services"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
            >
              Explore Packages
            </a>
          </div>

          {/* subtle stats */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)", borderRadius: 12, padding: 16 }}>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">10,000+</p>
              <p className="text-sm text-white/85">Trips Completed</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)", borderRadius: 12, padding: 16 }}>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">500+</p>
              <p className="text-sm text-white/85">Verified Drivers</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)", borderRadius: 12, padding: 16 }}>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">4.8 ★</p>
              <p className="text-sm text-white/85">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP TRIP PLANNER HEADER */}
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

              {/* --- Starting price pill + Book Now button inline --- */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="inline-block px-4 py-2 bg-white border border-amber-200 rounded-lg font-semibold text-amber-800 shadow-sm">
                  Starting Price - @Rs11/Km
                </div>

                <div className="flex flex-col items-start">
                  <button
                    onClick={() => window.open("/trip-planner", "_blank")}
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

                  <a href="/contact" className="block text-center bg-sky-600 text-white py-2 rounded">
                    Contact Us
                  </a>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES (with watermark) */}
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
