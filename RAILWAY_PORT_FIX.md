# Railway Port & Binding Fix

## ✅ Wat is gefixed:

1. **Server bindt nu naar `0.0.0.0`** (niet alleen localhost)
2. **Gebruikt `process.env.PORT`** (Railway zet dit automatisch)
3. **Betere log messages** voor debugging

---

## 🔧 Wat is veranderd:

### server/index.ts:

**Voor:**
```typescript
app.listen(env.port, () => {
  console.log(`[api] listening on http://localhost:${env.port}`);
});
```

**Na:**
```typescript
app.listen(env.port, '0.0.0.0', () => {
  console.log(`[api] Server running on port ${env.port} (bound to 0.0.0.0)`);
  if (process.env.SERVE_STATIC === '1') {
    console.log(`[api] Serving static files from /dist`);
  }
});
```

---

## ✅ Verificatie:

Na deploy zou je in de logs moeten zien:

```
[api] Server running on port 3001 (bound to 0.0.0.0)
[api] Serving static files from /dist
```

**Let op:** Railway kan een andere port gebruiken (bijv. 3000, 8080, etc.). Dat is normaal - Railway zet `PORT` automatisch.

---

## 🚀 Volgende Stappen:

1. **Commit en push:**
   ```bash
   git add server/index.ts Dockerfile
   git commit -m "Fix server binding to 0.0.0.0 for Railway"
   git push origin main
   ```

2. **Railway redeployt automatisch**

3. **Check logs:**
   - Railway Dashboard → Deployments → View Logs
   - Je zou moeten zien: `Server running on port X (bound to 0.0.0.0)`

4. **Test je Railway URL:**
   - Ga naar je Railway domain (bijv. `https://your-app.railway.app`)
   - Of test API: `https://your-app.railway.app/api/health`

---

## 📋 Checklist:

- [x] Server bindt naar `0.0.0.0` (niet localhost)
- [x] Gebruikt `process.env.PORT` (Railway zet dit)
- [x] Frontend wordt gebuild (`npm run build` in Dockerfile)
- [x] Static files worden geserveerd (`SERVE_STATIC=1`)
- [ ] Railway domain is gegenereerd
- [ ] Migrations zijn gerund
- [ ] Test account kan worden aangemaakt

---

## 🆘 Als het nog steeds niet werkt:

### Check Railway Variables:

Zorg dat deze zijn gezet:
- `PORT` - Railway zet dit automatisch (hoef je niet handmatig te zetten)
- `SERVE_STATIC=1` - Voor static file serving
- `NODE_ENV=production` - Voor productie mode

### Check Logs:

Railway Dashboard → Deployments → View Logs

**Goede logs:**
```
[api] Server running on port 3001 (bound to 0.0.0.0)
[api] Serving static files from /dist
```

**Slechte logs:**
```
[api] listening on http://localhost:3001  ❌ (bindt niet naar 0.0.0.0)
```

### Check Railway Domain:

1. Railway Dashboard → Settings → Networking
2. Klik **"Generate Domain"** (als je nog geen domain hebt)
3. Je krijgt: `your-app.up.railway.app`
4. Test deze URL in je browser

---

## 💡 Belangrijk:

- **Railway zet `PORT` automatisch** - je hoeft het niet handmatig te zetten
- **Bind altijd naar `0.0.0.0`** - anders kan Railway je app niet bereiken
- **Frontend wordt gebuild** - geen Vite dev server in productie
- **Static files worden geserveerd** - als `SERVE_STATIC=1` is gezet

---

De server zou nu correct moeten werken op Railway! 🚀
