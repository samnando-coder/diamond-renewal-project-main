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
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  // Default: relative paths (works when frontend and backend are on same domain)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Helper to build API URLs
 */
export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
