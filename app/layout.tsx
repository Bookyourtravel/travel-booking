// app/layout.tsx
import "./globals.css"; // तुम्हारे globals.css का path सही होना चाहिए
import React from "react";

export const metadata = {
  title: "BookYourTravell",
  description: "Trusted cabs, pilgrimage packages and tours in Varanasi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google font for the royal heading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
