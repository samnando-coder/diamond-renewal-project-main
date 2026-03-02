import { ShopCartProvider } from "@/features/shop/cart";
import { ShopLayout } from "@/components/shop/ShopLayout";

export default function ShopAppShell() {
  return (
    <ShopCartProvider>
      <ShopLayout />
    </ShopCartProvider>
  );
}

