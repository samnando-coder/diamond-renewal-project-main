# 🚀 Vercel Frontend Setup voor Railway Backend

## ❌ Probleem:

Je frontend op Vercel (`www.bluediamonds.club`) probeert API calls te maken naar `/api/...` op hetzelfde domain, wat een 404 geeft omdat de backend op Railway draait.

## ✅ Oplossing:

Je moet `VITE_API_BASE_URL` environment variable zetten in Vercel **en** een nieuwe deployment triggeren.

---

## 🔧 Stappen voor Vercel:

### 1. Zet Environment Variable in Vercel

1. **Ga naar Vercel Dashboard:**
   - [vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecteer je project

2. **Ga naar Settings → Environment Variables**

3. **Voeg nieuwe variable toe:**
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://diamond-renewal-project-main-production.up.railway.app`
   - **Environment:** Selecteer **Production** (en optioneel Preview/Development)

4. **Klik "Save"**

### 2. ⚠️ BELANGRIJK: Trigger Nieuwe Deployment

**Vercel gebruikt environment variables alleen tijdens de build.** Je moet een nieuwe deployment triggeren:

**Optie A: Via Dashboard (Makkelijkst)**
1. Ga naar **Deployments** tab
2. Klik op de **3 dots** (⋮) naast de laatste deployment
3. Klik **"Redeploy"**
4. Of klik **"Redeploy"** button

**Optie B: Via Git Push**
```bash
# Maak een kleine change (bijv. lege commit)
git commit --allow-empty -m "Trigger Vercel rebuild with VITE_API_BASE_URL"
git push
```

**Optie C: Via Vercel CLI**
```bash
vercel --prod
```

### 3. Verifieer Build Logs

1. Ga naar **Deployments** tab
2. Klik op de nieuwe deployment
3. Check **Build Logs**
4. Zoek naar: `VITE_API_BASE_URL` (zou moeten verschijnen in de build)

### 4. Test

1. Ga naar `https://www.bluediamonds.club`
2. Open browser console (F12)
3. Check console → Je zou moeten zien: `[API] API_BASE_URL: https://diamond-renewal-project-main-production.up.railway.app`
4. Probeer account aan te maken
5. Check Network tab → API call moet naar Railway URL gaan

---

## 🆘 Troubleshooting:

### "Nog steeds 404 op /api/..."

**Check:**
1. ✅ Is `VITE_API_BASE_URL` gezet in Vercel?
2. ✅ Is deployment opnieuw getriggerd na het zetten van de variable?
3. ✅ Check browser console → Wat is de waarde van `API_BASE_URL`?
4. ✅ Check Network tab → Gaat de request naar Railway of naar `www.bluediamonds.club`?

**Debug:**
- Open browser console
- Type: `window.location.origin`
- Check of API calls naar Railway gaan

### "Environment variable niet beschikbaar tijdens build"

**Oplossing:**
- Zorg dat je **Production** environment selecteert (niet alleen Development)
- Trigger een nieuwe deployment
- Check build logs om te zien of variable beschikbaar is

### "Build faalt"

**Check:**
- Is de variable naam exact: `VITE_API_BASE_URL`? (hoofdletters!)
- Is de URL correct (geen trailing slash)?
- Check Vercel build logs voor errors

---

## 📋 Checklist:

- [ ] `VITE_API_BASE_URL` is gezet in Vercel (Production environment)
- [ ] Nieuwe deployment is getriggerd
- [ ] Build logs tonen geen errors
- [ ] Browser console toont: `[API] API_BASE_URL: https://...`
- [ ] API calls gaan naar Railway (check Network tab)
- [ ] Geen 404 errors meer
- [ ] Account kan worden aangemaakt

---

## 🔍 Verificatie:

### Check Browser Console:

Na het laden van de site, open console en je zou moeten zien:
```
[API] API_BASE_URL: https://diamond-renewal-project-main-production.up.railway.app
```

### Check Network Tab:

1. Open DevTools → Network tab
2. Probeer te registreren
3. Check de failed request
4. **Request URL** moet zijn: `https://diamond-renewal-project-main-production.up.railway.app/api/auth/register`
5. **Niet:** `https://www.bluediamonds.club/api/auth/register`

---

## 💡 Belangrijk:

- **Vite environment variables** worden **tijdens build time** ingebouwd
- Je **moet** een nieuwe deployment triggeren na het zetten van de variable
- Variables moeten beginnen met `VITE_` om beschikbaar te zijn in de frontend
- Check altijd de build logs om te verifiëren dat variables beschikbaar zijn

---

## 🎯 Quick Fix:

1. Vercel Dashboard → Settings → Environment Variables
2. Voeg toe: `VITE_API_BASE_URL` = `https://diamond-renewal-project-main-production.up.railway.app`
3. Deployments → Redeploy
4. Wacht tot deployment klaar is
5. Test op `www.bluediamonds.club`

---

Na deze stappen zou alles moeten werken! 🚀
