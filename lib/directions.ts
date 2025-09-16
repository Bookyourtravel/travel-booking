// lib/directions.ts
export type RouteResponse = {
  distanceMeters: number;
  distanceKm: number;
  distanceText: string;
  durationText: string;
};

export async function getRouteFromServer(originLatLng: string, destinationLatLng: string): Promise<RouteResponse> {
  const res = await fetch("/api/directions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin: originLatLng, destination: destinationLatLng }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown" }));
    throw new Error(err.error || "Failed to fetch route");
  }

  const data = await res.json();
  // expected: { distanceMeters, distanceKm, distanceText, durationText }
  if (data.error) throw new Error(data.error || "No route");
  return data as RouteResponse;
}
