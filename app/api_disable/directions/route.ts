// app/api/directions/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, destination } = body;

    if (!origin || !destination) {
      return NextResponse.json({ error: "Missing origin or destination" }, { status: 400 });
    }

    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Server API key not configured" }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&key=${key}`;

    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ error: "Directions API error", details: txt }, { status: 502 });
    }

    const data = await r.json();

    if (!data.routes || data.routes.length === 0) {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }

    const leg = data.routes[0].legs[0];
    const distanceMeters = leg.distance?.value ?? 0;
    const distanceText = leg.distance?.text ?? "";
    const durationText = leg.duration?.text ?? "";

    return NextResponse.json({
      distanceMeters,
      distanceKm: Number((distanceMeters / 1000).toFixed(2)),
      distanceText,
      durationText,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
