"use client";

import React from "react";
import Link from "next/link";

const SUPPORT_PHONE = "+919389971003";

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-orange-600/90 backdrop-blur-md shadow-lg border-b border-orange-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Brand + Tabs */}
          <div className="flex items-center gap-8">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white text-orange-600 font-bold flex items-center justify-center shadow">
                BY
              </div>
              <span className="font-bold text-xl tracking-wide text-white drop-shadow">
                BookYourTravell
              </span>
            </Link>

            {/* Tabs */}
            <nav className="hidden md:flex items-center gap-4">
              {[
                { href: "/#popular-services", label: "Services" },
                { href: "/packages", label: "Packages" },
                { href: "/reviews", label: "Reviews" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-semibold text-white hover:bg-orange-700/70 transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${SUPPORT_PHONE.replace(/^\+/, "")}`,
                  "_blank"
                )
              }
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow"
            >
              WhatsApp
            </button>

            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="hidden md:inline-flex px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm text-white font-semibold"
            >
              Call
            </a>

            <Link
              href="/#top-trip-planner"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 hover:bg-black/50 text-white text-sm font-bold shadow"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
