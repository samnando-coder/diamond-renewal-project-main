import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTreatmentBySlug } from '@/data/treatmentsCatalog';

const sections = [
  { eyebrow: 'Vorm', slug: 'wenkbrauwen' },
  { eyebrow: 'Blik', slug: 'wimpers' },
] as const;

const WenkbrauwenWimpers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Behandelingen</span>
              <h1 className="text-display text-cream mt-4 mb-6">Wenkbrauwen &amp; Wimpers</h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Accentueer je blik — kies hieronder een categorie voor alle info en prijzen.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((s) => {
                const p = getTreatmentBySlug(s.slug);
                const hasContent = p && (p.details || (p.intro && p.intro.trim().length > 0));
                return (
                  <div
                    key={s.slug}
                    className="bg-card border border-border rounded-sm p-8 hover:shadow-xl transition-all duration-500 hover-glow"
                  >
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{s.eyebrow}</p>
                    <h2 className="font-heading text-2xl text-foreground mb-3">{p?.title ?? s.slug}</h2>
                    <p className="text-body mb-6">{p?.intro ?? 'Ontdek onze professionele wenkbrauw- en wimperbehandelingen voor een perfecte blik.'}</p>
                    {hasContent ? (
                      <Link
                        to={`/behandelingen/${s.slug}`}
                        className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
                      >
                        Meer informatie
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WenkbrauwenWimpers;

