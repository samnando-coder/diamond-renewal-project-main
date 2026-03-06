/**
 * Legacy URL redirects mapping
 * Maps old URLs to new URLs to prevent 404 errors from Google search results
 */

export type LegacyRedirect = {
  pattern: RegExp;
  target: string | ((matches: RegExpMatchArray) => string);
  permanent?: boolean; // true = 301, false = 302
};

/**
 * Common legacy URL patterns that might exist in Google search results
 * These will be redirected to the new URL structure
 */
export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  // Old product URLs - various patterns
  {
    pattern: /^\/producten\/(.+)$/i,
    target: (matches) => {
      // Try to find product by name/slug and redirect to /shop/p/:id
      // For now, redirect to shop search
      const query = matches[1].replace(/[-_]/g, ' ');
      return `/shop/search?q=${encodeURIComponent(query)}`;
    },
    permanent: true,
  },
  {
    pattern: /^\/product\/(.+)$/i,
    target: (matches) => {
      const query = matches[1].replace(/[-_]/g, ' ');
      return `/shop/search?q=${encodeURIComponent(query)}`;
    },
    permanent: true,
  },
  {
    pattern: /^\/shop\/product\/(.+)$/i,
    target: (matches) => {
      // If it looks like an ID, redirect to /shop/p/:id
      const id = matches[1];
      if (/^p_\d+$/.test(id) || /^\d+$/.test(id)) {
        return `/shop/p/${id}`;
      }
      // Otherwise search
      const query = id.replace(/[-_]/g, ' ');
      return `/shop/search?q=${encodeURIComponent(query)}`;
    },
    permanent: true,
  },
  {
    pattern: /^\/webshop\/(.+)$/i,
    target: (matches) => {
      const query = matches[1].replace(/[-_]/g, ' ');
      return `/shop/search?q=${encodeURIComponent(query)}`;
    },
    permanent: true,
  },
  
  // Old shop category URLs
  {
    pattern: /^\/producten\/categorie\/(.+)$/i,
    target: (matches) => {
      const category = matches[1].toLowerCase();
      const categoryMap: Record<string, string> = {
        haar: 'haar',
        gezicht: 'gezicht',
        lichaam: 'lichaam',
        wellness: 'wellness',
      };
      const mapped = categoryMap[category] || category;
      return `/shop/c/${mapped}`;
    },
    permanent: true,
  },
  {
    pattern: /^\/shop\/categorie\/(.+)$/i,
    target: (matches) => {
      const category = matches[1].toLowerCase();
      return `/shop/c/${category}`;
    },
    permanent: true,
  },
  
  // Old shop home URLs
  {
    pattern: /^\/webshop\/?$/i,
    target: '/shop',
    permanent: true,
  },
  {
    pattern: /^\/winkel\/?$/i,
    target: '/shop',
    permanent: true,
  },
  
  // Old cart/checkout URLs
  {
    pattern: /^\/producten\/winkelwagen\/?$/i,
    target: '/shop/cart',
    permanent: true,
  },
  {
    pattern: /^\/producten\/cart\/?$/i,
    target: '/shop/cart',
    permanent: true,
  },
  {
    pattern: /^\/shop\/winkelwagen\/?$/i,
    target: '/shop/cart',
    permanent: true,
  },
  {
    pattern: /^\/producten\/checkout\/?$/i,
    target: '/shop/checkout',
    permanent: true,
  },
  
  // Generic producten/* redirects to shop
  {
    pattern: /^\/producten\/.+$/i,
    target: '/shop',
    permanent: true,
  },
];

/**
 * Find redirect for a given path
 * Returns the target URL and whether it's permanent (301) or temporary (302)
 */
export function findLegacyRedirect(pathname: string): { target: string; permanent: boolean } | null {
  // Normalize pathname
  const normalized = pathname.split('?')[0]; // Remove query string
  
  for (const redirect of LEGACY_REDIRECTS) {
    const match = normalized.match(redirect.pattern);
    if (match) {
      const target = typeof redirect.target === 'function' 
        ? redirect.target(match)
        : redirect.target;
      
      return {
        target,
        permanent: redirect.permanent !== false, // Default to permanent (301)
      };
    }
  }
  
  return null;
}

/**
 * Get all possible legacy URLs for a product (for reference)
 * This can be used to generate sitemap entries or test redirects
 */
export function getLegacyProductUrls(productId: string, productName: string): string[] {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [
    `/producten/${slug}`,
    `/product/${slug}`,
    `/product/${productId}`,
    `/shop/product/${slug}`,
    `/shop/product/${productId}`,
    `/webshop/${slug}`,
  ];
}
