# Webshop Migration Plan

## Doel
Alle webshop-gerelateerde bestanden verplaatsen naar een standalone `webshop/` folder zodat deze apart gehost kan worden.

## Bestanden die verplaatst moeten worden:

### Frontend:
- `src/pages/shop/*` → `webshop/src/pages/`
- `src/components/shop/*` → `webshop/src/components/`
- `src/features/shop/*` → `webshop/src/features/`
- `src/data/shopCatalog.ts` → `webshop/src/data/`
- `src/lib/productSEO.ts` → `webshop/src/lib/`

### Backend:
- Shop API endpoints uit `server/index.ts` → `webshop/server/index.ts`
- Shop gerelateerde Prisma models → `webshop/prisma/`

### Configuratie:
- Eigen `package.json`
- Eigen `vite.config.ts`
- Eigen `tsconfig.json`
- Eigen `tailwind.config.js`
- Eigen `.env.example`

### Routes:
- Shop routes uit `src/App.tsx` → `webshop/src/App.tsx`

## Structuur:
```
webshop/
├── src/
│   ├── pages/
│   ├── components/
│   ├── features/
│   ├── data/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── server/
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .env.example
└── README.md
```
