"use client";
// app/reviews/page.tsx
import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";

type Review = {
  id: number;
  name: string;
  city: string;
  rating: number;
  title: string;
  text: string;
  date: string;
};

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReviews(count = 150): Review[] {
  const names = ["Anjali", "Rohit", "Meera", "Sanjay", "Priya", "Amit", "Sunita", "Vikas", "Pooja", "Rahul", "Deepa", "Neeraj", "Kavita", "Arun", "Sneha", "Vandana", "Manish", "Gaurav", "Ritu", "Kiran"];
  const cities = ["Varanasi", "Lucknow", "Kanpur", "Ayodhya", "Prayagraj", "Mirzapur", "Bhadohi", "Patna", "Gorakhpur", "Jhansi"];
  const titles = [
    "Perfect Ganga Aarti trip",
    "Good value for money",
    "Reliable intercity taxi",
    "Great driver & timings",
    "Temple darshan made easy",
    "Comfortable airport pickup",
    "Guide helped with local food",
    "Minor delay but good service",
    "Driver was very knowledgeable",
    "Overall excellent experience",
  ];
  const texts = [
    "Driver reached on time, car was clean and AC worked well. Our Ganga Aarti experience was wonderful. Highly recommended for a stress-free trip.",
    "Transparent pricing and no hidden charges. Driver gave helpful local tips and recommended good food stops.",
    "Good communication, on-time pickup and smooth drive to Ayodhya. Driver knew the route and temple timings well.",
    "Pickup was slightly delayed but support fixed it quickly. Driver was friendly and professional. Still worth the booking.",
    "Perfect for families — comfortable car, helpful driver and smooth routing for multiple stops.",
    "Booked for airport pickup — driver tracked flight and was waiting at arrival. Smooth luggage handling and polite driver.",
    "We did a one-day trip to Prayagraj. Nice car, reasonable rate and driver was respectful to elders in our group.",
    "Booking flow was simple; final billing matched estimate. Add-on temple support was useful for darshan timings.",
    "Driver acted like a local guide — suggested food stalls and side attractions we would've missed otherwise.",
    "Good experience overall. A couple of small hiccups but support team resolved them promptly.",
  ];

  const reviews: Review[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const name = randomFrom(names);
    const city = randomFrom(cities);
    const rating = Math.random() < 0.85 ? (4 + Math.round(Math.random())) : (2 + Math.round(Math.random() * 1)); // mostly 4-5, some 2-3
    const title = randomFrom(titles);
    const text = randomFrom(texts);
    const daysAgo = Math.floor(Math.random() * 400); // within ~1 year
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const date = d.toLocaleDateString("en-GB");
    reviews.push({
      id: i + 1,
      name: `${name}`,
      city,
      rating,
      title,
      text,
      date,
    });
  }
  return reviews;
}

export default function ReviewsPage() {
  const all = useMemo(() => generateReviews(180), []);
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(1);
  const [page, setPage] = useState(1);
  const perPage = 30;

  const filtered = all.filter((r) => {
    const q = search.trim().toLowerCase();
    if (r.rating < minRating) return false;
    if (!q) return true;
    return `${r.name} ${r.city} ${r.title} ${r.text}`.toLowerCase().includes(q);
  });

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Head>
        <title>150+ Traveller Reviews — BookYourTravell (Varanasi trips & taxis)</title>
        <meta
          name="description"
          content="Read 150+ traveller reviews for BookYourTravell — Varanasi taxi, temple darshan, Ayodhya trips, airport pickups. Honest user experiences and ratings to help you choose."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Traveller Reviews — BookYourTravell</h1>
            <p className="text-sm text-gray-600">
              Realistic sample reviews for rides, temple packages and airport pickups. Use filters to find relevant feedback — location, ratings or keywords.
            </p>
          </header>

          <section className="mb-6 bg-white p-4 rounded shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search reviews: 'Ayodhya', 'airport', 'Ganga', 'delay'..."
                className="flex-1 border px-3 py-2 rounded"
              />
              <select value={minRating} onChange={(e) => { setMinRating(Number(e.target.value)); setPage(1); }} className="border rounded px-3 py-2">
                <option value={1}>All ratings</option>
                <option value={3}>3 ★ & up</option>
                <option value={4}>4 ★ & up</option>
                <option value={5}>5 ★ only</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing <strong>{filtered.length}</strong> reviews • Page {page}/{pages}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pageItems.map((r) => (
              <article key={r.id} className="bg-white p-4 rounded shadow-sm border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{r.name} · <span className="text-gray-500 text-xs">{r.city}</span></div>
                    <div className="text-xs text-gray-500 mt-1">{r.date}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-amber-500 font-semibold">{Array(r.rating).fill("★").join("")}</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                </div>

                <h4 className="mt-3 font-medium">{r.title}</h4>
                <p className="text-sm text-gray-700 mt-2">{r.text}</p>
              </article>
            ))}
          </section>

          {/* pagination */}
          <nav className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 rounded border disabled:opacity-50"
              disabled={page === 1}
            >
              Prev
            </button>

            {Array.from({ length: pages }).map((_, i) => {
              const p = i + 1;
              if (p > 6 && p < pages - 2 && Math.abs(p - page) > 3) {
                // condense large page sets
                if (p === Math.ceil(page / 5) * 5) {
                  return <span key={p} className="px-2">...</span>;
                }
                return null;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded ${p === page ? "bg-amber-600 text-white" : "border"}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-2 rounded border disabled:opacity-50"
              disabled={page === pages}
            >
              Next
            </button>
          </nav>

          <div className="mt-8 text-center text-sm text-gray-500">
            Note: These reviews are sample/demo content for the reviews page UI. Replace with real customer reviews pulled from your backend (or a reviews moderation workflow) before going fully live.
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-amber-600 underline">Back to homepage</Link>
          </div>
        </div>
      </main>
    </>
  );
}
