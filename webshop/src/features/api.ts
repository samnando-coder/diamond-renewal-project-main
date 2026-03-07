import type { ShopProduct } from "./types";
import { SHOP_PRODUCTS } from "@/data/shopCatalog";

import { apiUrl } from '@/lib/api';

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  // Always return static products from SHOP_PRODUCTS
  // The API endpoint may return empty array if database is empty
  // So we always use the static catalog as source of truth
  return SHOP_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image ?? null,
    currency: "EUR",
    priceCents: p.price ? Math.round(p.price * 100) : null,
  }));
}

