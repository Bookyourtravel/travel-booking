// app/components/BookByKmForm.jsx
"use client";

import React, { useEffect, useState } from "react";

/* ---------- helper ---------- */
function generateRef() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `BYT-${date}-${suffix}`;
}

const LUGGAGE_TYPES = [
  { value: "none", label: "No luggage" },
  { value: "backpack_5kg", label: "Small / Backpack (≈5kg)" },
  { value: "trolley_5kg", label: "Trolley small (≈5kg)" },
  { value: "medium_7kg", label: "Medium (≈7kg)" },
  { value: "duffel", label: "Duffel bag (clothes)" },
  { value: "large_15kg", label: "Large (≈15kg)" },
];

// Embedded WhatsApp contact (fallback modal included)
function WhatsAppContactInline({ phone, getPrefillMessage }) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const openWhatsApp = () => {
    const text = encodeURIComponent(getPrefillMessage());
    const waDeep = `whatsapp://send?phone=${phone}&text=${text}`;
    const waWeb = `https://wa.me/${phone}?text=${text}`;

    try {
      window.location.href = waDeep; // try mobile deep link
    } catch (e) {}

    setTimeout(() => {
      try {
        window.open(waWeb, "_blank", "noopener,noreferrer");
        setTimeout(() => setShowFallback(true), 900);
      } catch (e) {
        setShowFallback(true);
      }
    }, 300);
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = phone;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mailToFallback = () => {
    const subject = encodeURIComponent("Booking request");
    const body = encodeURIComponent(getPrefillMessage());
    window.location.href = `mailto:you@yourdomain.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <button
        onClick={openWhatsApp}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.92 11.92 0 0012 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.18 1.6 6.01L0 24l6.33-1.64A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 22.01c-1.72 0-3.41-.44-4.88-1.28l-.35-.2-3.76.98.97-3.66-.23-.37A9.02 9.02 0 012.99 12 9.01 9.01 0 1112 21.99z"/>
          <path d="M17.51 14.21c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24 0-.36.11-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.55-.4-.15-.01-.32-.01-.49-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.66 2.4 1.09 2.4.73 2.84.68.44-.05 1.42-.58 1.62-1.14.2-.56.2-1.03.14-1.14-.05-.11-.2-.18-.44-.3z"/>
        </svg>
        Message on WhatsApp
      </button>

      {showFallback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFallback(false)} />
          <div className="relative bg-white rounded-lg p-5 max-w-md w-full shadow-lg">
            <h3 className="font-semibold mb-2">Can't open WhatsApp?</h3>
            <p className="text-sm text-gray-600 mb-3">If WhatsApp Web isn't signed in or your device doesn't have WhatsApp, use one of these:</p>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="text-xs text-gray-500">Phone</div>
                <div className="font-medium">{phone}</div>
              </div>
              <button onClick={copyNumber} className="px-3 py-2 border rounded">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setShowFallback(false); mailToFallback(); }} className="px-3 py-2 bg-sky-600 text-white rounded">Email us</button>
              <a href={`tel:${phone}`} className="px-3 py-2 border rounded">Call</a>
              <button onClick={() => setShowFallback(false)} className="px-3 py-2 border rounded ml-auto">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Main form component ---------- */
export default function BookByKmForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState("oneway");
  const [notes, setNotes] = useState("");

  // pickup / drop
  // pickup default Varanasi (user can choose Varanasi Airport / Cantonment)
  const [pickup, setPickup] = useState("Varanasi");
  const [drop, setDrop] = useState("");

  // luggage
  const [luggageType, setLuggageType] = useState("trolley_5kg");
  const [luggageCount, setLuggageCount] = useState(1);
  const [luggageItems, setLuggageItems] = useState([]);

  // submission
  const [notice, setNotice] = useState(null);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (phone && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
      setNotice("कृपया सही फोन नंबर डालें (country code सहित या बिना) ।");
      return;
    }
    if (passengers < 1) {
      setNotice("Number of passengers must be at least 1.");
      return;
    }
    setNotice(null);
  }, [phone, passengers]);

  function addLuggage() {
    if (!luggageType || luggageType === "none") return;
    const cnt = Math.max(1, Number(luggageCount || 1));
    setLuggageItems((prev) => {
      const found = prev.find((p) => p.type === luggageType);
      if (found) {
        return prev.map((p) => (p.type === luggageType ? { ...p, count: p.count + cnt } : p));
      }
      return [...prev, { type: luggageType, count: cnt }];
    });
    setLuggageCount(1);
    setLuggageType("trolley_5kg");
  }

  function removeLuggage(type) {
    setLuggageItems((prev) => prev.filter((p) => p.type !== type));
  }

  function resetForm() {
    setName(""); setPhone(""); setPassengers(1); setTripType("oneway"); setNotes("");
    setPickup("Varanasi"); setDrop("");
    setLuggageItems([]); setLuggageCount(1); setLuggageType("trolley_5kg");
    setNotice(null); setSubmittedRef(null); setSubmittedData(null);
  }

  async function handleSubmit(e) {
    e && e.preventDefault();

    if (!name.trim()) { setNotice("कृपया नाम दर्ज करें."); return; }
    if (!phone.trim()) { setNotice("कृपया फोन नंबर दर्ज करें."); return; }
    if (!drop.trim()) { setNotice("कृपया Drop (Destination) दर्ज करें."); return; }

    const ref = generateRef();
    const payload = {
      ref,
      name: name.trim(),
      phone: phone.trim(),
      passengers,
      tripType,
      pickup,
      drop,
      luggage: luggageItems,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    // demo: store client-side
    setSubmittedRef(ref);
    setSubmittedData(payload);
    setNotice(null);

    // TODO: agar chaha to yahan POST karke Google Sheet / Apps Script bhej sakte ho
    setTimeout(() => {
      document.getElementById("book-confirm")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }

  // WhatsApp number (apna number daalo, country code ke saath, bina +)
  const WA_NUMBER = "919812345678"; // <-- अपना WhatsApp नंबर यहाँ बदल दे
  const getWhatsAppMessage = () => {
    if (!submittedData) return "";
    const luggageText = (submittedData.luggage || []).length === 0 ? "No luggage" :
      (submittedData.luggage.map(it => `${it.count}× ${it.type}`).join(", "));
    return `Booking request\nRef: ${submittedRef}\nName: ${submittedData.name}\nPhone: ${submittedData.phone}\nFrom: ${submittedData.pickup}\nTo: ${submittedData.drop}\nPassengers: ${submittedData.passengers}\nLuggage: ${luggageText}\nNotes: ${submittedData.notes || "-"}`;
  };

  return (
    <div className="rounded-xl border shadow-sm p-6 bg-white">
      <h3 className="text-2xl font-semibold mb-2">Book By Details </h3>
      <p className="text-sm text-gray-600 mb-4">Pickup default: Varanasi. Destination can be any city in India.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Your name" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g. 9198XXXXXXXX" />
          <div className="text-xs text-gray-500 mt-1">हम इस नंबर पर कॉल करके booking confirm करेंगे — कोई online payment नहीं।</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Passengers</label>
            <input type="number" min={1} max={12} value={passengers} onChange={(e)=>setPassengers(Math.max(1, Number(e.target.value||1)))} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trip type</label>
            <select value={tripType} onChange={(e)=>setTripType(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="oneway">One-way</option>
              <option value="round">Round-trip</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <input value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="child seat, early pickup, etc." />
          </div>
        </div>

        {/* Pickup & Drop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Pickup (From)</label>
            <select value={pickup} onChange={(e)=>setPickup(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="Varanasi">Varanasi (city)</option>
              <option value="Varanasi Airport">Varanasi Airport (Lal Bahadur)</option>
              <option value="Varanasi Cantonment">Varanasi Cantonment</option>
              <option value="Other Varanasi Location">Other (Varanasi)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Drop / Destination (India)</label>
            <input
              list="india-cities"
              value={drop}
              onChange={(e)=>setDrop(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Type city name or pick from suggestions"
            />
            <datalist id="india-cities">
              {/* helpful suggestions; user can still type any city */}
              <option>Lucknow</option>
              <option>Ayodhya</option>
              <option>Prayagraj</option>
              <option>Kanpur</option>
              <option>Patna</option>
              <option>Varanasi</option>
              <option>Agra</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Lucknow Airport</option>
              <option>Jhansi</option>
              <option>Mirzapur</option>
              <option>Bhadohi</option>
              <option>Gorakhpur</option>
              <option>Lucknow</option>
            </datalist>
          </div>
        </div>

        {/* Luggage */}
        <div className="pt-2 pb-1">
          <label className="block text-sm font-medium mb-2">Luggage — add multiple items</label>
          <div className="flex gap-2 items-center mb-2">
            <select value={luggageType} onChange={(e)=>setLuggageType(e.target.value)} className="border rounded px-3 py-2">
              {LUGGAGE_TYPES.map((t)=> <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            <input type="number" min={1} value={luggageCount} onChange={(e)=>setLuggageCount(Math.max(1, Number(e.target.value||1)))} className="w-20 border rounded px-3 py-2" />

            <button type="button" onClick={addLuggage} className="px-3 py-2 bg-amber-600 text-white rounded">Add</button>

            <button type="button" onClick={()=>setLuggageItems([])} className="px-3 py-2 border rounded text-sm">Clear</button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {luggageItems.length === 0 ? (
              <div className="text-xs text-gray-500">No luggage added</div>
            ) : (
              luggageItems.map((it) => (
                <div key={it.type} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border text-sm">
                  <div>{it.type} × {it.count}</div>
                  <button type="button" onClick={()=>removeLuggage(it.type)} className="text-xs px-2 py-1 rounded border bg-white">Remove</button>
                </div>
              ))
            )}
          </div>
        </div>

        {notice && <div className="p-3 rounded border bg-red-50 text-red-700 text-sm">{notice}</div>}

        <div className="flex items-center gap-3">
          <button type="submit" className={`px-4 py-2 rounded text-white bg-amber-600 hover:bg-amber-700`}>Submit Request</button>
          <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">Reset</button>
          <div className="ml-auto text-xs text-gray-500">Final fare confirmed by our team on call.</div>
        </div>
      </form>

      {/* Confirmation + WhatsApp */}
      {submittedRef && submittedData && (
        <div id="book-confirm" className="mt-6 p-4 rounded border bg-emerald-50">
          <div className="font-semibold text-amber-700">Request received</div>
          <div className="mt-1 text-sm text-gray-700">Reference: <strong>{submittedRef}</strong></div>

          <div className="mt-3 text-sm text-gray-800 space-y-1">
            <div><strong>Name:</strong> {submittedData.name}</div>
            <div><strong>Phone:</strong> {submittedData.phone}</div>
            <div><strong>From:</strong> {submittedData.pickup}</div>
            <div><strong>To:</strong> {submittedData.drop}</div>
            <div><strong>Passengers:</strong> {submittedData.passengers}</div>
            <div><strong>Trip type:</strong> {submittedData.tripType === "oneway" ? "One-way" : "Round-trip"}</div>
            <div><strong>Luggage:</strong>
              <div className="mt-1 ml-2">
                {submittedData.luggage.length === 0 ? <span>No luggage</span> :
                  submittedData.luggage.map((it, idx) => (
                    <div key={idx}>• {it.type} × {it.count}</div>
                  ))
                }
              </div>
            </div>
            {submittedData.notes && <div><strong>Notes:</strong> {submittedData.notes}</div>}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <WhatsAppContactInline phone={WA_NUMBER} getPrefillMessage={() => getWhatsAppMessage()} />

            <button onClick={() => {
              const subject = encodeURIComponent(`Booking request ${submittedRef}`);
              const body = encodeURIComponent(JSON.stringify(submittedData, null, 2));
              window.location.href = `mailto:you@yourdomain.com?subject=${subject}&body=${body}`;
            }} className="px-3 py-2 border rounded">Email details</button>

            <button onClick={() => { resetForm(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-3 py-2 border rounded ml-auto">Done</button>
          </div>

          <div className="mt-3 text-xs text-gray-700">Tip: WhatsApp खोलने के बाद message भेजना न भूलें — तभी हमें तुरन्त notification मिलता है।</div>
        </div>
      )}
    </div>
  );
}
