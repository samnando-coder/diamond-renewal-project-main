import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiUrl } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'text-green-600';
    case 'created':
      return 'text-yellow-600';
    case 'cancelled':
      return 'text-red-600';
    case 'refunded':
      return 'text-gray-600';
    default:
      return 'text-muted-foreground';
  }
}

function getStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'Betaald';
    case 'created':
      return 'In behandeling';
    case 'cancelled':
      return 'Geannuleerd';
    case 'refunded':
      return 'Terugbetaald';
    default:
      return status;
  }
}

const Account = () => {
  const { isAuthenticated, refetch: refetchAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fetchAccountData = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch(apiUrl('/api/account/me'), { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) throw new Error('Not authenticated');
        return (await r.json()) as AccountResponse;
      })
      .then((data) => {
        setData(data);
        setProfileForm({ name: data.profile.name || '', email: data.profile.email });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccountData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) return;
    navigate('/login');
  }, [isAuthenticated, navigate]);

  const orders = useMemo(() => data?.orders ?? [], [data]);

  const handleSaveProfile = async () => {
    if (!data) return;
    
    setIsSavingProfile(true);
    try {
      const res = await fetch(apiUrl('/api/account/update-profile'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name.trim() || null,
          email: profileForm.email.trim().toLowerCase(),
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Fout bij bijwerken profiel');
      }

      toast({
        title: 'Profiel bijgewerkt',
        description: 'Je gegevens zijn succesvol bijgewerkt.',
      });

      setIsEditingProfile(false);
      fetchAccountData();
      refetchAuth(); // Refresh auth context
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: e instanceof Error ? e.message : 'Er is iets misgegaan.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: 'Nieuwe wachtwoorden komen niet overeen.',
      });
      return;
    }

    if (passwordForm.new.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: 'Nieuw wachtwoord moet minimaal 8 tekens lang zijn.',
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch(apiUrl('/api/account/change-password'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Fout bij wijzigen wachtwoord');
      }

      toast({
        title: 'Wachtwoord gewijzigd',
        description: 'Je wachtwoord is succesvol gewijzigd.',
      });

      setIsChangingPassword(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: e instanceof Error ? e.message : 'Er is iets misgegaan.',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

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
              <p className="text-lead-dark">Beheer je accountgegevens en bekijk je bestelgeschiedenis.</p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="profile">Account Instellingen</TabsTrigger>
                  <TabsTrigger value="orders">Bestelgeschiedenis</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  {/* Profile Information */}
                  <div className="bg-card border border-border rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-xl text-foreground">Profielgegevens</h2>
                      {!isEditingProfile && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                          Bewerken
                        </Button>
                      )}
                    </div>

                    {loading ? (
                      <p className="text-sm text-muted-foreground">Laden…</p>
                    ) : data ? (
                      <div className="space-y-4">
                        {isEditingProfile ? (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="name">Naam</Label>
                              <Input
                                id="name"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                placeholder="Je naam"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">E-mailadres</Label>
                              <Input
                                id="email"
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                placeholder="je@voorbeeld.nl"
                              />
                            </div>
                            <div className="flex gap-3 pt-2">
                              <Button
                                onClick={handleSaveProfile}
                                disabled={isSavingProfile}
                                className="bg-accent text-accent-foreground hover:bg-gold-dark"
                              >
                                {isSavingProfile ? 'Opslaan…' : 'Opslaan'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditingProfile(false);
                                  setProfileForm({ name: data.profile.name || '', email: data.profile.email });
                                }}
                                disabled={isSavingProfile}
                              >
                                Annuleren
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-muted-foreground">Naam:</span>{' '}
                              <span className="text-foreground">{data.profile.name || '-'}</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">E-mail:</span>{' '}
                              <span className="text-foreground">{data.profile.email}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Geen gegevens geladen.</p>
                    )}
                  </div>

                  {/* Password Change */}
                  <div className="bg-card border border-border rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-heading text-xl text-foreground">Wachtwoord</h2>
                        <p className="text-sm text-muted-foreground mt-1">Wijzig je wachtwoord</p>
                      </div>
                      {!isChangingPassword && (
                        <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                          Wijzigen
                        </Button>
                      )}
                    </div>

                    {isChangingPassword ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Huidig wachtwoord</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            placeholder="Huidig wachtwoord"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nieuw wachtwoord</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            placeholder="Minimaal 8 tekens"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Bevestig nieuw wachtwoord</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            placeholder="Bevestig nieuw wachtwoord"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={handleChangePassword}
                            disabled={isSavingPassword}
                            className="bg-accent text-accent-foreground hover:bg-gold-dark"
                          >
                            {isSavingPassword ? 'Wijzigen…' : 'Wachtwoord wijzigen'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordForm({ current: '', new: '', confirm: '' });
                            }}
                            disabled={isSavingPassword}
                          >
                            Annuleren
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Je wachtwoord wordt veilig opgeslagen.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <div className="bg-card border border-border rounded-sm p-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                      <div>
                        <h2 className="font-heading text-xl text-foreground">Bestelgeschiedenis</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {orders.length > 0 ? `${orders.length} bestelling${orders.length !== 1 ? 'en' : ''}` : 'Geen bestellingen'}
                        </p>
                      </div>
                      <Link to="/shop">
                        <Button className="bg-accent text-accent-foreground hover:bg-gold-dark">
                          Naar webshop
                        </Button>
                      </Link>
                    </div>

                    {loading ? (
                      <p className="text-sm text-muted-foreground">Laden…</p>
                    ) : orders.length === 0 ? (
                      <div className="p-6 bg-muted rounded-sm text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          Je hebt nog geen bestellingen. Zodra je via de webshop bestelt, verschijnen ze hier.
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
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                              <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Ordernummer</p>
                                <p className="font-mono text-sm font-medium text-foreground">{o.id}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Totaal</p>
                                <p className="font-semibold text-lg text-accent">{formatEUR(o.totalCents)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                <p className={`text-sm font-medium ${getStatusColor(o.status)}`}>
                                  {getStatusLabel(o.status)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Datum</p>
                                <p className="text-sm text-foreground">
                                  {new Date(o.createdAt).toLocaleDateString('nl-NL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Tijd</p>
                                <p className="text-sm text-foreground">
                                  {new Date(o.createdAt).toLocaleTimeString('nl-NL', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>

                            {Array.isArray(o.items) && o.items.length > 0 ? (
                              <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Bestelde items</p>
                                <div className="space-y-2">
                                  {(o.items as Array<{ name?: string; qty?: number; priceCents?: number }>).map(
                                    (it, idx) => (
                                      <div key={`${o.id}-${idx}`} className="flex justify-between items-center gap-4 text-sm py-2 border-b border-border last:border-0">
                                        <div className="flex-1">
                                          <span className="text-foreground font-medium">
                                            {it.qty ?? 1}× {it.name ?? 'Item'}
                                          </span>
                                        </div>
                                        <span className="text-muted-foreground font-medium">
                                          {typeof it.priceCents === 'number' ? formatEUR(it.priceCents * (it.qty ?? 1)) : '-'}
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
