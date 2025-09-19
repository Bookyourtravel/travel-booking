// components/WhatsAppContact.tsx
"use client";

import React, { useState } from "react";

type Props = {
  phone: string; // international without +, e.g. 919812345678
  getPrefillMessage: () => string; // function that returns prefilled message
};

export default function WhatsAppContact({ phone, getPrefillMessage }: Props) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  // try to open WhatsApp. Strategy:
  // 1) try whatsapp:// (mobile deep link) by setting window.location
  // 2) then open wa.me in new tab as fallback
  // 3) if still not good, show fallback modal for copy/mail
  const openWhatsApp = () => {
    const text = encodeURIComponent(getPrefillMessage());
    const waDeep = `whatsapp://send?phone=${phone}&text=${text}`;
    const waWeb = `https://wa.me/${phone}?text=${text}`;

    // Try open deep link (mobile). On many desktops this will do nothing.
    // Use a short timeout then open wa.me in new tab.
    let opened = false;
    try {
      // Attempt 1: open deep link. This may be blocked by browser popup blockers when not user-initiated,
      // but since this is called on click, it's fine.
      window.location.href = waDeep;
      opened = true;
    } catch (e) {
      opened = false;
    }

    // After a tiny delay, open wa.me in new tab (this usually opens WhatsApp Web on desktop)
    setTimeout(() => {
      try {
        window.open(waWeb, "_blank", "noopener,noreferrer");
        // show fallback only if we suspect no whatsapp — we can't truly detect,
        // but show modal after small delay so user has time to interact.
        setTimeout(() => {
          // If user didn't interact with WhatsApp Web (i.e., not logged in) they may need fallback
          // We'll show fallback modal so they can copy number / use mailto.
          setShowFallback(true);
        }, 900);
      } catch (err) {
        setShowFallback(true);
      }
    }, 300);
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // older browsers fallback
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
        aria-label="Message us on WhatsApp"
      >
        {/* SVG */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.92 11.92 0 0012 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.18 1.6 6.01L0 24l6.33-1.64A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 22.01c-1.72 0-3.41-.44-4.88-1.28l-.35-.2-3.76.98.97-3.66-.23-.37A9.02 9.02 0 012.99 12 9.01 9.01 0 1112 21.99z"/>
          <path d="M17.51 14.21c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24 0-.36.11-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.55-.4-.15-.01-.32-.01-.49-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.66 2.4 1.09 2.4.73 2.84.68.44-.05 1.42-.58 1.62-1.14.2-.56.2-1.03.14-1.14-.05-.11-.2-.18-.44-.3z"/>
        </svg>
        Message on WhatsApp
      </button>

      {/* Fallback modal */}
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
