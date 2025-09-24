// app/api/contact/route.ts
import { NextResponse } from "next/server";

type Hit = { count: number; firstSeen: number };

const ALLOWED_ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://bookyourtravell.com").replace(/\/$/, "");
const RATE_LIMIT = Number(process.env.CONTACT_RATE_LIMIT_PER_IP || 5);
const RATE_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW || 3600) * 1000;

const ipMap = new Map<string, Hit>();

function validateEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function validatePhone(p: string) {
  return /^[0-9+\-\s]{7,15}$/.test(p);
}

export async function POST(req: Request) {
  try {
    // Origin / Referer check (basic)
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    if (origin && !origin.startsWith(ALLOWED_ORIGIN)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
    }

    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
    // Rate limiting (in-memory, simple)
    const now = Date.now();
    const hit = ipMap.get(ip);
    if (hit) {
      if (now - hit.firstSeen < RATE_WINDOW_MS) {
        if (hit.count >= RATE_LIMIT) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        hit.count++;
      } else {
        ipMap.set(ip, { count: 1, firstSeen: now });
      }
    } else {
      ipMap.set(ip, { count: 1, firstSeen: now });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const { name, email, phone, message, price, recaptchaToken } = body;

    // Basic required checks
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!validateEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (!validatePhone(phone)) return NextResponse.json({ error: "Invalid phone" }, { status: 400 });

    if (!recaptchaToken) return NextResponse.json({ error: "Missing recaptcha token" }, { status: 400 });

    // Verify reCAPTCHA server-side
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(recaptchaToken)}`;
    const r = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await r.json().catch(() => null);
    if (!captchaData || !captchaData.success) {
      return NextResponse.json({ error: "Failed reCAPTCHA verification" }, { status: 400 });
    }

    // Enforce score threshold (strict)
    const MIN_SCORE = 0.5;
    if (typeof captchaData.score === "number" && captchaData.score < MIN_SCORE) {
      return NextResponse.json({ error: "Low reCAPTCHA score" }, { status: 400 });
    }

    // At this point reCAPTCHA passed and input validated.
    // TODO: store to DB or send email (server-side) - minimal PII only.
    // Example response (do not echo sensitive internals)
    return NextResponse.json({ success: true, msg: "Form accepted" });
  } catch (err) {
    console.error("Contact API unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
