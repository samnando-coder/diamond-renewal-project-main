# 🔗 Frontend-Backend Koppeling voor Railway

## ✅ Wat is gedaan:

1. **API Base URL Helper toegevoegd** (`src/lib/api.ts`)
   - Gebruikt relatieve paths (werkt als frontend en backend opzelfde domain)
   - Ondersteunt `VITE_API_BASE_URL` environment variable (voor aparte frontend)

2. **Alle API calls geüpdatet** om `apiUrl()` te gebruiken:
   - `src/lib/auth.ts` - Login, register, logout
   - `src/features/shop/api.ts` - Producten ophalen
   - `src/pages/shop/ShopCheckout.tsx` - Checkout
   - `src/pages/shop/ShopProduct.tsx` - Direct checkout
   - `src/pages/shop/ShopCheckoutSuccess.tsx` - Order ophalen
   - `src/pages/Account.tsx` - Account data
   - `src/lib/reviews.ts` - Reviews ophalen

---

## 🚀 Hoe het werkt:

### Railway Setup (Huidige Configuratie):

Railway serveert **zowel frontend als backend** op hetzelfde domain:
- Frontend: `https://diamond-renewal-project-main-production.up.railway.app`
- Backend API: `https://diamond-renewal-project-main-production.up.railway.app/api`

**Dit betekent:**
- ✅ Relatieve paths werken (`/api/auth/me`)
- ✅ Cookies werken (same domain)
- ✅ CORS is niet nodig (same origin)

### Als Frontend Later Apart Draait:

Als je frontend later op een aparte domain draait (bijv. Netlify):
1. Zet `VITE_API_BASE_URL` environment variable:
   ```
   VITE_API_BASE_URL=https://diamond-renewal-project-main-production.up.railway.app
   ```
2. Update `CORS_ORIGIN` in Railway:
   ```
   CORS_ORIGIN=https://www.bluediamonds.club,https://bluediamonds.club,https://your-frontend.netlify.app
   ```

---

## ✅ Verificatie:

### Test de API:

1. **Health Check:**
   ```bash
   curl https://diamond-renewal-project-main-production.up.railway.app/api/health
   # Moet teruggeven: {"ok":true}
   ```

2. **Test in Browser:**
   - Ga naar: `https://diamond-renewal-project-main-production.up.railway.app`
   - Open DevTools → Network tab
   - Probeer in te loggen/registreren
   - Check of API calls naar `/api/...` gaan (niet naar localhost)

3. **Check Console:**
   - Geen CORS errors
   - Geen 404 errors op API calls
   - Cookies worden gezet (Application → Cookies)

---

## 🔧 Railway Environment Variables:

Zorg dat deze zijn gezet in Railway:

```env
# Database
DATABASE_URL=postgresql://...

# CORS (moet Railway domain bevatten)
CORS_ORIGIN=https://diamond-renewal-project-main-production.up.railway.app,https://www.bluediamonds.club,https://bluediamonds.club

# Session
SESSION_COOKIE_NAME=bd_session
SESSION_COOKIE_DOMAIN=.bluediamonds.club
SESSION_DAYS=30

# Server
NODE_ENV=production
SERVE_STATIC=1
PORT=3001  # Railway zet dit automatisch
```

---

## 📋 Checklist:

- [x] API base URL helper toegevoegd
- [x] Alle API calls geüpdatet
- [x] Imports toegevoegd
- [ ] Code is gepusht naar GitHub
- [ ] Railway heeft gere deployed
- [ ] Frontend laadt op Railway URL
- [ ] Login/register werkt
- [ ] API calls werken (check Network tab)
- [ ] Cookies worden gezet
- [ ] Geen CORS errors

---

## 🆘 Troubleshooting:

### "CORS error" of "Invalid Origin"

**Oplossing:**
- Check `CORS_ORIGIN` in Railway Variables
- Moet Railway domain bevatten: `https://diamond-renewal-project-main-production.up.railway.app`
- Redeploy na het updaten

### "404 on /api/..."

**Oplossing:**
- Check of `SERVE_STATIC=1` is gezet
- Check of frontend is gebuild (`dist/` folder bestaat)
- Check server logs voor errors

### "Cookies not working"

**Oplossing:**
- Check `SESSION_COOKIE_DOMAIN` (moet `.bluediamonds.club` zijn, niet Railway domain)
- Check of HTTPS werkt (cookies werken niet op HTTP in productie)
- Check browser DevTools → Application → Cookies

---

## 🎯 Volgende Stappen:

1. **Commit en push:**
   ```bash
   git add .
   git commit -m "Link frontend with Railway backend API"
   git push origin main
   ```

2. **Wacht op Railway redeploy**

3. **Test:**
   - Ga naar Railway URL
   - Test login/register
   - Test shop functionaliteit

4. **Run database migrations** (zie `RAILWAY_GO_LIVE.md`)

---

De frontend is nu gekoppeld aan de backend! 🚀
