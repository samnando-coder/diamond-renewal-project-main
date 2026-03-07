# Webshop Migration Guide

## Status
De webshop bestanden zijn gekopieerd naar de `webshop/` folder. 

## Wat is al gekopieerd:
- ✅ `src/pages/shop/*` → `webshop/src/pages/`
- ✅ `src/components/shop/*` → `webshop/src/components/`
- ✅ `src/features/shop/*` → `webshop/src/features/`
- ✅ `src/data/shopCatalog.ts` → `webshop/src/data/`
- ✅ `src/lib/productSEO.ts` → `webshop/src/lib/`
- ✅ `src/lib/api.ts` → `webshop/src/lib/`
- ✅ `src/lib/cloudinaryMapping.ts` → `webshop/src/lib/`
- ✅ `src/lib/cloudinary.ts` → `webshop/src/lib/`
- ✅ `src/lib/brand.ts` → `webshop/src/lib/`
- ✅ `src/lib/utils.ts` → `webshop/src/lib/`
- ✅ `src/lib/analytics.ts` → `webshop/src/lib/`

## Wat nog moet gebeuren:

### 1. Kopieer shared dependencies:
```powershell
# UI Components (alleen degenen die gebruikt worden)
Copy-Item -Path "src\components\ui\*" -Destination "webshop\src\components\ui\" -Recurse

# Layout Components
Copy-Item -Path "src\components\layout\Container.tsx" -Destination "webshop\src\components\layout\"
Copy-Item -Path "src\components\layout\Section.tsx" -Destination "webshop\src\components\layout\"
Copy-Item -Path "src\components\layout\PageHeader.tsx" -Destination "webshop\src\components\layout\"
Copy-Item -Path "src\components\layout\FilterSidebar.tsx" -Destination "webshop\src\components\layout\"

# Hooks
Copy-Item -Path "src\hooks\useAuth.ts" -Destination "webshop\src\hooks\"
Copy-Item -Path "src\hooks\useSEO.ts" -Destination "webshop\src\hooks\"
Copy-Item -Path "src\hooks\use-toast.ts" -Destination "webshop\src\hooks\"

# Auth Provider
Copy-Item -Path "src\components\auth\*" -Destination "webshop\src\components\auth\" -Recurse

# Analytics
Copy-Item -Path "src\components\analytics\*" -Destination "webshop\src\components\analytics\" -Recurse
```

### 2. Maak standalone App.tsx:
- Kopieer shop routes uit `src/App.tsx`
- Maak een nieuwe `webshop/src/App.tsx` met alleen shop routes

### 3. Maak standalone server:
- Kopieer shop API endpoints uit `server/index.ts`
- Maak `webshop/server/index.ts` met alleen shop endpoints

### 4. Maak configuratie bestanden:
- `webshop/package.json` - met alleen shop dependencies
- `webshop/vite.config.ts`
- `webshop/tsconfig.json`
- `webshop/tailwind.config.ts`
- `webshop/index.html`
- `webshop/src/main.tsx`
- `webshop/src/index.css`

### 5. Kopieer Prisma schema:
- Kopieer alleen shop-gerelateerde models naar `webshop/prisma/schema.prisma`

### 6. Update imports:
- Alle imports moeten werken met de nieuwe structuur
- `@/` alias moet naar `webshop/src/` wijzen

## Volgende stappen:
1. Run het migratiescript om alle bestanden te kopiëren
2. Maak de configuratie bestanden
3. Test of alles werkt
4. Update imports waar nodig
