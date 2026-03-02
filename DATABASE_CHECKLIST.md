# Database Setup Checklist — Wat moet er nog gebeuren?

## ✅ Wat al klaar is:
- ✅ Prisma schema is gedefinieerd
- ✅ Migrations zijn aanwezig
- ✅ Setup scripts zijn beschikbaar
- ✅ Code is klaar voor PostgreSQL

## ❌ Wat er nog moet gebeuren:

### 1. PostgreSQL Database Aanmaken (KIES EEN OPTIE)

#### Optie A: Supabase (Gratis, Aanbevolen) ⭐
1. Ga naar [supabase.com](https://supabase.com) → Sign up
2. **New Project** → Vul naam in (bijv. "bluediamonds-shop")
3. Wacht tot project klaar is (~2 minuten)
4. Ga naar **Settings** → **Database**
5. Scroll naar **Connection string** → Selecteer **URI** mode
6. Kopieer de connection string (ziet eruit als):
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
   ⚠️ **BELANGRIJK:** Gebruik de **direct connection** (port 5432), NIET de pooler (port 6543)

#### Optie B: Railway (Eenvoudig)
1. Ga naar [railway.app](https://railway.app) → Sign up
2. **New Project** → **Add Database** → **PostgreSQL**
3. Klik op de database → **Variables** tab
4. Kopieer `DATABASE_URL`

#### Optie C: Render (Gratis tier)
1. Ga naar [render.com](https://render.com) → Sign up
2. **New** → **PostgreSQL**
3. Kopieer **Internal Database URL**

---

### 2. Environment Variable Zetten

Maak een `.env` file in de root van je project (als die nog niet bestaat):

```bash
# Kopieer het voorbeeld
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

---

### 3. Database Setup Uitvoeren

Run het setup script:

```bash
npm run setup:production-db
```

Dit script doet automatisch:
- ✅ Genereert Prisma Client
- ✅ Runt alle database migrations
- ✅ Verifieert connectie
- ✅ Toont database statistieken

**Verwachte output:**
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

---

### 4. (Optioneel) Producten Importeren

Als je producten uit WooCommerce wilt importeren:

```bash
# Zet eerst deze in .env:
WOO_REST_BASE="https://bluediamonds.club/wp-json/wc/v3/products"
WOO_CONSUMER_KEY="ck_..."
WOO_CONSUMER_SECRET="cs_..."

# Dan run:
npm run import:woo
```

Of handmatig via Prisma Studio:
```bash
npm run db:studio
```

---

### 5. Verificatie

Test of alles werkt:

```bash
# Check database connectie
npm run init:production

# Open Prisma Studio om data te bekijken
npm run db:studio
```

---

## 🚨 Veelvoorkomende Problemen

### "DATABASE_URL is not set"
- Check dat `.env` file bestaat in de root directory
- Check dat `DATABASE_URL` correct is gezet (zonder quotes of met quotes, beide werken)

### "Can't reach database server"
- Check dat je de **direct connection** gebruikt (port 5432), niet de pooler
- Check firewall/network settings
- Check database credentials

### "Migration failed: Connection pooler does not support Prisma migrations"
- **Oplossing:** Gebruik de direct connection string (niet de pooler)
- Voor Supabase: Gebruik "URI" mode, NIET "Session mode" of "Transaction mode"
- Connection string moet eruitzien als: `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres`

### "prepared statement already exists"
- Dit betekent dat je de connection pooler gebruikt
- Gebruik de direct connection string (zie boven)

---

## 📋 Quick Start Commands

```bash
# 1. Database aanmaken (via Supabase/Railway/Render)
# 2. DATABASE_URL in .env zetten
# 3. Run setup:
npm run setup:production-db

# 4. (Optioneel) Producten importeren:
npm run import:woo

# 5. Verificatie:
npm run init:production
npm run db:studio
```

---

## 📚 Meer Info

- Zie `QUICK_START_PRODUCTION.md` voor uitgebreide instructies
- Zie `DATABASE_SETUP.md` voor troubleshooting
- Zie `SUPABASE_CONNECTION.md` voor Supabase-specifieke tips

---

## ✅ Checklist voor Live Gaan

- [ ] PostgreSQL database is aangemaakt
- [ ] `DATABASE_URL` is gezet in `.env`
- [ ] `npm run setup:production-db` is succesvol gerund
- [ ] `npm run init:production` toont geen errors
- [ ] Database heeft tabellen (check via `npm run db:studio`)
- [ ] `CORS_ORIGIN` bevat je productie domain
- [ ] `SESSION_COOKIE_DOMAIN` is correct gezet
- [ ] (Optioneel) Producten zijn geïmporteerd
- [ ] (Optioneel) Stripe is geconfigureerd
