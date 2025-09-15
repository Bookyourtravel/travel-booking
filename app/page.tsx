"use client";

import React, { useState } from "react";

/**
 * Paste this entire file into: app/page.tsx
 * - Optional: put images into /public (banner.jpg, logo.png) to replace placeholders
 */

const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 28px",
  borderBottom: "1px solid #eee",
  position: "sticky",
  top: 0,
  background: "white",
  zIndex: 40,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "24px",
};

const heroStyle: React.CSSProperties = {
  minHeight: 380,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  marginTop: 16,
  borderRadius: 8,
  overflow: "hidden",
  position: "relative",
  background:
    "linear-gradient(90deg, rgba(11,116,222,0.9), rgba(13,96,160,0.85)), url('/banner.jpg') center/cover no-repeat",
};

const heroInner: React.CSSProperties = {
  textAlign: "center",
  padding: "40px 20px",
  maxWidth: 900,
};

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
  minWidth: 140,
  outline: "none",
};

const buttonPrimary: React.CSSProperties = {
  padding: "12px 18px",
  background: "#ff6b00",
  border: "none",
  borderRadius: 6,
  color: "white",
  cursor: "pointer",
};

export default function HomePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function onSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    // For MVP we just show a fake response. Later we'll call backend / Firestore.
    if (!from || !to) {
      setMessage("Please enter both origin and destination.");
      return;
    }
    setMessage(`Searching trips: ${from} → ${to} on ${date || "any date"}...`);
    // clear message after 4s
    setTimeout(() => setMessage(null), 4000);
  }

  return (
    <div style={{ fontFamily: '"Inter","Segoe UI",Roboto,Arial, sans-serif', color: "#222" }}>
      {/* NAV */}
      <header style={navStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* logo (use public/logo.png if you add) */}
          <div style={{ fontWeight: 700, fontSize: 18, color: "#0b74de" }}>
            ✈️ BookYourTravell
          </div>
          <nav style={{ marginLeft: 12, display: "flex", gap: 12 }}>
            <a href="#" style={{ textDecoration: "none", color: "#333" }}>Home</a>
            <a href="#" style={{ textDecoration: "none", color: "#333" }}>Hotels</a>
            <a href="#" style={{ textDecoration: "none", color: "#333" }}>Cars</a>
            <a href="#" style={{ textDecoration: "none", color: "#333" }}>Contact</a>
          </nav>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="#" style={{ textDecoration: "none", color: "#0b74de" }}>Login</a>
          <button style={{ ...buttonPrimary, background: "#0b74de" }}>Get started</button>
        </div>
      </header>

      {/* HERO */}
      <main>
        <div style={{ ...heroStyle }}>
          <div style={heroInner}>
            <h1 style={{ fontSize: 36, margin: 0, fontWeight: 700 }}>Plan. Book. Travel.</h1>
            <p style={{ fontSize: 18, marginTop: 8, opacity: 0.95 }}>
              Book affordable travel packages, hotels and local experiences from Varanasi and across India.
            </p>

            {/* Search box */}
            <form onSubmit={onSearch} style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 8, maxWidth: 820, width: "100%", alignItems: "center" }}>
                <input
                  style={inputStyle}
                  placeholder="From (city)"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
                <input
                  style={inputStyle}
                  placeholder="To (city)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
                <input
                  style={inputStyle}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button style={buttonPrimary} type="submit">Search</button>
              </div>
            </form>

            {message && (
              <div style={{ marginTop: 14, background: "rgba(255,255,255,0.12)", padding: 10, display: "inline-block", borderRadius: 6 }}>
                <small>{message}</small>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={containerStyle}>
          {/* Intro */}
          <section style={{ marginTop: 28, textAlign: "center" }}>
            <h2 style={{ marginBottom: 6 }}>Why BookWithUs?</h2>
            <p style={{ color: "#555", maxWidth: 760, margin: "0 auto" }}>
              Reliable booking, local guides, and easy refunds. Start with our popular packages and customize.
            </p>
          </section>

          {/* Popular destinations */}
          <section style={{ marginTop: 28 }}>
            <h3>Popular Destinations</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 12 }}>
              <DestinationCard title="Varanasi" subtitle="Ganga Aarti + Pilgrimage tour" price="₹1,499" />
              <DestinationCard title="Rishikesh" subtitle="Yoga & Whitewater rafting" price="₹2,199" />
              <DestinationCard title="Agra" subtitle="Taj Mahal day trip" price="₹999" />
              <DestinationCard title="Jaipur" subtitle="Heritage & Forts" price="₹1,799" />
            </div>
          </section>

          {/* About / small features */}
          <section style={{ marginTop: 30, display: "flex", gap: 20, alignItems: "stretch", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260, padding: 18, borderRadius: 8, border: "1px solid #f0f0f0" }}>
              <h4>Secure Payments</h4>
              <p style={{ color: "#555" }}>Razorpay integration (server-verified) for secure checkout.</p>
            </div>
            <div style={{ flex: 1, minWidth: 260, padding: 18, borderRadius: 8, border: "1px solid #f0f0f0" }}>
              <h4>Verified Drivers & Guides</h4>
              <p style={{ color: "#555" }}>Background-verified drivers for safe travel experiences.</p>
            </div>
            <div style={{ flex: 1, minWidth: 260, padding: 18, borderRadius: 8, border: "1px solid #f0f0f0" }}>
              <h4>24/7 Support</h4>
              <p style={{ color: "#555" }}>Phone and email support for bookings and cancellations.</p>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ marginTop: 40, borderTop: "1px solid #eee", padding: "30px 24px", color: "#555" }}>
        <div style={containerStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong>BookYourTravell</strong>
              <div style={{ fontSize: 13, marginTop: 6 }}>Varanasi • Book local experiences • © {new Date().getFullYear()}</div>
            </div>

            <div style={{ display: "flex", gap: 14 }}>
              <a href="#" style={{ color: "#555" }}>Terms</a>
              <a href="#" style={{ color: "#555" }}>Privacy</a>
              <a href="#" style={{ color: "#555" }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* small helper component */
function DestinationCard({ title, subtitle, price }: { title: string; subtitle: string; price: string }) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #eee", background: "white", minHeight: 120 }}>
      <div style={{ padding: 14 }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <p style={{ margin: "6px 0", color: "#666" }}>{subtitle}</p>
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid #fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>{price}</div>
        <button style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#0b74de", color: "white", cursor: "pointer" }}>
          Book
        </button>
      </div>
    </div>
  );
}
