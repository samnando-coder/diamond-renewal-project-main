# Database Setup Guide — PostgreSQL Production

Deze guide helpt je om de PostgreSQL database volledig in te stellen voor productie.

## Snelle Start

### Optie 1: Automatische Setup (Aanbevolen)

```bash
# 1. Zet DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# 2. Run de setup script
npm run setup:production-db
```

Dit script doet automatisch:
- ✅ Genereert Prisma Client
- ✅ Runt alle migrations
- ✅ Verifieert database connectie
- ✅ Toont database statistieken

### Optie 2: Handmatige Setup

```bash
# 1. Genereer Prisma Client
npm run db:generate

# 2. Run migrations
npm run db:migrate

# 3. Verifieer (optioneel)
npm run db:studio
```

## Database Providers

### Option A: Supabase (Gratis tier beschikbaar)

1. Ga naar [supabase.com](https://supabase.com)
2. Maak een nieuw project
3. Ga naar Settings → Database
4. Kopieer de "Connection string" (URI mode)
5. Zet in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

### Option B: Railway

1. Ga naar [railway.app](https://railway.app)
2. New Project → Add Database → PostgreSQL
3. Klik op de database → Variables tab
4. Kopieer `DATABASE_URL`
5. Zet in `.env`

### Option C: Render

1. Ga naar [render.com](https://render.com)
2. New → PostgreSQL
3. Kopieer de "Internal Database URL"
4. Zet in `.env`

### Option D: Eigen PostgreSQL Server

1. Installeer PostgreSQL op je server
2. Maak een database:
   ```sql
   CREATE DATABASE bluediamonds_shop;
   CREATE USER shop_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE bluediamonds_shop TO shop_user;
   ```
3. Zet in `.env`:
   ```env
   DATABASE_URL="postgresql://shop_user:your_secure_password@your-server.com:5432/bluediamonds_shop"
   ```

## Environment Variables

Zet deze in je `.env` file:

```env
# Database (VERPLICHT)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# CORS (VERPLICHT)
CORS_ORIGIN="https://www.bluediamonds.club,https://bluediamonds.club"

# Session (VERPLICHT)
SESSION_COOKIE_NAME="bd_session"
SESSION_COOKIE_DOMAIN=".bluediamonds.club"  # Voor cross-subdomain sessions
SESSION_DAYS=30

# Stripe (Aanbevolen voor checkout)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# WooCommerce (Optioneel, voor product sync)
WOO_REST_BASE="https://bluediamonds.club/wp-json/wc/v3/products"
WOO_CONSUMER_KEY="ck_..."
WOO_CONSUMER_SECRET="cs_..."

# Admin (Optioneel)
ADMIN_EMAILS="admin@bluediamonds.club"
```

## Verificatie

### 1. Check Database Connectie

```bash
npm run init:production
```

Dit script checkt:
- ✅ Alle environment variables
- ✅ Database connectie
- ✅ Migrations status
- ✅ Stripe configuratie (als geconfigureerd)
- ✅ CORS settings

### 2. Check Database Content

```bash
npm run db:studio
```

Dit opent Prisma Studio waar je kunt zien:
- Users
- Products
- Orders
- Sessions

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Products (zonder auth = geen prijzen)
curl http://localhost:3001/api/shop/products

# Products (met auth cookie = met prijzen)
curl http://localhost:3001/api/shop/products \
  -H "Cookie: bd_session=your_session_token"
```

## Migrations

### Nieuwe Migration Aanmaken

```bash
# 1. Pas schema.prisma aan
# 2. Genereer migration
npx prisma migrate dev --name descriptive_name

# 3. In productie: deploy
npm run db:migrate
```

### Migrations Status Checken

```bash
npx prisma migrate status
```

### Migrations Resetten (ALLEEN DEV!)

```bash
# ⚠️ WARNING: Dit verwijdert alle data!
npx prisma migrate reset
```

## Product Data Importeren

### Optie 1: WooCommerce Sync

```bash
# Zet WOO_* env vars in .env
npm run import:woo
```

### Optie 2: CSV Import

```bash
# Export producten als CSV (sku;brand;name;imageUrl;priceCents)
npm run import:product-images -- --file="products.csv"
```

### Optie 3: Handmatig via Prisma Studio

```bash
npm run db:studio
```

## Troubleshooting

### "Connection refused" Error

- Check dat PostgreSQL draait
- Check DATABASE_URL is correct
- Check firewall/network settings
- Check database credentials

### "Migration failed" Error

- Check database heeft correcte permissions
- Check DATABASE_URL wijst naar juiste database
- Check migrations folder bestaat

### "Prisma Client not generated" Error

```bash
npm run db:generate
```

### Database Lock Error

Als migrations vastlopen:
```bash
# Check welke migrations pending zijn
npx prisma migrate status

# Force deploy (als nodig)
npx prisma migrate deploy --skip-generate
```

## Production Checklist

Voor je live gaat:

- [ ] DATABASE_URL is gezet en werkt
- [ ] `npm run setup:production-db` is succesvol gerund
- [ ] `npm run init:production` toont geen errors
- [ ] Database heeft producten (check via `npm run db:studio`)
- [ ] CORS_ORIGIN bevat je productie domain
- [ ] SESSION_COOKIE_DOMAIN is correct (voor subdomains)
- [ ] Stripe is geconfigureerd (als je checkout gebruikt)
- [ ] Webhook is ingesteld in Stripe Dashboard
- [ ] Backups zijn ingesteld (database provider heeft vaak automatische backups)

## Backup & Restore

### Backup

```bash
# Via pg_dump (als je directe toegang hebt)
pg_dump "postgresql://user:password@host:5432/dbname" > backup.sql

# Via Prisma (export data)
npx prisma db pull  # Pull schema
# Export data via Prisma Studio of custom script
```

### Restore

```bash
# Via psql
psql "postgresql://user:password@host:5432/dbname" < backup.sql
```

## Support

Voor vragen:
- Check `DEPLOYMENT.md` voor algemene deployment info
- Check Prisma docs: https://www.prisma.io/docs
- Check database provider docs (Supabase/Railway/etc.)
