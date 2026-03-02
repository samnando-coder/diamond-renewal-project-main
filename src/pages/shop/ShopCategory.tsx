import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilterSidebar, FilterSidebarTrigger } from "@/components/layout/FilterSidebar";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopProductCardSkeleton } from "@/components/shop/ShopProductCardSkeleton";
import { useShopProducts } from "@/features/shop/useShopProducts";
import { categoryLabel, extractSize, getCategory } from "@/features/shop/catalog";
import type { ShopCategory } from "@/features/shop/types";

const isCategory = (c: string | undefined): c is ShopCategory =>
  c === "haar" || c === "gezicht" || c === "lichaam" || c === "wellness";

type Sort = "featured" | "name-asc" | "price-asc" | "price-desc";

export default function ShopCategory() {
  const { category } = useParams();
  const { data: products = [], isLoading } = useShopProducts();
  const [brand, setBrand] = React.useState("");
  const [size, setSize] = React.useState("");
  const [sort, setSort] = React.useState<Sort>("featured");
  const [visibleCount, setVisibleCount] = React.useState(24);

  React.useEffect(() => {
    setBrand("");
    setSize("");
    setVisibleCount(24);
  }, [category]);

  if (!isCategory(category)) {
    return (
      <Section spacing="default">
        <Container size="wide">
          <div className="bg-card border border-border rounded-sm p-8">
            <p className="text-sm text-muted-foreground">
              Deze categorie bestaat niet.{" "}
              <Link to="/shop" className="text-accent hover:underline">
                Ga naar shop-home
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  const inCategory = products.filter((p) => getCategory(p) === category);
  const filtered = inCategory
    .filter((p) => (brand ? p.brand === brand : true))
    .filter((p) => (size ? extractSize(p.name) === size : true));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name, "nl");
    if (sort === "price-asc") return (a.priceCents ?? Number.POSITIVE_INFINITY) - (b.priceCents ?? Number.POSITIVE_INFINITY);
    if (sort === "price-desc") return (b.priceCents ?? -1) - (a.priceCents ?? -1);
    return 0;
  });

  const visible = sorted.slice(0, visibleCount);

  return (
    <Section spacing="default">
      <Container size="wide">
        <FilterSidebar
          filters={
            <ShopFilters
              products={inCategory}
              brand={brand}
              setBrand={(b) => {
                setBrand(b);
                setVisibleCount(24);
              }}
              size={size}
              setSize={(s) => {
                setSize(s);
                setVisibleCount(24);
              }}
              onClear={() => {
                setBrand("");
                setSize("");
                setVisibleCount(24);
              }}
            />
          }
        >
          <PageHeader
            title={categoryLabel(category)}
            crumbs={[
              { label: "Shop", href: "/shop" },
              { label: categoryLabel(category) },
            ]}
            right={
              <>
                <div className="lg:hidden">
                  <FilterSidebarTrigger />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-10 rounded-sm border border-border bg-background px-3 text-sm text-foreground"
                  aria-label="Sorteren"
                >
                  <option value="featured">Aanbevolen</option>
                  <option value="name-asc">Naam (A–Z)</option>
                  <option value="price-asc">Prijs (laag–hoog)</option>
                  <option value="price-desc">Prijs (hoog–laag)</option>
                </select>
              </>
            }
          />

          <p className="mt-4 text-xs text-muted-foreground">
            {isLoading ? "Bezig met laden…" : `${sorted.length} producten`}
          </p>

          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => <ShopProductCardSkeleton key={idx} />)
            ) : sorted.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 p-6 bg-muted rounded-sm text-sm text-muted-foreground">
                Geen producten gevonden (pas je filters aan).
              </div>
            ) : (
              visible.map((p) => <ShopProductCard key={p.id} product={p} />)
            )}
          </div>

          {!isLoading && sorted.length > visible.length ? (
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center border border-border bg-background px-6 py-3 text-xs font-medium tracking-wider uppercase hover:bg-muted transition-colors"
                onClick={() => setVisibleCount((c) => Math.min(sorted.length, c + 24))}
              >
                Laad meer
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
                onClick={() => setVisibleCount(sorted.length)}
              >
                Toon alles
              </button>
            </div>
          ) : null}
        </FilterSidebar>
      </Container>
    </Section>
  );
}

