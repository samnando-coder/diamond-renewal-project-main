import * as React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ShopErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[Shop] Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Section spacing="default">
          <Container size="wide">
            <div className="bg-card border border-border rounded-sm p-8 text-center">
              <h2 className="font-heading text-xl text-foreground mb-4">Er is iets misgegaan</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We konden deze pagina niet laden. Probeer het later opnieuw of neem contact met ons op.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/shop">Terug naar Shop</Link>
                </Button>
                <Button asChild>
                  <Link to="/contact">Contact Opnemen</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      );
    }

    return this.props.children;
  }
}
