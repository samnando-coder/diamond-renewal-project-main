import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpressieSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Tips &amp; Trucs</span>
          <h2 className="text-heading text-foreground mt-4 mb-6">Tips &amp; Trucs</h2>
          <div className="accent-line-center mb-6" />
          <p className="text-lead">
            Praktisch advies over behandelingen, wat ze doen en waar ze goed voor zijn.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedSection animation="fade-up" delay={0}>
            <div className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover-glow h-full p-8">
              <h3 className="font-heading text-xl text-foreground mb-3">Welke gezichtsbehandeling past bij jou?</h3>
              <p className="text-body mb-6">
                De juiste behandeling hangt af van je huidtype en je doel (glow, hydratatie, onzuiverheden of anti-aging).
                We adviseren je graag op basis van een korte intake.
              </p>
              <Link
                to="/behandelingen/gezichtsbehandelingen"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
              >
                Bekijk gezichtsbehandelingen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={80}>
            <div className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover-glow h-full p-8">
              <h3 className="font-heading text-xl text-foreground mb-3">Massage: welke stijl kies je?</h3>
              <p className="text-body mb-6">
                Ontspanning, herstel of juist diep werken op spanning: iedere massagestijl heeft z’n eigen effect.
                We helpen je kiezen op basis van klachten en voorkeur.
              </p>
              <Link
                to="/behandelingen/massage-stijlen"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
              >
                Bekijk massage stijlen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={160}>
            <div className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover-glow h-full p-8">
              <h3 className="font-heading text-xl text-foreground mb-3">Meer lezen: tips per behandeling.</h3>
              <p className="text-body mb-6">
                In onze blogs vind je uitleg, nazorg en slimme tips om het meeste uit je behandeling te halen.
              </p>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
              >
                Bekijk alle blogs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

