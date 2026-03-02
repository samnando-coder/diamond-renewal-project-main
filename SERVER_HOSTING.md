# Server Hosting - Je Server Online Zetten

## 🎯 Het Probleem:

- ✅ Database is al online (Supabase) - dat is goed!
- ❌ Server draait nu lokaal op je laptop
- ❌ Klanten kunnen alleen inloggen als je laptop aan staat

## ✅ Oplossing: Host je Server Online

Je moet de server (de Express API) online hosten. Hier zijn de beste opties:

---

## Optie 1: Railway (Aanbevolen - Eenvoudig) ⭐

**Voordelen:**
- ✅ Zeer eenvoudig setup
- ✅ Automatische deployments
- ✅ Gratis tier beschikbaar
- ✅ Goede documentatie

**Stappen:**

1. **Account aanmaken:**
   - Ga naar [railway.app](https://railway.app)
   - Sign up met GitHub

2. **Project aanmaken:**
   - Klik "New Project"
   - Kies "Deploy from GitHub repo"
   - Selecteer je repository

3. **Environment Variables zetten:**
   - Klik op je service → "Variables"
   - Voeg toe:
     ```
     DATABASE_URL=postgresql://... (je Supabase URL)
     CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club
     SESSION_COOKIE_NAME=bd_session
     SESSION_COOKIE_DOMAIN=.bluediamonds.club
     SESSION_DAYS=30
     PORT=3001
     NODE_ENV=production
     SERVE_STATIC=1
     ```

4. **Build & Start Commands:**
   - Build: `npm install && npm run build`
   - Start: `npm start`

5. **Custom Domain (optioneel):**
   - Railway geeft je een gratis `.railway.app` domain
   - Of voeg je eigen domain toe in Settings

**Kosten:** Gratis tier (500 uur/maand), daarna ~$5/maand

---

## Optie 2: Render (Gratis Tier)

**Voordelen:**
- ✅ Gratis tier (met beperkingen)
- ✅ Automatische deployments
- ✅ Eenvoudig setup

**Stappen:**

1. **Account aanmaken:**
   - Ga naar [render.com](https://render.com)
   - Sign up

2. **Nieuwe Web Service:**
   - Klik "New" → "Web Service"
   - Connect je GitHub repo
   - Settings:
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Environment:** Node

3. **Environment Variables:**
   - Voeg alle variabelen toe (zie Railway hierboven)

4. **Custom Domain:**
   - Render geeft gratis `.onrender.com` domain
   - Of voeg eigen domain toe

**Kosten:** Gratis (maar service gaat slapen na 15 min inactiviteit), of $7/maand voor altijd-on

---

## Optie 3: Fly.io (Goede Performance)

**Voordelen:**
- ✅ Goede performance
- ✅ Wereldwijde edge locations
- ✅ Gratis tier

**Stappen:**

1. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Deploy:**
   ```bash
   fly launch
   ```
   - Volg de prompts
   - Zet environment variables via `fly secrets set KEY=value`

**Kosten:** Gratis tier (3 shared VMs), daarna pay-as-you-go

---

## Optie 4: VPS (Eigen Server)

Als je al een VPS hebt (bijv. bij DigitalOcean, Hetzner, etc.):

**Stappen:**

1. **SSH naar je server:**
   ```bash
   ssh user@your-server.com
   ```

2. **Clone repository:**
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

3. **Installeer dependencies:**
   ```bash
   npm install
   npm run build
   ```

4. **Zet environment variables:**
   ```bash
   # Maak .env file
   nano .env
   # Voeg alle variabelen toe
   ```

5. **Start met PM2 (process manager):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "shop-api" -- start
   pm2 save
   pm2 startup  # Voor auto-start bij reboot
   ```

6. **Nginx reverse proxy (voor HTTPS):**
   ```nginx
   server {
       listen 80;
       server_name api.bluediamonds.club;
       
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

---

## ⚙️ Belangrijke Configuratie

### Environment Variables (voor alle opties):

```env
# Database (je Supabase URL)
DATABASE_URL="postgresql://postgres:...@db.xxx.supabase.co:5432/postgres"

# CORS (je frontend domains)
CORS_ORIGIN="https://www.bluediamonds.club,https://bluediamonds.club"

# Session
SESSION_COOKIE_NAME="bd_session"
SESSION_COOKIE_DOMAIN=".bluediamonds.club"
SESSION_DAYS=30

# Server
PORT=3001
NODE_ENV=production
SERVE_STATIC=1  # Als je frontend ook op dezelfde server serveert

# Stripe (optioneel)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Frontend Aanpassen:

Als je server op een andere URL draait (bijv. `https://api.bluediamonds.club`), moet je je frontend aanpassen:

```typescript
// In je frontend code, verander API base URL
const API_BASE = 'https://api.bluediamonds.club';
// of
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## 🚀 Quick Start (Railway - Aanbevolen):

1. **GitHub repo klaarzetten:**
   - Zorg dat je code op GitHub staat
   - Zorg dat `package.json` heeft:
     ```json
     {
       "scripts": {
         "start": "NODE_ENV=production SERVE_STATIC=1 tsx server/index.ts"
       }
     }
     ```

2. **Railway setup:**
   - Sign up op railway.app
   - New Project → Deploy from GitHub
   - Selecteer je repo
   - Railway detecteert automatisch Node.js

3. **Environment variables:**
   - Klik op je service → Variables
   - Voeg alle variabelen toe (zie hierboven)

4. **Deploy:**
   - Railway deployt automatisch
   - Je krijgt een URL zoals: `https://your-app.railway.app`

5. **Custom domain (optioneel):**
   - Settings → Domains
   - Voeg `api.bluediamonds.club` toe
   - Volg DNS instructies

---

## ✅ Checklist Na Deployment:

- [ ] Server draait online
- [ ] Database connectie werkt (check logs)
- [ ] `/api/health` endpoint werkt
- [ ] Registratie werkt (`/api/auth/register`)
- [ ] Login werkt (`/api/auth/login`)
- [ ] Frontend kan connecten met API
- [ ] CORS is correct geconfigureerd
- [ ] HTTPS werkt (SSL certificate)
- [ ] Custom domain werkt (als gebruikt)

---

## 🆘 Troubleshooting:

### "Cannot connect to database"
- Check DATABASE_URL is correct
- Check database firewall allows connections
- Voor Supabase: gebruik direct connection (port 5432), niet pooler

### "CORS errors"
- Check CORS_ORIGIN bevat je frontend URL
- Check frontend gebruikt correcte API URL

### "Session cookies don't work"
- Check SESSION_COOKIE_DOMAIN is correct
- Check cookies zijn Secure in production
- Check domain matches (bijv. `.bluediamonds.club`)

---

## 💰 Kosten Overzicht:

| Provider | Gratis Tier | Betaald | Best Voor |
|----------|-------------|---------|-----------|
| Railway | 500 uur/maand | ~$5/maand | Eenvoudig, snel |
| Render | 15 min sleep | $7/maand | Gratis tier |
| Fly.io | 3 VMs | Pay-as-you-go | Performance |
| VPS | N/A | ~$5-10/maand | Volledige controle |

---

## 🎯 Mijn Aanbeveling:

**Voor jouw situatie: Railway**

- ✅ Eenvoudigste setup
- ✅ Goede gratis tier
- ✅ Automatische deployments
- ✅ Goede documentatie
- ✅ Betrouwbaar

**Stappen:**
1. Push code naar GitHub
2. Sign up Railway
3. Deploy from GitHub
4. Zet environment variables
5. Klaar! 🎉

---

## 📞 Hulp Nodig?

Als je hulp nodig hebt met deployment, laat het weten! Ik kan je door de stappen helpen.
