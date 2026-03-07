import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopProductCardSkeleton } from "@/components/shop/ShopProductCardSkeleton";
import { useShopProducts } from "@/features/shop/useShopProducts";
import { categoryLabel } from "@/features/shop/catalog";
import type { ShopCategory } from "@/features/shop/types";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryMapping";
import { useSEO } from "@/hooks/useSEO";
import { NewsletterForm } from "@/components/shop/NewsletterForm";

const categoryImages: Record<ShopCategory, string> = {
  haar: "/Blue Diamonds Foto's/IMG_5418.jpg",
  gezicht: "/Blue Diamonds Foto's/IMG_5412.jpg",
  lichaam: "/Blue Diamonds Foto's/IMG_5503.jpg",
  wellness: "/Blue Diamonds Foto's/IMG_5621.jpg",
};

const categories: ShopCategory[] = ["haar", "gezicht", "lichaam", "wellness"];

export default function ShopHome() {
  const { data: products = [], isLoading } = useShopProducts();
  
  useSEO({
    title: "Webshop",
    description: "Premium producten uit de salon — geselecteerd op kwaliteit en resultaat. Vind snel wat bij jouw routine past.",
    image: getCloudinaryImageUrl("/Blue Diamonds Foto's/IMG_5602.jpg"),
    url: typeof window !== "undefined" ? `${window.location.origin}/shop` : undefined,
  });
  // Show featured products - prefer products with actual images, but show all if needed
  const featured = products
    .filter((p) => {
      // Prefer products with actual images (not category placeholders)
      // But if we have less than 8 products with https:// images, include others too
      const withHttpsImages = products.filter(p => p.image && p.image.startsWith("https://"));
      if (withHttpsImages.length >= 8) {
        return p.image && p.image.startsWith("https://");
      }
      // If we have less than 8 with https images, show all products with any image
      return p.image;
    })
    .slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getCloudinaryImageUrl("/Blue Diamonds Foto's/IMG_5602.jpg")}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-primary/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        </div>

        <Container size="wide" className="relative z-10 py-16 md:py-24 text-cream">
          <div className="grid gap-10 lg:grid-cols-12 items-end">
            <div className="lg:col-span-7">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Webshop</span>
              <h1 className="text-display mt-4 mb-6">Shop</h1>
              <p className="text-lead-dark max-w-2xl">
                Premium producten uit de salon — geselecteerd op kwaliteit en resultaat. Vind snel wat bij jouw routine
                past.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop/search"
                  className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
                >
                  Bekijk producten
                </Link>
                <Link
                  to="/shop/c/haar"
                  className="inline-flex items-center justify-center border border-cream/30 text-cream px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-white/10 transition-colors"
                >
                  Start bij haar
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3 text-xs text-cream/85">
                <div className="rounded-sm border border-cream/15 bg-white/5 p-4">
                  <p className="tracking-[0.2em] uppercase text-cream/70">Kwaliteit</p>
                  <p className="mt-1 font-medium text-cream">Salonmerken</p>
                </div>
                <div className="rounded-sm border border-cream/15 bg-white/5 p-4">
                  <p className="tracking-[0.2em] uppercase text-cream/70">Snel kiezen</p>
                  <p className="mt-1 font-medium text-cream">Zoek & filters</p>
                </div>
                <div className="rounded-sm border border-cream/15 bg-white/5 p-4">
                  <p className="tracking-[0.2em] uppercase text-cream/70">Checkout</p>
                  <p className="mt-1 font-medium text-cream">Veilig via Stripe</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-sm border border-cream/15 bg-white/5 p-6">
                <p className="text-xs tracking-[0.3em] uppercase text-cream/70 mb-3">Snel naar</p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={`/shop/c/${c}`}
                      className="rounded-sm border border-cream/15 bg-white/5 px-4 py-3 text-sm text-cream hover:bg-white/10 transition-colors"
                    >
                      {categoryLabel(c)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Category tiles */}
      <Section spacing="default">
        <Container size="wide">
          <AnimatedSection animation="fade-up" className="mb-8">
            <h2 className="text-heading text-foreground">Shop per categorie</h2>
            <div className="accent-line mb-4" />
            <p className="text-sm text-muted-foreground max-w-2xl">
              Kies een categorie om sneller te filteren. Op desktop krijg je sticky filters; op mobiel als drawer.
            </p>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <AnimatedSection key={c} animation="fade-up" delay={i * 60}>
                <Link to={`/shop/c/${c}`} className="group block rounded-sm overflow-hidden border border-border bg-card">
                  <div className="aspect-[4/3] bg-muted relative">
                    <img
                      src={getCloudinaryImageUrl(categoryImages[c])}
                      alt={categoryLabel(c)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-90" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs tracking-[0.3em] uppercase text-cream/80">Categorie</p>
                      <p className="font-heading text-xl text-cream">{categoryLabel(c)}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured products */}
      <Section spacing="default" className="bg-cream-dark">
        <Container size="wide">
          <AnimatedSection animation="fade-up" className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-heading text-foreground">Aanbevolen</h2>
              <div className="accent-line mb-4" />
              <p className="text-sm text-muted-foreground">Een selectie om snel te starten.</p>
            </div>
            <Link
              to="/shop/search"
              className="text-xs tracking-[0.2em] uppercase text-accent hover:underline"
            >
              Alles bekijken
            </Link>
          </AnimatedSection>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ShopProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="p-6 bg-muted rounded-sm text-sm text-muted-foreground">Nog geen producten gevonden.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => (
                <AnimatedSection key={p.id} animation="fade-up" delay={i * 50}>
                  <ShopProductCard product={p} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* USPs + newsletter */}
      <Section spacing="default">
        <Container size="wide">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Kwaliteit", desc: "Salonmerken met bewezen routines." },
                  { title: "Snel kiezen", desc: "Zoek, filter en sorteer zonder ruis." },
                  { title: "Veilig", desc: "Afrekenen via Stripe (testomgeving mogelijk)." },
                ].map((u) => (
                  <div key={u.title} className="bg-card border border-border rounded-sm p-6">
                    <p className="font-heading text-lg text-foreground mb-2">{u.title}</p>
                    <p className="text-sm text-muted-foreground">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-sm p-6">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Nieuwsbrief</p>
                <p className="font-heading text-xl text-foreground mb-2">Updates & tips</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Krijg af en toe een korte update met tips en productselecties.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

