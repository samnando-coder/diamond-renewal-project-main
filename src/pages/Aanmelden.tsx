import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Aanmelden = () => {
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({ name: name.trim() || undefined, email, password });
      toast({ title: 'Account aangemaakt', description: 'Je bent nu ingelogd.' });
      navigate('/producten');
    } catch (err) {
      toast({
        title: 'Aanmelden mislukt',
        description: err instanceof Error ? err.message : 'Probeer het opnieuw.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-display text-cream mt-4 mb-6">Aanmelden</h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Maak een account aan om verder te gaan.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto bg-card border border-border rounded-sm p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <Label>Naam (optioneel)</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Je naam"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="je@email.com"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label>Wachtwoord</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimaal 8 tekens"
                    className="mt-2"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: gebruik minimaal 8 tekens.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-gold-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Bezig…' : 'Account aanmaken'}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground mt-6 text-center">
                Al een account?{' '}
                <Link to="/login" className="text-accent hover:underline">
                  Inloggen
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Aanmelden;

