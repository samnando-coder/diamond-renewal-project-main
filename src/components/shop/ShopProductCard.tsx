import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";
import type { ShopProduct } from "@/features/shop/types";
import { useAuth } from "@/hooks/useAuth";
import { useShopCart } from "@/features/shop/cart";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function ShopProductCard({ product }: { product: ShopProduct }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useShopCart();
  const { toast } = useToast();

  return (
    <div className="group bg-card border border-border rounded-sm overflow-hidden h-full flex flex-col transition-shadow hover:shadow-xl hover-glow">
      <Link to={`/shop/p/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-muted overflow-hidden relative">
          {product.image ? (
            <img
              src={getCloudinaryImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/5 to-transparent opacity-80 pointer-events-none" />
        </div>
      </Link>
      <div className="p-5 flex flex-col gap-3 grow">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{product.brand}</p>
        <h3 className="font-heading text-lg text-foreground leading-snug group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto">
          <p className="text-accent font-semibold mb-3">
            {product.priceCents == null || !isAuthenticated ? (
              <span className="text-muted-foreground">Login voor prijs</span>
            ) : (
              new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(product.priceCents / 100)
            )}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline">
              <Link to={`/shop/p/${product.id}`}>Bekijken</Link>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-navy-light"
              disabled={!isAuthenticated || product.priceCents == null}
              onClick={() => {
                if (!isAuthenticated || product.priceCents == null) {
                  toast({
                    title: "Login vereist",
                    description: "Log in om prijzen te zien en je winkelmandje te gebruiken.",
                    action: (
                      <ToastAction altText="Inloggen" asChild>
                        <Link to="/login">Inloggen</Link>
                      </ToastAction>
                    ),
                  });
                  return;
                }
                addItem(product);
                toast({
                  title: "Toegevoegd aan winkelmandje",
                  description: product.name,
                  action: (
                    <ToastAction altText="Bekijk winkelwagen" asChild>
                      <Link to="/shop/cart">Bekijk</Link>
                    </ToastAction>
                  ),
                });
              }}
            >
              Voeg toe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

