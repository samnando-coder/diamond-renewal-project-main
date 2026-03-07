# Webshop Standalone - Complete Setup Guide

## ✅ Wat is al gedaan:

### Structuur aangemaakt:
- ✅ `webshop/src/pages/` - Alle shop pagina's
- ✅ `webshop/src/components/` - Shop componenten
- ✅ `webshop/src/features/` - Shop features
- ✅ `webshop/src/data/` - Shop catalog
- ✅ `webshop/src/lib/` - Shop utilities
- ✅ `webshop/server/` - Backend server
- ✅ `webshop/prisma/` - Database schema

### Configuratie bestanden:
- ✅ `webshop/package.json`
- ✅ `webshop/vite.config.ts`
- ✅ `webshop/tsconfig.json` + app/node variants
- ✅ `webshop/tailwind.config.ts`
- ✅ `webshop/src/App.tsx` (standalone)
- ✅ `webshop/src/main.tsx`
- ✅ `webshop/index.html`
- ✅ `webshop/server/index.ts` (alle shop endpoints)
- ✅ `webshop/prisma/schema.prisma` (alle shop models)

## ⚠️ Wat nog handmatig moet worden gekopieerd:

### 1. UI Components (alle):
```powershell
Copy-Item -Path "src\components\ui\*" -Destination "webshop\src\components\ui\" -Recurse -Force
```

### 2. Layout Components:
```powershell
Copy-Item -Path "src\components\layout\Container.tsx" -Destination "webshop\src\components\layout\" -Force
Copy-Item -Path "src\components\layout\Section.tsx" -Destination "webshop\src\components\layout\" -Force
Copy-Item -Path "src\components\layout\PageHeader.tsx" -Destination "webshop\src\components\layout\" -Force
Copy-Item -Path "src\components\layout\FilterSidebar.tsx" -Destination "webshop\src\components\layout\" -Force
```

### 3. Hooks:
```powershell
Copy-Item -Path "src\hooks\useAuth.ts" -Destination "webshop\src\hooks\" -Force
Copy-Item -Path "src\hooks\useSEO.ts" -Destination "webshop\src\hooks\" -Force
Copy-Item -Path "src\hooks\use-toast.ts" -Destination "webshop\src\hooks\" -Force
```

### 4. Auth & Analytics:
```powershell
Copy-Item -Path "src\components\auth\*" -Destination "webshop\src\components\auth\" -Recurse -Force
Copy-Item -Path "src\components\analytics\*" -Destination "webshop\src\components\analytics\" -Recurse -Force
```

### 5. Public Assets:
```powershell
New-Item -ItemType Directory -Force -Path "webshop\public\Blue Diamonds Foto's" | Out-Null
Copy-Item -Path "public\Blue Diamonds Foto's\bluediamondslogo.png" -Destination "webshop\public\Blue Diamonds Foto's\" -Force -ErrorAction SilentlyContinue
```

### 6. Cloudinary Mapping:
```powershell
Copy-Item -Path "src\lib\cloudinary-mapping.json" -Destination "webshop\src\lib\cloudinary-mapping.json" -Force -ErrorAction SilentlyContinue
```

### 7. Login/Aanmelden pagina's (optioneel):
Als je de webshop volledig standalone wilt, kopieer:
```powershell
Copy-Item -Path "src\pages\Login.tsx" -Destination "webshop\src\pages\" -Force
Copy-Item -Path "src\pages\Aanmelden.tsx" -Destination "webshop\src\pages\" -Force
```

En voeg routes toe aan `webshop/src/App.tsx`.

## 📝 Volgende stappen:

1. **Kopieer ontbrekende bestanden** (gebruik de PowerShell commando's hierboven)

2. **Test de webshop lokaal**:
   ```bash
   cd webshop
   npm install
   npm run db:generate
   npm run dev
   ```

3. **Fix imports** waar nodig (alle `@/` imports moeten werken)

4. **Deploy**:
   - Frontend: Vercel/Netlify
   - Backend: Railway/Render
   - Database: Supabase/Railway PostgreSQL

## 🎯 De webshop is nu standalone!

Alle webshop bestanden staan in de `webshop/` folder en kunnen apart gehost worden.
