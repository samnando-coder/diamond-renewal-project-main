import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { FloatingElements } from '@/components/animations/FloatingElements';
import { ArrowRight } from 'lucide-react';
import { useSalonizedWidget } from '@/components/salonized/SalonizedWidgetProvider';

export const CTASection = () => {
  const { openWidget } = useSalonizedWidget();
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      
      {/* Floating Elements */}
      <FloatingElements variant="diamonds" count={15} />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)), transparent)',
            left: '-10%',
            top: '-20%',
            animation: 'wave 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)), transparent)',
            right: '-15%',
            bottom: '-30%',
            animation: 'wave 20s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--cream)), transparent)',
            left: '40%',
            top: '60%',
            animation: 'wave 12s ease-in-out infinite',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection animation="fade-up">
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-accent/50" />
              Klaar om te ontspannen?
              <span className="w-8 h-[1px] bg-accent/50" />
            </span>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <h2 className="text-heading text-cream mt-4 mb-6">
              Boek Vandaag Nog Je Verwenmoment
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <p className="text-lead-dark mb-10 max-w-xl mx-auto">
              Neem contact met ons op of maak direct een afspraak. 
              Wij staan klaar om je te verwelkomen in onze salon.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="scale-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                className="btn-gold magnetic-btn group relative overflow-hidden"
                onClick={() => openWidget()}
              >
                <span className="relative z-10 flex items-center">
                  Maak een Afspraak
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-dark to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <a href="tel:0031702042635">
                <Button variant="outline-light" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Phone className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    070 - 20 42 635
                  </span>
                  <div className="absolute inset-0 bg-cream/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </a>
            </div>
          </AnimatedSection>

          {/* Location Hint */}
          <AnimatedSection animation="fade-in" delay={500}>
            <div className="mt-10 inline-flex items-center gap-2 text-cream/50 text-sm group cursor-pointer hover:text-cream/70 transition-colors">
              <span className="text-lg">📍</span>
              <span className="relative">
                Noordeinde 35, 2514 GC Den Haag
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent/50 group-hover:w-full transition-all duration-300" />
              </span>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full fill-background opacity-10"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
};
