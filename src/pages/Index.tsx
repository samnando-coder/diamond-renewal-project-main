import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ShortsSection } from '@/components/sections/ShortsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ArrangementsSection } from '@/components/sections/ArrangementsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ImpressieSection } from '@/components/sections/ImpressieSection';
import { CTASection } from '@/components/sections/CTASection';
import { ParallaxBackground } from '@/components/animations/ParallaxBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global parallax background */}
      <ParallaxBackground intensity={0.3} className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        <Header />
        <main className="page-transition">
          <HeroSection />
          <ShortsSection />
          <ServicesSection />
          <ArrangementsSection />
          <AboutSection />
          <ImpressieSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
