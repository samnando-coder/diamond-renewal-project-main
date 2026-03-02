import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { OpeningHoursList } from '@/components/shared/OpeningHoursList';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bericht verzonden!",
      description: "We nemen zo snel mogelijk contact met u op.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Neem Contact Op
              </span>
              <h1 className="text-display text-cream mt-4 mb-6">
                Contact
              </h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Heb je vragen of wil je een afspraak maken? 
                Neem gerust contact met ons op.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="font-heading text-2xl text-foreground mb-6">
                  Stuur ons een bericht
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Naam *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Je naam"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        E-mail *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="je@email.com"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Telefoon
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 - 12345678"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Onderwerp *
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Bijv. Afspraak maken"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Bericht *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Je bericht..."
                      rows={6}
                      className="bg-background"
                    />
                  </div>

                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-gold-dark">
                    <Send className="w-4 h-4 mr-2" />
                    Verstuur bericht
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="font-heading text-2xl text-foreground mb-6">
                  Onze gegevens
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4 p-6 bg-cream-dark rounded-sm">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Adres</h3>
                      <p className="text-muted-foreground">
                        Noordeinde 35<br />
                        2514 GC Den Haag
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-cream-dark rounded-sm">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Telefoon</h3>
                      <a
                        href="tel:0031702042635"
                        className="text-accent hover:underline"
                      >
                        070 - 20 42 635
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-cream-dark rounded-sm">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">E-mail</h3>
                      <a
                        href="mailto:info@bluediamonds.club"
                        className="text-accent hover:underline"
                      >
                        info@bluediamonds.club
                      </a>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="p-6 bg-primary text-primary-foreground rounded-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-accent" />
                    <h3 className="font-heading text-xl">Openingstijden</h3>
                  </div>
                  <OpeningHoursList
                    className="space-y-3"
                    dayClassName="text-cream/70 whitespace-nowrap"
                    hoursClassName="text-cream"
                  />
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-16 aspect-[21/9] bg-muted rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Noordeinde%2035%2C%202514%20GC%20Den%20Haag&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Blue Diamonds locatie"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
