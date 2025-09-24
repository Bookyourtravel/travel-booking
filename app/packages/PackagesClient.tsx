// app/packages/PackagesClient.tsx
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const PACKAGES_LIST = [
  { slug: "ayodhya", title: "Varanasi → Ayodhya Taxi", short: "Reliable intercity taxi with fixed price and driver guide.", starting: "₹1,850 (4 pax)", duration: "Full day", highlights: ["Private car", "Driver guide"], rating: 4.7, images: ["/images/ayodhya1.webp"], badge: "Popular" },
  { slug: "kashi-darshan", title: "Local Darshan - Kashi Vishwanath", short: "Temple darshan + guided walk and Ganga Aarti experience.", starting: "₹3,800 (4 pax)", duration: "3–4 hours", highlights: ["Ganga Aarti","Local guide"], rating: 4.9, images: ["/images/kashi1.webp"], badge: "Top Rated" },
  { slug: "lucknow-airport", title: "Airport Pickup/Drop", short: "Comfortable sedan / Innova with flight tracking options.", starting: "₹699 (Pickup)", duration: "As required", highlights: ["Flight tracking", "Meet & greet"], rating: 4.6, images: ["/images/lucknow-airport.webp"] },
  { slug: "prayagraj", title: "Varanasi → Prayagraj (Sangam)", short: "Day trip or overnight packages.", starting: "₹2,900 (4 pax)", duration: "Overnight", highlights: ["Optional hotel"], rating: 4.5, images: ["/images/prayagraj1.webp"] },
  { slug: "ganga-aarti", title: "Evening Ganga Aarti Special", short: "Front-row aarti experience.", starting: "₹1,599 (per person)", duration: "2 hours", highlights: ["Front-row seating"], rating: 4.8, images: ["/images/arti1.webp"] },
  { slug: "self-drive", title: "Self-Drive Cars (Varanasi)", short: "Flexible self-drive cars", starting: "₹1,850 / day", duration: "Per day", highlights: ["Insurance included"], rating: 4.4, images: ["/images/selfdrive1.webp"] },
];

export default function PackagesClient() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w >= 1100 ? 3 : w >= 720 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardWidth = Math.max(100 / cols - 2, 100 / cols - 2);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* small background placeholder */}
      <div style={{ textAlign: "center", padding: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fb923c" }}>Explore Our Packages</h1>
        <p style={{ color: "#6b7280" }}>Temple trips, day tours, airport transfers and more.</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "20px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {PACKAGES_LIST.map((p) => (
            <div key={p.slug} style={{ width: `${cardWidth}%`, minWidth: 260, boxSizing: "border-box", padding: 14, borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.06)", background: "#fff" }}>
              <Image src={p.images?.[0]} alt={p.title} width={400} height={250} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
              <h3 style={{ margin: "10px 0 6px", fontSize: 18 }}>{p.title}</h3>
              <p style={{ color: "#6b7280", marginBottom: 10 }}>{p.short}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#e11d48", fontWeight: 800 }}>{p.starting}</div>
                <Link href={`/packages/${p.slug}`}>
                  <button style={{ background: "linear-gradient(90deg,#fb923c,#f97316)", color: "#fff", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                    See details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
