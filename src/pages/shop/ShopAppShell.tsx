import { ShopCartProvider } from "@/features/shop/cart";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ShopErrorBoundary } from "@/components/shop/ErrorBoundary";

export default function ShopAppShell() {
  return (
    <ShopErrorBoundary>
      <ShopCartProvider>
        <ShopLayout />
      </ShopCartProvider>
    </ShopErrorBoundary>
  );
}

