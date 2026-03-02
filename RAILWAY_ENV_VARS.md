# Railway Environment Variables Setup

## ⚠️ BELANGRIJK: Zet deze environment variables in Railway!

Je server start nu, maar heeft environment variables nodig om te werken.

---

## 🚀 Stappen om Environment Variables te Zetten:

### 1. Ga naar Railway Dashboard

1. Ga naar [railway.app](https://railway.app)
2. Login met je account
3. Klik op je project
4. Klik op je service (de app die je net hebt gedeployed)

### 2. Open Variables Tab

1. Klik op de **"Variables"** tab (of **"Settings"** → **"Variables"**)
2. Je ziet een lijst met environment variables

### 3. Voeg de Verplichte Variables Toe

Klik op **"New Variable"** en voeg deze toe:

#### ✅ VERPLICHT - Database:

```env
DATABASE_URL=postgresql://postgres:JE_WACHTWOORD@JE_HOST:5432/postgres
```

**Waar vind je deze?**
- Ga naar je Supabase project
- Settings → Database
- Copy de **"Connection string"** (gebruik de **Direct connection** voor Railway)
- Vervang `[YOUR-PASSWORD]` met je database wachtwoord

**Voorbeeld:**
```
DATABASE_URL=postgresql://postgres.sxudxgjyoriikjikfvav:samnando200@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

#### ✅ VERPLICHT - CORS:

```env
CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club
```

#### ✅ VERPLICHT - Session:

```env
SESSION_COOKIE_NAME=bd_session
SESSION_COOKIE_DOMAIN=.bluediamonds.club
SESSION_DAYS=30
```

#### ✅ VERPLICHT - Server:

```env
NODE_ENV=production
SERVE_STATIC=1
PORT=3001
```

**Let op:** Railway zet `PORT` automatisch, maar je kunt het ook handmatig zetten.

---

### 4. Optionele Variables (voor later):

#### Stripe (als je betalingen wilt):

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### WooCommerce (als je producten wilt syncen):

```env
WOO_REST_BASE=https://bluediamonds.club/wp-json/wc/v3/products
WOO_CONSUMER_KEY=ck_...
WOO_CONSUMER_SECRET=cs_...
```

---

## 📋 Complete Lijst (Copy-Paste):

Voeg deze allemaal toe in Railway:

```env
# Database (VERPLICHT)
DATABASE_URL=postgresql://postgres:JE_WACHTWOORD@JE_HOST:5432/postgres

# CORS (VERPLICHT)
CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club

# Session (VERPLICHT)
SESSION_COOKIE_NAME=bd_session
SESSION_COOKIE_DOMAIN=.bluediamonds.club
SESSION_DAYS=30

# Server (VERPLICHT)
NODE_ENV=production
SERVE_STATIC=1
PORT=3001
```

---

## ✅ Na het Zetten van Variables:

1. **Redeploy de service:**
   - Klik op **"Deployments"** tab
   - Klik op de nieuwste deployment
   - Klik **"Redeploy"** (of wacht tot Railway automatisch redeployt)

2. **Check de logs:**
   - Ga naar **"Deployments"** → Klik op deployment → **"View Logs"**
   - Je zou moeten zien: `[api] listening on http://localhost:3001`
   - Geen errors over `DATABASE_URL` meer

3. **Test de API:**
   - Ga naar je Railway URL (bijv. `https://your-app.railway.app`)
   - Of test de health endpoint: `https://your-app.railway.app/api/health`

---

## 🆘 Troubleshooting:

### "DATABASE_URL is not set"

**Oplossing:**
- Check of je de variable hebt toegevoegd in Railway
- Check of de naam exact is: `DATABASE_URL` (hoofdletters!)
- Redeploy na het toevoegen van variables

### "Connection refused" of database errors

**Oplossing:**
- Check of je Supabase database **Direct connection** gebruikt (niet pooler voor Railway)
- Check of je database firewall Railway IPs toestaat
- Check of je wachtwoord correct is

### Server start niet

**Oplossing:**
- Check of `SERVE_STATIC=1` is gezet
- Check of `NODE_ENV=production` is gezet
- Check de logs voor specifieke errors

---

## 💡 Tips:

- **Variables zijn case-sensitive:** `DATABASE_URL` ≠ `database_url`
- **Geen quotes nodig:** Zet `postgresql://...` zonder quotes
- **Redeploy na changes:** Railway redeployt automatisch, maar soms moet je handmatig redeployen
- **Check logs:** Altijd de logs checken als er problemen zijn

---

## 🎯 Quick Checklist:

- [ ] `DATABASE_URL` is gezet (Supabase connection string)
- [ ] `CORS_ORIGIN` is gezet (je domain)
- [ ] `SESSION_COOKIE_NAME` is gezet
- [ ] `SESSION_COOKIE_DOMAIN` is gezet
- [ ] `SESSION_DAYS` is gezet
- [ ] `NODE_ENV=production` is gezet
- [ ] `SERVE_STATIC=1` is gezet
- [ ] Service is gere deployed
- [ ] Logs tonen geen errors
- [ ] API is bereikbaar

---

Zet deze variables en je server zou moeten werken! 🚀
