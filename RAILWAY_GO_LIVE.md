# 🚀 Railway Go-Live Checklist

Je server staat online! Volg deze stappen om alles werkend te krijgen voor klanten.

---

## ✅ Stap 1: Database Migrations Runnen

**BELANGRIJK:** Zonder migrations bestaan de database tabellen niet, dus login/signup werkt niet!

### Optie A: Via Railway Dashboard (Makkelijkst)

1. Ga naar Railway Dashboard → Je service
2. Klik op **"Deployments"** tab
3. Klik op **"Run Command"** (of **"Shell"**)
4. Voer in: `npm run db:migrate`
5. Klik **"Run"**
6. Wacht tot je ziet: `✅ Migrations completed`

### Optie B: Via Railway CLI

```bash
# Installeer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project (selecteer je project)
railway link

# Run migrations
railway run npm run db:migrate
```

### ⚠️ Als Migrations Falen:

**Error: "advisory lock" of "P1002"**
- Je gebruikt waarschijnlijk een **pooler connection string**
- Gebruik de **direct connection** (zie hieronder)

**Fix:**
1. Ga naar Supabase → Settings → Database
2. Kopieer **"Connection string"** → **"URI"** mode (NIET Session/Transaction)
3. Update `DATABASE_URL` in Railway Variables
4. Redeploy en run migrations opnieuw

---

## ✅ Stap 2: Test Database Connectie

### Via Railway Dashboard:

1. Ga naar **"Deployments"** → **"Run Command"**
2. Voer in: `npm run init:production`
3. Check of je ziet: `✅ Database connection successful`

### Of test handmatig:

1. Ga naar je Railway URL (bijv. `https://your-app.railway.app`)
2. Open browser console (F12)
3. Probeer te registreren/inloggen
4. Check of er errors zijn

---

## ✅ Stap 3: Custom Domain Instellen (Aanbevolen)

Railway geeft je een gratis `.railway.app` domain, maar je kunt ook je eigen domain gebruiken.

### Optie A: Railway Domain (Gratis)

1. Railway Dashboard → Je service → **"Settings"** → **"Domains"**
2. Klik **"Generate Domain"**
3. Je krijgt: `your-app.railway.app`
4. Update `CORS_ORIGIN` in Variables:
   ```
   CORS_ORIGIN=https://your-app.railway.app
   ```

### Optie B: Eigen Domain (bijv. api.bluediamonds.club)

1. Railway Dashboard → Je service → **"Settings"** → **"Domains"**
2. Klik **"Custom Domain"**
3. Voer in: `api.bluediamonds.club` (of je voorkeur)
4. Volg de DNS instructies:
   - Voeg een CNAME record toe in je DNS:
     ```
     Type: CNAME
     Name: api (of subdomain)
     Value: [Railway geeft je een waarde]
     ```
5. Wacht tot DNS propageert (5-30 minuten)
6. Update `CORS_ORIGIN` in Variables:
   ```
   CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club,https://api.bluediamonds.club
   ```

---

## ✅ Stap 4: Test Login/Signup

### Test Registratie:

1. Ga naar je Railway URL
2. Ga naar login/register pagina
3. Maak een test account aan
4. Check of je ingelogd bent

### Test Login:

1. Log uit
2. Log weer in met je test account
3. Check of sessie werkt (blijf ingelogd na refresh)

### Als het niet werkt:

**Check logs:**
- Railway Dashboard → Deployments → View Logs
- Zoek naar errors

**Check database:**
- Ga naar Supabase → Table Editor
- Check of `User` en `Session` tabellen bestaan
- Check of er data in staat na registratie

---

## ✅ Stap 5: Frontend Domain Koppelen

Als je frontend op een andere domain staat (bijv. Netlify):

### Update CORS:

1. Railway Dashboard → Variables
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club,https://your-app.railway.app
   ```
3. Redeploy

### Update Frontend API URL:

In je frontend code (als je een aparte frontend hebt):
- Update API base URL naar je Railway URL
- Of gebruik environment variables

---

## ✅ Stap 6: SSL/HTTPS Verificatie

Railway geeft automatisch HTTPS. Check:

1. Ga naar je Railway URL (moet `https://` zijn)
2. Check of er geen SSL warnings zijn
3. Test of cookies werken (check browser DevTools → Application → Cookies)

---

## ✅ Stap 7: Monitoring Setup

### Check Logs:

1. Railway Dashboard → Deployments → View Logs
2. Check voor errors
3. Monitor request count

### Set Up Alerts (optioneel):

1. Railway Dashboard → Settings → Notifications
2. Zet email alerts aan voor:
   - Deployment failures
   - High error rates

---

## 📋 Complete Checklist:

- [ ] **Database migrations gerund** (`npm run db:migrate`)
- [ ] **Database connectie werkt** (test met `npm run init:production`)
- [ ] **Custom domain ingesteld** (Railway domain of eigen domain)
- [ ] **CORS_ORIGIN is correct** (alle domains waar frontend draait)
- [ ] **Test account aangemaakt** (registratie werkt)
- [ ] **Login werkt** (sessie blijft bestaan)
- [ ] **HTTPS werkt** (geen SSL warnings)
- [ ] **Logs zijn schoon** (geen errors)

---

## 🆘 Troubleshooting:

### "Cannot connect to database"

**Check:**
- `DATABASE_URL` is correct in Railway Variables
- Database firewall staat open voor Railway IPs
- Migrations zijn gerund

### "CORS error" of "Invalid Origin"

**Check:**
- `CORS_ORIGIN` bevat je frontend domain
- Geen trailing slashes in `CORS_ORIGIN`
- Redeploy na het updaten van `CORS_ORIGIN`

### "Session not working" of "Logged out after refresh"

**Check:**
- `SESSION_COOKIE_DOMAIN` is correct (bijv. `.bluediamonds.club`)
- `SESSION_COOKIE_NAME` is gezet
- Cookies worden gezet (check browser DevTools)
- HTTPS is actief (cookies werken niet op HTTP in productie)

### "404 on page reload"

**Check:**
- `SERVE_STATIC=1` is gezet
- Frontend is gebuild (`dist/` folder bestaat)
- SPA routing is correct geconfigureerd

---

## 🎯 Na Go-Live:

1. **Monitor logs** voor de eerste paar dagen
2. **Test alle features** (login, signup, checkout, etc.)
3. **Check database** regelmatig (Supabase Dashboard)
4. **Backup database** (Supabase doet dit automatisch, maar check settings)

---

## 💡 Tips:

- **Keep Railway Dashboard open** tijdens eerste tests
- **Test met verschillende browsers** (Chrome, Firefox, Safari)
- **Test op mobile** (cookies kunnen anders werken)
- **Monitor database usage** (Supabase heeft gratis tier limits)

---

Je bent nu klaar om live te gaan! 🚀

Als alles werkt, kunnen klanten nu:
- ✅ Accounts aanmaken
- ✅ Inloggen
- ✅ Sessies blijven actief
- ✅ Bestellingen plaatsen (als Stripe is geconfigureerd)
