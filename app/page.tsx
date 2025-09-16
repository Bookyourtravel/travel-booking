"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";

/**
 * Full page.tsx — Hero + Popular services + Trip planner (Book-by-km)
 *
 * Notes:
 * - Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
 * - Places & Directions libraries loaded via Script tag below.
 * - If Google API not available, form still works with manual distance input.
 */

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
    img: "/images/ayodhya.jpg",
    href: "/packages/ayodhya",
  },
  { title: "Local Darshan - Kashi Vishwanath", desc: "Temple darshan + guided walk + Ganga Aarti evening experience", img: "/images/kashi.jpg", href: "/packages/kashi-darshan" },
  { title: "Lucknow Airport Pickup/Drop", desc: "Comfortable sedan / Innova options with flight tracking", img: "/images/lucknow.jpg", href: "/packages/lucknow-airport" },
  { title: "Varanasi → Prayagraj (Sangam)", desc: "Day trip or overnight packages with hotel add-ons", img: "/images/prayagraj.jpg", href: "/packages/prayagraj" },
  { title: "Evening Ganga Aarti Special", desc: "Front-row aarti experience with priest and photography", img: "/images/ganga.jpg", href: "/packages/ganga-aarti" },
];

/* -------------------- Helper -------------------- */
function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/* -------------------- BookByKmForm (inline component) -------------------- */
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

  // validation / capacity notification
  useEffect(() => {
    const car = CAR_OPTIONS.find((c) => c.id === carId)!;
    if (passengers > car.capacity) {
      setNotice(`Selected car (${car.label}) supports up to ${car.capacity} passengers. Please choose a different car or reduce passengers.`);
    } else {
      setNotice(null);
    }
  }, [carId, passengers]);

  // init autocomplete after maps loaded
  useEffect(() => {
    if (!mapsLoaded) return;
    const g = (window as any).google;
    if (!g) return;
    const pickupEl = pickupRef.current;
    const dropEl = dropRef.current;
    if (!pickupEl || !dropEl) return;

    const pAC = new g.maps.places.Autocomplete(pickupEl, { types: ["geocode", "establishment"], componentRestrictions: {} });
    const dAC = new g.maps.places.Autocomplete(dropEl, { types: ["geocode", "establishment"], componentRestrictions: {} });

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

    return () => {
      // no easy dispose for Google autocomplete; letting GC handle
    };
  }, [mapsLoaded]);

  // compute route distance whenever pickup+drop change (and maps available)
  useEffect(() => {
    async function compute() {
      setDistanceKm(null);
      if (!mapsLoaded) return;
      if (!pickup || !drop) return;
      if (pickup.lat === 0 && drop.lat === 0) return; // bad places
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

        // sum distance across legs (meters)
        let meters = 0;
        if (resp && resp.routes && resp.routes[0]) {
          const legs = resp.routes[0].legs || [];
          for (const leg of legs) {
            meters += leg.distance?.value || 0;
          }
        }
        const km = Math.round((meters / 1000) * 100) / 100; // 2 decimals
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

  // fare calculation
  const selectedCar = CAR_OPTIONS.find((c) => c.id === carId)!;
  const baseFare = 0; // can add base fare if needed
  const calcFare = () => {
    if (!distanceKm) return null;
    const perKm = selectedCar.rate;
    const raw = baseFare + distanceKm * perKm;
    // night charge: if pickup at night — handled on server ideally; here sample note
    return Math.round(raw);
  };

  // "Continue to Book" handler (demo)
  const handleContinue = (e?: React.FormEvent) => {
    e?.preventDefault();
    // validation
    if (passengers > selectedCar.capacity) {
      setNotice(`Selected car (${selectedCar.label}) supports up to ${selectedCar.capacity} passengers.`);
      return;
    }
    if (!distanceKm) {
      setNotice("Distance not calculated. Please enter pickup & drop using map or enter Approx distance manually.");
      return;
    }
    // Normally: go to checkout / confirm page
    alert(`Proceeding: Car ${selectedCar.label}, distance ${distanceKm} km, fare ${formatINR(calcFare() || 0)}. (Demo)`);
  };

  return (
    <div className="rounded-xl border shadow-sm p-6 bg-white">
      {/* Load maps script: handled at page-level; here we just set state if google available */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Book by Distance (Estimate)</h3>
        <p className="text-sm text-gray-600">Select car, passengers, pickup & drop. Distance auto-calculates from Google Directions when you pick places.</p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Car</label>
          <select value={carId} onChange={(e) => setCarId(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
            {CAR_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} (₹{c.rate}/km) — max {c.capacity}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Number of Passengers</label>
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
          <label className="block text-sm font-medium">Pickup Location</label>
          <input ref={pickupRef} placeholder="Hotel / Railway Station / Address" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Drop Location</label>
          <input ref={dropRef} placeholder="Drop address" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Approx Distance (km) — (edit if auto not available)</label>
          <input
            type="number"
            step="0.1"
            value={distanceKm ?? ""}
            onChange={(e) => setDistanceKm(e.target.value === "" ? null : Number(e.target.value))}
            placeholder="e.g. 100"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          <div className="text-xs text-gray-500 mt-1">Auto-calculated when both pickup & drop selected (if Maps loaded). {loadingCalc ? "Calculating..." : ""}</div>
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
            Continue to Book
          </button>
          <button type="button" className="px-4 py-2 rounded border" onClick={() => {
            // reset
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
          Note: Toll & parking charges will be borne by the customer. Night charges (after 9pm) may apply (₹350). Final price confirmed on checkout.
        </div>
      </form>
    </div>
  );
}

/* -------------------- Main Page -------------------- */
export default function HomePage() {
  // hero background: use a single image (royal look)
  const heroImage = "/images/kashi.jpg"; // change if your file is different

  // detect google maps loaded by Script tag
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

  return (
    <main className="min-h-screen font-sans">
      {/* Load Google Maps JS with Places & Directions */}
      <Script
        strategy="afterInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`}
        onLoad={() => {
          // nothing — page hook will detect
        }}
      />

      {/* HERO */}
      <section className="relative h-[72vh] overflow-hidden">
        <img src={heroImage} alt="Varanasi Kashi Vishwanath" className="absolute inset-0 w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 text-left text-white">
          <h1 className="font-serif text-5xl md:text-7xl leading-tight drop-shadow-lg" style={{ fontWeight: 700 }}>Discover Varanasi & Beyond</h1>
          <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl">
            Trusted cabs, pilgrimage packages, local tours and curated experiences — handpicked for Kashi travellers.
          </p>

          {/* quote / micro-motion */}
          <div className="mt-6 flex items-center gap-4">
            <a href="#services" className="bg-amber-400 text-slate-900 px-5 py-2 rounded-md font-medium shadow hover:opacity-95">Plan your trip</a>
            <Link href="/packages" className="border border-white/30 text-white px-4 py-2 rounded-md">Browse packages</Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/90">
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
            {PACKAGES.map((p) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-2">Varanasi Trip Planner</h2>
              <p className="text-gray-600 mb-6">Choose stops (order matters), get instant price estimate and book. Designed for Kashi travellers.</p>

              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                {/* Here we embed the BookByKmForm */}
                <BookByKmForm />
              </div>
            </div>

            <aside className="w-full">
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
