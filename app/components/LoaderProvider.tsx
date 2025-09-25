// app/components/LoaderProvider.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname } from "next/navigation";

// NProgress config
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.08 });

export default function LoaderProvider() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // ref to avoid scheduling multiple setTimeouts and to track mounted state
  const scheduledRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (scheduledRef.current) {
        clearTimeout(scheduledRef.current);
        scheduledRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // When pathname changes (navigation complete in app-router), finish progress.
    if (!pathname) return;
    NProgress.done();

    // hide our loading badge shortly after done
    if (scheduledRef.current) {
      clearTimeout(scheduledRef.current);
      scheduledRef.current = null;
    }
    scheduledRef.current = setTimeout(() => {
      // safety: only update if still mounted
      if (isMountedRef.current) setLoading(false);
      scheduledRef.current = null;
    }, 250);

    return () => {
      if (scheduledRef.current) {
        clearTimeout(scheduledRef.current);
        scheduledRef.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    // helper to start progress and set loading state (scheduled to avoid insertion-phase updates)
    const start = () => {
      // start the visual progress immediately
      NProgress.start();

      // schedule setting the React state outside of insertion phase / sync handlers
      if (!scheduledRef.current) {
        scheduledRef.current = setTimeout(() => {
          scheduledRef.current = null;
          if (isMountedRef.current) setLoading(true);
        }, 0); // schedule next tick (microtask-ish)
      }
    };

    // Patch history.pushState and history.replaceState so SPA navigations trigger loader immediately
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    // @ts-ignore - temporarily override
    history.pushState = function (...args: any[]) {
      start();
      // call original
      // eslint-disable-next-line prefer-rest-params
      return origPush.apply(this, args as any);
    };

    // @ts-ignore
    history.replaceState = function (...args: any[]) {
      start();
      // eslint-disable-next-line prefer-rest-params
      return origReplace.apply(this, args as any);
    };

    // capture clicks on same-origin anchor tags (<a href="/...">) to start progress immediately
    const onClick = (e: MouseEvent) => {
      // only left-click without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // find nearest <a> ancestor
      let el = e.target as HTMLElement | null;
      while (el && el.tagName !== "A") el = el.parentElement;
      if (!el) return;

      const a = el as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (!href) return;

      // ignore external links / anchors to same page (#) / mailto/tel
      if (href.startsWith("http") && !href.startsWith(location.origin)) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;

      // start progress
      start();
    };

    // Also start on popstate (browser back/forward)
    const onPop = () => start();

    window.addEventListener("click", onClick, true); // capture phase so it fires before navigation
    window.addEventListener("popstate", onPop);

    // cleanup: restore originals
    return () => {
      // restore history functions
      // @ts-ignore
      history.pushState = origPush;
      // @ts-ignore
      history.replaceState = origReplace;
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);

      if (scheduledRef.current) {
        clearTimeout(scheduledRef.current);
        scheduledRef.current = null;
      }
    };
  }, []);

  // Simple bottom-right loading badge markup + minimal inline styles
  return (
    <>
      {loading && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            right: 16,
            bottom: 24,
            zIndex: 9999,
            background: " rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 10,
            fontSize: 13,
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
            backdropFilter: "blur(4px)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 50 50"
            style={{ display: "block", transform: "translateY(-1px)" }}
          >
            <path
              fill="#fff"
              d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068
              c0-8.071,6.545-14.616,14.615-14.616c8.071,0,14.616,6.545,14.616,14.616H43.935z"
            >
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <span>Loading…</span>
        </div>
      )}
    </>
  );
}
