import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FloatingElements } from '@/components/animations/FloatingElements';
import { useEffect, useState } from 'react';
import { MEDIA, getMediaItemSrc } from '@/lib/media';
import { useSalonizedWidget } from '@/components/salonized/SalonizedWidgetProvider';

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroImages = MEDIA.filter((m) => m.kind === 'image' && m.tags.includes('hero'));
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openWidget } = useSalonizedWidget();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Preload hero images for smoother cross-fade.
  useEffect(() => {
    for (const it of heroImages) {
      const img = new Image();
      img.src = getMediaItemSrc(it);
    }
  }, [heroImages]);

  // Auto-advance slideshow (pauses on interaction).
  useEffect(() => {
    if (paused) return;
    if (heroImages.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % heroImages.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [paused, heroImages.length]);

  useEffect(() => {
    // Keep index valid if heroImages count changes.
    setActiveIdx((i) => (heroImages.length ? i % heroImages.length : 0));
  }, [heroImages.length]);

  const goPrev = () => {
    if (heroImages.length <= 1) return;
    setActiveIdx((i) => (i - 1 + heroImages.length) % heroImages.length);
    setPaused(true);
  };

  const goNext = () => {
    if (heroImages.length <= 1) return;
    setActiveIdx((i) => (i + 1) % heroImages.length);
    setPaused(true);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`,
        }}
      >
        <div className="absolute inset-0">
          {heroImages.length ? (
            heroImages.map((it, idx) => (
              <img
                key={it.src}
                src={getMediaItemSrc(it)}
                alt={it.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  idx === activeIdx ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectPosition: (it as { objectPosition?: string }).objectPosition }}
                loading={idx === activeIdx ? 'eager' : 'lazy'}
                decoding="async"
              />
            ))
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
      </div>

      {/* Floating Elements */}
      <FloatingElements variant="diamonds" count={20} className="z-[1]" />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)), transparent 60%)',
            left: '60%',
            top: '20%',
            animation: 'wave 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)), transparent 60%)',
            left: '10%',
            bottom: '10%',
            animation: 'wave 15s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="max-w-2xl">
          <div className="mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="inline-block text-accent text-sm tracking-[0.3em] uppercase font-medium relative">
              <span className="absolute -left-4 top-1/2 w-8 h-[1px] bg-accent/50 -translate-y-1/2" />
              Premium Beauty & Wellness
            </span>
          </div>

          <h1
            className="text-display text-cream mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            Ontdek de Ultieme
            <span className="block text-accent relative inline-block">
              Verwenervaring
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0,4 Q50,0 100,4 T200,4" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
          </h1>

          <p
            className="text-lead-dark md:text-xl mb-10 max-w-lg animate-fade-up opacity-0"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            Welkom bij Blue Diamonds in Den Haag! Stap binnen in onze beautysalon en de buitenwereld verdwijnt naar de achtergrond. Hier draait het om jou.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
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
            <Link to="/behandelingen">
              <Button variant="outline-light" className="group relative overflow-hidden">
                <span className="relative z-10">Onze Behandelingen</span>
                <div className="absolute inset-0 bg-cream/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Slideshow controls */}
          {heroImages.length > 1 ? (
            <div
              className="mt-10 flex items-center gap-4 animate-fade-up opacity-0"
              style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Vorige foto"
                  className="h-10 w-10 rounded-sm border border-cream/20 bg-cream/5 backdrop-blur-md text-cream hover:bg-cream/10 transition-colors inline-flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Volgende foto"
                  className="h-10 w-10 rounded-sm border border-cream/20 bg-cream/5 backdrop-blur-md text-cream hover:bg-cream/10 transition-colors inline-flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {heroImages.map((it, idx) => (
                  <button
                    key={it.src}
                    type="button"
                    aria-label={`Ga naar foto ${idx + 1}`}
                    onClick={() => {
                      setActiveIdx(idx);
                      setPaused(true);
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      idx === activeIdx ? 'bg-accent' : 'bg-cream/30 hover:bg-cream/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Special Offer Card */}
          <Link
            to="/arrangementen#energy-boost"
            className="mt-16 p-6 bg-cream/5 backdrop-blur-md rounded-sm border border-cream/20 max-w-md animate-fade-up opacity-0 hover-glow cursor-pointer block"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 blur-2xl rounded-full" />
            <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2 relative">
              ✨ Special Offer
            </p>
            <h3 className="font-heading text-xl text-cream mb-2">
              Energy boost arrangement
            </h3>
            <p className="text-cream/70 text-sm mb-3">
              Magnesium experience intensive behandeling (80 min), magnesiumrijke smoothie & Welnamis (30 min)
            </p>
            <div className="flex items-center gap-3">
              <span className="text-cream/50 line-through text-sm">€ 144,95</span>
              <span className="text-accent font-semibold text-lg animate-pulse">€ 119,95</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center p-2 relative overflow-hidden">
          <div className="w-1 h-2 bg-cream/50 rounded-full animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/5 to-cream/10 animate-pulse" />
        </div>
        <p className="text-cream/40 text-xs mt-2 text-center tracking-widest uppercase">Scroll</p>
      </div>
    </section>
  );
};
