export type ShopCategory = "haar" | "gezicht" | "lichaam" | "wellness";

export type ShopProduct = {
  id: string;
  name: string;
  brand: string;
  image?: string | null;
  currency: string;
  priceCents: number | null;
};

export type CartItem = {
  productId: string;
  name: string;
  qty: number;
  priceCents: number;
  image?: string | null;
  brand?: string;
};

