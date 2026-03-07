# Webshop Standalone Setup - Status

## ✅ Wat is al gedaan:

### Bestanden gekopieerd:
- ✅ Shop pages (`src/pages/shop/*` → `webshop/src/pages/`)
- ✅ Shop components (`src/components/shop/*` → `webshop/src/components/`)
- ✅ Shop features (`src/features/shop/*` → `webshop/src/features/`)
- ✅ Shop data (`src/data/shopCatalog.ts` → `webshop/src/data/`)
- ✅ Shop lib files (productSEO, api, cloudinary, etc.)

### Configuratie bestanden gemaakt:
- ✅ `webshop/package.json`
- ✅ `webshop/vite.config.ts`
- ✅ `webshop/tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- ✅ `webshop/src/App.tsx` (standalone)
- ✅ `webshop/src/main.tsx`
- ✅ `webshop/index.html`

## ⚠️ Wat nog moet gebeuren:

### 1. Kopieer ontbrekende bestanden handmatig:

```powershell
# Vanuit de root directory:

# CSS
Copy-Item "src\index.css" "webshop\src\index.css"

# Tailwind config
Copy-Item "tailwind.config.ts" "webshop\tailwind.config.ts"

# PostCSS config (als die bestaat)
Copy-Item "postcss.config.js" "webshop\postcss.config.js" -ErrorAction SilentlyContinue

# Cloudinary mapping JSON
Copy-Item "src\lib\cloudinary-mapping.json" "webshop\src\lib\cloudinary-mapping.json" -ErrorAction SilentlyContinue

# UI Components (alle)
Copy-Item "src\components\ui\*" "webshop\src\components\ui\" -Recurse -Force

# Layout components
Copy-Item "src\components\layout\Container.tsx" "webshop\src\components\layout\"
Copy-Item "src\components\layout\Section.tsx" "webshop\src\components\layout\"
Copy-Item "src\components\layout\PageHeader.tsx" "webshop\src\components\layout\"
Copy-Item "src\components\layout\FilterSidebar.tsx" "webshop\src\components\layout\"

# Hooks
Copy-Item "src\hooks\useAuth.ts" "webshop\src\hooks\"
Copy-Item "src\hooks\useSEO.ts" "webshop\src\hooks\"
Copy-Item "src\hooks\use-toast.ts" "webshop\src\hooks\"

# Auth
Copy-Item "src\components\auth\*" "webshop\src\components\auth\" -Recurse -Force

# Analytics
Copy-Item "src\components\analytics\*" "webshop\src\components\analytics\" -Recurse -Force

# Routing
New-Item -ItemType Directory -Force "webshop\src\components\routing"
Copy-Item "src\components\routing\ScrollToTop.tsx" "webshop\src\components\routing\"
```

### 2. Maak standalone server:

Kopieer shop-gerelateerde endpoints uit `server/index.ts` naar `webshop/server/index.ts`:
- `/api/auth/*` (login, register, logout, me)
- `/api/shop/products`
- `/api/checkout/*`
- `/api/account/*`
- `/api/newsletter/subscribe`
- `/api/webhooks/stripe`

Kopieer ook:
- `server/env.ts` → `webshop/server/env.ts`
- `server/auth.ts` → `webshop/server/auth.ts`
- `server/stripe.ts` → `webshop/server/stripe.ts`
- `server/prisma.ts` → `webshop/server/prisma.ts`

### 3. Prisma schema:

Kopieer alleen shop-gerelateerde models:
- User
- Session
- Order
- Product
- NewsletterSubscriber

### 4. Public assets:

```powershell
# Kopieer logo en andere assets
Copy-Item "public\Blue Diamonds Foto's\*" "webshop\public\Blue Diamonds Foto's\" -Recurse -Force -ErrorAction SilentlyContinue
```

### 5. Update imports in gekopieerde bestanden:

Alle imports moeten werken met de nieuwe structuur. Check:
- `@/` alias wijst naar `webshop/src/`
- Alle relative imports zijn correct

### 6. Login/Aanmelden pagina's:

Als de webshop standalone is, moet je login/aanmelden pagina's toevoegen:
- `webshop/src/pages/Login.tsx`
- `webshop/src/pages/Aanmelden.tsx`
- `webshop/src/pages/Account.tsx`

Of link naar de hoofdsite voor authenticatie.

## Volgende stappen:

1. Run het PowerShell script hierboven om alle bestanden te kopiëren
2. Maak `webshop/server/index.ts` met alleen shop endpoints
3. Test of alles compileert: `cd webshop && npm install && npm run build`
4. Fix imports waar nodig
5. Test de webshop lokaal

## Deployment:

De webshop kan nu apart gehost worden op:
- **Frontend**: Vercel, Netlify, of elke static host
- **Backend**: Railway, Render, of elke Node.js host
- **Database**: Supabase, Railway, of elke PostgreSQL host
