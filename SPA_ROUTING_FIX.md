# SPA Routing Fix - 404 Error bij Reload

## Het Probleem:

Wanneer je `/shop` of een andere route direct bezoekt of reload, krijg je een 404 error. Dit komt omdat de server probeert die route te vinden, maar die bestaat alleen in de frontend (React Router).

## ✅ Oplossingen:

### 1. Development (Lokaal)

Vite heeft nu `appType: "spa"` in de config, wat automatisch `index.html` serveert voor alle routes.

**Test:**
1. Start dev server: `npm run dev`
2. Ga naar `http://localhost:8080/shop`
3. Reload de pagina - zou moeten werken

### 2. Productie (Server serveert frontend)

Als je server de frontend serveert (met `SERVE_STATIC=1`):

**Zet in je environment variables:**
```env
SERVE_STATIC=1
```

**De server heeft nu:**
- Static files worden geserveerd
- Catch-all route serveert `index.html` voor alle routes (behalve `/api/*`)

**Test:**
1. Build frontend: `npm run build`
2. Start server: `SERVE_STATIC=1 npm start`
3. Ga naar `http://localhost:3001/shop`
4. Reload - zou moeten werken

### 3. Static Hosting (Netlify/Vercel/etc.)

Als je frontend op een static host draait:

#### Netlify:
De `public/_redirects` file is al aanwezig:
```
/*    /index.html   200
```

Dit zorgt dat alle routes naar `index.html` gaan.

#### Vercel:
Maak een `vercel.json` file:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Cloudflare Pages:
Maak een `_redirects` file in de `public` folder (al aanwezig).

---

## 🚀 Quick Fix:

### Als je server de frontend serveert:

1. **Zet environment variable:**
   ```bash
   # In .env of je hosting platform
   SERVE_STATIC=1
   ```

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Start server:**
   ```bash
   npm start
   # of
   NODE_ENV=production SERVE_STATIC=1 npm start
   ```

4. **Test:**
   - Ga naar je site
   - Navigeer naar `/shop`
   - Reload de pagina
   - Zou moeten werken! ✅

### Als je static hosting gebruikt:

- **Netlify:** `_redirects` file is al aanwezig ✅
- **Vercel:** Maak `vercel.json` (zie hierboven)
- **Andere:** Check documentatie voor SPA routing support

---

## 🔍 Troubleshooting:

### "Nog steeds 404 bij reload"

1. **Check of `SERVE_STATIC=1` is gezet:**
   ```bash
   echo $SERVE_STATIC  # Linux/Mac
   echo $env:SERVE_STATIC  # Windows PowerShell
   ```

2. **Check of `dist/` folder bestaat:**
   ```bash
   ls dist/  # Linux/Mac
   dir dist  # Windows
   ```

3. **Check server logs:**
   - Kijk of de catch-all route wordt getriggerd
   - Check of `index.html` wordt gevonden

4. **Test lokaal:**
   ```bash
   npm run build
   SERVE_STATIC=1 npm start
   # Ga naar http://localhost:3001/shop
   # Reload - werkt het?
   ```

### "Werkt lokaal maar niet online"

- Check of `SERVE_STATIC=1` is gezet in je hosting platform
- Check of `dist/` folder wordt geüpload bij deployment
- Check of de server de `dist/` folder kan vinden

---

## ✅ Wat is er gefixt:

1. ✅ Vite config heeft nu `appType: "spa"` voor development
2. ✅ Server catch-all route is verbeterd
3. ✅ Static files worden correct geserveerd
4. ✅ `_redirects` file is aanwezig voor Netlify

---

## 📝 Checklist:

- [ ] `SERVE_STATIC=1` is gezet (als server frontend serveert)
- [ ] `npm run build` is gerund
- [ ] `dist/` folder bestaat en bevat `index.html`
- [ ] Server start zonder errors
- [ ] `/shop` route werkt bij direct bezoek
- [ ] Reload werkt zonder 404

---

## 🎯 Conclusie:

De fix is geïmplementeerd. Zorg dat:
1. `SERVE_STATIC=1` is gezet als je server de frontend serveert
2. Frontend is gebuild (`npm run build`)
3. Server is herstart

Dan zou het moeten werken! 🚀
