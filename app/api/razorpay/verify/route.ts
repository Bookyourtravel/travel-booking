// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Expected POST body from client after checkout:
 * {
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string
 * }
 *
 * This route verifies signature using RAZORPAY_KEY_SECRET and returns ok:true if valid.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: "Missing required parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("Missing RAZORPAY_KEY_SECRET in env");
      return NextResponse.json({ ok: false, error: "Server misconfiguration" }, { status: 500 });
    }

    // create expected signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (expected === razorpay_signature) {
      // signature valid — do post-payment work here (save to DB, mark order paid, send emails, etc.)
      return NextResponse.json({ ok: true, verified: true });
    } else {
      console.warn("Razorpay signature mismatch", { expected, got: razorpay_signature });
      return NextResponse.json({ ok: false, verified: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("verify-route error:", err);
    return NextResponse.json({ ok: false, error: err.message || err }, { status: 500 });
  }
}
