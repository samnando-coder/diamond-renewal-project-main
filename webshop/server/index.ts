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
import bcrypt from 'bcryptjs';

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

// Origin guard
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const origin = req.headers.origin;
  
  if (!origin) {
    if (process.env.SERVE_STATIC === '1') {
      return next();
    }
    console.warn('[CORS] Missing Origin header for', req.method, req.path, 'from', req.headers.host);
    return res.status(403).json({ error: 'Missing Origin header. This is required for cross-origin requests.' });
  }
  
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

// Auth endpoints
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
  res.clearCookie(env.sessionCookieName, { domain: env.sessionCookieDomain, path: '/' });
  return res.json({ ok: true });
});

app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated.' });
  return res.json({ email: user.email, name: user.name ?? null });
});

// Shop endpoints
app.get('/api/shop/products', async (req, res) => {
  const token = req.cookies?.[env.sessionCookieName] as string | undefined;
  const user = await getUserBySessionToken(token);
  const includePrice = !!user;

  try {
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
  } catch (error) {
    console.error('[Shop Products] Error:', error);
    // Return empty array so frontend can use static fallback
    return res.json({ products: [] });
  }
});

// Account endpoints
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

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Huidig wachtwoord is onjuist.' });
  }

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

// Checkout endpoints
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
  
  const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
  const SHIPPING_COST_CENTS = 495;
  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_COST_CENTS;
  const totalCents = subtotalCents + shippingCents;

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

// Stripe webhook
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
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.subscribed) {
        return res.json({ message: 'Je bent al aangemeld voor de nieuwsbrief.' });
      } else {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { subscribed: true },
        });
        return res.json({ message: 'Je bent opnieuw aangemeld voor de nieuwsbrief.' });
      }
    }

    await prisma.newsletterSubscriber.create({
      data: { email, subscribed: true },
    });

    return res.json({ message: 'Bedankt voor je aanmelding! Je ontvangt binnenkort updates.' });
  } catch (e) {
    console.error('[Newsletter] Error:', e);
    return res.status(500).json({ error: 'Er is iets misgegaan. Probeer het later opnieuw.' });
  }
});

// Serve static files
if (process.env.SERVE_STATIC === '1') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir, { index: false }));
    app.get(/^(?!\/api).*/, (_req, res) => {
      return res.sendFile(path.join(distDir, 'index.html'));
    });
  }
}

app.listen(env.port, '0.0.0.0', () => {
  console.log(`[webshop] Server running on port ${env.port} (bound to 0.0.0.0)`);
  if (process.env.SERVE_STATIC === '1') {
    console.log(`[webshop] Serving static files from /dist`);
  }
});
