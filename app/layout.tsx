// app/layout.tsx
import "./globals.css";
import React from "react";
import type { Metadata } from "next";

// Client components
import LoaderProvider from "./components/LoaderProvider";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "BookYourTravell — Taxi, Packages & Temple Tours in Varanasi",
  description:
    "Book taxi from Varanasi to Ayodhya, Prayagraj, Lucknow and more. Verified drivers, fair pricing, temple darshan support. 24/7 support & easy booking.",
  keywords: [
    "Varanasi taxi booking",
    "Ayodhya cab service",
    "Prayagraj tour package",
    "Kashi Vishwanath darshan",
    "Varanasi airport pickup",
    "Book travel India",
  ],
  authors: [{ name: "BookYourTravell" }],
  metadataBase: new URL("https://bookyourtravell.com"),
  openGraph: {
    title: "BookYourTravell — Taxi & Packages",
    description:
      "Trusted travel booking service from Varanasi with verified drivers, temple darshan & custom tours.",
    url: "https://bookyourtravell.com",
    siteName: "BookYourTravell",
    images: [{ url: "/images/og-image\.webp", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookYourTravell — Taxi & Packages",
    description:
      "Varanasi taxi, tours & temple darshan support. Verified drivers, honest fares.",
    images: ["/images/og-image\.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-white text-slate-900">
        <LoaderProvider />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
