// app/packages/[slug]/page.tsx
import React from "react";
import Link from "next/link";
import { SUPPORT_PHONE, SUPPORT_EMAIL } from "@/lib/constants";

/**
 * Simple content map for package detail pages.
 * Add / edit content here for each slug (keep keys lowercase and URL-friendly).
 */
const PACKAGES_DETAILS: Record<string, any> = {
  ayodhya: {
    title: "Varanasi → Ayodhya Taxi",
    subtitle: "Ayodhya — Ramayan era history and temple visits",
    heroImage: "/images/ayodhya1.jpg",
    starting: "₹1,850 (4 pax)",
    history:
      "Ayodhya is an ancient city tied to the Ramayana era. Its temples, ghats and historic sites hold deep religious significance.",
    attractions: [
      "Ram Janmabhoomi Complex",
      "Hanuman Garhi",
      "Kanak Bhawan",
      "Local temples and heritage walks",
    ],
    itinerary: [
      "Day 1: Depart Varanasi, short stops en route, reach Ayodhya for temple darshan.",
      "Day 2: Local sightseeing – Ram Janmabhoomi, Hanuman Garhi and local markets.",
    ],
    tips: [
      "Check temple timings beforehand.",
      "Wear comfortable footwear and carry light luggage.",
      "Ask if you need a local guide — we can arrange one.",
    ],
  },

  "kashi-darshan": {
    title: "Local Darshan - Kashi Vishwanath",
    subtitle: "Kashi Vishwanath and Ganga Aarti experience",
    heroImage: "/images/kashi1.jpg",
    starting: "₹3,800 (4 pax)",
    history:
      "Kashi Vishwanath is the heart of Kashi. Experiencing the aarti and the ghats is uniquely spiritual.",
    attractions: [
      "Kashi Vishwanath Mandir",
      "Dashashwamedh Ghat (Ganga Aarti)",
      "Assi & Manikarnika Ghat walk",
      "Local food specialties",
    ],
    itinerary: [
      "Morning: Sunrise boat ride on Ganga + visit Assi/Manikarnika.",
      "Evening: Front-row Ganga Aarti booking and darshan.",
    ],
    tips: [
      "Aarti gets crowded — ask about priority passes if you want front seats.",
      "Respect dress codes and photo rules inside some temples.",
    ],
  },

  "lucknow-airport": {
    title: "Airport Pickup/Drop",
    subtitle: "Punctual airport transfers with flight tracking",
    heroImage: "/images/airport.jpg",
    starting: "₹699 (Pickup)",
    history:
      "Airport transfers are ideal for intercity travelers — we track flight arrival and adjust pickup.",
    attractions: [
      "Timely pickup/drop with flight tracking",
      "Meet & greet on arrival",
      "Optional short city drop or sightseeing on request",
    ],
    itinerary: [
      "Pickup: Driver tracks your flight and adjusts wait time accordingly.",
      "Drop: Timely transfer to airport for departure.",
    ],
    tips: [
      "Share flight number and arrival time in booking notes.",
      "If you have extra luggage, mention it so we assign the right vehicle.",
    ],
  },

  prayagraj: {
    title: "Varanasi → Prayagraj (Sangam)",
    subtitle: "Triveni Sangam pilgrimage and heritage spots",
    heroImage: "/images/prayagraj1.jpg",
    starting: "₹2,900 (4 pax)",
    history:
      "Prayagraj (Allahabad) is famous for the Triveni Sangam – the confluence of Ganga, Yamuna and mythical Saraswati. Kumbh and other events are held here.",
    attractions: [
      "Triveni Sangam",
      "Boat ride at Sangam",
      "Anand Bhavan (heritage)",
      "Local temples & ghats",
    ],
    itinerary: [
      "Day trip: Sunrise Sangam visit + local sightseeing.",
      "Overnight option with hotels available on request.",
    ],
    tips: ["During peak season, book boat tickets in advance."],
  },

  "ganga-aarti": {
    title: "Evening Ganga Aarti Special",
    subtitle: "Front-row aarti experience with priest & photography",
    heroImage: "/images/arti1.jpg",
    starting: "₹1,599 (per person)",
    history:
      "Ganga Aarti is a daily spiritual ceremony at the ghats; front-row seats offer a memorable experience.",
    attractions: [
      "Front-row Aarti seats",
      "Priest assistance for rituals",
      "Photography and quick guided explanation",
    ],
    itinerary: ["Evening aarti package with pickup, front-row seating and photos."],
    tips: ["Aarti timings change seasonally — we confirm before booking."],
  },

  "self-drive": {
    title: "Self-Drive Cars (Varanasi)",
    subtitle: "Self-drive rentals – hourly & daily",
    heroImage: "/images/selfdrive1.jpg",
    starting: "₹1,850 / day",
    history:
      "Self-drive gives flexibility — local pickup/drop and documentation help provided.",
    attractions: ["Hatchback/sedan options", "Hourly/daily packages", "Easy pickup/drop"],
    itinerary: ["Day rental: Explore Varanasi at your own pace — pickup/drop included."],
    tips: ["Valid driving license and refundable deposit required for self-drive."],
  },
};

export async function generateStaticParams() {
  return Object.keys(PACKAGES_DETAILS).map((slug) => ({ slug }));
}

export default function PackagePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const pkg = PACKAGES_DETAILS[slug];

  if (!pkg) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Package not found</h2>
          <p className="mt-2">
            Please go back to <Link href="/">home</Link>.
          </p>
        </div>
      </main>
    );
  }

  const waMessage = encodeURIComponent(
    `Hi, I want to book *${pkg.title}*.\nFrom: Varanasi\nTo: ${pkg.title}\nPassengers: 2 (example)\nPlease share price & availability.`
  );
  const waUrl = `https://wa.me/${SUPPORT_PHONE.replace(/^\+/, "")}?text=${waMessage}`;

  return (
    <main className="min-h-screen font-sans">
      <section
        className="relative py-20"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${pkg.heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          color: "white",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-black/30 p-6 rounded-lg inline-block">
            <h1 className="text-3xl md:text-4xl font-bold">{pkg.title}</h1>
            <p className="mt-2 text-sm md:text-base">{pkg.subtitle}</p>
            <div className="mt-4 flex gap-3">
              <a href={waUrl} target="_blank" rel="noreferrer" className="bg-emerald-500 text-white px-4 py-2 rounded">Book Now (WhatsApp)</a>
              <Link href="/packages"><a className="px-4 py-2 rounded border bg-white/10">All Packages</a></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700 mb-4">{pkg.history}</p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Top Attractions</h3>
            <ul className="list-disc list-inside text-gray-700">
              {pkg.attractions.map((a: string, i: number) => (
                <li key={i}>
                  {/* Link to internal anchor for each attraction — client can click and read details below */}
                  <a href={`#attraction-${i}`} className="underline hover:text-amber-700">{a}</a>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Suggested Itinerary</h3>
            <ol className="list-decimal list-inside text-gray-700">
              {pkg.itinerary.map((it: string, idx: number) => <li key={idx} className="mb-2">{it}</li>)}
            </ol>

            <h3 className="text-xl font-semibold mt-6 mb-2">Practical Tips</h3>
            <ul className="list-disc list-inside text-gray-700">
              {pkg.tips && pkg.tips.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>

            {/* Attraction details section — simple static expandable content */}
            <div className="mt-10 border-t pt-6">
              <h3 className="text-2xl font-semibold mb-4">Attraction Details</h3>
              {pkg.attractions.map((a: string, i: number) => (
                <article key={i} id={`attraction-${i}`} className="mb-6">
                  <h4 className="text-lg font-semibold">{a}</h4>
                  <div className="mt-2 text-gray-700">
                    {/* Placeholder detail — you can replace with longer content & images */}
                    <p>
                      Detailed history and significance of <strong>{a}</strong>. (Replace this paragraph with the
                      full historical background, visiting tips, rituals/etiquette, best times to visit and a short photo gallery.)
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <img src="/images/placeholder1.jpg" alt={`${a} photo 1`} className="w-full rounded" />
                      <img src="/images/placeholder2.jpg" alt={`${a} photo 2`} className="w-full rounded" />
                      <img src="/images/placeholder3.jpg" alt={`${a} photo 3`} className="w-full rounded" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="border rounded p-4 bg-gray-50">
            <div>
              <div className="text-sm text-gray-600">Starting Price</div>
              <div className="text-xl font-bold mt-1">{pkg.starting}</div>
            </div>

            <div className="mt-6">
              <a href={waUrl} target="_blank" rel="noreferrer" className="block w-full text-center bg-amber-600 text-white py-3 rounded">Book Now via WhatsApp</a>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div>Call: <a href={`tel:${SUPPORT_PHONE}`} className="underline">{SUPPORT_PHONE}</a></div>
              <div className="mt-2">Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a></div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
