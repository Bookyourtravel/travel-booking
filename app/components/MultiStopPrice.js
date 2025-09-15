// Multi-stop price calculator (server/client compatible)
const CAB_MULTIPLIERS = { sedan: 1, suv: 1.35, innova: 1.6 };

export function calculateMultiStopPrice(routeOrder, distanceMap, options = {}) {
  const { cabType = "sedan", passengers = 2, includeGuide = false } = options;
  const perKmRate = 9;
  const basePerLeg = 500;
  let legs = [];
  for (let i = 0; i < routeOrder.length - 1; i++) {
    const a = routeOrder[i], b = routeOrder[i + 1];
    const key1 = `${a}-${b}`, key2 = `${b}-${a}`;
    const km = distanceMap[key1] ?? distanceMap[key2] ?? null;
    if (km == null) throw new Error(`Distance not found for leg ${a} → ${b}`);
    legs.push({ from: a, to: b, km });
  }
  let intercitySum = 0;
  for (const leg of legs) {
    const legBase = basePerLeg + Math.round(leg.km * perKmRate);
    intercitySum += legBase;
  }
  const multiplier = CAB_MULTIPLIERS[cabType] ?? 1;
  let subtotal = Math.round(intercitySum * multiplier);
  if (legs.length >= 2) subtotal += 300; // multi-stop handling charge
  if (includeGuide) subtotal += 700;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;
  return { legs, intercitySum, multiplier, subtotal, serviceFee, total };
}
