// app/packages/BackgroundSlideshowClient.tsx
"use client";
import React, { useEffect, useState } from "react";

/**
 * हल्का background slideshow जो fixed रहता है और page के पीछे subtle watermark/texture देता है.
 * यह client-only है ताकि page server-side fast रहे।
 */

export default function BackgroundSlideshowClient() {
  const IMAGES = [
    "/images/bw1\.webp",
    "/images/bw2\.webp",
    "/images/bw3\.webp"
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 900ms ease, transform 900ms ease, filter 900ms ease",
            transform: i === idx ? "scale(1.03)" : "scale(1.02)",
            filter: i === idx ? "brightness(0.85) saturate(0.95)" : "brightness(0.95) saturate(0.95)",
            opacity: i === idx ? 0.14 : 0,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(255,250,245,0.04), rgba(0,0,0,0.04))",
        }}
      />
    </div>
  );
}
