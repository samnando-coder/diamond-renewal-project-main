import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTreatmentBySlug } from '@/data/treatmentsCatalog';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

const hairSections = [
  { eyebrow: 'Mooi', slug: 'knippen-stijlen' },
  { eyebrow: 'Afwisseling', slug: 'kleuren' },
  { eyebrow: 'Uitgesproken', slug: 'highlights' },
  { eyebrow: 'Natuurlijk', slug: 'balayage' },
  { eyebrow: 'Stralend & Verfrissend', slug: 'herstel' },
  { eyebrow: 'Gezondheid', slug: 'keratine' },
] as const;

const Haar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <img src={getCloudinaryImageUrl("/Blue Diamonds Foto's/IMG_0293.jpeg")} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Behandelingen</span>
              <h1 className="text-display text-cream mt-4 mb-6">Haar</h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Knippen, kleuren en verzorging — professioneel, met aandacht voor jouw stijl.
              </p>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairSections.map((s) => {
                const p = getTreatmentBySlug(s.slug);
                const title = p?.title ?? s.slug;
                const intro = p?.intro ?? 'Ontdek onze professionele haarbehandelingen met aandacht voor detail en kwaliteit.';
                const hasContent = p && (p.details || (p.intro && p.intro.trim().length > 0));

                return (
                  <div key={s.slug} className="bg-card border border-border rounded-sm p-8 hover:shadow-xl transition-all duration-500 hover-glow">
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{s.eyebrow}</p>
                    <h2 className="font-heading text-2xl text-foreground mb-3">{title}</h2>
                    <p className="text-body mb-6">{intro}</p>
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

export default Haar;

