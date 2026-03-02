# Blue Diamonds Club - Webshop Project

## 📚 Documentatie

- **[README_FRONTEND.md](./README_FRONTEND.md)** - Complete frontend documentatie
- **[README_BACKEND.md](./README_BACKEND.md)** - Complete backend documentatie

## 🚀 Quick Start

### Installatie

```bash
# Clone repository
git clone https://github.com/samnando-coder/diamond-renewal-project-main.git
cd diamond-renewal-project-main

# Installeer dependencies
npm install

# Genereer Prisma Client
npm run db:generate
```

### Development

```bash
# Start frontend (http://localhost:8080)
npm run dev

# Start backend (http://localhost:3001) - in aparte terminal
npm run server
```

## 🛠️ Technologie Stack

### Frontend
- **Vite** - Build tool en dev server
- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Styling

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Production database
- **Stripe** - Payment processing

## 📁 Project Structuur

```
├── src/              # Frontend (React)
├── server/           # Backend (Express API)
├── prisma/           # Database schema & migrations
├── public/           # Static assets
└── dist/             # Build output (na npm run build)
```

## 🔑 Environment Variables

Kopieer `ENV.example` naar `.env` en vul in:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# CORS
CORS_ORIGIN="https://www.bluediamonds.club,https://bluediamonds.club"

# Session
SESSION_COOKIE_NAME="bd_session"
SESSION_COOKIE_DOMAIN=".bluediamonds.club"
SESSION_DAYS=30

# Stripe (optioneel)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Zie [README_BACKEND.md](./README_BACKEND.md) voor volledige lijst.

## 🛍️ Webshop Features

- ✅ Product catalogus met filters en zoeken
- ✅ Shopping cart (localStorage + context)
- ✅ Checkout via Stripe (iDEAL + card)
- ✅ Order management (zichtbaar in `/account`)
- ✅ Shipping costs (gratis boven €50, anders €4.95)
- ✅ User authentication (login/signup)
- ✅ Account pagina met order history

## 📖 Routes

### Hoofd Routes
- `/` - Homepage
- `/behandelingen` - Behandelingen overzicht
- `/shop` - Webshop homepage
- `/login` - Inloggen
- `/aanmelden` - Aanmelden
- `/account` - Account pagina (vereist login)

### Shop Routes
- `/shop` - Shop homepage
- `/shop/c/:category` - Categorie pagina
- `/shop/search` - Zoek pagina
- `/shop/p/:id` - Product detail
- `/shop/cart` - Winkelwagen
- `/shop/checkout` - Checkout
- `/shop/checkout/success` - Bestelling bevestigd

## 💳 Payments

De shop gebruikt **Stripe Checkout** voor betalingen:
- Credit/Debit Cards
- iDEAL (Nederlandse banken)

Zie [README_BACKEND.md](./README_BACKEND.md#stripe-setup) voor Stripe configuratie.

## 🚢 Deployment

### Frontend (Vercel)
Zie [README_FRONTEND.md](./README_FRONTEND.md#deployment) voor Vercel deployment.

### Backend (Railway)
Zie [README_BACKEND.md](./README_BACKEND.md#deployment) voor Railway deployment.

## 📝 Scripts

```bash
npm run dev              # Start frontend dev server
npm run server           # Start backend dev server
npm run build            # Build frontend voor productie
npm start                # Start production server
npm run db:generate      # Genereer Prisma Client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run setup:production-db  # Automatische database setup
```

## 📚 Meer Info

- **[README_FRONTEND.md](./README_FRONTEND.md)** - Frontend documentatie (routes, API integratie, deployment)
- **[README_BACKEND.md](./README_BACKEND.md)** - Backend documentatie (API endpoints, database, Stripe, deployment)
