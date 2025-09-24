// app/components/ContactForm.tsx
"use client";
import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function getRecaptchaToken(): Promise<string> {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) throw new Error("Site key missing (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)");

    // @ts-ignore - grecaptcha injected by reCAPTCHA script
    const gre = (globalThis as any).grecaptcha;

    // If grecaptcha is already available and has execute
    if (gre && typeof gre.execute === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await gre.execute(siteKey, { action: "submit" });
    }

    // If grecaptcha isn't ready yet, wait for grecaptcha.ready
    return new Promise<string>((resolve, reject) => {
      // Wait up to X ms for grecaptcha to become available
      const timeout = 8000;
      let cleared = false;
      const start = Date.now();

      function tryReady() {
        // @ts-ignore
        const g = (globalThis as any).grecaptcha;
        if (g && typeof g.execute === "function") {
          // @ts-ignore
          g.ready(() => {
            // @ts-ignore
            g.execute(siteKey, { action: "submit" }).then((token: string) => {
              cleared = true;
              resolve(token);
            }).catch((err: any) => {
              cleared = true;
              reject(err);
            });
          });
          return;
        }

        if (Date.now() - start > timeout) {
          cleared = true;
          reject(new Error("reCAPTCHA not available (timeout)"));
          return;
        }

        // Retry shortly
        setTimeout(tryReady, 300);
      }

      tryReady();
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, any> = Object.fromEntries(formData.entries());

    try {
      // Get token (may throw)
      const token = await getRecaptchaToken();
      payload.recaptchaToken = token;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg("✅ Message sent successfully!");
        form.reset();
      } else {
        // if captchaData provided from server, show short hint
        if (data && data.captchaData) {
          setMsg("❌ reCAPTCHA failed — server says: " + (data.error || "verification failed"));
          console.error("Server captchaData:", data.captchaData);
        } else {
          setMsg("❌ " + (data?.error || "Failed to send"));
        }
      }
    } catch (err: any) {
      console.error("Contact submit error:", err);
      if (err?.message?.includes("Site key missing")) {
        setMsg("❌ reCAPTCHA site key not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env.local");
      } else if (err?.message?.includes("reCAPTCHA not available")) {
        setMsg("❌ reCAPTCHA script not loaded. Try hard-refresh (Ctrl+Shift+R) or check Script tag.");
      } else {
        setMsg("❌ Network or server error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-3">
      <h4 className="font-semibold">Quick Enquiry Form</h4>

      <input name="name" required placeholder="Your Name" className="w-full border rounded px-3 py-2" />
      <input name="email" type="email" required placeholder="Your Email" className="w-full border rounded px-3 py-2" />
      <input name="phone" required placeholder="Phone Number" className="w-full border rounded px-3 py-2" />
      <textarea name="message" required placeholder="Your Message" className="w-full border rounded px-3 py-2" />
      <input name="price" placeholder="Expected budget / price range" className="w-full border rounded px-3 py-2" />

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-700"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {msg && <p className="text-sm mt-2">{msg}</p>}
    </form>
  );
}
