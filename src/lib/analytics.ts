/**
 * Google Analytics / Google Ads Integration
 * Google Ads Conversion ID: AW-410102787
 * Google Analytics 4 ID: G-VGB25BKEWX (if needed)
 * 
 * Note: The gtag script is loaded directly in index.html
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = 'AW-410102787'; // Google Ads Conversion ID
const GA4_MEASUREMENT_ID = 'G-VGB25BKEWX'; // Google Analytics 4 ID (optional)

/**
 * Initialize Google Analytics
 * Note: The gtag script is already loaded in index.html
 * This function just ensures gtag is available and tracks page views
 */
export function initGoogleAnalytics() {
  // gtag is already loaded from index.html, just ensure it's available
  if (!window.gtag) {
    // Fallback: if gtag is not available, create it
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer!.push(args);
    };
  }
}

/**
 * Track page view
 * Call this when the route changes (React Router)
 */
export function trackPageView(path: string, title?: string) {
  if (!window.gtag) {
    return;
  }

  // Track page view for Google Ads
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });

  // Also track for GA4 if different ID
  if (GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== GA_MEASUREMENT_ID) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  eventParams?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }
) {
  if (!window.gtag) {
    return;
  }

  // Send event to both Google Ads and GA4
  window.gtag('event', eventName, {
    ...eventParams,
    send_to: [GA_MEASUREMENT_ID, GA4_MEASUREMENT_ID].filter(Boolean).join(','),
  });
}

/**
 * Track e-commerce events
 */
export function trackPurchase(orderId: string, value: number, currency: string = 'EUR', items?: Array<{
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}>) {
  if (!window.gtag) {
    return;
  }

  window.gtag('event', 'purchase', {
    transaction_id: orderId,
    value,
    currency,
    items,
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(itemId: string, itemName: string, price: number, quantity: number = 1) {
  if (!window.gtag) {
    return;
  }

  window.gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: price * quantity,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        price,
        quantity,
      },
    ],
  });
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(value: number, items?: Array<{
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}>) {
  if (!window.gtag) {
    return;
  }

  window.gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value,
    items,
  });
}
