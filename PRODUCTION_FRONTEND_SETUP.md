# 🌐 Productie Frontend Setup (www.bluediamonds.club)

## ❌ Probleem:

Je frontend draait op `www.bluediamonds.club` maar probeert API calls te maken naar `/api/...` op hetzelfde domain, wat een 404 geeft omdat de backend op Railway draait.

## ✅ Oplossing:

Je moet de frontend vertellen waar de backend API staat door `VITE_API_BASE_URL` environment variable te zetten tijdens de build.

---

## 🚀 Stappen:

### Optie 1: Netlify/Vercel (Aanbevolen)

Als je frontend op Netlify of Vercel draait:

1. **Ga naar je hosting dashboard** (Netlify/Vercel)
2. **Ga naar Environment Variables** (of Build Settings)
3. **Voeg toe:**
   ```
   VITE_API_BASE_URL=https://diamond-renewal-project-main-production.up.railway.app
   ```
4. **Redeploy** je frontend

### Optie 2: Build Lokaal en Upload

Als je lokaal build en upload:

1. **Maak een `.env.production` file** in de root:
   ```env
   VITE_API_BASE_URL=https://diamond-renewal-project-main-production.up.railway.app
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Upload de `dist/` folder** naar je hosting

### Optie 3: Build Script Aanpassen

Je kunt ook een build script maken:

```json
// package.json
{
  "scripts": {
    "build:production": "VITE_API_BASE_URL=https://diamond-renewal-project-main-production.up.railway.app npm run build"
  }
}
```

Dan run je: `npm run build:production`

---

## 🔧 Railway CORS Configuratie:

Zorg dat Railway `CORS_ORIGIN` bevat:

Railway Dashboard → Variables → `CORS_ORIGIN`:
```
https://diamond-renewal-project-main-production.up.railway.app,https://www.bluediamonds.club,https://bluediamonds.club
```

---

## ✅ Verificatie:

Na het instellen:

1. **Check browser console:**
   - Geen 404 errors meer
   - API calls gaan naar Railway URL

2. **Test registratie:**
   - Probeer account aan te maken op `www.bluediamonds.club`
   - Check Network tab → API call moet naar Railway gaan

3. **Check Railway logs:**
   - Railway Dashboard → Deployments → View Logs
   - Je zou requests moeten zien van `www.bluediamonds.club`

---

## 🆘 Troubleshooting:

### "404 on /api/..."

**Oplossing:**
- Check of `VITE_API_BASE_URL` is gezet tijdens build
- Check of frontend is gere deployed na het zetten van de variable
- Check browser console → Network tab → zie je de Railway URL?

### "403 Forbidden" of "Invalid Origin"

**Oplossing:**
- Check `CORS_ORIGIN` in Railway Variables
- Moet `https://www.bluediamonds.club` bevatten
- Redeploy Railway na het updaten

### "CORS error"

**Oplossing:**
- Check of `CORS_ORIGIN` exact matcht (geen trailing slash)
- Check of HTTPS wordt gebruikt (CORS werkt niet op HTTP)
- Check Railway logs voor specifieke error

---

## 📋 Checklist:

- [ ] `VITE_API_BASE_URL` is gezet in build environment
- [ ] Frontend is gere deployed met nieuwe build
- [ ] `CORS_ORIGIN` in Railway bevat `https://www.bluediamonds.club`
- [ ] Test account kan worden aangemaakt op productie
- [ ] Geen 404 errors meer
- [ ] API calls gaan naar Railway

---

## 💡 Alternatief: Serveer Frontend ook op Railway

Als je frontend ook op Railway wilt serveren (monolith):

1. **Railway serveert al frontend** via `SERVE_STATIC=1`
2. **Point je domain naar Railway:**
   - Railway Dashboard → Settings → Domains
   - Voeg `www.bluediamonds.club` toe
   - Volg DNS instructies

3. **Dan hoef je geen `VITE_API_BASE_URL` te zetten** - alles draait op hetzelfde domain

---

Na het instellen zou alles moeten werken! 🚀
