import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ReactNode } from 'react';

export function SimpleContentPage(props: { eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                {props.eyebrow ?? 'Info'}
              </span>
              <h1 className="text-display text-cream mt-4 mb-6">{props.title}</h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">{props.children}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

