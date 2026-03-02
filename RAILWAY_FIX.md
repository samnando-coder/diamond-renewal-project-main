# Railway Deployment Fix

## Het Probleem:

Railway/Railpack kan niet bepalen hoe de app te builden omdat het de verkeerde directory als root ziet of de build commands niet kan vinden.

## ✅ Oplossing:

Ik heb de volgende bestanden aangemaakt:

1. **`nixpacks.toml`** - Nixpacks build configuratie
2. **`railway.json`** - Railway JSON configuratie  
3. **`railway.toml`** - Railway TOML configuratie
4. **`Procfile`** - Heroku/Railway compatible process file
5. **`start.sh`** - Start script (backup)

---

## 🔧 Wat Railway Nu Doet:

### Automatische Detectie:
Railway detecteert nu:
- ✅ Node.js project (via `package.json` in root)
- ✅ Build command: `npm run build && npm run db:generate`
- ✅ Start command: `NODE_ENV=production SERVE_STATIC=1 npm start`

### Build Process:
1. `npm ci` - Installeert dependencies
2. `npm run build` - Build frontend (maakt `dist/` folder)
3. `npm run db:generate` - Genereert Prisma Client
4. `NODE_ENV=production SERVE_STATIC=1 npm start` - Start server

---

## 🚀 Volgende Stappen:

### 1. Commit en Push:

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push
```

### 2. Railway Dashboard:

1. Ga naar [railway.app](https://railway.app)
2. Ga naar je project
3. Klik op je service
4. Klik **"Redeploy"** of wacht op automatische deploy

### 3. Check Logs:

1. Ga naar **Deployments** tab
2. Klik op de nieuwste deployment
3. Check **Build Logs** en **Deploy Logs**

---

## 🆘 Als Het Nog Steeds Niet Werkt:

### Optie 1: Expliciete Build Commands in Railway

1. Ga naar Railway Dashboard
2. Klik op je service → **Settings**
3. Scroll naar **"Build & Deploy"**
4. Zet **Build Command:**
   ```
   npm ci && npm run build && npm run db:generate
   ```
5. Zet **Start Command:**
   ```
   NODE_ENV=production SERVE_STATIC=1 npm start
   ```

### Optie 2: Check Root Directory

1. Ga naar Railway Dashboard
2. Klik op je service → **Settings**
3. Check **"Root Directory"**
4. Moet leeg zijn of `/` (root van repo)

### Optie 3: Use Dockerfile

Als Nixpacks niet werkt, kun je de Dockerfile gebruiken:

1. Railway Dashboard → Service → Settings
2. Zet **"Dockerfile Path"** naar `Dockerfile`
3. Railway gebruikt dan de Dockerfile in plaats van Nixpacks

---

## ✅ Verificatie:

Na deploy, check:

1. **Build logs** - Geen errors?
2. **Deploy logs** - Server start?
3. **Health check:**
   ```bash
   curl https://your-app.railway.app/api/health
   ```
4. **Frontend:**
   - Ga naar Railway URL
   - Check of site laadt

---

## 📝 Belangrijk:

- **Database Migrations:** Railway runt deze **niet automatisch**
- Run handmatig: `railway run npm run db:migrate`
- Of voeg toe aan build (zie RAILWAY_DEPLOY.md)

---

## 🎯 Quick Fix:

Als Railway nog steeds niet werkt:

1. **Delete en recreate service:**
   - Delete huidige service
   - New Service → Deploy from GitHub
   - Selecteer repo opnieuw

2. **Of gebruik expliciete commands:**
   - Settings → Build & Deploy
   - Zet build en start commands handmatig

3. **Of gebruik Dockerfile:**
   - Settings → Dockerfile Path: `Dockerfile`

---

De configuratie bestanden zijn nu aanwezig. Railway zou de app moeten kunnen builden en deployen! 🚀
