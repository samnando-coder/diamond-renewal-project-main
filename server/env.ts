export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  // Dev default must not collide with Vite (8080). Vite proxies /api -> 3001.
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8080')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? 'bd_session',
  sessionCookieDomain: process.env.SESSION_COOKIE_DOMAIN?.trim() || undefined,
  sessionDays: Number(process.env.SESSION_DAYS ?? 30),
  adminEmails: (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  wooRestBase: process.env.WOO_REST_BASE?.trim() || 'https://bluediamonds.club/wp-json/wc/v3/products',
  wooConsumerKey: process.env.WOO_CONSUMER_KEY?.trim() || '',
  wooConsumerSecret: process.env.WOO_CONSUMER_SECRET?.trim() || '',
} as const;

