import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiUrl } from '@/lib/api';

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
    fetch(apiUrl('/api/account/me'), { credentials: 'include' })
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
                  <h2 className="font-heading text-xl text-foreground mb-4">Accountgegevens</h2>
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                  ) : data ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                          Naam
                        </p>
                        <p className="text-base font-medium text-foreground">
                          {data.profile.name || 'Niet opgegeven'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                          E-mailadres
                        </p>
                        <p className="text-base text-foreground">{data.profile.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Geen gegevens geladen.</p>
                  )}
                </div>
              </aside>

              <div className="lg:col-span-8">
                <div className="bg-card border border-border rounded-sm p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                    <div>
                      <h2 className="font-heading text-xl text-foreground">Bestelgeschiedenis</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overzicht van al je aankopen
                      </p>
                    </div>
                    <Link to="/shop">
                      <Button className="bg-accent text-accent-foreground hover:bg-gold-dark">
                        Naar webshop
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6">
                    {loading ? (
                      <p className="text-sm text-muted-foreground">Laden…</p>
                    ) : orders.length === 0 ? (
                      <div className="p-8 bg-muted rounded-sm text-center">
                        <p className="text-base text-muted-foreground mb-4">
                          Je hebt nog geen bestellingen geplaatst.
                        </p>
                        <Link to="/shop">
                          <Button className="bg-accent text-accent-foreground hover:bg-gold-dark">
                            Begin met winkelen
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((o) => (
                          <div key={o.id} className="p-5 border border-border rounded-sm hover:border-accent/50 transition-colors">
                            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                              <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                                  Bestelling
                                </p>
                                <p className="font-mono text-sm font-medium text-foreground">{o.id.slice(0, 8)}...</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                                  Totaalbedrag
                                </p>
                                <p className="text-xl font-semibold text-accent">{formatEUR(o.totalCents)}</p>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                              <p>
                                <span className="text-muted-foreground">Status:</span>{' '}
                                <span className={`font-medium ${
                                  o.status === 'paid' ? 'text-green-600' :
                                  o.status === 'created' ? 'text-yellow-600' :
                                  o.status === 'cancelled' ? 'text-red-600' :
                                  'text-foreground'
                                }`}>
                                  {o.status === 'paid' ? 'Betaald' :
                                   o.status === 'created' ? 'In behandeling' :
                                   o.status === 'cancelled' ? 'Geannuleerd' :
                                   o.status === 'refunded' ? 'Terugbetaald' :
                                   o.status}
                                </span>
                              </p>
                              <p>
                                <span className="text-muted-foreground">Datum:</span>{' '}
                                <span className="text-foreground">
                                  {new Date(o.createdAt).toLocaleDateString('nl-NL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </p>
                              {o.externalRef && (
                                <p>
                                  <span className="text-muted-foreground">Referentie:</span>{' '}
                                  <span className="text-foreground font-mono text-xs">{o.externalRef}</span>
                                </p>
                              )}
                            </div>
                            {Array.isArray(o.items) && o.items.length ? (
                              <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                                  Bestelde items
                                </p>
                                <div className="space-y-2">
                                  {(o.items as Array<{ name?: string; qty?: number; priceCents?: number }>).map(
                                    (it, idx) => {
                                      const itemTotal = (it.qty ?? 1) * (it.priceCents ?? 0);
                                      return (
                                        <div key={`${o.id}-${idx}`} className="flex justify-between gap-4 text-sm py-1">
                                          <span className="text-foreground">
                                            {it.qty ?? 1}× {it.name ?? 'Item'}
                                          </span>
                                          <span className="text-foreground font-medium">
                                            {typeof it.priceCents === 'number' ? formatEUR(itemTotal) : ''}
                                          </span>
                                        </div>
                                      );
                                    },
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

