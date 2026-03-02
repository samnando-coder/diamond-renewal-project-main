# Frontend README - Blue Diamonds Club

## Overzicht

De frontend is een React Single Page Application (SPA) gebouwd met:
- **Vite** - Build tool en dev server
- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Styling

## Development Setup

### Installatie

```bash
# Installeer dependencies
npm install

# Start development server (frontend op :8080, proxy naar backend :3001)
npm run dev
```

De development server draait op `http://localhost:8080` en proxy't `/api/*` requests naar de backend op `http://localhost:3001`.

### Build

```bash
# Build voor productie
npm run build

# Output: dist/ folder
```

## Project Structuur

```
src/
├── components/          # Herbruikbare componenten
│   ├── layout/         # Header, Footer, etc.
│   ├── shop/           # Shop-specifieke componenten
│   └── ui/             # shadcn-ui componenten
├── pages/              # Page componenten
│   ├── shop/           # Shop pagina's
│   └── ...             # Andere pagina's
├── features/           # Feature modules
│   └── shop/           # Shop feature (types, API calls, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functies
│   ├── api.ts          # API base URL configuratie
│   ├── auth.ts         # Auth API calls
│   └── ...
└── data/               # Static data
    └── shopCatalog.ts   # Product catalogus
```

## Routes

### Hoofd Routes

- `/` - Homepage
- `/behandelingen` - Behandelingen overzicht
- `/behandelingen/:slug` - Behandeling detail
- `/arrangementen` - Arrangementen
- `/shop` - Webshop homepage
- `/contact` - Contact
- `/login` - Inloggen
- `/aanmelden` - Aanmelden
- `/account` - Account pagina (vereist login)
- `/blogs` - Blog overzicht
- `/blogs/:id` - Blog detail

### Shop Routes

- `/shop` - Shop homepage met aanbevolen producten
- `/shop/c/:category` - Categorie pagina (haar, gezicht, lichaam, wellness)
- `/shop/search` - Zoek pagina
- `/shop/p/:id` - Product detail pagina
- `/shop/cart` - Winkelwagen
- `/shop/checkout` - Checkout (vereist login)
- `/shop/checkout/success` - Bestelling bevestigd

## API Integratie

### API Base URL

De frontend gebruikt `src/lib/api.ts` om API calls te maken. In productie wordt `VITE_API_BASE_URL` gebruikt als de frontend en backend op verschillende domains draaien.

**Development:**
- Vite proxy't `/api/*` naar `http://localhost:3001`

**Productie (Vercel + Railway):**
- Zet `VITE_API_BASE_URL=https://your-backend.railway.app` in Vercel environment variables
- Frontend maakt dan calls naar de Railway backend

### API Endpoints

- `GET /api/shop/products` - Haal producten op
- `POST /api/auth/register` - Registreer gebruiker
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Haal huidige gebruiker op
- `GET /api/account/me` - Haal account info + orders op
- `POST /api/checkout/create-session` - Maak Stripe checkout session

## Authentication

De frontend gebruikt cookie-based authentication. Na login wordt een session cookie gezet die automatisch meegestuurd wordt met alle API requests.

**Auth Hook:**
```typescript
import { useAuth } from '@/hooks/useAuth';

const { isAuthenticated, user, login, logout } = useAuth();
```

## Shop Functionaliteit

### Product Data

Producten worden opgehaald van:
1. `/api/shop/products` (backend API)
2. Fallback naar `src/data/shopCatalog.ts` (static data)

**Product Types:**
```typescript
interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  currency: string;
  priceCents: number | null; // null als niet ingelogd
}
```

### Shopping Cart

De shopping cart gebruikt React Context (`src/features/shop/ShopCartProvider.tsx`) en localStorage voor persistentie.

**Cart Hook:**
```typescript
import { useShopCart } from '@/features/shop/useShopCart';

const { items, totalCents, addItem, removeItem, clearCart } = useShopCart();
```

### Checkout Flow

1. Gebruiker vult winkelwagen
2. Klikt op "Afrekenen" → redirect naar `/shop/checkout`
3. Checkout pagina maakt Stripe session aan via `/api/checkout/create-session`
4. Redirect naar Stripe Checkout
5. Na betaling → redirect naar `/shop/checkout/success?session_id=...`
6. Success pagina haalt order op via `/api/checkout/session?session_id=...`

## Deployment

### Vercel (Aanbevolen voor Frontend)

1. **Push naar GitHub**
2. **Import project in Vercel**
3. **Zet Environment Variables:**
   - `VITE_API_BASE_URL` = `https://your-backend.railway.app`
4. **Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy**

### SPA Routing Fix

Voor Vercel is `vercel.json` al aangemaakt met rewrite rules:
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

Dit zorgt dat alle routes naar `index.html` gaan zodat React Router de routing kan afhandelen.

### Netlify

Voor Netlify is `public/_redirects` al aanwezig:
```
/*    /index.html   200
```

## Environment Variables

### Development

Geen environment variables nodig (Vite proxy handelt alles af).

### Production (Vercel)

- `VITE_API_BASE_URL` - Backend API URL (bijv. `https://your-backend.railway.app`)

**Belangrijk:** Na het zetten van environment variables moet je een nieuwe deployment triggeren!

## Troubleshooting

### "404 bij page reload"

**Oplossing:** Check dat `vercel.json` bestaat en correct is geconfigureerd (zie SPA Routing Fix hierboven).

### "API calls gaan naar verkeerde URL"

**Oplossing:**
1. Check `VITE_API_BASE_URL` is gezet in Vercel
2. Trigger nieuwe deployment
3. Check browser console voor `[API] API_BASE_URL: ...`

### "Producten niet zichtbaar"

**Oplossing:**
1. Check `/api/shop/products` endpoint werkt
2. Check browser console voor errors
3. Check Network tab voor failed requests
4. Frontend valt terug op `shopCatalog.ts` als API faalt

### "Login werkt niet"

**Oplossing:**
1. Check cookies worden geaccepteerd (browser settings)
2. Check CORS is correct geconfigureerd op backend
3. Check `SESSION_COOKIE_DOMAIN` is correct
4. Check API calls gaan naar juiste backend URL

## Product Images

Product images worden opgehaald van:
1. `productImageMap` in `src/data/shopCatalog.ts` (scraped packshots)
2. Fallback naar category images

**Image URLs:**
- Externe URLs (bijv. `https://www.redken.eu/...`) - direct gebruikt
- Lokale paths (bijv. `/Blue Diamonds Foto's/...`) - geserveerd via public folder

## Styling

### Tailwind CSS

De app gebruikt Tailwind CSS voor styling. Configuratie staat in `tailwind.config.ts`.

### shadcn-ui

UI componenten komen van shadcn-ui. Componenten staan in `src/components/ui/`.

**Nieuwe component toevoegen:**
```bash
npx shadcn-ui@latest add [component-name]
```

## Analytics

Google Analytics is geïntegreerd via `src/components/analytics/GoogleAnalytics.tsx`.

**Events:**
- Page views (automatisch)
- Purchase events (na checkout success)
- Begin checkout (bij checkout pagina)

## Development Tips

### Hot Reload

Vite heeft automatische hot reload. Wijzigingen worden direct getoond.

### TypeScript Errors

```bash
# Check TypeScript errors
npx tsc --noEmit
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Debugging

- Gebruik React DevTools browser extension
- Check Network tab voor API calls
- Check Console voor errors en debug logs

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build voor productie
npm run preview      # Preview production build
npm run lint         # Run ESLint
```
