import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './env';
import { prisma } from './prisma';
import {
  createSession,
  createUser,
  deleteSession,
  getUserBySessionToken,
  loginSchema,
  registerSchema,
  verifyUser,
} from './auth';
import { getStripe } from './stripe';
import { z } from 'zod';
import Stripe from 'stripe';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { syncWooProducts } from './wooSync';

const app = express();

app.set('trust proxy', 1);

function isAllowedOrigin(origin: string | undefined | null) {
  if (!origin) return true;
  if (env.nodeEnv !== 'production' && origin.startsWith('http://localhost:')) return true;
  return env.corsOrigins.includes(origin);
}

app.use(
  cors({
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
    credentials: true,
  }),
);
// Stripe webhooks need raw body. Skip JSON parsing for that route.
const jsonParser = express.json({ limit: '200kb' });
app.use((req, res, next) => {
  if (req.path === '/api/webhooks/stripe') return next();
  return jsonParser(req, res, next);
});
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
);

// Basic origin guard for cookie-based auth (dev/prod)
// Allow same-origin requests (no origin header) when frontend and backend are on same domain
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const origin = req.headers.origin;
  
  // Same-origin requests (frontend and backend on same domain) don't send Origin header
  // This is normal and safe - allow it when serving static files
  if (!origin) {
    // If we're serving static files (SERVE_STATIC=1), same-origin is expected
    // This happens when frontend and backend are on the same Railway domain
    if (process.env.SERVE_STATIC === '1') {
      return next(); // Allow same-origin requests
    }
    
    // For cross-origin requests, origin header is required
    // But log it for debugging
    console.warn('[CORS] Missing Origin header for', req.method, req.path, 'from', req.headers.host);
    return res.status(403).json({ error: 'Missing Origin header. This is required for cross-origin requests.' });
  }
  
  // Validate origin for cross-origin requests
  if (!isAllowedOrigin(origin)) {
    console.warn('[CORS] Invalid Origin:', origin, 'Allowed:', env.corsOrigins.join(', '));
    return res.status(403).json({ 
      error: `Invalid Origin: ${origin}. Allowed origins: ${env.corsOrigins.join(', ')}` 
    });
  }
  
  next();
});

function setSessionCookie(res: express.Response, token: string) {
  res.cookie(env.sessionCookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    domain: env.sessionCookieDomain,
    path: '/',
    maxAge: env.sessionDays * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res: express.Response) {
  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    domain: env.sessionCookieDomain,
    path: '/',
  });
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// --- Reviews (Google via Trustindex) ---
type GoogleReviewsSummary = {
  source: 'trustindex';
  rating: number | null;
  count: number | null;
  fetchedAt: string;
};

let googleReviewsCache: { at: number; value: GoogleReviewsSummary } | null = null;
const GOOGLE_REVIEWS_CACHE_MS = 30 * 60 * 1000; // 30 minutes

app.get('/api/reviews/google', async (_req, res) => {
  try {
    const now = Date.now();
    if (googleReviewsCache && now - googleReviewsCache.at < GOOGLE_REVIEWS_CACHE_MS) {
      return res.json(googleReviewsCache.value);
    }

    const url = 'https://www.trustindex.io/reviews/bluediamonds.club';
    const r = await fetch(url, {
      headers: {
        // Avoid overly aggressive bot blocks; keep it simple.
        'user-agent': 'BlueDiamondsWebsite/1.0 (+https://bluediamonds.club)',
        accept: 'text/html,*/*',
      },
    });

    if (!r.ok) {
      return res.status(502).json({
        source: 'trustindex',
        rating: null,
        count: null,
        fetchedAt: new Date().toISOString(),
      } satisfies GoogleReviewsSummary);
    }

    const html = await r.text();

    // Example snippet on Trustindex:
    // "4.7 | 229 reviews"
    const m1 = html.match(/(\d+(?:\.\d+)?)\s*\|\s*([\d.,]+)\s*reviews/i);
    const rating = m1 ? Number(m1[1]) : null;
    const count = m1 ? Number(String(m1[2]).replace(/[^\d]/g, '')) : null;

    const summary: GoogleReviewsSummary = {
      source: 'trustindex',
      rating: Number.isFinite(rating as number) ? (rating as number) : null,
      count: Number.isFinite(count as number) ? (count as number) : null,
      fetchedAt: new Date().toISOString(),
    };

    googleReviewsCache = { at: now, value: summary };
    return res.json(summary);
  } catch {
    return res.status(502).json({
      source: 'trustindex',
      rating: null,
      count: null,
      fetchedAt: new Date().toISOString(),
    } satisfies GoogleReviewsSummary);
  }
});

// --- Reviews (Salonized) ---
type SalonizedReviewsSummary = {
  source: 'salonized';
  rating: number | null;
  count: number | null;
  fetchedAt: string;
};

let salonizedReviewsCache: { at: number; value: SalonizedReviewsSummary } | null = null;
const SALONIZED_REVIEWS_CACHE_MS = 60 * 1000; // 1 minute (near real-time)

app.get('/api/reviews/salonized', async (_req, res) => {
  try {
    const now = Date.now();
    if (salonizedReviewsCache && now - salonizedReviewsCache.at < SALONIZED_REVIEWS_CACHE_MS) {
      return res.json(salonizedReviewsCache.value);
    }

    const url = 'https://blue-diamonds-club.salonized.com/reviews';
    const r = await fetch(url, {
      headers: {
        'user-agent': 'BlueDiamondsWebsite/1.0 (+https://bluediamonds.club)',
        accept: 'text/html,*/*',
      },
    });

    if (!r.ok) {
      return res.status(502).json({
        source: 'salonized',
        rating: null,
        count: null,
        fetchedAt: new Date().toISOString(),
      } satisfies SalonizedReviewsSummary);
    }

    const html = await r.text();

    // Example visible text:
    // "4.9" and "gebaseerd op 712 reviews"
    const ratingMatch = html.match(/>\s*(\d+(?:\.\d+)?)\s*<\/[^>]+>\s*gebaseerd op\s*\d+/i);
    const rating = ratingMatch ? Number(ratingMatch[1]) : null;

    const countMatch = html.match(/gebaseerd op\s*([\d.,]+)\s*reviews/i);
    const count = countMatch ? Number(String(countMatch[1]).replace(/[^\d]/g, '')) : null;

    const summary: SalonizedReviewsSummary = {
      source: 'salonized',
      rating: Number.isFinite(rating as number) ? (rating as number) : null,
      count: Number.isFinite(count as number) ? (count as number) : null,
      fetchedAt: new Date().toISOString(),
    };

    salonizedReviewsCache = { at: now, value: summary };
    return res.json(summary);
  } catch {
    return res.status(502).json({
      source: 'salonized',
      rating: null,
      count: null,
      fetchedAt: new Date().toISOString(),
    } satisfies SalonizedReviewsSummary);
  }
});

app.get('/api/shop/products', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  const includePrice = !!user;

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    take: 2000,
    select: { sku: true, name: true, brand: true, image: true, currency: true, priceCents: true },
  });
  return res.json({
    products: products.map((p) => ({
      id: p.sku,
      name: p.name,
      brand: p.brand,
      image: p.image,
      currency: p.currency,
      priceCents: includePrice ? p.priceCents : null,
    })),
  });
});

app.post('/api/admin/shop/sync-woo', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });

  // In production, lock this down via ADMIN_EMAILS env var.
  if (env.nodeEnv === 'production' && env.adminEmails.length > 0) {
    const email = String(user.email || '').toLowerCase();
    if (!env.adminEmails.includes(email)) return res.status(403).json({ error: 'Forbidden.' });
  }

  try {
    const result = await syncWooProducts();
    return res.json({ ok: true, ...result });
  } catch (e) {
    return res.status(502).json({ ok: false, error: e instanceof Error ? e.message : 'Woo sync failed.' });
  }
});

// Stripe webhook (raw body)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(501).send('Stripe webhook not configured.');

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch {
    return res.status(501).send('Stripe not configured.');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || Array.isArray(sig)) return res.status(400).send('Missing signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

    if (orderId && userId) {
      // idempotent update
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          paymentProvider: 'stripe',
          checkoutSessionId: session.id,
          paymentIntentId,
          externalRef: session.id,
        },
      }).catch(() => {});
    }
  }

  res.json({ received: true });
});

app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });
  return res.json({ email: user.email, name: user.name ?? null });
});

app.get('/api/account/me', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return res.json({
    profile: { email: user.email, name: user.name ?? null },
    orders: orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,
      currency: o.currency,
      totalCents: o.totalCents,
      source: o.source,
      externalRef: o.externalRef ?? null,
      items: (() => {
        try {
          return JSON.parse(o.itemsJson) as unknown;
        } catch {
          return [];
        }
      })(),
    })),
  });
});

// Update profile (name and email)
const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(80).nullable(),
  email: z.string().trim().toLowerCase().email(),
});

app.post('/api/account/update-profile', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload.', details: parsed.error.errors });
  }

  const { name, email } = parsed.data;

  // Check if email is already taken by another user
  if (email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Dit e-mailadres is al in gebruik.' });
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
        email,
      },
    });

    return res.json({ email: updated.email, name: updated.name ?? null });
  } catch (e) {
    console.error('[Update Profile] Error:', e);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het bijwerken van je profiel.',
      details: e instanceof Error ? e.message : 'Unknown error'
    });
  }
});

// Change password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

app.post('/api/account/change-password', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });

  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload.', details: parsed.error.errors });
  }

  const { currentPassword, newPassword } = parsed.data;

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Huidig wachtwoord is onjuist.' });
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return res.json({ message: 'Wachtwoord succesvol gewijzigd.' });
  } catch (e) {
    console.error('[Change Password] Error:', e);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het wijzigen van je wachtwoord.',
      details: e instanceof Error ? e.message : 'Unknown error'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error('[Register] Validation error:', parsed.error);
      return res.status(400).json({ error: 'Invalid payload.', details: parsed.error.errors });
    }

    const { email, password, name } = parsed.data;

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Account bestaat al.' });
      }
    } catch (dbError) {
      console.error('[Register] Database error (check existing):', dbError);
      return res.status(500).json({ 
        error: 'Database error bij controleren account.', 
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
    }

    let user;
    try {
      user = await createUser({ email, password, name });
    } catch (dbError) {
      console.error('[Register] Database error (create user):', dbError);
      // Check if it's a unique constraint violation (duplicate email)
      if (dbError instanceof Error && dbError.message.includes('Unique constraint')) {
        return res.status(409).json({ error: 'Account bestaat al.' });
      }
      return res.status(500).json({ 
        error: 'Database error bij aanmaken account.', 
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
    }

    let session;
    try {
      session = await createSession(user.id);
    } catch (dbError) {
      console.error('[Register] Database error (create session):', dbError);
      return res.status(500).json({ 
        error: 'Database error bij aanmaken sessie.', 
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
    }

    setSessionCookie(res, session.token);
    return res.status(201).json({ email: user.email, name: user.name ?? null });
  } catch (error) {
    console.error('[Register] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Er is een onverwachte fout opgetreden.', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload.' });

  const user = await verifyUser(parsed.data);
  if (!user) return res.status(401).json({ error: 'Onjuiste inloggegevens.' });

  const session = await createSession(user.id);
  setSessionCookie(res, session.token);
  return res.json({ email: user.email, name: user.name ?? null });
});

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  await deleteSession(token);
  clearSessionCookie(res);
  return res.json({ ok: true });
});

const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), qty: z.number().int().min(1).max(99) })).min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

app.post('/api/checkout/create-session', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });

  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload.' });

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch (e) {
    return res.status(501).json({ error: 'Payments are not configured (missing Stripe key).' });
  }

  const { items, successUrl, cancelUrl } = parsed.data;
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { sku: { in: productIds }, active: true },
    select: { sku: true, name: true, priceCents: true },
  });

  const bySku = new Map(products.map((p) => [p.sku as string, p]));
  const normalized = items.map((i) => {
    const p = bySku.get(i.productId);
    if (!p) throw new Error('Product not available');
    return { productId: i.productId, name: p.name, qty: i.qty, priceCents: p.priceCents };
  });

  const subtotalCents = normalized.reduce((sum, i) => sum + i.qty * i.priceCents, 0);
  
  // Calculate shipping: free above €50, otherwise €4.95
  const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
  const SHIPPING_COST_CENTS = 495;
  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_COST_CENTS;
  const totalCents = subtotalCents + shippingCents;

  // Create a pending order first (so we can show it even if webhook is delayed)
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'created',
      currency: 'EUR',
      totalCents,
      source: 'shop',
      itemsJson: JSON.stringify([...normalized, ...(shippingCents > 0 ? [{ name: 'Verzendkosten', qty: 1, priceCents: shippingCents }] : [])]),
      paymentProvider: 'stripe',
    },
  });

  const lineItems = [
    ...normalized.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: 'eur',
        unit_amount: i.priceCents,
        product_data: { name: i.name },
      },
    })),
    ...(shippingCents > 0
      ? [
          {
            quantity: 1,
            price_data: {
              currency: 'eur',
              unit_amount: shippingCents,
              product_data: { name: 'Verzendkosten' },
            },
          },
        ]
      : []),
  ];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    payment_method_types: ['card', 'ideal'],
    line_items: lineItems,
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      checkoutSessionId: session.id,
      paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      externalRef: session.id,
    },
  });

  return res.json({ checkoutUrl: session.url, orderId: order.id });
});

// Get order by Stripe session ID (for success page)
app.get('/api/checkout/session', async (req, res) => {
  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : null;
  if (!sessionId) return res.status(400).json({ error: 'Missing session_id.' });

  const order = await prisma.order.findUnique({
    where: { checkoutSessionId: sessionId },
    select: {
      id: true,
      status: true,
      totalCents: true,
      createdAt: true,
      itemsJson: true,
    },
  });

  if (!order) return res.status(404).json({ error: 'Order not found.' });

  let items: Array<{ name: string; qty: number; priceCents: number }> = [];
  try {
    items = JSON.parse(order.itemsJson) as Array<{ name: string; qty: number; priceCents: number }>;
  } catch {
    // ignore
  }

  return res.json({
    order: {
      id: order.id,
      status: order.status,
      totalCents: order.totalCents,
      createdAt: order.createdAt.toISOString(),
      items,
    },
  });
});

// Newsletter subscription
const newsletterSchema = z.object({
  email: z.string().email(),
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres.' });
  }

  const { email } = parsed.data;

  try {
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.subscribed) {
        return res.json({ message: 'Je bent al aangemeld voor de nieuwsbrief.' });
      } else {
        // Re-subscribe
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { subscribed: true },
        });
        return res.json({ message: 'Je bent opnieuw aangemeld voor de nieuwsbrief.' });
      }
    }

    // Create new subscription
    await prisma.newsletterSubscriber.create({
      data: { email, subscribed: true },
    });

    return res.json({ message: 'Bedankt voor je aanmelding! Je ontvangt binnenkort updates.' });
  } catch (e) {
    console.error('[Newsletter] Error:', e);
    return res.status(500).json({ error: 'Er is iets misgegaan. Probeer het later opnieuw.' });
  }
});

// Legacy URL redirects (301 permanent redirects for SEO)
// These handle old URLs from Google search results to prevent 404 errors
// IMPORTANT: These must be BEFORE the static file serving middleware
app.use((req, res, next) => {
  // Skip API routes and static assets
  if (req.path.startsWith('/api') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
    return next();
  }

  const path = req.path.toLowerCase();
  const pathWithoutQuery = path.split('?')[0];

  // Exact matches first
  if (pathWithoutQuery === '/webshop' || pathWithoutQuery === '/webshop/') {
    return res.redirect(301, '/shop');
  }
  if (pathWithoutQuery === '/winkel' || pathWithoutQuery === '/winkel/') {
    return res.redirect(301, '/shop');
  }
  if (pathWithoutQuery === '/producten/winkelwagen' || pathWithoutQuery === '/producten/winkelwagen/') {
    return res.redirect(301, '/shop/cart');
  }
  if (pathWithoutQuery === '/producten/cart' || pathWithoutQuery === '/producten/cart/') {
    return res.redirect(301, '/shop/cart');
  }
  if (pathWithoutQuery === '/shop/winkelwagen' || pathWithoutQuery === '/shop/winkelwagen/') {
    return res.redirect(301, '/shop/cart');
  }
  if (pathWithoutQuery === '/producten/checkout' || pathWithoutQuery === '/producten/checkout/') {
    return res.redirect(301, '/shop/checkout');
  }

  // Pattern matches
  // /producten/:slug -> /shop/search?q=...
  const productenMatch = pathWithoutQuery.match(/^\/producten\/(.+)$/);
  if (productenMatch && productenMatch[1]) {
    const slug = productenMatch[1];
    // Skip if it's a category or cart/checkout (already handled above)
    if (!['categorie', 'winkelwagen', 'cart', 'checkout'].includes(slug.toLowerCase())) {
      const query = slug.replace(/[-_]/g, ' ');
      return res.redirect(301, `/shop/search?q=${encodeURIComponent(query)}`);
    }
  }

  // /product/:slug -> /shop/p/:id or /shop/search?q=...
  const productMatch = pathWithoutQuery.match(/^\/product\/(.+)$/);
  if (productMatch && productMatch[1]) {
    const slug = productMatch[1];
    // If it looks like an ID (p_1, p_2, etc. or just numbers), redirect to product page
    if (/^p_\d+$/.test(slug) || /^\d+$/.test(slug)) {
      return res.redirect(301, `/shop/p/${slug}`);
    }
    // Otherwise search
    const query = slug.replace(/[-_]/g, ' ');
    return res.redirect(301, `/shop/search?q=${encodeURIComponent(query)}`);
  }

  // /shop/product/:id -> /shop/p/:id or /shop/search?q=...
  const shopProductMatch = pathWithoutQuery.match(/^\/shop\/product\/(.+)$/);
  if (shopProductMatch && shopProductMatch[1]) {
    const id = shopProductMatch[1];
    if (/^p_\d+$/.test(id) || /^\d+$/.test(id)) {
      return res.redirect(301, `/shop/p/${id}`);
    }
    const query = id.replace(/[-_]/g, ' ');
    return res.redirect(301, `/shop/search?q=${encodeURIComponent(query)}`);
  }

  // /webshop/:slug -> /shop/search?q=...
  const webshopMatch = pathWithoutQuery.match(/^\/webshop\/(.+)$/);
  if (webshopMatch && webshopMatch[1]) {
    const slug = webshopMatch[1];
    const query = slug.replace(/[-_]/g, ' ');
    return res.redirect(301, `/shop/search?q=${encodeURIComponent(query)}`);
  }

  // /producten/categorie/:category -> /shop/c/:category
  const categoryMatch = pathWithoutQuery.match(/^\/producten\/categorie\/(.+)$/);
  if (categoryMatch && categoryMatch[1]) {
    const category = categoryMatch[1].toLowerCase();
    const categoryMap: Record<string, string> = {
      haar: 'haar',
      gezicht: 'gezicht',
      lichaam: 'lichaam',
      wellness: 'wellness',
    };
    const mapped = categoryMap[category] || category;
    return res.redirect(301, `/shop/c/${mapped}`);
  }

  // /shop/categorie/:category -> /shop/c/:category
  const shopCategoryMatch = pathWithoutQuery.match(/^\/shop\/categorie\/(.+)$/);
  if (shopCategoryMatch && shopCategoryMatch[1]) {
    const category = shopCategoryMatch[1].toLowerCase();
    return res.redirect(301, `/shop/c/${category}`);
  }

  // Continue to next middleware if no redirect matched
  next();
});

// Serve the built frontend (single-app deployment)
if (process.env.SERVE_STATIC === '1') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    // Serve static files first (JS, CSS, images, etc.)
    app.use(express.static(distDir, { index: false }));
    // SPA catch-all: serve index.html for all routes NOT starting with /api
    // This ensures React Router can handle client-side routing
    app.get(/^(?!\/api).*/, (_req, res) => {
      return res.sendFile(path.join(distDir, 'index.html'));
    });
  }
}

app.listen(env.port, '0.0.0.0', () => {
  console.log(`[api] Server running on port ${env.port} (bound to 0.0.0.0)`);
  if (process.env.SERVE_STATIC === '1') {
    console.log(`[api] Serving static files from /dist`);
  }
});

