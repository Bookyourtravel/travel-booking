// app/page.tsx
export default function Home() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, Arial", padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 44, margin: 0 }}>BookYourTravell</h1>
      <p style={{ fontSize: 18, color: "#555" }}>Simple travel booking MVP — Varanasi based</p>

      <div style={{ maxWidth: 800, margin: "40px auto 0" }}>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <input placeholder="From (city)" style={{ padding: 12, flex: 1 }} />
          <input placeholder="To (city)" style={{ padding: 12, flex: 1 }} />
          <button style={{ padding: "12px 20px", background: "#0b74de", color: "white", border: "none", borderRadius: 6 }}>
            Search
          </button>
        </div>

        <section style={{ marginTop: 40, textAlign: "left" }}>
          <h2>Popular Destinations</h2>
          <ul>
            <li>Varanasi — Ganga Aarti special packages</li>
            <li>Rishikesh — Yoga & rafting</li>
            <li>Agra — Taj Mahal day trip</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
