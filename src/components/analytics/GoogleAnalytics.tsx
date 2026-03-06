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
    initGoogleAnalytics();
  }, []);

  // Track page view on route change
  useEffect(() => {
    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return null; // This component doesn't render anything
}
