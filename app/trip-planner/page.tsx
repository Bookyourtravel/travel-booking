// app/trip-planner/page.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function TripPlannerPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Varanasi Trip Planner</h1>

        <p className="text-gray-700 mb-4">
          Welcome — Trip Planner page is live. अभी हम यहाँ short booking flow और Google Maps integration दिखाएँगे।
          सही काम करने के बाद हम Razorpay checkout और server-side verification भी integrate कर देंगे।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Quick Start</h3>
            <p className="text-sm text-gray-600">Use the trip planner on the homepage or continue to booking.</p>
            <Link href="/" className="inline-block mt-3 bg-amber-600 text-white px-4 py-2 rounded">Go to Homepage</Link>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Test Payment (Sandbox)</h3>
            <p className="text-sm text-gray-600">Razorpay test mode enabled. Use demo flow from homepage once form is integrated.</p>
            <Link href="/" className="inline-block mt-3 border px-4 py-2 rounded">Open Booking</Link>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Note: यह placeholder page है — अगला step होगा यहाँ Book-by-KM form, Google Maps autocomplete और Razorpay checkout जोड़ना.
        </div>
      </div>
    </main>
  );
}
