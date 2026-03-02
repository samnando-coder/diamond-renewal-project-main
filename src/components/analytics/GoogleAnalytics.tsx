import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGoogleAnalytics, trackPageView } from '@/lib/analytics';

/**
 * Google Analytics Component
 * 
 * This component:
 * 1. Initializes Google Analytics on mount
 * 2. Tracks page views on route changes
 * 
 * Add this component once in your App.tsx
 */
export function GoogleAnalytics() {
  const location = useLocation();

  // Initialize GA on mount
  useEffect(() => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initGoogleAnalytics);
      return () => document.removeEventListener('DOMContentLoaded', initGoogleAnalytics);
    } else {
      initGoogleAnalytics();
    }
  }, []);

  // Track page view on route change
  useEffect(() => {
    // Wait a bit for GA to be ready
    const timeoutId = setTimeout(() => {
      if (window.gtag) {
        trackPageView(location.pathname + location.search, document.title);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return null; // This component doesn't render anything
}
