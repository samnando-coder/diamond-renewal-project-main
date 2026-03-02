import { useMemo, useRef } from 'react';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { pickByTag } from '@/lib/media';
import type { MediaItem } from '@/lib/media';
import { getCloudinaryImageUrl } from '@/lib/cloudinaryMapping';

// Mapping van video naar poster/thumbnail image (lokale paths)
// Deze worden automatisch omgezet naar Cloudinary URLs als mapping beschikbaar is
const VIDEO_POSTERS: Record<string, string> = {
  "/Blue Diamonds Short 1.mp4": "/Blue Diamonds Foto's/IMG_5602.jpg", // Wenkbrauw/gezichtsbehandeling
  "/Blue Diamonds Short 2.mp4": "/Blue Diamonds Foto's/IMG_5476.jpg", // Gezichtsbehandeling met massage
  "/Blue Diamonds Short 3.mp4": "/Blue Diamonds Foto's/IMG_5512.jpg", // Gezichtsmasker behandeling
  "/Blue Diamonds Short 4.mp4": "/Blue Diamonds Foto's/IMG_5623.jpg", // Massage met kruidenstempels
  "/Blue Diamonds Short 5.mp4": "/Blue Diamonds Foto's/IMG_5525.jpg", // Wellness/mineralen detailshot (IMG_5587 niet in Cloudinary)
};

// Simple video component with static poster
function VideoThumbnail({ item }: { item: MediaItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = useMemo(() => {
    const localPath = VIDEO_POSTERS[item.src];
    return localPath ? getCloudinaryImageUrl(localPath) : "";
  }, [item.src]);

  const handlePlay = () => {
    // Ensure video starts from beginning when user clicks play
    if (videoRef.current && videoRef.current.currentTime !== 0) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <video
      ref={videoRef}
      src={item.src}
      className="w-full h-full object-cover"
      controls
      playsInline
      preload="metadata"
      muted
      poster={poster || undefined}
      onPlay={handlePlay}
    />
  );
}

export const ShortsSection = () => {
  const shorts = pickByTag('shorts', 5);

  return (
    <section className="section-padding bg-cream-dark relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Actueel</span>
          <h2 className="text-heading text-foreground mt-4 mb-6">Shorts & Updates</h2>
          <div className="accent-line-center mb-6" />
          <p className="text-lead">
            Korte impressies uit de salon — altijd echte beelden, geen stock.
          </p>
        </AnimatedSection>

        {/* Shorts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {shorts.map((item, i) => (
            <AnimatedSection key={item.src} animation="fade-up" delay={i * 80}>
              <div className="rounded-sm overflow-hidden border border-border bg-background shadow-lg hover-glow">
                <div className="aspect-[9/16] bg-muted">
                  <VideoThumbnail item={item} />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

