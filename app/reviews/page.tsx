"use client";
// app/reviews/page.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";

/* ---------------- Types ---------------- */
type Review = {
  id: number;
  name: string;
  city: string;
  rating: number;
  title: string;
  text: string;
  date: string; // ISO
  verified?: boolean;
  reply: string;
  helpfulYes: number;
  helpfulNo: number;
};

/* ---------------- Helpers ---------------- */
function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function formatRandomName(base: string) {
  const variants = [
    () => base,
    () => `${base} ${randomFrom(["Kumar", "Singh", "Verma", "Sharma", "Gupta", "Prasad"])}`,
    () => `${base.charAt(0)}. ${randomFrom(["Kumar", "N.", "Chube", "S."])}`,
    () => `${base} ${base.length > 3 ? base.charAt(base.length - 1) + "." : "S."}`,
  ];
  return randomFrom(variants)();
}
function avatarColor(seed: string) {
  const colors = ["#FDE68A", "#FED7AA", "#FBCFE8", "#C7F9CC", "#C7D2FE", "#FECACA", "#D1FAE5", "#FFF7ED"];
  const s = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[s % colors.length];
}

/* ---------------- Generate reviews (demo) ---------------- */
function generateReviews(count = 180): Review[] {
  const names = ["Anjali", "Rohit", "Meera", "Sanjay", "Priya", "Amit", "Sunita", "Vikas", "Pooja", "Rahul", "Deepa", "Neeraj", "Kavita", "Arun", "Sneha", "Vandana", "Manish", "Gaurav", "Ritu", "Kiran", "Nitin", "Rocy", "Vijay", "Kamal", "Ramesh", "Sonia", "Asha"];
  const cities = ["Varanasi", "Lucknow", "Kanpur", "Ayodhya", "Prayagraj", "Mirzapur", "Bhadohi", "Patna", "Gorakhpur", "Jhansi", "Meerut"];

  const texts1 = [
    "बहुत खराब अनुभव। Driver समय पर नहीं आया और गाड़ी गंदी थी।",
    "Worst experience — driver rude and charged extra money.",
    "Support से बात की, उन्होंने दूसरी गाड़ी भेजी पर बहुत देर लग गई, पूरा schedule बिगड़ गया।",
    "AC नहीं चला और refund भी slow था।",
  ];
  const texts2 = [
    "Service ठीक-ठाक थी but pickup almost 45 min late.",
    "Car average, driver polite but not very helpful. Replacement came after complaint.",
    "Got replacement car after calling support; समय बर्बाद हुआ मगर आगे ठीक रहा।",
    "Fare थोड़ा ज़्यादा लगा, journey could be more comfortable.",
  ];
  const texts3 = [
    "Overall ठीक-ठाक रहा — timing पर improvement चाहिए।",
    "Driver polite था, पर coordination थोड़ी weak लगी।",
    "Average experience — booking simple, पर कुछ hiccups थे।",
    "Decent for short trips; long routes में improvement चाहिए।",
  ];
  const texts4_5 = [
    "Excellent service — driver on time, clean car and pleasant journey.",
    "गाड़ी साफ़ थी और driver बहुत supportive था।",
    "Transparent pricing, smooth booking; driver acted like local guide.",
    "Airport pickup flawless — driver tracked flight & was on time.",
  ];
  const replies = [
    "धन्यवाद — हमने टीम को बताया है और pickup timing बेहतर कर दी है।",
    "Thanks for letting us know — we investigated and updated the process.",
    "Sorry for the inconvenience — we offered a partial refund and improved coordination.",
    "धन्यवाद आपके फीडबैक के लिए। हम आगे से और ध्यान रखेंगे।",
    "Thanks — driver briefed to be more punctual and polite.",
  ];
  const titles = [
    "Perfect Ganga Aarti trip",
    "Good value for money",
    "Reliable intercity taxi",
    "Great driver & timings",
    "Temple darshan made easy",
    "Comfortable airport pickup",
    "Minor delay but manageable",
    "Overall experience",
    "Could be better",
    "Not recommended",
  ];

  const reviews: Review[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const baseName = randomFrom(names);
    const name = formatRandomName(baseName);
    const city = randomFrom(cities);

    const rRand = Math.random();
    let rating: 1 | 2 | 3 | 4 | 5 = 5;
    if (rRand < 0.65) rating = 5;
    else if (rRand < 0.85) rating = 4;
    else if (rRand < 0.94) rating = 3;
    else if (rRand < 0.98) rating = 2;
    else rating = 1;

    let textPool = texts4_5;
    if (rating === 1) textPool = texts1;
    else if (rating === 2) textPool = texts2;
    else if (rating === 3) textPool = texts3;

    const title = randomFrom(titles);
    const text = randomFrom(textPool);
    const daysAgo = Math.floor(Math.random() * 420);
    const d = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    const helpfulYes = Math.floor(Math.random() * 8);
    const helpfulNo = Math.floor(Math.random() * 4);
    const reply = randomFrom(replies);
    const verified = Math.random() < 0.14;

    reviews.push({
      id: i + 1,
      name,
      city,
      rating,
      title,
      text,
      date: d.toISOString(),
      verified,
      reply,
      helpfulYes,
      helpfulNo,
    });
  }
  return reviews;
}

/* ---------------- Stars component ---------------- */
function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i < n ? "text-amber-400" : "text-gray-200"}`} fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="0.6">
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896 4.664 23.165l1.402-8.168L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function ReviewsPage() {
  const all = useMemo(() => generateReviews(180), []);
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);
  const perPage = 30;

  // votes map: reviewId -> 'yes' | 'no'
  const [votes, setVotes] = useState<Record<number, "yes" | "no" | undefined>>({});
  // display counts merged with votes
  const [displayCounts, setDisplayCounts] = useState<Record<number, { yes: number; no: number }>>({});
  // per-review inline toast state: reviewId -> message
  const [inlineToast, setInlineToast] = useState<Record<number, string>>({});

  // initialize votes & displayCounts from localStorage + seeds
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("reviews_votes") : null;
    let parsed: Record<number, "yes" | "no"> = {};
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }
    }
    setVotes(parsed);

    const initCounts: Record<number, { yes: number; no: number }> = {};
    for (const r of all) {
      const baseYes = r.helpfulYes || 0;
      const baseNo = r.helpfulNo || 0;
      const userVote = parsed[r.id];
      const yes = baseYes + (userVote === "yes" ? 1 : 0);
      const no = baseNo + (userVote === "no" ? 1 : 0);
      initCounts[r.id] = { yes, no };
    }
    setDisplayCounts(initCounts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // show inline toast near the review (English messages)
  const showInlineToast = useCallback((id: number, msg: string) => {
    setInlineToast((t) => ({ ...t, [id]: msg }));
    window.setTimeout(() => {
      setInlineToast((t) => {
        const copy = { ...t };
        delete copy[id];
        return copy;
      });
    }, 1500);
  }, []);

  // handleVote: single source of truth
  const handleVote = useCallback((id: number, choice: "yes" | "no") => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("reviews_votes") : null;
    let parsed: Record<number, "yes" | "no"> = {};
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }
    }

    const prev = parsed[id]; // undefined | "yes" | "no"
    const newParsed = { ...parsed };

    setDisplayCounts((prevCounts) => {
      const counts = { ...prevCounts };
      const cur = counts[id] || { yes: 0, no: 0 };

      if (prev === choice) {
        // remove vote
        delete newParsed[id];
        if (choice === "yes") cur.yes = Math.max(0, cur.yes - 1);
        else cur.no = Math.max(0, cur.no - 1);
        showInlineToast(id, "Your vote removed.");
      } else if (prev && prev !== choice) {
        // switch vote
        newParsed[id] = choice;
        if (choice === "yes") {
          cur.yes = cur.yes + 1;
          cur.no = Math.max(0, cur.no - 1);
        } else {
          cur.no = cur.no + 1;
          cur.yes = Math.max(0, cur.yes - 1);
        }
        showInlineToast(id, "Your choice updated.");
      } else {
        // new vote
        newParsed[id] = choice;
        if (choice === "yes") cur.yes = cur.yes + 1;
        else cur.no = cur.no + 1;
        showInlineToast(id, "Thanks — your vote was recorded.");
      }

      counts[id] = cur;
      // persist votes
      try {
        localStorage.setItem("reviews_votes", JSON.stringify(newParsed));
      } catch {
        // ignore
      }
      setVotes(newParsed);
      return counts;
    });
  }, [showInlineToast]);

  const filtered = all.filter((r) => {
    if (selectedRating !== "all" && r.rating !== selectedRating) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${r.name} ${r.city} ${r.title} ${r.text}`.toLowerCase().includes(q);
  });

  const sorted = filtered.slice().sort((a, b) => {
    if (sortOrder === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const pages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageItems = sorted.slice((page - 1) * perPage, page * perPage);

  useEffect(() => setPage(1), [search, selectedRating, sortOrder]);

  return (
    <>
      <Head>
        <title>Traveller Reviews — BookYourTravell</title>
        <meta name="description" content="Traveller reviews for BookYourTravell — Varanasi trips & taxis." />
      </Head>

      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Traveller Reviews — BookYourTravell</h1>
            <p className="text-sm text-gray-600 max-w-2xl">Use filters to find feedback — location, rating or keywords.</p>
          </header>

          {/* Controls */}
          <section className="mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border sticky top-6 z-20">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 flex items-center gap-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reviews: 'Ayodhya', 'airport', 'Ganga', 'delay'..."
                    className="flex-1 border px-3 py-2 rounded-lg"
                    aria-label="Search reviews"
                  />

                  <div className="flex gap-2 flex-wrap">
                    {(["all", 5, 4, 3, 2, 1] as (number | "all")[]).map((v) => (
                      <button
                        key={String(v)}
                        onClick={() => setSelectedRating(v)}
                        className={`px-3 py-1 rounded-full border ${selectedRating === v ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-700"}`}
                        aria-pressed={selectedRating === v}
                      >
                        {v === "all" ? "All ratings" : `${v} ★`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <div className="text-sm text-gray-600">Showing <strong>{filtered.length}</strong> reviews • Page {page}/{pages}</div>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="border rounded px-3 py-2" aria-label="Sort">
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews list */}
          <section className="grid grid-cols-1 gap-4">
            {pageItems.map((r) => {
              const counts = displayCounts[r.id] || { yes: r.helpfulYes, no: r.helpfulNo };
              const myVote = votes[r.id];
              return (
                <article key={r.id} className="group bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex gap-4 hover:shadow-lg transition-shadow duration-200 transform-gpu hover:-translate-y-1">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ring-1 ring-white/30" style={{ background: avatarColor(r.name), color: "#0f172a" }} aria-hidden>
                      {r.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="font-semibold text-sm">{r.name}</div>
                          <div className="text-gray-500 text-xs">· {r.city}</div>
                          <div className="ml-3 hidden sm:block"><Stars n={r.rating} /></div>
                          {r.verified && <span className="ml-3 px-2 py-0.5 bg-green-50 text-green-800 rounded-full text-xs">Verified</span>}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(r.date).toLocaleDateString()}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-amber-500">{r.rating} ★</div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                    </div>

                    <h4 className="mt-3 font-medium text-gray-800">{r.title}</h4>
                    <p className="text-sm text-gray-700 mt-2">{r.text}</p>

                    {/* BookYourTravell Support reply (every review) */}
                    <div className="mt-4 ml-16 pl-4 border-l-2 border-amber-100 bg-amber-50/30 rounded-md p-3">
                      <div className="text-sm font-semibold text-amber-700">BookYourTravell Support</div>
                      <div className="text-sm text-gray-700 italic mt-1">{r.reply}</div>
                    </div>

                    {/* helpful buttons + inline toast */}
                    <div className="mt-3 ml-16 flex items-center gap-3 text-sm text-gray-600 relative">
                      <div>Was this helpful?</div>

                      <button
                        onClick={() => handleVote(r.id, "yes")}
                        className={`px-2 py-1 rounded border text-sm ${myVote === "yes" ? "bg-amber-600 text-white border-amber-600" : "hover:bg-gray-100"}`}
                        aria-pressed={myVote === "yes"}
                      >
                        Yes ({counts.yes})
                      </button>

                      <button
                        onClick={() => handleVote(r.id, "no")}
                        className={`px-2 py-1 rounded border text-sm ${myVote === "no" ? "bg-amber-600 text-white border-amber-600" : "hover:bg-gray-100"}`}
                        aria-pressed={myVote === "no"}
                      >
                        No ({counts.no})
                      </button>

                      {/* Inline toast tooltip centered directly above the buttons */}
                      <div
                        className={`absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 transition-all duration-200 ${inlineToast[r.id] ? "opacity-100 -translate-y-0" : "opacity-0 translate-y-1"}`}
                        aria-hidden={!inlineToast[r.id]}
                      >
                        {inlineToast[r.id] ? (
                          <div className="px-3 py-1 rounded-lg bg-amber-600/85 text-white text-xs shadow backdrop-blur-sm">
                            {inlineToast[r.id]}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination */}
          <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded border disabled:opacity-50" disabled={page === 1}>Prev</button>

            {(() => {
              const pagesToShow: (number | -1)[] = [];
              const total = pages;
              const current = page;
              const windowSize = 3;
              const start = Math.max(1, current - windowSize);
              const end = Math.min(total, current + windowSize);
              if (start > 1) pagesToShow.push(1);
              if (start > 2) pagesToShow.push(-1);
              for (let p = start; p <= end; p++) pagesToShow.push(p);
              if (end < total - 1) pagesToShow.push(-1);
              if (end < total) pagesToShow.push(total);
              return pagesToShow.map((p, idx) =>
                p === -1 ? <span key={"dot" + idx} className="px-2 text-gray-500">…</span> : (
                  <button key={p} onClick={() => setPage(p as number)} className={`px-3 py-2 rounded ${p === page ? "bg-amber-600 text-white" : "border"}`} aria-current={p === page ? "page" : undefined}>
                    {p}
                  </button>
                )
              );
            })()}

            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-2 rounded border disabled:opacity-50" disabled={page === pages}>Next</button>
          </nav>

          <div className="mt-8 text-center text-sm text-gray-500">
            Note: These reviews are demo content for UI. Replace with real moderated reviews from your backend before going live.
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-amber-600 underline">Back to homepage</Link>
          </div>
        </div>
      </main>
    </>
  );
}
