// app/components/BookByKmForm.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * BookByKmForm.jsx
 * - English messages
 * - Destination autocomplete (lots of India cities & airports)
 * - Phone (>=10 digits) & email validation with inline error messages
 * - Confirmation modal + WhatsApp open
 *
 * Paste this file at: app/components/BookByKmForm.jsx
 */

/* ----------------------- Config ----------------------- */
// Replace with your actual support contact
const SUPPORT_PHONE = "+919389971003"; // keep + or +91...
const SUPPORT_EMAIL = "shivam211019@gmail.com";

/* -------------------- Big India cities + airports --------------------
   This list is large but not exhaustive. Add more strings if needed.
   Suggestions will filter after user types 2+ chars.
*/
const INDIA_CITIES = [
  "Agartala","Agra","Ahmedabad","Aizawl","Ajmer","Alappuzha","Aligarh","Allahabad","Alwar","Amaravati",
  "Ambala","Amritsar","Anantapur","Ankleshwar","Ara","Ariyalur","Asansol","Aurangabad","Baleshwar","Ballari",
  "Balasore","Bareilly","Baripada","Beawar","Belgaum","Bengaluru","Berhampur","Bhagalpur","Bharatpur","Bhatinda",
  "Bhavnagar","Bhilai","Bhilwara","Bhopal","Bhubaneswar","Bhuj","Bijapur","Bikaner","Bilaspur","Chandigarh",
  "Chennai","Chhapra","Chikhli","Cooch Behar","Coimbatore","Cuttack","Daman","Darbhanga","Darjeeling","Dehradun",
  "Delhi","Dhanbad","Dharwad","Dindigul","Dibrugarh","Diu","Durgapur","Eluru","Erode","Faridabad","Farrukhabad",
  "Fatehpur","Gandhinagar","Gangtok","Gaya","Ghaziabad","Gorakhpur","Gulbarga","Guna","Gurdaspur","Guwahati",
  "Gwalior","Haldwani","Hampi","Harda","Hassan","Hazaribagh","Himachal Pradesh (State)","Hooghly","Hubli","Hyderabad",
  "Imphal","Indore","Itanagar","Jabalpur","Jaipur","Jalandhar","Jalgaon","Jalna","Jammu","Jamnagar","Jamshedpur",
  "Jhansi","Jodhpur","Kakinada","Kanchipuram","Kannur","Kanpur","Karimnagar","Karnal","Kavaratti","Khandwa",
  "Kochi (Cochin)","Kohima","Kolkata","Kollam","Kota","Kozhikode","Kudremukh","Kullu","Kurnool","Lalitpur","Latur",
  "Lucknow","Ludhiana","Madurai","Malappuram","Mangalore","Mathura","Meerut","Mehsana","Midnapore","Mirzapur",
  "Moga","Moradabad","Morbi","Mumbai","Munger","Muzaffarpur","Nadiad","Nagpur","Nainital","Nanded","Nashik","Navsari",
  "Nawada","Noida","Ongole","Ooty","Palakkad","Pali","Panaji (Goa)","Panipat","Parbhani","Pondicherry","Porbandar",
  "Prayagraj","Pune","Puri","Purnea","Raigarh","Raipur","Rajkot","Ramagundam","Rampur","Ranchi","Ratlam","Raurkela",
  "Rewari","Rishikesh","Rohtak","Roorkee","Sagar","Sambalpur","Satna","Shimla","Shimoga","Siliguri","Sirmaur",
  "Sirohi","Solapur","Sonepat","Srinagar","Sultanpur","Surat","Surendranagar","Thane","Thanjavur","Thiruvananthapuram",
  "Thoothukudi (Tuticorin)","Thrissur","Tirunelveli","Tirupati","Tiruppur","Tiruvannamalai","Udaipur","Udupi","Ujjain",
  "Ulhasnagar","Vadodara (Baroda)","Vapi","Varanasi","Vasai","Vijayawada","Visakhapatnam","Warangal","Washim","Yamuna Nagar",

  // common airports & variants (so user may type "DEL", "BOM", "GOI", "LKO")
  "Delhi Airport (DEL)","Mumbai Airport (BOM)","Bengaluru Airport (BLR)","Kolkata Airport (CCU)",
  "Chennai Airport (MAA)","Hyderabad Airport (HYD)","Lucknow Airport (LKO)","Varanasi Airport (VNS)",
  "Goa Airport (GOI)","Amritsar Airport (ATQ)","Pune Airport (PNQ)","Jaipur Airport (JAI)",
  "Thiruvananthapuram (TRV)","Cochin Airport (COK)","Nagpur (NAG)","Indore (IDR)","Raipur (RPR)",
  "Srinagar (SXR)","Leh (IXL)","Vadodara (BDQ)","Ahmedabad Airport (AMD)","Noida / Greater Noida (GZB)"
];

/* --------------------- Utilities --------------------- */
function digitsOnly(s) {
  return (s || "").replace(/\D/g, "");
}
function isValidEmail(s) {
  if (!s) return true; // optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

/* -------------------- Modal -------------------- */
function BookingModal({ open, onClose, payload, onSendWhatsApp }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setPhone("");
      setEmail("");
      setPhoneError("");
      setEmailError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSend = () => {
    const digits = digitsOnly(phone);
    if (digits.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setPhoneError("");
    setEmailError("");
    onSendWhatsApp(name || "Customer", digits, email || null);
  };

  const summary = `From: ${payload.from}\nTo: ${payload.to}\nPassengers: ${payload.passengers}\nLuggage: 5kg x${payload.luggage5}, 7kg x${payload.luggage7}, 15kg x${payload.luggage15}, Duffle x${payload.duffle}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-lg w-full bg-white rounded-lg shadow-lg overflow-auto">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Confirm & Contact Support</h3>
          <p className="text-sm text-gray-600">Fill your details — we'll send this info to WhatsApp support.</p>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium">Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. Amit Kumar" />
          </div>

          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`mt-1 block w-full border rounded px-3 py-2 ${phoneError ? "border-red-500" : ""}`} placeholder="+91xxxxxxxxxx or 10 digit" />
            {phoneError && <div className="text-red-600 text-sm mt-1">{phoneError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email (optional)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 block w-full border rounded px-3 py-2 ${emailError ? "border-red-500" : ""}`} placeholder="you@example.com" />
            {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Summary</label>
            <textarea readOnly value={summary} className="mt-1 block w-full border rounded px-3 py-2 h-28 bg-gray-50" />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSend} className="px-4 py-2 rounded bg-emerald-500 text-white">Send via WhatsApp</button>
            <a href={`tel:${SUPPORT_PHONE}`} className="px-4 py-2 rounded border inline-flex items-center">Call Support</a>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Booking%20Enquiry&body=${encodeURIComponent(summary)}`} className="px-4 py-2 rounded border inline-flex items-center">Email Support</a>
            <button onClick={onClose} className="ml-auto px-3 py-2 text-sm">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main component -------------------- */
export default function BookByKmForm() {
  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fromCity] = useState("Varanasi");
  const [toCity, setToCity] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [luggage5, setLuggage5] = useState(0);
  const [luggage7, setLuggage7] = useState(0);
  const [luggage15, setLuggage15] = useState(0);
  const [duffle, setDuffle] = useState(0);

  // validation/errors
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [toError, setToError] = useState("");

  // autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // modal
  const [modalOpen, setModalOpen] = useState(false);

  // derived validity
  const phoneDigits = digitsOnly(phone);
  const isPhoneValid = phoneDigits.length >= 10;
  const isEmailValid = isValidEmail(email);
  const isNameValid = name.trim().length > 0;
  const isToValid = toCity.trim().length > 0;

  // prepare suggestions (search only after 2 chars)
  useEffect(() => {
    const q = (toCity || "").trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const ql = q.toLowerCase();
    // prefer startsWith matches first, then includes
    const starts = [];
    const includes = [];
    for (let i = 0; i < INDIA_CITIES.length; i++) {
      const city = INDIA_CITIES[i];
      const lower = city.toLowerCase();
      if (lower.startsWith(ql)) starts.push(city);
      else if (lower.includes(ql)) includes.push(city);
      if (starts.length + includes.length >= 12) break; // limit suggestions
    }
    const combined = [...starts, ...includes];
    setSuggestions(combined);
    setShowSuggestions(true);
  }, [toCity]);

  // handle selecting suggestion
  function pickSuggestion(s) {
    setToCity(s);
    setShowSuggestions(false);
    setToError("");
  }

  // validate inline when values change
  useEffect(() => {
    setNameError(isNameValid ? "" : "");
  }, [name]);

  useEffect(() => {
    if (!phone) { setPhoneError(""); return; }
    if (phoneDigits.length < 10) setPhoneError("Phone number must be at least 10 digits.");
    else setPhoneError("");
  }, [phone, phoneDigits.length]);

  useEffect(() => {
    if (!email) { setEmailError(""); return; }
    setEmailError(isEmailValid ? "" : "Please enter a valid email address.");
  }, [email]);

  // submit handler (opens modal if valid)
  function handleSubmit(e) {
    e?.preventDefault();
    // basic validation
    if (!isNameValid) { setNameError("Please enter your name."); return; }
    if (!isPhoneValid) { setPhoneError("Phone number must be at least 10 digits."); return; }
    if (!isEmailValid) { setEmailError("Please enter a valid email address."); return; }
    if (!isToValid) { setToError("Please enter a destination city or airport."); return; }

    setNameError(""); setPhoneError(""); setEmailError(""); setToError("");
    setModalOpen(true);
  }

  // handler to send WhatsApp from modal (passed down)
  function onSendWhatsApp(nameVal, digits, emailVal) {
    const msg = `Booking enquiry from website:\nName: ${nameVal}\nMobile: ${digits}${emailVal ? `\nEmail: ${emailVal}` : ""}\nFrom: ${fromCity}\nTo: ${toCity}\nPassengers: ${passengers}\nLuggage: 5kg x${luggage5}, 7kg x${luggage7}, 15kg x${luggage15}, Duffle x${duffle}\n\nPlease provide quote & availability.`;
    const waUrl = `https://wa.me/${SUPPORT_PHONE.replace(/^\+/, "")}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    setModalOpen(false);
    alert("WhatsApp opened — we sent support the booking details.");
    // optionally reset form:
    // resetForm();
  }

  function resetForm() {
    setName(""); setPhone(""); setEmail(""); setToCity("");
    setPassengers(1); setLuggage5(0); setLuggage7(0); setLuggage15(0); setDuffle(0);
    setNameError(""); setPhoneError(""); setEmailError(""); setToError("");
    setSuggestions([]); setShowSuggestions(false);
  }

  return (
    <div className="rounded-xl border shadow-sm p-6 bg-white">
      <h3 className="text-2xl font-semibold mb-2">Book From Varanasi — Destination (All India)</h3>
      <p className="text-sm text-gray-600 mb-4">Type destination (city or airport). Suggestions appear after 2 letters.</p>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="block text-sm font-medium">Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={`w-full border rounded px-3 py-2 ${nameError ? "border-red-500" : ""}`} placeholder="Your name" />
          {nameError && <div className="text-red-600 text-sm mt-1">{nameError}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium">Mobile number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full border rounded px-3 py-2 ${phoneError ? "border-red-500" : ""}`} placeholder="e.g. +9198XXXXXXXX or 10 digits" />
          {phoneError && <div className="text-red-600 text-sm mt-1">{phoneError}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email (optional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full border rounded px-3 py-2 ${emailError ? "border-red-500" : ""}`} placeholder="you@example.com" />
          {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium">From</label>
          <input readOnly value={fromCity} className="w-full border rounded px-3 py-2 bg-gray-50" />
        </div>

        <div style={{ position: "relative" }}>
          <label className="block text-sm font-medium">Destination (To)</label>
          <input
            value={toCity}
            onChange={(e) => { setToCity(e.target.value); }}
            onFocus={() => { if (toCity.length >= 2) setShowSuggestions(true); }}
            onBlur={() => { setTimeout(()=>setShowSuggestions(false), 150); }}
            placeholder="Type city or airport (e.g. Lucknow / Prayagraj / Anywhere in India)"
            className={`w-full border rounded px-3 py-2 ${toError ? "border-red-500" : ""}`}
          />
          {toError && <div className="text-red-600 text-sm mt-1">{toError}</div>}

          {showSuggestions && suggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 bg-white border rounded mt-1 shadow max-h-48 overflow-auto z-30">
              {suggestions.map((s, idx) => (
                <div key={idx} onMouseDown={() => pickSuggestion(s)} className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-sm">
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Number Of Passengers</label>
          <input type="number" min={1} max={12} value={passengers} onChange={(e) => setPassengers(Math.max(1, Number(e.target.value || 1)))} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">5 kg trolley bags</label>
            <input type="number" min={0} value={luggage5} onChange={(e) => setLuggage5(Math.max(0, Number(e.target.value || 0)))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">7 kg cabin bags</label>
            <input type="number" min={0} value={luggage7} onChange={(e) => setLuggage7(Math.max(0, Number(e.target.value || 0)))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">15 kg check-in bags</label>
            <input type="number" min={0} value={luggage15} onChange={(e) => setLuggage15(Math.max(0, Number(e.target.value || 0)))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Duffle / Other</label>
            <input type="number" min={0} value={duffle} onChange={(e) => setDuffle(Math.max(0, Number(e.target.value || 0)))} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <div className="p-3 rounded border bg-gray-50">
            <div className="text-sm text-gray-700">Rate & Vehicle details: <strong>Contact for quote</strong></div>
            <div className="text-sm text-gray-700 mt-2">Estimated Fare: <strong>Contact Us — we'll provide a customised quote</strong></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 rounded text-white bg-amber-600 hover:opacity-95">Book Now</button>
          <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">Reset</button>
          <div className="ml-auto text-xs text-gray-500">Final fare confirmed by our team on call.</div>
        </div>
      </form>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        payload={{
          from: fromCity,
          to: toCity,
          passengers,
          luggage5,
          luggage7,
          luggage15,
          duffle,
        }}
        onSendWhatsApp={onSendWhatsApp}
      />
    </div>
  );
}
