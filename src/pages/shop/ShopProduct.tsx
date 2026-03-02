import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useShopProducts } from "@/features/shop/useShopProducts";
import { useShopCart } from "@/features/shop/cart";
import { useAuth } from "@/hooks/useAuth";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useSEO } from "@/hooks/useSEO";
import { trackEvent } from "@/lib/analytics";
import { apiUrl } from "@/lib/api";

export default function ShopProduct() {
  const { id } = useParams();
  const { data: products = [], isLoading } = useShopProducts();
  const { isAuthenticated } = useAuth();
  const { addItem } = useShopCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const product = products.find((p) => p.id === id);
  
  // Track view_item event when product is loaded
  React.useEffect(() => {
    if (product && product.priceCents != null) {
      trackEvent('view_item', {
        currency: 'EUR',
        value: product.priceCents,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_brand: product.brand,
            price: product.priceCents,
            quantity: 1,
          },
        ],
      });
    }
  }, [product]);
  
  useSEO({
    title: product?.name,
    description: product ? `${product.brand} — ${product.name}${product.priceCents ? ` — ${new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(product.priceCents / 100)}` : ""}` : undefined,
    image: product?.image ? getCloudinaryImageUrl(product.image) : undefined,
    url: typeof window !== "undefined" && product ? `${window.location.origin}/shop/p/${product.id}` : undefined,
  });

  const directCheckout = async () => {
    if (!isAuthenticated || !product || product.priceCents == null) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch(apiUrl("/api/checkout/create-session"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, qty: 1 }],
          successUrl: `${window.location.origin}/account`,
          cancelUrl: `${window.location.origin}/shop/p/${product.id}`,
        }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Checkout mislukt.");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Checkout mislukt.");
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <Section spacing="default">
        <Container size="wide">
          <div className="p-6 bg-muted rounded-sm text-sm text-muted-foreground">Product laden…</div>
        </Container>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section spacing="default">
        <Container size="wide">
          <div className="bg-card border border-border rounded-sm p-8">
            <p className="text-sm text-muted-foreground mb-4">Dit product is niet gevonden.</p>
            <Link to="/shop" className="text-accent hover:underline">
              Terug naar shop
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 4);

  return (
    <div>
      <Section spacing="default">
        <Container size="wide">
          <PageHeader
            title={product.name}
            crumbs={[{ label: "Shop", href: "/shop" }, { label: product.brand, href: "/shop/search?q=" + encodeURIComponent(product.brand) }, { label: product.name }]}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="bg-card border border-border rounded-sm overflow-hidden shadow-lg">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {product.image ? (
                    <img
                      src={getCloudinaryImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  ) : null}
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Tip: wil je advies voor jouw routine? Neem contact op — we helpen je graag kiezen.
              </div>
            </div>

            {/* Buy box */}
            <aside className="lg:col-span-5">
              <div className="sticky top-28 bg-card border border-border rounded-sm p-6 shadow-lg">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{product.brand}</p>
                <h2 className="font-heading text-2xl text-foreground leading-snug mb-4">{product.name}</h2>

                <p className="text-accent font-semibold text-xl mb-6">
                  {product.priceCents == null || !isAuthenticated ? (
                    <span className="text-muted-foreground">Login voor prijs</span>
                  ) : (
                    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(product.priceCents / 100)
                  )}
                </p>

                <div className="mb-6 grid gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Levering</span>
                    <span className="text-foreground/80">1–3 werkdagen</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Voorraad</span>
                    <span className="text-foreground/80">Op voorraad</span>
                  </div>
                </div>

                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-navy-light">
                      <Link to="/login">Inloggen</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/aanmelden">Aanmelden</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      disabled={product.priceCents == null}
                      onClick={() => {
                        if (product.priceCents == null) return;
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
                      Voeg toe aan winkelwagen
                    </Button>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-gold-dark"
                      disabled={isCheckingOut || product.priceCents == null}
                      onClick={directCheckout}
                    >
                      {isCheckingOut ? "Doorsturen…" : "Koop nu"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Levering en voorraadstatus worden later verfijnd. Afrekenen gaat via Stripe.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Tabs/accordions */}
      <Section spacing="default" className="bg-cream-dark">
        <Container size="wide">
          <div className="grid gap-4">
            {[
              {
                title: "Omschrijving",
                body:
                  "Een premium product uit onze salonselectie. Gebruik volgens de aanbevolen routine of vraag ons om persoonlijk advies.",
              },
              {
                title: "Specificaties",
                body:
                  "Merk, inhoud en varianten worden stapsgewijs uitgebreid. Voor nu tonen we de basisinformatie die uit de shop-API beschikbaar is.",
              },
              {
                title: "Reviews",
                body: "Reviews volgen later. Wil je feedback delen? Neem gerust contact op.",
              },
            ].map((t) => (
              <details key={t.title} className="bg-card border border-border rounded-sm p-6">
                <summary className="cursor-pointer font-heading text-lg text-foreground">{t.title}</summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length ? (
        <Section spacing="default">
          <Container size="wide">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-heading text-foreground">Gerelateerd</h2>
                <div className="accent-line mb-4" />
                <p className="text-sm text-muted-foreground">Meer van {product.brand}.</p>
              </div>
              <Link className="text-xs tracking-[0.2em] uppercase text-accent hover:underline" to={`/shop/search?q=${encodeURIComponent(product.brand)}`}>
                Bekijk alles
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}

