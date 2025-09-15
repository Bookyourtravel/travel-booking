"use client";
import { useState } from "react";
import calculateMultiStopPrice from "./MultiStopPrice"; // अगर तूने export default रखा है adjust कर

const DESTS = [
  { id: "prayagraj", label: "Prayagraj (Sangam)" },
  { id: "ayodhya", label: "Ayodhya" },
  { id: "lucknow", label: "Lucknow Airport" },
  { id: "local-darshan", label: "Local Darshan - Kashi Vishwanath" },
  { id: "ganga-aarti", label: "Evening Ganga Aarti" },
];

export default function VaranasiTripSelector() {
  const [route, setRoute] = useState(["varanasi"]);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [cabType, setCabType] = useState("sedan");
  const [includeGuide, setIncludeGuide] = useState(false);

  function addDest(id) {
    if (route.includes(id)) return;
    setRoute((r) => [...r, id]);
  }
  function removeDest(index) {
    if (index === 0) return; // don't remove start
    setRoute((r) => r.filter((_, i) => i !== index));
  }
  function moveUp(i) {
    if (i <= 1) return;
    setRoute((r) => {
      const copy = [...r];
      [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
      return copy;
    });
  }
  function moveDown(i) {
    setRoute((r) => {
      if (i >= r.length - 1) return r;
      const copy = [...r];
      [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
      return copy;
    });
  }

  // simple price calc — uses external helper if available
  let price = 0;
  try {
    price = calculateMultiStopPrice(route, {}, { cabType, passengers, includeGuide });
  } catch (e) {
    // fallback simple calc
    price = 0;
    price = (route.length - 1) * 800 * (cabType === "innova" ? 1.35 : 1);
    if (includeGuide) price += 700;
    price = Math.round(price);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* left: planner */}
      <div className="lg:col-span-2">
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">Add destinations (order matters)</div>
          <div className="flex flex-wrap gap-2">
            {DESTS.map((d) => (
              <button key={d.id}
                onClick={() => addDest(d.id)}
                className={`px-3 py-1.5 rounded-md border text-sm ${route.includes(d.id) ? "bg-amber-100 border-amber-300" : "bg-white hover:bg-gray-50"}`}>
                + {d.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Your route order</div>
          <div className="space-y-2">
            {route.map((r, i) => {
              const label = r === "varanasi" ? "Varanasi (start)" : (DESTS.find(x=>x.id===r)?.label || r);
              return (
                <div key={i} className="flex items-center gap-3 border rounded p-3">
                  <div className="flex-1">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-gray-500">Stop {i}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {i > 0 && <button onClick={()=>moveUp(i)} className="px-2 py-1 border rounded text-sm">▲</button>}
                    {i < route.length-1 && <button onClick={()=>moveDown(i)} className="px-2 py-1 border rounded text-sm">▼</button>}
                    {i !== 0 && <button onClick={()=>removeDest(i)} className="px-2 py-1 bg-red-50 text-red-600 border rounded text-sm">Remove</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Passengers</label>
            <input type="number" min={1} value={passengers} onChange={(e)=>setPassengers(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Cab Type</label>
            <select value={cabType} onChange={(e)=>setCabType(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="innova">Innova</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeGuide} onChange={(e)=>setIncludeGuide(e.target.checked)} />
              <span className="text-sm text-gray-700">Include local guide (₹700)</span>
            </label>
          </div>
        </div>
      </div>

      {/* right: summary */}
      <div>
        <div className="border rounded-lg p-4 bg-white shadow">
          <div className="text-sm text-gray-500">Legs: <span className="font-medium">{Math.max(0, route.length-1)}</span></div>
          <div className="mt-4 text-2xl font-bold">₹{price}</div>
          <div className="mt-4">
            <button className="w-full bg-blue-600 text-white py-2 rounded">Book now</button>
          </div>
          <div className="mt-4 text-xs text-gray-500">Payments processed securely. Prices are estimates — final price confirmed at booking.</div>
        </div>
      </div>
    </div>
  );
}
