import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { ARRANGEMENTS } from '@/data/arrangements';
import { arrangementBookingWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

// Requested: use the photo with two massage beds for arrangement visuals.
const arrangementImage = "/Blue Diamonds Foto's/IMG_5445.jpg";

const Arrangementen = () => {
  const location = useLocation();

  // Scroll to hash anchor when page loads or hash changes
  useEffect(() => {
    if (location.hash) {
      // Remove the # from the hash
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src={getCloudinaryImageUrl(arrangementImage)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Exclusieve Pakketten
              </span>
              <h1 className="text-display text-cream mt-4 mb-6">
                Arrangementen
              </h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                Ontdek onze zorgvuldig samengestelde pakketten voor een complete verwenervaring. 
                Op alle arrangementen is gemiddeld 30% pakketkorting toegepast.
              </p>
            </div>
          </div>
        </section>

        {/* Arrangements */}
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:gap-12">
              {ARRANGEMENTS.map((arrangement) => (
                <div
                  key={arrangement.id}
                  id={arrangement.id}
                  className={`bg-card border border-border rounded-sm overflow-hidden scroll-mt-32 ${
                    arrangement.featured ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <div className="grid lg:grid-cols-3">
                    {/* Icon & Title */}
                    <div className="relative p-8 lg:p-12 bg-cream-dark flex flex-col justify-center overflow-hidden">
                      {arrangement.image ? (
                        <div className="absolute inset-0 opacity-20">
                          <img src={getCloudinaryImageUrl(arrangement.image)} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-r from-cream-dark/90 to-cream-dark/40" />
                        </div>
                      ) : null}

                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                        <arrangement.icon className="w-8 h-8 text-accent" />
                      </div>
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                        {arrangement.subtitle}
                      </p>
                      <h2 className="font-heading text-2xl lg:text-3xl text-foreground mb-3">
                        {arrangement.title}
                      </h2>
                      {arrangement.featured && (
                        <span className="inline-block text-xs tracking-wider uppercase text-accent font-medium">
                          ★ Uniek in Nederland
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="p-8 lg:p-12 lg:col-span-2">
                      <p className="text-body mb-6">
                        {arrangement.description}
                      </p>

                      <div className="flex flex-wrap gap-6 mb-8">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Duur
                          </p>
                          <p className="font-medium text-foreground">{arrangement.duration}</p>
                        </div>
                        {arrangement.pricing?.from && arrangement.pricing?.to ? (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Prijs
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-muted-foreground line-through text-sm">{arrangement.pricing.from}</span>
                              <span className="text-accent font-semibold">{arrangement.pricing.to}</span>
                            </div>
                          </div>
                        ) : arrangement.pricing?.note ? (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Prijs
                            </p>
                            <p className="text-sm text-muted-foreground">{arrangement.pricing.note}</p>
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-8">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                          Inclusief
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {arrangement.includes.map((item) => (
                            <span
                              key={item}
                              className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href="tel:0031702042635"
                          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-navy-light transition-colors"
                        >
                          Reserveer telefonisch
                          <ArrowRight className="w-4 h-4" />
                        </a>

                        <a
                          href={buildWhatsAppLink(arrangementBookingWhatsAppMessage(arrangement.title))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-[#1ebe5d] transition-colors"
                          aria-label={`Boek ${arrangement.title} via WhatsApp`}
                        >
                          WhatsApp
                          <WhatsAppIcon className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-12 p-6 bg-muted rounded-sm text-center">
              <p className="text-sm text-muted-foreground">
                * Arrangementen kunnen gereserveerd worden via{' '}
                <a href="tel:0031702042635" className="text-accent hover:underline">
                  telefoon (070 - 20 42 635)
                </a>{' '}
                of{' '}
                <a
                  href={buildWhatsAppLink(arrangementBookingWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  WhatsApp
                </a>
                <br />
                * Arrangementen kunnen in overleg worden gewijzigd en aangevuld.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Arrangementen;
