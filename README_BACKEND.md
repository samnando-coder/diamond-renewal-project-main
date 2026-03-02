# Backend README - Blue Diamonds Club

## Overzicht

De backend is een Express.js API server met:
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Production database (SQLite voor dev)
- **Stripe** - Payment processing
- **bcrypt** - Password hashing

## Development Setup

### Installatie

```bash
# Installeer dependencies
npm install

# Genereer Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### Start Server

```bash
# Development (met hot reload)
npm run server

# Production
npm start
```

De server draait op `http://localhost:3001` (of `process.env.PORT`).

## Project Structuur

```
server/
├── index.ts           # Main Express app
├── auth.ts            # Authentication logic
├── prisma.ts          # Prisma Client setup
├── stripe.ts          # Stripe client setup
├── env.ts             # Environment variables
├── wooSync.ts         # WooCommerce sync
└── ...

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations
```

## API Endpoints

### Health Check

- `GET /api/health` - Server health check

### Authentication

- `POST /api/auth/register` - Registreer nieuwe gebruiker
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe" // optioneel
  }
  ```

- `POST /api/auth/login` - Login gebruiker
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- `POST /api/auth/logout` - Logout gebruiker (vereist session cookie)

- `GET /api/auth/me` - Haal huidige gebruiker op (vereist session cookie)

### Account

- `GET /api/account/me` - Haal account info + order history op (vereist login)

### Shop

- `GET /api/shop/products` - Haal producten op
  - Zonder auth: producten zonder prijzen
  - Met auth: producten met prijzen

### Checkout

- `POST /api/checkout/create-session` - Maak Stripe checkout session (vereist login)
  ```json
  {
    "items": [
      { "productId": "product-123", "qty": 2 }
    ],
    "successUrl": "https://www.bluediamonds.club/shop/checkout/success",
    "cancelUrl": "https://www.bluediamonds.club/shop/cart"
  }
  ```

- `GET /api/checkout/session?session_id=...` - Haal order op via Stripe session ID

- `POST /api/webhooks/stripe` - Stripe webhook endpoint (voor order updates)

### Reviews

- `GET /api/reviews/google` - Google reviews (via Trustindex)
- `GET /api/reviews/salonized` - Salonized reviews

### Admin (Optioneel)

- `POST /api/admin/shop/sync-woo` - Sync producten van WooCommerce (vereist admin email)

## Database

### Schema

**User:**
- `id` (String, cuid)
- `email` (String, unique)
- `name` (String, optional)
- `passwordHash` (String)
- `createdAt`, `updatedAt` (DateTime)

**Session:**
- `id` (String, cuid)
- `userId` (String, foreign key)
- `token` (String, unique)
- `expiresAt` (DateTime)
- `createdAt` (DateTime)

**Product:**
- `sku` (String, primary key)
- `name` (String)
- `brand` (String)
- `image` (String, optional)
- `currency` (String)
- `priceCents` (Int)
- `active` (Boolean)

**Order:**
- `id` (String, cuid)
- `userId` (String, foreign key)
- `stripeSessionId` (String, unique, optional)
- `status` (String: "created" | "paid" | "cancelled" | "refunded")
- `totalCents` (Int)
- `currency` (String)
- `items` (JSON)
- `createdAt`, `updatedAt` (DateTime)

### Migrations

```bash
# Nieuwe migration aanmaken
npx prisma migrate dev --name descriptive_name

# Migrations deployen (productie)
npm run db:migrate

# Migrations status checken
npx prisma migrate status

# Database resetten (ALLEEN DEV!)
npx prisma migrate reset
```

### Prisma Studio

```bash
# Open database GUI
npm run db:studio
```

## Environment Variables

### Verplicht

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"
# Of voor dev: file:./dev.db (SQLite)

# CORS
CORS_ORIGIN="https://www.bluediamonds.club,https://bluediamonds.club"

# Session
SESSION_COOKIE_NAME="bd_session"
SESSION_COOKIE_DOMAIN=".bluediamonds.club"  # Voor cross-subdomain
SESSION_DAYS=30
```

### Stripe (Aanbevolen)

```env
STRIPE_SECRET_KEY="sk_live_..."  # of sk_test_... voor dev
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Optioneel

```env
# WooCommerce sync
WOO_REST_BASE="https://bluediamonds.club/wp-json/wc/v3/products"
WOO_CONSUMER_KEY="ck_..."
WOO_CONSUMER_SECRET="cs_..."

# Admin
ADMIN_EMAILS="admin@bluediamonds.club"

# Server
PORT=3001
NODE_ENV=production
SERVE_STATIC=1  # Serve frontend dist/ folder
```

## Database Setup

### Production (PostgreSQL)

**Optie 1: Supabase (Aanbevolen - Gratis tier)**

1. Ga naar [supabase.com](https://supabase.com)
2. Maak nieuw project
3. Ga naar Settings → Database
4. Kopieer "Connection string" (URI mode)
5. Zet in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

**Optie 2: Railway**

1. Ga naar [railway.app](https://railway.app)
2. New Project → Add Database → PostgreSQL
3. Kopieer `DATABASE_URL` uit Variables tab

**Automatische Setup:**

```bash
# Zet DATABASE_URL in .env, dan:
npm run setup:production-db
```

Dit doet:
- ✅ Genereert Prisma Client
- ✅ Runt alle migrations
- ✅ Verifieert database connectie

**Handmatige Setup:**

```bash
npm run db:generate
npm run db:migrate
```

### Development (SQLite)

```env
DATABASE_URL="file:./dev.db"
```

```bash
npm run db:generate
npm run db:migrate
```

## Stripe Setup

### 1. Stripe Account

1. Ga naar [stripe.com](https://stripe.com) → Sign up
2. Maak account aan

### 2. API Keys

**Development (Test Mode):**
1. Ga naar [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)
2. Kopieer **Secret key** (`sk_test_...`)
3. Zet in `.env` als `STRIPE_SECRET_KEY`

**Production (Live Mode):**
1. Schakel over naar **Live mode**
2. Ga naar [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)
3. Kopieer **Secret key** (`sk_live_...`)
4. Zet in `.env` als `STRIPE_SECRET_KEY`

### 3. Webhook Configuratie

**Production:**
1. Ga naar [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klik "Add endpoint"
3. Endpoint URL: `https://your-backend.railway.app/api/webhooks/stripe`
4. Events: Selecteer `checkout.session.completed`
5. Kopieer **Signing secret** (`whsec_...`)
6. Zet in `.env` als `STRIPE_WEBHOOK_SECRET`

**Development (met Stripe CLI):**
```bash
# Installeer Stripe CLI
# Login
stripe login

# Forward webhooks naar local server
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Dit geeft je een nieuwe webhook secret (gebruik deze voor STRIPE_WEBHOOK_SECRET)
```

### 4. Test Checkout

Gebruik Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: Elke toekomstige datum (bijv. 12/34)
- CVC: Elke 3 cijfers (bijv. 123)
- ZIP: Elke 5 cijfers (bijv. 12345)

## Deployment

### Railway (Aanbevolen)

1. **Push naar GitHub**
2. **Ga naar [railway.app](https://railway.app)**
3. **New Project → Deploy from GitHub repo**
4. **Selecteer repository**

5. **Zet Environment Variables:**
   ```env
   DATABASE_URL=postgresql://...
   CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club
   SESSION_COOKIE_NAME=bd_session
   SESSION_COOKIE_DOMAIN=.bluediamonds.club
   SESSION_DAYS=30
   PORT=3001
   NODE_ENV=production
   SERVE_STATIC=1
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

6. **Railway detecteert automatisch:**
   - Node.js project (via `package.json`)
   - Build: `npm run build && npm run db:generate`
   - Start: `NODE_ENV=production SERVE_STATIC=1 npm start`

7. **Run Migrations:**
   ```bash
   # Via Railway CLI
   railway run npm run db:migrate
   
   # Of via Railway Dashboard → Deployments → Run Command
   ```

8. **Generate Domain:**
   - Settings → Domains → Generate Domain
   - Of voeg custom domain toe

### Docker

Er is een `Dockerfile` aanwezig voor Docker deployments:

```bash
# Build
docker build -t bluediamonds-backend .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  -e CORS_ORIGIN=https://www.bluediamonds.club \
  -e SERVE_STATIC=1 \
  bluediamonds-backend
```

### Andere Platforms

**Render:**
- Gebruik `Dockerfile` of configureer build/start commands

**Fly.io:**
- Er is een `fly.toml` aanwezig (check of deze up-to-date is)

**VPS:**
- Gebruik `Dockerfile` of run direct met `npm start`
- Zet reverse proxy (nginx) voor HTTPS

## Product Data

### Optie 1: Static Data (Huidige Setup)

Producten komen uit `src/data/shopCatalog.ts` (frontend). Backend API endpoint `/api/shop/products` retourneert lege array als database leeg is, frontend valt terug op static data.

### Optie 2: Database (Voor Dynamische Producten)

**WooCommerce Sync:**
```bash
# Zet WOO_* env vars in .env
npm run import:woo
```

**CSV Import:**
```bash
# Export producten als CSV (sku;brand;name;imageUrl;priceCents)
npm run import:product-images -- --file="products.csv"
```

**Handmatig via Prisma Studio:**
```bash
npm run db:studio
```

## Security

### CORS

CORS is geconfigureerd via `CORS_ORIGIN` environment variable. Alleen requests van toegestane origins worden geaccepteerd.

### Session Cookies

- Cookies zijn `HttpOnly` (niet toegankelijk via JavaScript)
- Cookies zijn `Secure` in production (alleen HTTPS)
- Cookies hebben `SameSite=Lax` (CSRF protection)
- Cookie domain is configureerbaar via `SESSION_COOKIE_DOMAIN`

### Password Hashing

Wachtwoorden worden gehashed met bcrypt (10 rounds).

### Rate Limiting

Er is rate limiting op `/api/auth/*` endpoints (100 requests per 15 minuten per IP).

## Monitoring

### Logs

Check server logs voor:
- API requests
- Errors
- Database queries (in development mode)

### Health Check

```bash
curl https://your-backend.railway.app/api/health
```

### Database Monitoring

```bash
# Open Prisma Studio
npm run db:studio
```

## Troubleshooting

### "Database connection failed"

**Oplossing:**
1. Check `DATABASE_URL` is correct
2. Check database is bereikbaar (firewall settings)
3. Check database credentials zijn correct
4. Voor Supabase: gebruik direct connection (port 5432), niet pooler

### "Migration failed"

**Oplossing:**
1. Check database heeft correcte permissions
2. Check `DATABASE_URL` wijst naar juiste database
3. Check migrations folder bestaat
4. Check PostgreSQL versie is compatibel

### "Stripe webhook not working"

**Oplossing:**
1. Check `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook URL is bereikbaar vanaf internet
3. Check `checkout.session.completed` event is geselecteerd
4. Test webhook in Stripe Dashboard → Send test webhook

### "CORS errors"

**Oplossing:**
1. Check `CORS_ORIGIN` bevat exacte frontend URL (inclusief protocol)
2. Check geen trailing slash in URL
3. Check server stuurt `Access-Control-Allow-Origin` header

### "Session cookies not working"

**Oplossing:**
1. Check `SESSION_COOKIE_DOMAIN` is correct (bijv. `.bluediamonds.club` voor subdomains)
2. Check cookies zijn `Secure` in production
3. Check browser accepteert cookies
4. Check `trust proxy` is ingesteld (staat al in code)

## Scripts

```bash
npm run server              # Start dev server (met hot reload)
npm start                   # Start production server
npm run db:generate         # Genereer Prisma Client
npm run db:migrate          # Run migrations
npm run db:studio           # Open Prisma Studio
npm run setup:production-db # Automatische database setup
npm run init:production     # Verifieer alle productie configuratie
npm run import:woo          # Sync producten van WooCommerce
npm run seed:test-user      # Seed test gebruiker
npm run seed:products       # Seed test producten
```

## Verificatie Checklist

Voor productie:

- [ ] `DATABASE_URL` is gezet en werkt
- [ ] `npm run setup:production-db` is succesvol gerund
- [ ] `npm run init:production` toont geen errors
- [ ] Database heeft producten (check via `npm run db:studio`)
- [ ] `CORS_ORIGIN` bevat productie domain
- [ ] `SESSION_COOKIE_DOMAIN` is correct
- [ ] Stripe is geconfigureerd (als checkout gebruikt wordt)
- [ ] Webhook is ingesteld in Stripe Dashboard
- [ ] Server start zonder errors
- [ ] Health check endpoint werkt
- [ ] API endpoints werken (test met curl of Postman)
