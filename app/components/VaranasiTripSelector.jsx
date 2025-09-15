"use client";
import React, { useState, useMemo } from "react";
import { calculateMultiStopPrice } from "./MultiStopPrice";
import { DISTANCES } from "../data/distances";

export default function VaranasiTripSelector() {
  const STOPS = ["Prayagraj", "Ayodhya", "Lucknow"];

  const [routeOrder, setRouteOrder] = useState(["Varanasi"]);
  const [passengers, setPassengers] = useState(2);
  const [cabType, setCabType] = useState("sedan");
  const [date, setDate] = useState("");
  const [includeGuide, setIncludeGuide] = useState(false);

  function addStop(stop) {
    if (routeOrder.includes(stop)) return;
    setRouteOrder((prev) => [...prev, stop]);
  }
  function removeStop(index) {
    setRouteOrder((prev) => prev.filter((_, i) => i !== index));
  }
  function moveUp(index) {
    if (index <= 1) return;
    setRouteOrder((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }
  function moveDown(index) {
    if (index === 0 || index === routeOrder.length - 1) return;
    setRouteOrder((prev) => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }

  const multiPrice = useMemo(() => {
    try {
      const result = calculateMultiStopPrice(routeOrder, DISTANCES, {
        cabType,
        passengers,
        includeGuide,
      });
      return result;
    } catch (e) {
      return { error: e.message, total: 0, legs: [] };
    }
  }, [routeOrder, cabType, passengers, includeGuide]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Varanasi Trip Planner</h1>
      <p className="text-sm text-gray-600 mb-6">
        Varanasi se apna route select karo, price automatic calculate ho jayega.
      </p>

      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Stops Selector */}
          <div className="font-medium mb-2">Add destinations (order matters)</div>
          <div className="flex gap-2 flex-wrap">
            {STOPS.map((s) => (
              <button
                key={s}
                onClick={() => addStop(s)}
                className="px-3 py-1 border rounded text-sm"
              >
                + {s}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <div className="text-sm text-gray-600">Your route order:</div>
            <ul className="mt-2 space-y-2">
              {routeOrder.map((r, idx) => (
                <li
                  key={r + idx}
                  className="flex items-center gap-2 p-2 border rounded"
                >
                  <div className="font-medium">
                    {idx === 0 ? `${r} (start)` : r}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {idx > 0 && (
                      <button
                        onClick={() => moveUp(idx)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        ↑
                      </button>
                    )}
                    {idx > 0 && (
                      <button
                        onClick={() => moveDown(idx)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        ↓
                      </button>
                    )}
                    {idx > 0 && (
                      <button
                        onClick={() => removeStop(idx)}
                        className="text-xs px-2 py-1 border rounded text-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Date + options */}
          <div className="mt-4">
            <label className="block text-sm text-gray-700">Date</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Passengers</label>
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Cab Type</label>
              <select
                value={cabType}
                onChange={(e) => setCabType(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="innova">Innova</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              id="guide"
              type="checkbox"
              checked={includeGuide}
              onChange={(e) => setIncludeGuide(e.target.checked)}
            />
            <label htmlFor="guide" className="text-sm">
              Include local guide (₹700)
            </label>
          </div>
        </div>

        {/* Price summary */}
        <div>
          <h2 className="font-medium mb-3">Price summary</h2>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Legs:</div>
            <ul className="mt-2 text-sm space-y-1">
              {multiPrice.legs && multiPrice.legs.map((leg, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {leg.from} → {leg.to} ({leg.km} km)
                  </span>
                  <span>
                    Est. ₹{Math.round(500 + leg.km * 9)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between font-semibold">
              <div>Total</div>
              <div>₹{multiPrice.total ?? 0}</div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:opacity-95">
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
