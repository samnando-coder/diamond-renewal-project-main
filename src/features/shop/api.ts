import type { ShopProduct } from "./types";
import { SHOP_PRODUCTS } from "@/data/shopCatalog";

import { apiUrl } from '@/lib/api';

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  // Always use static products from shopCatalog.ts
  // Database products are optional (for prices when logged in)
  return SHOP_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image ?? null,
    currency: "EUR",
    priceCents: p.price ? Math.round(p.price * 100) : null,
  }));
}

