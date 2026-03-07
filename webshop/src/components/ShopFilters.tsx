import { Button } from "@/components/ui/button";
import type { ShopProduct } from "@/features/shop/types";
import { extractSize } from "@/features/shop/catalog";

type ShopFiltersProps = {
  products: ShopProduct[];
  brand: string;
  setBrand: (brand: string) => void;
  size: string;
  setSize: (size: string) => void;
  onClear: () => void;
};

export function ShopFilters({ products, brand, setBrand, size, setSize, onClear }: ShopFiltersProps) {
  const brandOptions = Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => a.localeCompare(b, "nl"));

  const sizeOptions = Array.from(
    new Set(
      products
        .map((p) => extractSize(p.name))
        .filter((s): s is string => Boolean(s)),
    ),
  ).sort((a, b) => a.localeCompare(b, "nl", { numeric: true }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-lg text-foreground">Filters</p>
        <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          {products.length} items
        </span>
      </div>
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Merk</p>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setSize("");
          }}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Alle merken</option>
          {brandOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Grootte</p>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Alle grootheden</option>
          {sizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Button variant="outline" className="w-full" onClick={onClear}>
        Wis filters
      </Button>
    </div>
  );
}

