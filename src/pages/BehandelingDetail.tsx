import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getTreatmentBySlug } from "@/data/treatmentsCatalog";
import type { AnyTreatment } from "@/data/treatmentsCatalog";
import { useSalonizedWidget } from "@/components/salonized/SalonizedWidgetProvider";
import NotFound from "./NotFound";
import { BLOG_POSTS } from "@/data/blogs";
import { SALONIZED_SERVICES_BY_TREATMENT_SLUG } from "@/lib/salonizedDeepLinks";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";

const MASSAGE_STYLE_PAGES = [
  { eyebrow: "Rustgevend & Ontspannend", title: "Relaxation massage", slug: "massage-relaxation" },
  { eyebrow: "Focus op herstel & klachten", title: "Recovery massage", slug: "massage-recovery" },
  { eyebrow: "Focus op spieren & prestatie", title: "Sportmassage", slug: "massage-sportmassage" },
  { eyebrow: "Focus op vormgeven en verstrakking", title: "Shaping & Contouring massage", slug: "massage-shaping-contouring" },
  { eyebrow: "Focus op algehele welzijn en op maat", title: "Speciale massages", slug: "massage-speciale" },
  { eyebrow: "Focus op lichaam & geest", title: "Gezichtsmassage", slug: "massage-gezichtsmassage" },
  { eyebrow: "Focus op verminderen van spanning en druk", title: "Nek-, Schouder- & Rug massage", slug: "massage-nek-schouder-rug" },
  { eyebrow: "Focus op verlichting & bloedcirculatie", title: "Hand- & Voet massage", slug: "massage-hand-voet" },
  { eyebrow: "Samen genieten", title: "Duo massage", slug: "massage-duo" },
] as const;

const BehandelingDetail = () => {
  const { slug } = useParams();
  const { openWidget } = useSalonizedWidget();

  const treatment = useMemo(() => getTreatmentBySlug(slug ?? ""), [slug]) as AnyTreatment | undefined;
  if (!treatment) {
    return <NotFound />;
  }

  const bookingServices = useMemo(() => {
    const direct = SALONIZED_SERVICES_BY_TREATMENT_SLUG[treatment.slug];
    if (direct?.length) return direct;

    // Try to map subpages to their parent category (e.g. gezicht subpages -> gezichtsbehandelingen).
    const cat = ('category' in (treatment ?? {}) ? (treatment as { category?: string }).category : undefined) ?? undefined;
    if (cat && SALONIZED_SERVICES_BY_TREATMENT_SLUG[cat]?.length) return SALONIZED_SERVICES_BY_TREATMENT_SLUG[cat];
    return [];
  }, [treatment]);

  const relatedBlogs = useMemo(() => {
    const tSlug = treatment.slug;
    const cat = ('category' in (treatment ?? {}) ? (treatment as { category?: string }).category : undefined) ?? undefined;
    const bucket = cat ?? tSlug;

    const categories: string[] = [];
    if (bucket.includes('gezicht')) categories.push('Gezichtsbehandelingen');
    if (bucket.includes('massage')) categories.push('Massage');
    if (bucket.includes('haar')) categories.push('Haar');
    if (bucket.includes('voeten')) categories.push('Voeten');
    if (bucket.includes('wax')) categories.push('Waxen');
    if (bucket.includes('urban')) categories.push('Urban Wellness');
    if (bucket.includes('wenkbrauw')) categories.push('Wenkbrauwen');
    if (bucket.includes('wimper')) categories.push('Wimpers');

    const uniq = Array.from(new Set(categories));
    if (!uniq.length) return [];

    return BLOG_POSTS.filter((p) => p.category && uniq.includes(p.category)).slice(0, 3);
  }, [treatment]);

  const detailsParagraphs = useMemo(() => {
    const raw = treatment.details?.trim();
    if (!raw) return [];
    return raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }, [treatment?.details]);

  const galleryImages = useMemo(() => {
    const raw = (treatment as unknown as { images?: string[]; image?: string })?.images?.length
      ? (treatment as unknown as { images?: string[] }).images
      : treatment.image
        ? [treatment.image]
        : [];

    // de-dupe while preserving order
    return Array.from(new Set((raw ?? []).filter(Boolean)));
  }, [treatment]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            {treatment?.image ? (
              <img 
                src={getCloudinaryImageUrl(treatment.image)} 
                alt="" 
                className="w-full h-full object-cover"
                style={treatment.slug === 'wenkbrauwen-wimpers' ? { objectPosition: 'center 35%' } : undefined}
              />
            ) : null}
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                {treatment?.label ?? "Behandeling"}
              </p>
              <h1 className="text-display text-cream mt-4 mb-6">
                {treatment?.title ?? "Onbekende behandeling"}
              </h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
              <p className="text-lead-dark">
                {treatment?.intro ??
                  "Ontdek onze professionele behandeling met aandacht voor detail en kwaliteit. Neem gerust contact op voor meer informatie of advies."}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                {galleryImages.length > 1 ? (
                  <div className="mb-10">
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      Foto&apos;s
                    </p>
                    <Carousel opts={{ align: "start" }} className="relative">
                      <CarouselContent>
                        {galleryImages.map((src) => (
                          <CarouselItem key={src} className="basis-full md:basis-1/2">
                            <div className="aspect-[4/3] rounded-sm overflow-hidden border border-border bg-muted">
                              <img
                                src={getCloudinaryImageUrl(src)}
                                alt={treatment?.title ?? "Behandeling foto"}
                                className="w-full h-full object-cover"
                                style={treatment.slug === 'wenkbrauwen-wimpers' && src.includes('IMG_0318') ? { objectPosition: 'center 35%' } : undefined}
                                loading="lazy"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 bg-background/70 border-border backdrop-blur" />
                      <CarouselNext className="right-2 bg-background/70 border-border backdrop-blur" />
                    </Carousel>
                  </div>
                ) : null}

                <h2 className="text-heading text-foreground mb-6">Meer informatie</h2>
                <div className="prose prose-neutral max-w-none">
                  {('quote' in (treatment ?? {}) && treatment?.quote) ? (
                    <p className="text-body mb-6 italic">
                      {treatment.quote}
                    </p>
                  ) : null}

                  {detailsParagraphs.length ? (
                    detailsParagraphs.map((p) => (
                      <p key={p} className="text-body mb-5">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-body">
                      We houden deze pagina bewust helder en relevant. Wil je prijzen, duur en beschikbare opties? Bel ons of stuur een bericht — dan adviseren we op maat.
                    </p>
                  )}
                </div>

                {treatment.slug === 'massage-stijlen' ? (
                  <div className="mt-10">
                    <h3 className="text-heading text-foreground mb-6">Massage stijlen</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MASSAGE_STYLE_PAGES.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/behandelingen/${s.slug}`}
                          className="bg-card border border-border rounded-sm p-6 hover:shadow-xl transition-all duration-500 hover-glow flex flex-col"
                        >
                          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{s.eyebrow}</p>
                          <p className="font-medium text-foreground mb-2">{s.title}</p>
                          <span className="mt-4 inline-flex items-center gap-2 text-accent font-medium">
                            Meer informatie
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : ('pricing' in (treatment ?? {}) && treatment?.pricing?.length) ? (
                  <div className="mt-10">
                    <h3 className="text-heading text-foreground mb-6">Prijzen</h3>
                    <div className="space-y-8">
                      {treatment.pricing.map((sec) => (
                        <div key={sec.title} className="bg-card border border-border rounded-sm p-8">
                          <h4 className="text-lg font-heading text-foreground mb-6 text-center">{sec.title}</h4>
                          <div className="space-y-6">
                            {sec.items.map((it) => (
                              <div
                                key={`${sec.title}:${it.name}`}
                                className="flex flex-col items-center text-center space-y-2 pb-6 border-b border-border last:border-0 last:pb-0"
                              >
                                <p className="text-base font-medium text-foreground leading-relaxed">{it.name}</p>
                                {it.duration ? (() => {
                                  // Some imported items include long descriptions in `duration`, e.g. "70 minuten — ...".
                                  // Split time + description so nothing overflows on small screens.
                                  const raw = it.duration.trim();
                                  // Match dash with optional space before and required space after, or just dash with space after
                                  const parts = raw.split(/\s*[—-]\s+/);
                                  const time = parts[0] ?? raw;
                                  const rest = parts.length > 1 ? parts.slice(1).join(' — ').trim() : '';

                                  return (
                                    <div className="space-y-2">
                                      <p className="text-sm text-muted-foreground whitespace-nowrap tabular-nums">
                                        {time}
                                      </p>
                                      {rest ? (
                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl break-words whitespace-pre-line" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                          {rest}
                                        </p>
                                      ) : null}
                                    </div>
                                  );
                                })() : null}
                                <p className="text-xl font-semibold text-accent">{it.price}</p>
                                {it.note ? (
                                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mt-2 break-words whitespace-normal">
                                    {it.note}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 pt-6 border-t border-border">
                            <Button
                              type="button"
                              className="w-full btn-gold magnetic-btn group"
                              onClick={() => openWidget('booking', bookingServices)}
                            >
                              Maak een Afspraak
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {relatedBlogs.length ? (
                  <div className="mt-12">
                    <h3 className="text-heading text-foreground mb-6">Gerelateerde blogs</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {relatedBlogs.map((p) => (
                        <Link
                          key={p.id}
                          to={`/blogs/${p.id}`}
                          className="bg-card border border-border rounded-sm p-6 hover:shadow-xl transition-all duration-500 hover-glow flex flex-col"
                        >
                          {p.category ? (
                            <span className="inline-block text-xs tracking-wider uppercase text-accent font-medium mb-2">
                              {p.category}
                            </span>
                          ) : null}
                          <p className="font-medium text-foreground mb-2 line-clamp-2">{p.title}</p>
                          <p className="text-small line-clamp-3">{p.excerpt}</p>
                          <span className="mt-4 inline-flex items-center gap-2 text-accent font-medium">
                            Lees verder
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {treatment?.highlights?.length ? (
                  <div className="mt-10">
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      Highlights
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {treatment.highlights.map((h) => (
                        <span
                          key={h}
                          className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <aside className="bg-card border border-border rounded-sm p-6 h-fit">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Snel regelen
                </p>
                <div className="space-y-3">
                  <Button
                    type="button"
                    className="w-full btn-gold magnetic-btn group"
                    onClick={() => openWidget('booking', bookingServices)}
                  >
                    Maak een Afspraak
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Link to="/contact">
                    <Button className="w-full btn-gold magnetic-btn group">
                      Neem contact op
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <a href="tel:0031702042635">
                    <Button variant="outline" className="w-full btn-outline-light">
                      Bel: 070 - 20 42 635
                    </Button>
                  </a>
                </div>

                <div className="mt-6 text-sm text-muted-foreground">
                  {'parent' in (treatment ?? {}) && treatment?.parent ? (
                    <Link to={treatment.parent.href} className="hover:text-accent transition-colors">
                      ← Terug naar {treatment.parent.title}
                    </Link>
                  ) : (
                    <Link to="/behandelingen" className="hover:text-accent transition-colors">
                      ← Terug naar behandelingen
                    </Link>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BehandelingDetail;

