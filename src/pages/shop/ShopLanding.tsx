import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";
import { useSEO } from "@/hooks/useSEO";
import { useShopProducts } from "@/features/shop/useShopProducts";
import { ShopProductCard } from "@/components/shop/ShopProductCard";

export default function ShopLanding() {
  const { data: products = [] } = useShopProducts();
  
  useSEO({
    title: "Blue Diamonds Club Webshop — Premium Salonproducten Online",
    description: "Ontdek premium salonproducten van gerenommeerde merken zoals Redken en Thalion. Professionele kwaliteit voor thuisgebruik. Gratis verzending vanaf €50. Veilig betalen via Stripe.",
    image: getCloudinaryImageUrl("/Blue Diamonds Foto's/IMG_5602.jpg"),
    url: typeof window !== "undefined" ? `${window.location.origin}/shop` : undefined,
  });

  // Get featured products
  const featured = products
    .filter((p) => p.image && p.image.startsWith("https://"))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getCloudinaryImageUrl("/Blue Diamonds Foto's/IMG_5602.jpg")}
            alt="Blue Diamonds Club Webshop"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>

        <Container size="wide" className="relative z-10 py-20 md:py-32 text-cream">
          <AnimatedSection animation="fade-up" className="max-w-3xl">
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Welkom bij</span>
            <h1 className="text-display mt-4 mb-6">
              Blue Diamonds Club
              <br />
              <span className="text-accent">Webshop</span>
            </h1>
            <p className="text-lead-dark mb-8 text-lg">
              Premium salonproducten van gerenommeerde merken. Professionele kwaliteit die je thuis kunt gebruiken. 
              Ontdek onze zorgvuldig geselecteerde collectie van Redken, Thalion en meer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark text-base px-8 py-6">
                <Link to="/shop">Bekijk Producten</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-cream/30 text-cream hover:bg-white/10 text-base px-8 py-6">
                <Link to="/shop/c/haar">Start bij Haarverzorging</Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { icon: "✓", title: "Salonkwaliteit", desc: "Alleen de beste merken" },
                { icon: "🚚", title: "Gratis verzending", desc: "Vanaf €50 bestelling" },
                { icon: "🔒", title: "Veilig betalen", desc: "Via Stripe" },
              ].map((item, i) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={i * 100} className="bg-white/10 backdrop-blur-sm border border-cream/20 rounded-sm p-4">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className="font-heading text-sm text-cream mb-1">{item.title}</p>
                  <p className="text-xs text-cream/80">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <Section spacing="default" className="bg-cream-dark">
          <Container size="wide">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-heading text-foreground mb-4">Populaire Producten</h2>
              <div className="accent-line mx-auto mb-4" />
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Ontdek onze bestsellers en populaire producten. Geselecteerd op kwaliteit en klanttevredenheid.
              </p>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <AnimatedSection key={p.id} animation="fade-up" delay={i * 50}>
                  <ShopProductCard product={p} />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fade-up" delay={300} className="mt-10 text-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark">
                <Link to="/shop">Bekijk Alle Producten</Link>
              </Button>
            </AnimatedSection>
          </Container>
        </Section>
      )}

      {/* Why Choose Us */}
      <Section spacing="default">
        <Container size="wide">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-heading text-foreground mb-4">Waarom Blue Diamonds Club?</h2>
            <div className="accent-line mx-auto mb-4" />
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              We selecteren alleen de beste salonproducten voor jouw thuisroutine.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Premium Merken",
                desc: "Redken, Thalion en andere gerenommeerde salonmerken. Alleen producten die we zelf vertrouwen.",
                icon: "⭐",
              },
              {
                title: "Professionele Kwaliteit",
                desc: "Dezelfde producten die we in de salon gebruiken. Nu beschikbaar voor thuisgebruik.",
                icon: "✨",
              },
              {
                title: "Gratis Verzending",
                desc: "Bestel voor €50 of meer en ontvang gratis verzending. Altijd snel en veilig verpakt.",
                icon: "📦",
              },
              {
                title: "Veilig & Betrouwbaar",
                desc: "Veilig betalen via Stripe. Je gegevens zijn altijd beschermd. Klantenservice staat voor je klaar.",
                icon: "🔐",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={i * 100}>
                <div className="bg-card border border-border rounded-sm p-6 h-full">
                  <p className="text-3xl mb-4">{item.icon}</p>
                  <h3 className="font-heading text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section spacing="default" className="bg-cream-dark">
        <Container size="wide">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-heading text-foreground mb-4">Shop per Categorie</h2>
            <div className="accent-line mx-auto mb-4" />
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Vind snel wat je zoekt door te filteren op categorie.
            </p>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Haarverzorging",
                slug: "haar",
                image: "/Blue Diamonds Foto's/IMG_5418.jpg",
                desc: "Shampoo, conditioner, maskers en meer",
              },
              {
                name: "Gezichtsverzorging",
                slug: "gezicht",
                image: "/Blue Diamonds Foto's/IMG_5412.jpg",
                desc: "Serums, crèmes en reinigingsproducten",
              },
              {
                name: "Lichaamsverzorging",
                slug: "lichaam",
                image: "/Blue Diamonds Foto's/IMG_5503.jpg",
                desc: "Body care en wellness producten",
              },
              {
                name: "Wellness",
                slug: "wellness",
                image: "/Blue Diamonds Foto's/IMG_5621.jpg",
                desc: "Supplementen en wellness producten",
              },
            ].map((cat, i) => (
              <AnimatedSection key={cat.slug} animation="fade-up" delay={i * 100}>
                <Link
                  to={`/shop/c/${cat.slug}`}
                  className="group block rounded-sm overflow-hidden border border-border bg-card"
                >
                  <div className="aspect-[4/3] bg-muted relative">
                    <img
                      src={getCloudinaryImageUrl(cat.image)}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs tracking-[0.2em] uppercase text-cream/90 mb-1">Categorie</p>
                      <p className="font-heading text-xl text-cream mb-1">{cat.name}</p>
                      <p className="text-xs text-cream/80">{cat.desc}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="default">
        <Container size="wide">
          <AnimatedSection animation="fade-up" className="bg-card border border-border rounded-sm p-8 md:p-12 text-center">
            <h2 className="text-heading text-foreground mb-4">Klaar om te beginnen?</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ontdek onze collectie premium salonproducten. Professionele kwaliteit voor thuisgebruik. 
              Gratis verzending vanaf €50.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark">
                <Link to="/shop">Bekijk Alle Producten</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Neem Contact Op</Link>
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </div>
  );
}
