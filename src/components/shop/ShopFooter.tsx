import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";

export function ShopFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container size="wide" className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-heading text-lg text-foreground mb-2">Blue Diamonds</p>
            <p className="text-sm text-muted-foreground">
              Premium producten uit de salon — samengesteld met focus op resultaat en kwaliteit.
            </p>
          </div>
          <div className="text-sm">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Service</p>
            <div className="grid gap-2">
              <Link className="text-muted-foreground hover:text-foreground" to="/contact">
                Contact
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" to="/privacy">
                Privacy
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" to="/algemene-voorwaarden">
                Algemene voorwaarden
              </Link>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Shop</p>
            <div className="grid gap-2">
              <Link className="text-muted-foreground hover:text-foreground" to="/shop/c/haar">
                Haar
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" to="/shop/c/gezicht">
                Gezicht
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" to="/shop/c/lichaam">
                Lichaam
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" to="/shop/c/wellness">
                Wellness
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Blue Diamonds</p>
          <p className="text-xs text-muted-foreground">Branding & theme blijven 100% identiek aan de hoofdsite.</p>
        </div>
      </Container>
    </footer>
  );
}

