/**
 * Google Analytics 4 (GA4) Integration
 * Measurement ID: G-VGB25BKEWX
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

const GA_MEASUREMENT_ID = 'G-VGB25BKEWX';

/**
 * Initialize Google Analytics
 * Call this once when the app loads
 */
export function initGoogleAnalytics() {
  // Prevent double initialization
  if (window.gtag) {
    return;
  }

  // Create dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  }

  window.gtag = gtag;

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize GA4
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
}

/**
 * Track page view
 * Call this when the route changes (React Router)
 */
export function trackPageView(path: string, title?: string) {
  if (!window.gtag) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });
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

  window.gtag('event', eventName, eventParams);
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
