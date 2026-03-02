import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { trackPurchase } from "@/lib/analytics";

type OrderData = {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: Array<{ name: string; qty: number; priceCents: number }>;
};

export default function ShopCheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Geen sessie-ID gevonden.");
      setLoading(false);
      return;
    }

    // Fetch order by session ID
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Order niet gevonden.");
        return (await res.json()) as { order?: OrderData };
      })
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          
          // Track purchase event for Google Analytics
          if (data.order.status === 'paid' || data.order.status === 'created') {
            trackPurchase(
              data.order.id,
              data.order.totalCents,
              'EUR',
              data.order.items.map((item: { name: string; qty: number; priceCents: number }, idx: number) => ({
                item_id: `item_${idx}`,
                item_name: item.name,
                price: item.priceCents,
                quantity: item.qty,
              }))
            );
          }
        } else {
          setError("Order niet gevonden.");
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Er is iets misgegaan.");
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const formatEUR = (cents: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);

  return (
    <Section spacing="default">
      <Container size="wide">
        <PageHeader
          title="Bestelling ontvangen"
          crumbs={[
            { label: "Shop", href: "/shop" },
            { label: "Bestelling ontvangen" },
          ]}
        />

        <div className="mt-8 max-w-2xl">
          {loading ? (
            <div className="bg-card border border-border rounded-sm p-8 text-center">
              <p className="text-sm text-muted-foreground">Bestelling ophalen…</p>
            </div>
          ) : error ? (
            <div className="bg-card border border-border rounded-sm p-8">
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-3">
                <Button asChild className="bg-accent text-accent-foreground hover:bg-gold-dark">
                  <Link to="/account">Naar account</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/shop">Naar shop</Link>
                </Button>
              </div>
            </div>
          ) : order ? (
            <div className="bg-card border border-border rounded-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="font-heading text-xl text-foreground">Betaling ontvangen</h2>
                  <p className="text-sm text-muted-foreground">Je bestelling is bevestigd.</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Ordernummer</p>
                    <p className="font-medium text-foreground">{order.id}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground capitalize">{order.status}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Datum</p>
                    <p className="font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleString("nl-NL")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Totaal</p>
                    <p className="text-lg font-semibold text-accent">{formatEUR(order.totalCents)}</p>
                  </div>
                </div>

                {order.items.length > 0 ? (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-4 text-sm">
                          <span className="text-foreground">
                            {item.qty}× {item.name}
                          </span>
                          <span className="text-muted-foreground">{formatEUR(item.priceCents * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="pt-6 border-t border-border space-y-3">
                <p className="text-sm text-muted-foreground">
                  Je ontvangt een bevestigingsmail op je e-mailadres. Je bestelling wordt zo snel mogelijk verzonden.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-gold-dark">
                    <Link to="/account">Bekijk in account</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/shop">Verder winkelen</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
