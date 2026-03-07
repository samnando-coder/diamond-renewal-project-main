import { Outlet } from "react-router-dom";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopFooter } from "@/components/shop/ShopFooter";

export function ShopLayout() {
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <ShopFooter />
    </div>
  );
}

