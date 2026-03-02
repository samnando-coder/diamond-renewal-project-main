import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import * as React from "react";
import { Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/hooks/useAuth";
import { useShopCart } from "@/features/shop/cart";
import { BRAND } from "@/lib/brand";
import { MiniCartDrawer } from "@/components/shop/MiniCartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Haar", href: "/shop/c/haar" },
  { label: "Gezicht", href: "/shop/c/gezicht" },
  { label: "Lichaam", href: "/shop/c/lichaam" },
  { label: "Wellness", href: "/shop/c/wellness" },
];

export function ShopHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useShopCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQ = (searchParams.get("q") ?? "").trim();
  const [q, setQ] = React.useState(initialQ);

  React.useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/shop/search?q=${encodeURIComponent(query)}` : "/shop/search");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      {/* Topbar */}
      <div className="border-b border-border/60 bg-muted/30">
        <Container size="wide" className="py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            <span>Snelle levering</span>
            <span className="hidden sm:inline">•</span>
            <span>Premium salonmerken</span>
            <span className="hidden sm:inline">•</span>
            <span>Veilig afrekenen</span>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <Container size="wide" className="py-4">
        <div className="grid items-center gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link to="/shop" className="flex items-center gap-3">
              <img
                src={BRAND.logoSrc}
                alt={`${BRAND.name} logo`}
                className="h-10 w-auto object-contain"
                loading="eager"
                decoding="async"
              />
              <div className="leading-tight">
                <div className="font-heading text-lg text-foreground">{BRAND.name}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Webshop</div>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={submit} className="flex gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Zoek een product…"
                  className="h-11 w-full rounded-sm border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Zoeken"
                />
              </div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-navy-light px-5">
                Zoeken
              </Button>
            </form>
          </div>

          <div className="lg:col-span-3 flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex h-11 items-center gap-2 rounded-sm border border-border bg-background px-3 text-sm text-foreground hover:bg-muted transition-colors"
                  aria-label="Account"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem disabled className="opacity-80">
                      {user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account">Mijn account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Uitloggen</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Inloggen</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/aanmelden">Aanmelden</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <MiniCartDrawer
              trigger={
                <button
                  className="relative inline-flex h-11 items-center gap-2 rounded-sm border border-border bg-background px-3 text-sm text-foreground hover:bg-muted transition-colors"
                  aria-label="Winkelwagen"
                  type="button"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Winkelwagen</span>
                  {itemCount > 0 ? (
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-semibold grid place-items-center">
                      {itemCount}
                    </span>
                  ) : null}
                </button>
              }
            />
          </div>
        </div>
      </Container>

      {/* Category nav */}
      <div className="border-t border-border/60 bg-background">
        <Container size="wide" className="py-3">
          <nav className="flex items-center gap-6 overflow-x-auto">
            {categories.map((c) => (
              <NavLink
                key={c.href}
                to={c.href}
                className={({ isActive }) =>
                  cn(
                    "text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors border-b-2 pb-2 -mb-2",
                    isActive
                      ? "text-accent border-accent"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                  )
                }
              >
                {c.label}
              </NavLink>
            ))}
            <div className="ml-auto hidden md:flex">
              <Link to="/" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground">
                Terug naar hoofdsite
              </Link>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

