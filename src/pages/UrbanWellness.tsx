import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { URBAN_WELLNESS_DEVICES, URBAN_WELLNESS_HERO_IMAGE, URBAN_WELLNESS_INTRO } from '@/data/urbanWellness';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

const UrbanWellness = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getCloudinaryImageUrl(URBAN_WELLNESS_HERO_IMAGE)}
              alt="Urban Wellness Center"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Innovatieve Wellness
              </span>
              <h1 className="text-display text-cream mt-4 mb-6">
                Urban Wellness
              </h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                {URBAN_WELLNESS_INTRO.lead}
              </p>
            </div>
          </div>
        </section>

        {/* Quick device links */}
        <section className="py-12 bg-cream-dark">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {URBAN_WELLNESS_DEVICES.map((d) => (
                <div key={d.id} className="bg-card border border-border rounded-sm overflow-hidden hover-glow">
                  {d.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img src={getCloudinaryImageUrl(d.image)} alt={d.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                    </div>
                  ) : null}
                  <div className="p-8">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Urban Wellness
                  </p>
                  <h2 className="font-heading text-2xl text-foreground mb-3">{d.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{d.short}</p>
                  <a
                    href={`#${d.id}`}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
                  >
                    {d.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro copy */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-heading text-foreground mb-6 text-center">{URBAN_WELLNESS_INTRO.title}</h2>
              <div className="space-y-5">
                {URBAN_WELLNESS_INTRO.paragraphs.map((p) => (
                  <p key={p} className="text-body">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Device details */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-6">
            <div className="space-y-14">
              {URBAN_WELLNESS_DEVICES.map((d) => (
                <div
                  key={d.id}
                  id={d.id}
                  className="bg-card border border-border rounded-sm overflow-hidden scroll-mt-32"
                >
                  <div className="grid lg:grid-cols-3">
                    <div className="relative p-8 lg:p-12 bg-cream-dark flex flex-col justify-center overflow-hidden">
                      {d.image ? (
                        <div className="absolute inset-0 pointer-events-none">
                          <img
                            src={getCloudinaryImageUrl(d.image)}
                            alt=""
                            className="w-full h-full object-cover opacity-20 blur-sm scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-cream-dark/80 via-cream-dark/70 to-cream-dark/90" />
                        </div>
                      ) : null}

                      <div className="relative z-10">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                          Urban Wellness
                        </p>
                        <h3 className="font-heading text-2xl lg:text-3xl text-foreground mb-3">{d.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{d.short}</p>
                      </div>
                    </div>

                    <div className="p-8 lg:p-12 lg:col-span-2">
                      <div className="space-y-4 mb-8">
                        {d.description.map((p) => (
                          <p
                            key={p}
                            className={p === 'Wetenschappelijk bewezen!' ? 'font-medium text-foreground' : 'text-body'}
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Removed legacy "Meer informatie? Klik hier" CTA per request */}

                      <div className="mb-8">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Prijzen</p>
                        <div className="grid gap-4">
                          {d.prices.map((opt) => (
                            <div key={`${d.id}-${opt.label}`} className="p-4 bg-muted rounded-sm">
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                <p className="font-medium text-foreground">{opt.label}</p>
                                <p className="text-accent font-semibold">{opt.price}</p>
                              </div>
                              {opt.note ? (
                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{opt.note}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      {d.extra ? (
                        <div className="p-6 bg-cream-dark rounded-sm">
                          <h4 className="font-heading text-xl text-foreground mb-3">{d.extra.title}</h4>
                          <div className="space-y-3">
                            {d.extra.body.map((p) => (
                              <p key={p} className="text-sm text-muted-foreground leading-relaxed">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading text-cream mb-4">Maak direct online een afspraak!</h2>
              <p className="text-lead-dark mb-8">
                Wil je meer weten of direct een moment plannen? Stuur ons een bericht of bel ons voor een afspraak.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
                >
                  Online contact / afspraak
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:0031702042635"
                  className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-cream/10 transition-colors"
                >
                  Bel: 070 - 20 42 635
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UrbanWellness;
