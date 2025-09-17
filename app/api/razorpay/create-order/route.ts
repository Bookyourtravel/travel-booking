// app/api/razorpay/create-order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected body: { amount: number, currency?: string, receipt?: string }
    const amountPaise = Math.round((body.amount || 1) * 100); // rupees -> paise
    const options = {
      amount: amountPaise,
      currency: body.currency || "INR",
      receipt: body.receipt || `rcpt_${Date.now()}`,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    console.error("create-order err:", err);
    return NextResponse.json({ ok: false, error: err.message || err }, { status: 500 });
  }
}
