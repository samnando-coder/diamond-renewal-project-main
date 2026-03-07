import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useShopCart } from "@/features/shop/cart";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";
import { useAuth } from "@/hooks/useAuth";
import { calculateShippingCost, getShippingCostDisplay, getTotalWithShipping } from "@/features/shop/shipping";

export default function ShopCart() {
  const { isAuthenticated } = useAuth();
  const { items, totalCents, itemCount, removeItem, setQty, clear } = useShopCart();
  const shippingCost = calculateShippingCost(totalCents);
  const totalWithShipping = getTotalWithShipping(totalCents);

  return (
    <Section spacing="default">
      <Container size="wide">
        <PageHeader title="Winkelwagen" crumbs={[{ label: "Shop", href: "/shop" }, { label: "Winkelwagen" }]} />

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Items */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">{itemCount} items</p>
                {items.length ? (
                  <Button variant="outline" size="sm" onClick={clear}>
                    Leegmaken
                  </Button>
                ) : null}
              </div>

              {items.length === 0 ? (
                <div className="p-8">
                  <p className="text-sm text-muted-foreground mb-4">Je winkelwagen is nog leeg.</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
                  >
                    Naar shop
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {items.map((i) => (
                    <div key={i.productId} className="p-6 grid gap-4 sm:grid-cols-12 items-start">
                      <Link to={`/shop/p/${i.productId}`} className="sm:col-span-3">
                        <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden">
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

                      <div className="sm:col-span-6">
                        {i.brand ? (
                          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{i.brand}</p>
                        ) : null}
                        <Link to={`/shop/p/${i.productId}`} className="font-heading text-lg text-foreground hover:underline">
                          {i.name}
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(i.priceCents / 100)}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                          <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground" htmlFor={`qty-${i.productId}`}>
                            Aantal
                          </label>
                          <input
                            id={`qty-${i.productId}`}
                            type="number"
                            min={1}
                            max={99}
                            value={i.qty}
                            onChange={(e) => setQty(i.productId, Number(e.target.value))}
                            className="h-10 w-20 rounded-sm border border-border bg-background px-3 text-sm text-foreground"
                          />
                          <Button variant="outline" size="sm" onClick={() => removeItem(i.productId)}>
                            Verwijder
                          </Button>
                        </div>
                      </div>

                      <div className="sm:col-span-3 sm:text-right">
                        <p className="text-sm font-medium text-foreground">
                          {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                            (i.qty * i.priceCents) / 100,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-card border border-border rounded-sm p-6">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Samenvatting</p>
              <div className="grid gap-2 text-sm">
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
                {shippingCost > 0 && totalCents < 5000 ? (
                  <p className="text-xs text-muted-foreground">
                    Bestel voor €{((5000 - totalCents) / 100).toFixed(2)} meer voor gratis verzending
                  </p>
                ) : null}
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Totaal</p>
                  <p className="text-lg font-semibold text-accent">
                    {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                      totalWithShipping / 100,
                    )}
                  </p>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="mt-6 grid gap-3">
                  <p className="text-xs text-muted-foreground">Log in om af te rekenen.</p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-navy-light">
                    <Link to="/login">Inloggen</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/aanmelden">Aanmelden</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full mt-6 bg-accent text-accent-foreground hover:bg-gold-dark"
                  disabled={items.length === 0}
                >
                  <Link to="/shop/checkout">Naar afrekenen</Link>
                </Button>
              )}

              <p className="text-xs text-muted-foreground mt-3">
                Verzending en eventuele kortingen worden later toegevoegd.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

