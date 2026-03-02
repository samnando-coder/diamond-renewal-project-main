import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function ShopNotFound() {
  return (
    <Section spacing="default">
      <Container size="wide">
        <div className="bg-card border border-border rounded-sm p-8">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Pagina niet gevonden</p>
          <h1 className="font-heading text-2xl text-foreground mb-3">Deze shop-pagina bestaat niet (meer).</h1>
          <p className="text-sm text-muted-foreground mb-6">Ga terug naar de shop-home en probeer het opnieuw.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase hover:bg-gold-dark transition-colors"
          >
            Naar shop
          </Link>
        </div>
      </Container>
    </Section>
  );
}

