import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { TREATMENTS } from '@/data/treatments';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

const labelClass = (label: string) => {
  if (label === 'beauty') return 'bg-accent text-accent-foreground';
  if (label === 'health') return 'bg-primary text-primary-foreground';
  return 'bg-muted text-muted-foreground';
};

export const ServicesSection = () => {
  const items = TREATMENTS.slice(0, 6);

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Onze Expertise</span>
          <h2 className="text-heading text-foreground mt-4 mb-6">Behandelingen</h2>
          <div className="accent-line-center mb-6" />
          <p className="text-lead">
            Mooi & verzorgd — ontdek ons aanbod aan beauty en health behandelingen, uitgevoerd door
            specialisten in Den Haag.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {items.map((t, index) => (
            <AnimatedSection key={t.slug} animation="fade-up" delay={index * 60}>
              <Link
                to={
                  t.slug === 'haar'
                    ? '/haar'
                    : t.slug === 'wenkbrauwen-wimpers'
                      ? '/wenkbrauwen-wimpers'
                      : t.slug === 'led-lichttherapie'
                        ? '/behandelingen/led-lichttherapie'
                        : `/behandelingen/${t.slug}`
                }
                className="group block bg-card rounded-sm border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover-glow h-full"
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

                <div className="p-6 flex flex-col h-full">
                  <h3 className="font-heading text-xl text-foreground mb-3 group-hover:text-accent transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.intro}</p>
                  <span className="mt-auto inline-flex items-center text-accent text-sm font-medium">
                    Meer informatie
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={450} className="mt-12 text-center">
          <Link
            to="/behandelingen"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
          >
            Bekijk alle behandelingen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};
