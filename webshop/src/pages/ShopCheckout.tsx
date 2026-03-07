import * as React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useShopCart } from "@/features/shop/cart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { calculateShippingCost, getShippingCostDisplay, getTotalWithShipping } from "@/features/shop/shipping";
import { trackBeginCheckout } from "@/lib/analytics";
import { apiUrl } from "@/lib/api";

export default function ShopCheckout() {
  const { isAuthenticated } = useAuth();
  const { items, totalCents } = useShopCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const shippingCost = calculateShippingCost(totalCents);
  const totalWithShipping = getTotalWithShipping(totalCents);

  // Track begin checkout when page loads
  React.useEffect(() => {
    if (items.length > 0 && isAuthenticated) {
      trackBeginCheckout(
        totalWithShipping,
        items.map((i) => ({
          item_id: i.productId,
          item_name: i.name,
          price: i.priceCents,
          quantity: i.qty,
        }))
      );
    }
  }, []); // Only on mount

  const checkout = async () => {
    if (!isAuthenticated || items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch(apiUrl("/api/checkout/create-session"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((c) => ({ productId: c.productId, qty: c.qty })),
          successUrl: `${window.location.origin}/shop/checkout/success`,
          cancelUrl: `${window.location.origin}/shop/cart`,
        }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Checkout mislukt.");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Checkout mislukt",
        description: e instanceof Error ? e.message : "Er is iets misgegaan. Probeer het opnieuw.",
      });
      setIsCheckingOut(false);
    }
  };

  return (
    <Section spacing="default">
      <Container size="wide">
        <PageHeader title="Afrekenen" crumbs={[{ label: "Shop", href: "/shop" }, { label: "Afrekenen" }]} />

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="bg-card border border-border rounded-sm p-6">
              <p className="text-sm text-muted-foreground mb-2">Controleer je bestelling en rond af.</p>
              <div className="mt-6 space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Geen items.{" "}
                    <Link className="text-accent hover:underline" to="/shop">
                      Ga naar shop
                    </Link>
                    .
                  </p>
                ) : (
                  items.map((i) => (
                    <div key={i.productId} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-foreground">{i.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {i.qty} ×{" "}
                          {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(i.priceCents / 100)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                          (i.qty * i.priceCents) / 100,
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Subtotaal</p>
                  <p className="text-foreground">
                    {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(totalCents / 100)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Verzendkosten</p>
                  <p className="text-foreground">{getShippingCostDisplay(totalCents)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Totaal</p>
                <p className="text-lg font-semibold text-accent">
                  {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                    totalWithShipping / 100,
                  )}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-card border border-border rounded-sm p-6">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Betaal</p>

              {!isAuthenticated ? (
                <div className="grid gap-3">
                  <p className="text-xs text-muted-foreground">Log in om af te rekenen.</p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-navy-light">
                    <Link to="/login">Inloggen</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-gold-dark"
                    disabled={items.length === 0 || isCheckingOut}
                    onClick={checkout}
                  >
                    {isCheckingOut ? "Doorsturen naar Stripe…" : "Afrekenen"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/shop/cart">Terug naar winkelwagen</Link>
                  </Button>
                </div>
              )}

              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                <p>Je wordt veilig doorgestuurd naar Stripe om af te rekenen.</p>
                <p>Na betaling kom je terug in je account.</p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

