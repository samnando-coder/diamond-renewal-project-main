# 🔧 Vercel SPA Routing Fix

## ❌ Probleem:

Je krijgt 404 errors bij het reloaden van pagina's op Vercel:
```
GET https://www.bluediamonds.club/shop 404 (Not Found)
```

## 🔍 Oorzaak:

Vercel weet niet dat het een Single Page Application (SPA) is. Wanneer je `/shop` direct bezoekt of reload, probeert Vercel een bestand `/shop` te vinden, maar die bestaat niet. Alle routes moeten naar `index.html` gaan zodat React Router de routing kan afhandelen.

## ✅ Oplossing:

Ik heb een `vercel.json` configuratiebestand aangemaakt dat Vercel vertelt om alle routes naar `index.html` te rewriten.

---

## 📋 Wat is toegevoegd:

### `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Dit vertelt Vercel:
- Alle routes (`/*`) moeten naar `/index.html` gaan
- React Router handelt dan de client-side routing af

---

## 🚀 Volgende Stappen:

### 1. Code is al gepusht

De `vercel.json` is toegevoegd en gepusht naar GitHub.

### 2. Vercel redeploy

Vercel zou automatisch moeten redeployen. Als dat niet gebeurt:

1. **Ga naar Vercel Dashboard**
2. **Ga naar je project**
3. **Klik op "Deployments" tab**
4. **Klik op de 3 dots (⋮) naast de laatste deployment**
5. **Klik "Redeploy"**

### 3. Test

Na redeploy:
1. Ga naar `https://www.bluediamonds.club/shop`
2. Reload de pagina (F5 of Ctrl+R)
3. Geen 404 error meer!

---

## 🆘 Als het nog steeds niet werkt:

### Check Vercel Build Logs:

1. Vercel Dashboard → Deployments
2. Klik op deployment → "Build Logs"
3. Check of `vercel.json` wordt gedetecteerd

### Check Vercel Settings:

1. Vercel Dashboard → Settings → General
2. Check "Framework Preset" → Moet "Vite" of "Other" zijn
3. Check "Build Command" → Moet `npm run build` zijn
4. Check "Output Directory" → Moet `dist` zijn

### Manual Fix in Vercel:

Als `vercel.json` niet werkt, kun je het ook handmatig instellen:

1. Vercel Dashboard → Settings → Rewrites
2. Voeg toe:
   - **Source:** `/(.*)`
   - **Destination:** `/index.html`

---

## 📋 Checklist:

- [x] `vercel.json` is aangemaakt
- [x] Code is gepusht naar GitHub
- [ ] Vercel heeft gere deployed
- [ ] Test reload op `/shop` → Geen 404
- [ ] Test reload op andere pagina's → Geen 404

---

## 💡 Technische Details:

### Hoe SPA Routing Werkt:

1. **Eerste bezoek:** Browser vraagt `/shop` aan
2. **Vercel rewrite:** Vercel serveert `/index.html` (niet `/shop`)
3. **React Router:** Laadt en ziet `/shop` in URL
4. **Client-side routing:** React Router toont de juiste component

### Waarom werkt dit?

- **Static files** (JS, CSS, images) worden normaal geserveerd
- **Alle andere routes** worden naar `index.html` gerewrite
- **React Router** handelt de routing af in de browser

---

Na de Vercel redeploy zou de 404 error opgelost moeten zijn! 🚀
