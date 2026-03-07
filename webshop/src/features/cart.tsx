import * as React from "react";
import type { CartItem, ShopProduct } from "./types";
import { trackAddToCart } from "@/lib/analytics";

type ShopCartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalCents: number;
  addItem: (p: ShopProduct) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const ShopCartContext = React.createContext<ShopCartContextValue | null>(null);

const STORAGE_KEY = "bd_shop_cart_v1";

function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x === "object")
      .map((x) => x as CartItem)
      .filter((x) => typeof x.productId === "string" && typeof x.qty === "number" && typeof x.priceCents === "number");
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(() => (typeof window === "undefined" ? [] : readCart()));

  React.useEffect(() => {
    writeCart(items);
  }, [items]);

  const addItem = React.useCallback((p: ShopProduct) => {
    if (p.priceCents == null) return;
    setItems((prev) => {
      const existing = prev.find((x) => x.productId === p.id);
      const newQty = existing ? existing.qty + 1 : 1;
      
      // Track add to cart event
      trackAddToCart(p.id, p.name, p.priceCents, newQty);
      
      if (!existing) {
        return [
          ...prev,
          {
            productId: p.id,
            name: p.name,
            qty: 1,
            priceCents: p.priceCents,
            image: p.image ?? null,
            brand: p.brand,
          },
        ];
      }
      return prev.map((x) => (x.productId === p.id ? { ...x, qty: x.qty + 1 } : x));
    });
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const setQty = React.useCallback((productId: string, qty: number) => {
    const q = Math.max(1, Math.min(99, Math.floor(qty)));
    setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, qty: q } : x)));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalCents = items.reduce((sum, i) => sum + i.qty * i.priceCents, 0);

  const value: ShopCartContextValue = React.useMemo(
    () => ({ items, itemCount, totalCents, addItem, removeItem, setQty, clear }),
    [items, itemCount, totalCents, addItem, removeItem, setQty, clear],
  );

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>;
}

export function useShopCart() {
  const ctx = React.useContext(ShopCartContext);
  if (!ctx) throw new Error("useShopCart must be used within <ShopCartProvider />");
  return ctx;
}

