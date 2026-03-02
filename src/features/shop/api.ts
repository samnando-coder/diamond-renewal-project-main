import type { ShopProduct } from "./types";
import { SHOP_PRODUCTS } from "@/data/shopCatalog";

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  try {
    const res = await fetch("/api/shop/products", { credentials: "include" });
    if (!res.ok) throw new Error("Producten ophalen mislukt.");
    const data = (await res.json()) as { products?: ShopProduct[] };
    return data.products ?? [];
  } catch {
    // Fallback for static hosting (no API) so products remain visible.
    return SHOP_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      image: p.image ?? null,
      currency: "EUR",
      priceCents: p.price ? Math.round(p.price * 100) : null,
    }));
  }
}

