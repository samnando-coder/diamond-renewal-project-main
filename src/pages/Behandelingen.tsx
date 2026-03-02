import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TREATMENTS } from '@/data/treatments';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

const labelClass = (label: string) => {
  if (label === 'beauty') return 'bg-accent text-accent-foreground';
  if (label === 'health') return 'bg-primary text-primary-foreground';
  return 'bg-muted text-muted-foreground';
};

const Behandelingen = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Onze Expertise
              </span>
              <h1 className="text-display text-cream mt-4 mb-6">
                Behandelingen
              </h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Mooi & verzorgd — ontdek ons aanbod aan beauty en health behandelingen,
                uitgevoerd door specialisten in Den Haag.
              </p>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TREATMENTS.map((t, index) => (
                <Link
                  key={t.slug}
                  to={
                    t.slug === 'haar'
                      ? '/haar'
                      : t.slug === 'wenkbrauwen-wimpers'
                        ? '/wenkbrauwen-wimpers'
                        : t.slug === 'led-lichttherapie'
                          ? '/behandelingen/led-lichttherapie'
                          : `/behandelingen/${t.slug}`
                  }
                  className="group bg-card rounded-sm border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover-glow"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {t.image ? (
                      <img
                        src={getCloudinaryImageUrl(t.image)}
                        alt={t.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={t.slug === 'wenkbrauwen-wimpers' ? { objectPosition: 'center 35%' } : undefined}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/10 via-primary/5 to-background" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent opacity-80" />
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase rounded-sm ${labelClass(
                        t.label
                      )}`}
                    >
                      {t.label}
                    </span>
                  </div>

                  <div className="p-6 relative">
                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h2 className="font-heading text-xl text-foreground mb-3 group-hover:text-accent transition-colors">
                      {t.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {t.intro}
                    </p>
                    <span className="inline-flex items-center text-accent text-sm font-medium group-hover:gap-3 transition-all duration-300">
                      Meer informatie
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-cream-dark">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-heading text-foreground mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-body max-w-xl mx-auto mb-8">
              Maak vandaag nog een afspraak en ervaar zelf de kwaliteit van Blue Diamonds.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
            >
              Neem contact op
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Behandelingen;
