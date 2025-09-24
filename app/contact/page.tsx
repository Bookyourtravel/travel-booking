// app/contact/page.tsx
import React from "react";
import Script from "next/script";
import ContactForm from "../components/ContactForm";
import { SUPPORT_EMAIL, SUPPORT_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata = {
  title: "Contact — BookYourTravell",
  description:
    "Contact BookYourTravell — WhatsApp, call or email for bookings and support.",
};

function waLink(number?: string, text?: string) {
  const num = (number || WHATSAPP_NUMBER || "").replace(/^\+/, "");
  const msg = encodeURIComponent(text || "Hi, I want to enquire about a package.");
  return `https://wa.me/${num}?text=${msg}`;
}

export default function ContactPage() {
  const sample = `Name:
Date of travel:
Pickup (city/airport):
Destination:
Passengers:
Extras (child seat, hotel, guide):`;

  return (
    <>
      {/* reCAPTCHA script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />

      <main className="min-h-screen py-12">
        {/* HERO */}
        <div className="bg-gradient-to-r from-orange-50 to-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 drop-shadow-sm">
              Contact Us
            </h1>
            <p className="mt-2 text-gray-700 max-w-2xl">
              We’re here to help — for quick quotes use WhatsApp, for urgent help
              call, or drop an email. Paste the quick template below to get a fast
              price & availability reply.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column: WhatsApp / Call / Email */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-xl bg-green-50 border border-green-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white grid place-items-center font-bold">
                  W
                </div>
                <div>
                  <div className="text-lg font-semibold">WhatsApp</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Fast replies — message us directly.
                  </div>
                  <a
                    href={waLink(WHATSAPP_NUMBER, sample)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-green-800 font-medium"
                  >
                    {WHATSAPP_NUMBER}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500 text-white grid place-items-center font-bold">
                  C
                </div>
                <div>
                  <div className="text-lg font-semibold">Call</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Speak with our support team quickly.
                  </div>
                  <a
                    href={`tel:${SUPPORT_PHONE}`}
                    className="mt-3 inline-block text-rose-600 font-medium"
                  >
                    {SUPPORT_PHONE}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-sky-50 border border-sky-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-600 text-white grid place-items-center font-bold">
                  E
                </div>
                <div>
                  <div className="text-lg font-semibold">Email</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Send details; we’ll reply with next steps.
                  </div>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="mt-3 inline-block text-sky-700 font-medium"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* trust badges */}
            <div className="mt-3 flex gap-3 items-center">
              <div className="px-3 py-2 bg-white border rounded shadow text-sm">
                ✅ Trusted drivers
              </div>
              <div className="px-3 py-2 bg-white border rounded shadow text-sm">
                🔒 Secure booking
              </div>
            </div>
          </div>

          {/* Middle column: form */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">Quick booking info</h3>
              <p className="text-sm text-gray-600 mb-3">
                Copy the template and paste into WhatsApp or email — fastest way to
                get price & availability.
              </p>

              <pre className="bg-gray-50 border rounded p-4 text-sm text-gray-800 whitespace-pre-wrap">
                {sample}
              </pre>

              <div className="mt-4 flex gap-3">
                <a
                  href={waLink(WHATSAPP_NUMBER, sample)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block flex-1 text-center px-4 py-2 rounded bg-green-600 text-white font-medium shadow"
                >
                  Message on WhatsApp
                </a>

                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                    "Booking enquiry"
                  )}&body=${encodeURIComponent(sample)}`}
                  className="inline-block px-4 py-2 rounded border bg-white text-gray-700"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Main secure form */}
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>

          {/* Right column: map + address */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border rounded-xl overflow-hidden shadow">
              <iframe
                title="Office location"
                className="w-full h-56"
                src="https://www.google.com/maps?q=53+Ghodha+Hatiya+Shivapur+Varanasi+UP+221003&output=embed"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold">Office</h4>
              <p className="text-sm text-gray-600">BookYourTravell — Local operator, Varanasi</p>
              <p className="mt-2 text-sm">
                <strong>Address:</strong> 53, Ghodha, Hatiya, Shivapur, Varanasi,
                UP 221003 (Near Octavia Hospital)
              </p>
              <p className="mt-2 text-sm">
                <strong>Phone:</strong>{" "}
                <a href={`tel:${SUPPORT_PHONE}`} className="text-rose-600">
                  {SUPPORT_PHONE}
                </a>
              </p>
              <p className="text-sm">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sky-700">
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p className="text-sm mt-2 text-gray-500">
                For arrivals call the phone number above for urgent help.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-10">
          <div className="text-center text-sm text-gray-500">
            Trusted local drivers · Fair pricing · Easy booking
          </div>
        </div>
      </main>
    </>
  );
}
