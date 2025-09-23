// app/packages/BackgroundSlideshowClient.tsx
"use client";
import React from "react";

export default function BackgroundSlideshowClient() {
  const IMAGES = ["/images/bw1.jpg", "/images/bw2.jpg", "/images/bw3.jpg", "/images/bw4.jpg"];
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",   // <-- scroll ke sath chalega
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === idx ? 0.08 : 0,  // <-- halka watermark
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}
