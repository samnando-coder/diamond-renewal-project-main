# 🔧 Railway CORS & Origin Fix

## ❌ Probleem:

Je krijgt 403 errors bij register/login:
- `api/auth/register:1 Failed to load resource: the server responded with a status of 403`
- `api/auth/me:1 Failed to load resource: the server responded with a status of 401`

## 🔍 Oorzaak:

De server blokkeert requests omdat:
1. **Same-origin requests** (frontend en backend opzelfde domain) sturen **geen Origin header**
2. De origin guard verwacht altijd een Origin header voor POST requests
3. Dit is onnodig restrictief voor same-origin requests

## ✅ Oplossing:

De origin guard is aangepast om:
- ✅ Same-origin requests toe te staan (geen Origin header nodig)
- ✅ Cross-origin requests te valideren (Origin header vereist)
- ✅ Betere error messages te geven

---

## 🚀 Wat je moet doen:

### 1. Code is al gefixed en gepusht

De fix is al in de code. Railway zou automatisch moeten redeployen.

### 2. Check CORS_ORIGIN in Railway

Railway Dashboard → Variables → Check `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://diamond-renewal-project-main-production.up.railway.app,https://www.bluediamonds.club,https://bluediamonds.club
```

**Belangrijk:**
- Moet exact de Railway domain bevatten (zonder trailing slash)
- Meerdere domains gescheiden door komma
- Geen quotes nodig

### 3. Test opnieuw

Na redeploy:
1. Ga naar Railway URL
2. Probeer account aan te maken
3. Check browser console voor errors

---

## 🆘 Als het nog steeds niet werkt:

### Check Railway Logs:

Railway Dashboard → Deployments → View Logs

**Zoek naar:**
- `Invalid Origin: ...` errors
- Check welke origin wordt gestuurd

### Check Browser DevTools:

1. Open DevTools → Network tab
2. Probeer te registreren
3. Klik op de failed request
4. Check **Request Headers** → `Origin` header
5. Check **Response** → error message

### Debug Origin:

Voeg tijdelijk logging toe om te zien welke origin wordt gestuurd:

```typescript
// In server/index.ts, tijdelijk toevoegen:
console.log('Request origin:', req.headers.origin);
console.log('Request host:', req.headers.host);
console.log('Allowed origins:', env.corsOrigins);
```

---

## 📋 Checklist:

- [x] Origin guard is gefixed (same-origin toegestaan)
- [ ] Code is gepusht naar GitHub
- [ ] Railway heeft gere deployed
- [ ] CORS_ORIGIN bevat Railway domain
- [ ] Test account kan worden aangemaakt
- [ ] Login werkt
- [ ] Geen 403 errors meer

---

## 💡 Technische Details:

### Same-Origin vs Cross-Origin:

**Same-Origin (Railway setup):**
- Frontend: `https://diamond-renewal-project-main-production.up.railway.app`
- Backend: `https://diamond-renewal-project-main-production.up.railway.app/api`
- **Geen Origin header** (browser stuurt dit niet voor same-origin)
- ✅ Nu toegestaan

**Cross-Origin (later, als frontend apart draait):**
- Frontend: `https://www.bluediamonds.club`
- Backend: `https://api.bluediamonds.club`
- **Origin header** wordt gestuurd: `https://www.bluediamonds.club`
- ✅ Wordt gevalideerd tegen `CORS_ORIGIN`

---

De fix zou het probleem moeten oplossen! 🚀
