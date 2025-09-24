// app/about/page.tsx
import React from "react";
import Link from "next/link";

/**
 * Simple SEO metadata for /about
 */
export const metadata = {
  title: "About — BookYourTravell",
  description:
    "BookYourTravell — Trusted local operator for airport transfers, day trips and custom Varanasi experiences.",
  openGraph: {
    title: "About — BookYourTravell",
    description:
      "Trusted local operator for airport transfers, day trips and custom Varanasi experiences.",
    images: ["/images/og-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen font-sans">
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,246,240,0.6), rgba(255,249,246,0.9))",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h1 style={{ fontSize: 44, fontWeight: 800, color: "#fb923c" }}>
            About BookYourTravell
          </h1>
          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 16 }}>
            Local guides & reliable drivers — safe, punctual transfers and curated
            experiences in Varanasi & nearby. We keep pricing transparent and focus
            on comfortable travel.
          </p>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            <div style={{ padding: 18, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(12,18,20,0.06)" }}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>Our Promise</h3>
              <ul style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.6 }}>
                <li>Trusted local drivers</li>
                <li>Fixed fares — no surprises</li>
                <li>Flight monitoring & on-time pickup</li>
              </ul>
            </div>

            <div style={{ padding: 18, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(12,18,20,0.06)" }}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>What we offer</h3>
              <ul style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.6 }}>
                <li>Airport transfers (meet & greet)</li>
                <li>Temple & day tours with local insights</li>
                <li>Custom routes, family-friendly pacing</li>
              </ul>
            </div>

            <div style={{ padding: 18, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(12,18,20,0.06)" }}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>Safety & Support</h3>
              <p style={{ marginTop: 10, color: "#4b5563" }}>
                Drivers background-checked, regular vehicle maintenance, and 24/7
                contact for bookings and support.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <a
              href="/contact"
              className="inline-block"
              style={{
                background: "linear-gradient(90deg,#fb923c,#f97316)",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Contact Us
            </a>
            <Link href="/packages" style={{ alignSelf: "center", color: "#fb923c", fontWeight: 700 }}>
              View Packages →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#16323b" }}>Team & Story</h2>
          <p style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.7 }}>
            We started as a small local taxi service with a mission — make travel
            in and around Varanasi easy and trustworthy for families and solo
            travelers. Today we combine local knowledge, punctual drivers and
            easy booking so you can focus on the trip, not logistics.
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 220, background: "#fff", padding: 14, borderRadius: 12, boxShadow: "0 8px 20px rgba(12,18,20,0.06)" }}>
              <div style={{ height: 120, background: "#f3f4f6", borderRadius: 8 }} />
              <h4 style={{ marginTop: 10, marginBottom: 6 }}>Shivam — Founder</h4>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Operations & product</div>
            </div>

            <div style={{ width: 220, background: "#fff", padding: 14, borderRadius: 12, boxShadow: "0 8px 20px rgba(12,18,20,0.06)" }}>
              <div style={{ height: 120, background: "#f3f4f6", borderRadius: 8 }} />
              <h4 style={{ marginTop: 10, marginBottom: 6 }}>Local Team</h4>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Drivers & guides</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
