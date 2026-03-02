/**
 * API base URL configuration
 * 
 * In production (Railway), frontend and backend are on the same domain,
 * so we use relative paths. If frontend is on a separate domain, set
 * VITE_API_BASE_URL environment variable.
 */
const getApiBaseUrl = (): string => {
  // In development, Vite proxy handles /api -> localhost:3001
  // In production (Railway), frontend is served by Express, so relative paths work
  // If frontend is on separate domain, use VITE_API_BASE_URL
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    const baseUrl = envUrl.replace(/\/$/, ''); // Remove trailing slash
    // Debug logging (only in development)
    if (import.meta.env.DEV) {
      console.log('[API] Using VITE_API_BASE_URL:', baseUrl);
    }
    return baseUrl;
  }
  
  // Default: relative paths (works when frontend and backend are on same domain)
  // Debug logging (only in development)
  if (import.meta.env.DEV) {
    console.log('[API] No VITE_API_BASE_URL set, using relative paths');
  }
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Debug: Log API base URL in production (helps troubleshoot)
if (typeof window !== 'undefined') {
  console.log('[API] API_BASE_URL:', API_BASE_URL || '(relative paths)');
}

/**
 * Helper to build API URLs
 */
export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
