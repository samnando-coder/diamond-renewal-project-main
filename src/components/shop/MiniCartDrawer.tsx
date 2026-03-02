import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useShopCart } from "@/features/shop/cart";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";
import { useAuth } from "@/hooks/useAuth";

type MiniCartDrawerProps = {
  trigger: React.ReactNode;
};

export function MiniCartDrawer({ trigger }: MiniCartDrawerProps) {
  const { isAuthenticated } = useAuth();
  const { items, totalCents, itemCount, removeItem } = useShopCart();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const money = (cents: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="p-0 w-[92vw] sm:w-[420px]">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Winkelmandje ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="p-6">
          {items.length === 0 ? (
            <div className="bg-muted rounded-sm p-6 text-sm text-muted-foreground">
              Je winkelmandje is nog leeg.
              <div className="mt-4">
                <Button
                  className="bg-accent text-accent-foreground hover:bg-gold-dark"
                  onClick={() => go("/shop/search")}
                >
                  Bekijk producten
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[48vh] overflow-auto pr-2 space-y-4">
                {items.map((i) => (
                  <div key={i.productId} className="flex gap-3">
                    <Link to={`/shop/p/${i.productId}`} onClick={() => setOpen(false)} className="shrink-0">
                      <div className="w-20 aspect-[4/3] bg-muted rounded-sm overflow-hidden border border-border">
                        {i.image ? (
                          <img
                            src={getCloudinaryImageUrl(i.image)}
                            alt={i.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                      {i.brand ? (
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{i.brand}</p>
                      ) : null}
                      <Link
                        to={`/shop/p/${i.productId}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-foreground font-medium hover:underline line-clamp-2"
                      >
                        {i.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {i.qty} × {money(i.priceCents)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 p-2 rounded-sm hover:bg-muted transition-colors"
                      aria-label="Verwijder"
                      onClick={() => removeItem(i.productId)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Totaal</p>
                  <p className="text-lg font-semibold text-accent">{money(totalCents)}</p>
                </div>

                {!isAuthenticated ? (
                  <div className="grid gap-3">
                    <p className="text-xs text-muted-foreground">Log in om af te rekenen.</p>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-navy-light"
                      onClick={() => go(`/login?next=${encodeURIComponent(location.pathname + location.search)}`)}
                    >
                      Inloggen
                    </Button>
                    <Button variant="outline" onClick={() => go("/shop/cart")}>
                      Naar winkelwagen
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Button variant="outline" onClick={() => go("/shop/cart")}>
                      Naar winkelwagen
                    </Button>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-gold-dark"
                      onClick={() => go("/shop/checkout")}
                    >
                      Afrekenen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

