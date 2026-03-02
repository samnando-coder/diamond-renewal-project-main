# Deployment Guide — Blue Diamonds Club Webshop

Deze guide helpt je om de webshop live te zetten met alle benodigde configuratie.

## Overzicht

De shop bestaat uit:
- **Frontend**: React SPA (Vite build → `dist/`)
- **Backend**: Express API server (`server/`)
- **Database**: SQLite (dev) of PostgreSQL (production)
- **Payments**: Stripe Checkout

## Stappenplan

### 1. Database Setup

#### Development (SQLite)
```bash
npx prisma generate
npx prisma migrate deploy
npm run seed:products  # Optioneel: seed test data
```

#### Production (PostgreSQL) — **SNELSTE WEG**

**Gebruik de automatische setup script:**

1. Kies een database provider (Supabase/Railway/Render - zie `QUICK_START_PRODUCTION.md`)
2. Kopieer `ENV.production.example` naar `.env` en vul in:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   CORS_ORIGIN="https://www.bluediamonds.club,https://bluediamonds.club"
   SESSION_COOKIE_NAME="bd_session"
   SESSION_COOKIE_DOMAIN=".bluediamonds.club"
   ```
3. Run de setup:
   ```bash
   npm run setup:production-db
   ```

**Handmatige setup (als je meer controle wilt):**
```bash
npm run db:generate
npm run db:migrate
```

Zie `DATABASE_SETUP.md` of `QUICK_START_PRODUCTION.md` voor uitgebreide instructies.

### 2. Environment Variables

Kopieer `ENV.example` naar `.env` en vul in:

#### Verplicht
- `DATABASE_URL`: Database connection string
- `CORS_ORIGIN`: Comma-separated allowed origins (bijv. `https://www.bluediamonds.club,https://bluediamonds.club`)
- `SESSION_COOKIE_NAME`: Cookie naam (default: `bd_session`)
- `SESSION_COOKIE_DOMAIN`: Voor cross-subdomain sessions (bijv. `.bluediamonds.club`)
- `SESSION_DAYS`: Session expiry in dagen (default: 30)

#### Stripe (voor betalingen)
- `STRIPE_SECRET_KEY`: Stripe secret key (test of live)
- `STRIPE_WEBHOOK_SECRET`: Webhook secret van Stripe Dashboard

#### Optioneel
- `WOO_REST_BASE`: WooCommerce REST API endpoint (voor product sync)
- `WOO_CONSUMER_KEY`: WooCommerce consumer key
- `WOO_CONSUMER_SECRET`: WooCommerce consumer secret
- `ADMIN_EMAILS`: Comma-separated admin emails (voor admin endpoints)

### 3. Stripe Webhook Configuratie

1. Ga naar [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klik "Add endpoint"
3. Endpoint URL: `https://jouw-domein.com/api/webhooks/stripe`
4. Events: Selecteer `checkout.session.completed`
5. Kopieer de "Signing secret" → zet in `.env` als `STRIPE_WEBHOOK_SECRET`

### 4. Build & Deploy

#### Frontend Build
```bash
npm run build
```
Output: `dist/` directory

#### Server Start
```bash
# Development
npm run dev

# Production
NODE_ENV=production SERVE_STATIC=1 npm start
```

De `SERVE_STATIC=1` flag zorgt dat de Express server ook de `dist/` directory serveert (SPA routing).

### 5. Deployment Opties

#### Option A: Monolith (Server serveert alles)
- Build frontend: `npm run build`
- Start server met `SERVE_STATIC=1`
- Server draait op poort 3001 (of `PORT` env var)
- Reverse proxy (nginx/Apache) voor HTTPS en domain routing

#### Option B: Gescheiden (Frontend op CDN, API apart)
- Frontend: Deploy `dist/` naar Vercel/Netlify/Cloudflare Pages
- Backend: Deploy `server/` naar Railway/Fly.io/Render
- Zorg dat `CORS_ORIGIN` de frontend URL bevat

### 6. Reverse Proxy (nginx example)

```nginx
server {
    listen 80;
    server_name shop.bluediamonds.club;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. SSL/HTTPS

Gebruik Let's Encrypt (certbot) of je hosting provider's SSL tooling.

### 8. Product Data

#### Optie 1: WooCommerce Sync (als je WooCommerce hebt)
1. Zet `WOO_REST_BASE`, `WOO_CONSUMER_KEY`, `WOO_CONSUMER_SECRET` in `.env`
2. Log in op de shop als admin
3. Ga naar `/api/admin/shop/sync-woo` (POST request) of gebruik de script:
   ```bash
   npm run sync:woo
   ```

#### Optie 2: CSV Import (fallback)
1. Export producten als CSV uit WooCommerce (of handmatig)
2. Zorg dat kolommen zijn: `sku;brand;name;imageUrl;priceCents`
3. Run:
   ```bash
   npm run import:product-images -- --file="products.csv"
   ```

#### Optie 3: Handmatig via Prisma Studio
```bash
npx prisma studio
```

### 9. Verificatie Checklist

- [ ] Database migrations zijn gerund
- [ ] `.env` is correct geconfigureerd
- [ ] Stripe webhook is ingesteld en getest
- [ ] Frontend build werkt (`npm run build`)
- [ ] Server start zonder errors
- [ ] Producten zijn zichtbaar in `/shop`
- [ ] Cart functionaliteit werkt
- [ ] Checkout redirect naar Stripe
- [ ] Webhook ontvangt events (check Stripe Dashboard → Events)
- [ ] Orders verschijnen in `/account` na betaling
- [ ] SSL/HTTPS is actief
- [ ] CORS is correct geconfigureerd

### 10. Monitoring

- Check Stripe Dashboard → Events voor webhook deliveries
- Check database voor orders (`npx prisma studio`)
- Monitor server logs voor errors
- Test checkout flow regelmatig (test mode in Stripe)

## Troubleshooting

### Webhook ontvangt geen events
- Check dat webhook URL correct is en bereikbaar
- Check `STRIPE_WEBHOOK_SECRET` in `.env`
- Test webhook in Stripe Dashboard → Webhooks → Send test webhook

### CORS errors
- Check `CORS_ORIGIN` bevat de exacte frontend URL (inclusief protocol)
- Check dat server `Access-Control-Allow-Origin` header stuurt

### Products niet zichtbaar
- Check database heeft producten: `npx prisma studio`
- Check `/api/shop/products` endpoint werkt
- Check frontend fallback naar `src/data/shopCatalog.ts` werkt

### Session cookies werken niet
- Check `SESSION_COOKIE_DOMAIN` is correct (bijv. `.bluediamonds.club` voor subdomains)
- Check cookies zijn `Secure` in production (`NODE_ENV=production`)
- Check browser accepteert cookies (third-party cookies kunnen geblokkeerd zijn)

## Support

Voor vragen of issues, check:
- `README.md` voor algemene info
- `SHOP_IMAGES_IMPORT.md` voor product image import
- Server logs voor error details
