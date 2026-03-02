import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Forces the viewport to start at the top on every navigation + reload.
 * This prevents the browser from restoring previous scroll positions.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  // Disable browser scroll restoration (including reload/back-forward cache).
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Always jump to top when the route path changes.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

