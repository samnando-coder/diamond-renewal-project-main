# Quick Start — Production Database Setup

**5 minuten setup voor PostgreSQL database in productie.**

## Stap 1: Kies een Database Provider

### Optie A: Supabase (Gratis, Aanbevolen)

1. Ga naar [supabase.com](https://supabase.com) → Sign up
2. New Project → Vul naam in → Wacht op setup
3. Ga naar **Settings** → **Database**
4. Scroll naar **Connection string** → Selecteer **URI**
5. Kopieer de connection string (ziet eruit als: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`)

### Optie B: Railway (Eenvoudig)

1. Ga naar [railway.app](https://railway.app) → Sign up
2. New Project → **Add Database** → **PostgreSQL**
3. Klik op de database → **Variables** tab
4. Kopieer `DATABASE_URL`

### Optie C: Render (Gratis tier)

1. Ga naar [render.com](https://render.com) → Sign up
2. New → **PostgreSQL**
3. Kopieer **Internal Database URL**

## Stap 2: Zet Environment Variables

Maak een `.env` file in de root van je project:

```bash
# Kopieer ENV.production.example
cp ENV.production.example .env
```

Open `.env` en vul in:

```env
# Database (VERPLICHT - plak hier je DATABASE_URL van stap 1)
DATABASE_URL="postgresql://postgres:password@host:5432/dbname"

# CORS (VERPLICHT - je productie domain)
CORS_ORIGIN="https://www.bluediamonds.club,https://bluediamonds.club"

# Session (VERPLICHT)
SESSION_COOKIE_NAME="bd_session"
SESSION_COOKIE_DOMAIN=".bluediamonds.club"
SESSION_DAYS=30

# Stripe (als je checkout gebruikt)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Stap 3: Run Database Setup

```bash
npm run setup:production-db
```

Dit script doet automatisch:
- ✅ Genereert Prisma Client
- ✅ Runt alle database migrations
- ✅ Verifieert connectie
- ✅ Toont database statistieken

**Output ziet er zo uit:**
```
🚀 Setting up production database...

📦 Step 1: Generating Prisma Client...
✅ Prisma Client generated

🗄️  Step 2: Running database migrations...
✅ Migrations completed

🔍 Step 3: Verifying database connection...
✅ Database connection verified
   Users: 0
   Products: 0
   Orders: 0

✨ Production database setup complete!
```

## Stap 4: Verifieer Alles Werkt

```bash
npm run init:production
```

Dit checkt:
- ✅ Alle environment variables
- ✅ Database connectie
- ✅ Migrations status
- ✅ Stripe configuratie (als geconfigureerd)

## Stap 5: Importeer Producten (Optioneel)

### Optie 1: Seed Basis Producten

```bash
npm run seed:products
```

### Optie 2: Importeer van WooCommerce

```bash
# Zet eerst WOO_* vars in .env
npm run import:woo
```

### Optie 3: Importeer van CSV

```bash
npm run import:product-images -- --file="products.csv"
```

## Klaar! 🎉

Je database is nu klaar voor productie. 

**Volgende stappen:**
1. ✅ Database is geconfigureerd
2. ⏭️ Configureer Stripe webhook (zie `DEPLOYMENT.md`)
3. ⏭️ Deploy je applicatie
4. ⏭️ Test checkout flow

## Troubleshooting

### "DATABASE_URL is not set"
→ Zet `DATABASE_URL` in je `.env` file

### "Connection refused"
→ Check dat je database provider draait en DATABASE_URL correct is

### "Migration failed"
→ Check database heeft correcte permissions. Run: `npm run db:migrate`

### Meer hulp nodig?
→ Zie `DATABASE_SETUP.md` voor uitgebreide documentatie
