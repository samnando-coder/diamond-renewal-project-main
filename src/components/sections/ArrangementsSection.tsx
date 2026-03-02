import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { ARRANGEMENTS } from '@/data/arrangements';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

// Requested: use the photo with two massage beds for arrangement visuals.
const arrangementImage = "/Blue Diamonds Foto's/IMG_5445.jpg";

export const ArrangementsSection = () => {
  const highlights = ARRANGEMENTS.slice(0, 3);

  return (
    <section className="section-padding bg-cream-dark relative overflow-hidden">
      {/* Background image */}
      {arrangementImage ? (
        <div className="absolute inset-0 opacity-10">
          <img src={getCloudinaryImageUrl(arrangementImage)} alt="" className="w-full h-full object-cover" />
        </div>
      ) : null}

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Exclusieve Pakketten</span>
          <h2 className="text-heading text-foreground mt-4 mb-6">Arrangementen</h2>
          <div className="accent-line-center mb-6" />
          <p className="text-lead">
            Kies een arrangement voor een complete verwenervaring — met gemiddeld 30% pakketkorting.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((a, index) => (
            <AnimatedSection key={a.id} animation="fade-up" delay={index * 80}>
              <div className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover-glow h-full">
                {a.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={getCloudinaryImageUrl(a.image)}
                      alt={a.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                  </div>
                ) : null}

                <div className="p-8">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                    <a.icon className="w-7 h-7 text-accent" />
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{a.subtitle}</p>
                  <h3 className="font-heading text-xl text-foreground mb-3">{a.title}</h3>

                  <div className="mb-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Duur</p>
                    <p className="font-medium text-foreground">{a.duration}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Inclusief</p>
                    <div className="flex flex-wrap gap-2">
                      {a.includes.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/arrangementen#${a.id}`}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
                  >
                    Bekijk arrangement
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400} className="mt-12 text-center">
          <Link
            to="/arrangementen"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-navy-light transition-colors"
          >
            Bekijk alle arrangementen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};
