import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type AccountResponse = {
  profile: { email: string; name: string | null };
  orders: Array<{
    id: string;
    createdAt: string;
    status: string;
    currency: string;
    totalCents: number;
    source: string;
    externalRef: string | null;
    items: unknown;
  }>;
};

function formatEUR(cents: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

const Account = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch('/api/account/me', { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) throw new Error('Not authenticated');
        return (await r.json()) as AccountResponse;
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) return;
    navigate('/login');
  }, [isAuthenticated, navigate]);

  const orders = useMemo(() => data?.orders ?? [], [data]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Account</span>
              <h1 className="text-display text-cream mt-4 mb-6">Mijn account</h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Bekijk je gegevens en eerdere aankopen.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-8">
              <aside className="lg:col-span-4">
                <div className="bg-card border border-border rounded-sm p-6">
                  <h2 className="font-heading text-xl text-foreground mb-4">Gegevens</h2>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Laden…</p>
                  ) : data ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">E-mail:</span>{' '}
                        <span className="text-foreground">{data.profile.email}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Naam:</span>{' '}
                        <span className="text-foreground">{data.profile.name ?? '-'}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-4">
                        (Bewerken van gegevens voegen we hierna toe.)
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Geen gegevens geladen.</p>
                  )}
                </div>
              </aside>

              <div className="lg:col-span-8">
                <div className="bg-card border border-border rounded-sm p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="font-heading text-xl text-foreground">Aankopen</h2>
                    <Link to="/producten">
                      <Button className="bg-accent text-accent-foreground hover:bg-gold-dark">
                        Naar webshop
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6">
                    {loading ? (
                      <p className="text-sm text-muted-foreground">Laden…</p>
                    ) : orders.length === 0 ? (
                      <div className="p-6 bg-muted rounded-sm">
                        <p className="text-sm text-muted-foreground">
                          Je hebt nog geen aankopen. Zodra je via de webshop bestelt, verschijnen ze hier.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((o) => (
                          <div key={o.id} className="p-5 border border-border rounded-sm">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div>
                                <p className="text-sm text-muted-foreground">Order</p>
                                <p className="font-medium text-foreground">{o.id}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Totaal</p>
                                <p className="font-semibold text-accent">{formatEUR(o.totalCents)}</p>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                              <p>
                                <span className="text-muted-foreground">Status:</span> {o.status}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Bron:</span> {o.source}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Datum:</span>{' '}
                                {new Date(o.createdAt).toLocaleString('nl-NL')}
                              </p>
                            </div>
                            {Array.isArray(o.items) && o.items.length ? (
                              <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                                  Items
                                </p>
                                <div className="space-y-2">
                                  {(o.items as Array<{ name?: string; qty?: number; priceCents?: number }>).map(
                                    (it, idx) => (
                                      <div key={`${o.id}-${idx}`} className="flex justify-between gap-4 text-sm">
                                        <span className="text-foreground">
                                          {it.qty ?? 1}× {it.name ?? 'Item'}
                                        </span>
                                        <span className="text-muted-foreground">
                                          {typeof it.priceCents === 'number' ? formatEUR(it.priceCents) : ''}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Account;

