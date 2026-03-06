import { Navigate, useLocation } from 'react-router-dom';
import { findLegacyRedirect } from '@/lib/legacyRedirects';

/**
 * Universal legacy redirect component
 * Handles redirects for old URLs to prevent 404 errors
 */
export default function LegacyRedirect() {
  const { pathname } = useLocation();
  const redirect = findLegacyRedirect(pathname);
  
  if (redirect) {
    // Use replace to avoid adding to history
    return <Navigate to={redirect.target} replace />;
  }
  
  // If no redirect found, go to shop (better than 404)
  return <Navigate to="/shop" replace />;
}
