import { useEffect, useMemo, useRef } from 'react';

type Props = {
  micrositeUrl: string;
  onCountChange?: (count: number | null) => void;
  className?: string;
};

function ensureSalonizedScriptLoaded(micrositeUrl: string) {
  const existing = document.querySelector('script[data-name="salonized"]') as HTMLScriptElement | null;
  if (existing) return;

  const s = document.createElement('script');
  s.src = 'https://cdn.salonized.com/widget.js';
  s.async = true;
  s.dataset.name = 'salonized';
  s.dataset.micrositeUrl = micrositeUrl;
  document.body.appendChild(s);
}

function extractFirstLargeNumber(text: string): number | null {
  // Look for a plausible review count first (e.g. "123", "123 reviews", "123 beoordelingen")
  const m = text.match(/(\d{1,6})/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function SalonizedReviewsMini({ micrositeUrl, onCountChange, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const observer = useMemo(() => {
    if (!onCountChange) return null;
    return new MutationObserver(() => {
      const el = ref.current;
      if (!el) return;
      const text = (el.textContent ?? '').trim();
      onCountChange(extractFirstLargeNumber(text));
    });
  }, [onCountChange]);

  useEffect(() => {
    ensureSalonizedScriptLoaded(micrositeUrl);
  }, [micrositeUrl]);

  useEffect(() => {
    if (!observer) return;
    const el = ref.current;
    if (!el) return;

    observer.observe(el, { childList: true, subtree: true, characterData: true });
    // best-effort initial read (in case content is already there)
    const initial = (el.textContent ?? '').trim();
    onCountChange?.(extractFirstLargeNumber(initial));

    return () => observer.disconnect();
  }, [observer, onCountChange]);

  return (
    <div
      ref={ref}
      className={['salonized-reviews-mini', className].filter(Boolean).join(' ')}
      style={{ textAlign: 'center' }}
    />
  );
}

