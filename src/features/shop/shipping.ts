/**
 * Shipping costs calculation
 * Free shipping above threshold, fixed cost below
 */

const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // €50.00
const SHIPPING_COST_CENTS = 495; // €4.95

export function calculateShippingCost(subtotalCents: number): number {
  if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
    return 0;
  }
  return SHIPPING_COST_CENTS;
}

export function getShippingCostDisplay(subtotalCents: number): string {
  const cost = calculateShippingCost(subtotalCents);
  if (cost === 0) {
    return "Gratis";
  }
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cost / 100);
}

export function getTotalWithShipping(subtotalCents: number): number {
  return subtotalCents + calculateShippingCost(subtotalCents);
}
