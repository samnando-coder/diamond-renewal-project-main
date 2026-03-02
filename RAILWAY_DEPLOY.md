# Railway Deployment Guide

## ✅ Configuratie Bestanden Aangemaakt:

1. **`nixpacks.toml`** - Nixpacks build configuratie
2. **`railway.json`** - Railway specifieke configuratie
3. **`start.sh`** - Start script (backup)
4. **`Procfile`** - Heroku/Railway compatible process file

---

## 🚀 Deployment Stappen:

### 1. Push naar GitHub

Zorg dat alle bestanden zijn gecommit en gepusht:

```bash
git add .
git commit -m "Add Railway deployment config"
git push
```

### 2. Railway Setup

1. **Ga naar [railway.app](https://railway.app)**
2. **New Project** → **Deploy from GitHub repo**
3. **Selecteer je repository**

### 3. Environment Variables

Klik op je service → **Variables** tab → Voeg toe:

```env
# Database (VERPLICHT)
DATABASE_URL=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres

# CORS (VERPLICHT)
CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club

# Session (VERPLICHT)
SESSION_COOKIE_NAME=bd_session
SESSION_COOKIE_DOMAIN=.bluediamonds.club
SESSION_DAYS=30

# Server
PORT=3001
NODE_ENV=production
SERVE_STATIC=1

# Stripe (optioneel)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Build & Deploy

Railway detecteert automatisch:
- ✅ Node.js project (via `package.json`)
- ✅ Build command: `npm run build && npm run db:generate`
- ✅ Start command: `NODE_ENV=production SERVE_STATIC=1 npm start`

### 5. Custom Domain (optioneel)

1. Klik op je service → **Settings** → **Domains**
2. Klik **"Generate Domain"** voor gratis `.railway.app` domain
3. Of voeg je eigen domain toe (bijv. `api.bluediamonds.club`)

---

## 🔧 Build Process:

Railway voert automatisch uit:

1. **Install dependencies:**
   ```bash
   npm ci
   ```

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Start server:**
   ```bash
   NODE_ENV=production SERVE_STATIC=1 npm start
   ```

---

## 📋 Checklist:

- [ ] Code is gepusht naar GitHub
- [ ] Railway project is aangemaakt
- [ ] GitHub repo is gekoppeld
- [ ] Environment variables zijn gezet
- [ ] Build is succesvol
- [ ] Server start zonder errors
- [ ] Database connectie werkt
- [ ] Custom domain is ingesteld (optioneel)

---

## 🆘 Troubleshooting:

### "Railpack could not determine how to build"

**Oplossing:**
- Zorg dat `package.json` in de root directory staat
- Zorg dat `nixpacks.toml` bestaat
- Check dat Railway de root directory als working directory heeft

### "Build failed"

**Check:**
- Alle dependencies zijn in `package.json`
- `npm ci` werkt lokaal
- `npm run build` werkt lokaal
- `npm run db:generate` werkt lokaal

### "Server start failed"

**Check:**
- `DATABASE_URL` is correct gezet
- `SERVE_STATIC=1` is gezet
- `NODE_ENV=production` is gezet
- Port is correct (Railway zet `PORT` automatisch)

### "Database connection failed"

**Check:**
- `DATABASE_URL` is correct (Supabase direct connection, port 5432)
- Database firewall allows Railway IPs
- Database migrations zijn gerund (Railway doet dit niet automatisch)

**Run migrations handmatig:**
```bash
# Via Railway CLI
railway run npm run db:migrate

# Of via Railway dashboard → Deployments → Run Command
```

---

## 🔄 Database Migrations:

Railway runt migrations **niet automatisch**. Je moet dit handmatig doen:

### Optie 1: Via Railway CLI

```bash
# Installeer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npm run db:migrate
```

### Optie 2: Via Railway Dashboard

1. Ga naar je service
2. Klik **"Deployments"** tab
3. Klik **"Run Command"**
4. Voer in: `npm run db:migrate`
5. Klik **"Run"**

### Optie 3: Via Build Script

Je kunt migrations ook toevoegen aan de build:

```toml
# In nixpacks.toml
[phases.build]
cmds = [
  "npm run build",
  "npm run db:generate",
  "npm run db:migrate"
]
```

⚠️ **Let op:** Dit runt migrations bij elke build. Alleen doen als je zeker weet dat dit veilig is.

---

## 📊 Monitoring:

### Logs Bekijken:

1. Ga naar Railway Dashboard
2. Klik op je service
3. Klik **"Deployments"** tab
4. Klik op een deployment → **"View Logs"**

### Metrics:

Railway toont automatisch:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## ✅ Na Deployment:

1. **Test de API:**
   ```bash
   curl https://your-app.railway.app/api/health
   ```

2. **Test de frontend:**
   - Ga naar je Railway URL
   - Check of alle pagina's werken
   - Test login/signup

3. **Check database:**
   ```bash
   railway run npm run db:studio
   ```

4. **Update Stripe webhook:**
   - Ga naar Stripe Dashboard → Webhooks
   - Update endpoint URL naar: `https://your-app.railway.app/api/webhooks/stripe`

---

## 🎯 Quick Start:

```bash
# 1. Push code
git push

# 2. Ga naar railway.app
# 3. New Project → Deploy from GitHub
# 4. Selecteer repo
# 5. Zet environment variables
# 6. Wacht op deploy
# 7. Run migrations: railway run npm run db:migrate
# 8. Test!
```

---

## 💡 Tips:

- Railway geeft je een gratis `.railway.app` domain
- Je kunt meerdere services hebben (bijv. frontend + backend apart)
- Railway heeft automatische HTTPS
- Check logs als er problemen zijn
- Run migrations na eerste deploy

---

## 📚 Meer Info:

- [Railway Docs](https://docs.railway.app)
- [Nixpacks Docs](https://nixpacks.com/docs)
