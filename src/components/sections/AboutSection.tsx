import { Link } from 'react-router-dom';
import { ArrowRight, Award, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FloatingElements } from '@/components/animations/FloatingElements';
import { useMemo } from 'react';

const features = [
  {
    icon: Award,
    title: 'Premium Kwaliteit',
    description: 'Wij werken uitsluitend met hoogwaardige schoonheidsproducten.',
  },
  {
    icon: Leaf,
    title: 'Natuurlijke Ingrediënten',
    description: 'Zeeplanten, algen, biologische oliën en extracten.',
  },
  {
    icon: Heart,
    title: 'Persoonlijke Aandacht',
    description: 'Onze experts luisteren naar al je wensen.',
  },
];

export const AboutSection = () => {
  const MIN_SALONIZED_REVIEWS = 700;
  const MIN_GOOGLE_REVIEWS = 220;

  const salonizedReviewsDisplay = useMemo(() => {
    return MIN_SALONIZED_REVIEWS;
  }, []);

  const googleReviewsDisplay = useMemo(() => {
    return MIN_GOOGLE_REVIEWS;
  }, []);

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Elements */}
      <FloatingElements variant="stars" count={12} />
      
      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cream-dark to-transparent opacity-50" />
      
      {/* Animated gradient orb */}
      <div 
        className="absolute top-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent)), transparent)',
          animation: 'wave 15s ease-in-out infinite',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <AnimatedSection animation="fade-right">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Over Ons
              </span>
              <h2 className="text-heading text-foreground mt-4 mb-6">
                Jouw Oase in het Hart van Den Haag
              </h2>
              <div className="accent-line mb-8" />
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-6 mb-10">
                <p className="text-body">
                  Welkom bij Blue Diamonds! Stap binnen in onze beautysalon en de buitenwereld 
                  verdwijnt naar de achtergrond. Of je nu komt voor gezichtsbehandelingen, 
                  haarbehandelingen, ontharing, massage of voor een voetbehandeling: onze experts luisteren naar 
                  al je wensen.
                </p>
                <p className="text-body">
                  Ons ervaren team bestaat uit de beste specialisten in Den Haag, die uitblinken 
                  in diverse soorten massages, huidverzorging, haarbehandelingen en make-up. Voor het optimale 
                  resultaat werken wij uitsluitend met hoogwaardige schoonheidsproducten.
                </p>
              </div>
            </AnimatedSection>

            {/* Features */}
            <div className="grid gap-6 mb-10">
              {features.map((feature, index) => (
                <AnimatedSection key={feature.title} animation="fade-left" delay={200 + index * 100}>
                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fade-up" delay={500}>
              <Link to="/over-ons">
                <Button className="btn-outline magnetic-btn group">
                  MEER OVER ONS
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>

          {/* Stats */}
          <AnimatedSection animation="scale-up" delay={200}>
            <div className="bg-primary p-8 md:p-12 rounded-sm text-primary-foreground relative overflow-hidden group hover-glow">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div 
                  className="absolute w-64 h-64 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--accent)), transparent)',
                    top: '-20%',
                    right: '-10%',
                    animation: 'wave 10s ease-in-out infinite',
                  }}
                />
                <div 
                  className="absolute w-48 h-48 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--accent)), transparent)',
                    bottom: '-10%',
                    left: '-10%',
                    animation: 'wave 12s ease-in-out infinite reverse',
                  }}
                />
              </div>

              <h3 className="font-heading text-2xl mb-8 relative z-10">
                Waarom kiezen voor Blue Diamonds?
              </h3>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="text-center p-6 border border-cream/20 rounded-sm hover:border-accent/50 hover:bg-cream/5 transition-all duration-300 cursor-pointer group/stat">
                  <p className="font-heading text-4xl text-accent mb-2">
                    <AnimatedCounter end={5} suffix="+" />
                  </p>
                  <p className="text-sm text-cream/70 group-hover/stat:text-cream transition-colors">Jaar ervaring</p>
                </div>
                <div className="text-center p-6 border border-cream/20 rounded-sm hover:border-accent/50 hover:bg-cream/5 transition-all duration-300 cursor-pointer group/stat">
                  <p className="font-heading text-4xl text-accent mb-2">
                    <AnimatedCounter end={160} suffix="+" />
                  </p>
                  <p className="text-sm text-cream/70 group-hover/stat:text-cream transition-colors">Behandelingen</p>
                </div>
                <div className="text-center p-6 border border-cream/20 rounded-sm hover:border-accent/50 hover:bg-cream/5 transition-all duration-300 cursor-pointer group/stat">
                  <p className="font-heading text-4xl text-accent mb-2">
                    <AnimatedCounter end={salonizedReviewsDisplay} suffix="+" />
                  </p>
                  <p className="text-sm text-cream/70 group-hover/stat:text-cream transition-colors">Salonized reviews</p>
                </div>
                <div className="text-center p-6 border border-cream/20 rounded-sm hover:border-accent/50 hover:bg-cream/5 transition-all duration-300 cursor-pointer group/stat">
                  <p className="font-heading text-4xl text-accent mb-2">
                    <AnimatedCounter end={googleReviewsDisplay} suffix="+" />
                  </p>
                  <p className="text-sm text-cream/70 group-hover/stat:text-cream transition-colors">Google reviews</p>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-cream/70 relative z-10">
                4 &amp; 5 sterren reviews.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
