# Blue Diamonds Club Webshop - Standalone

Dit is een standalone versie van de webshop die apart gehost kan worden op een eigen domein.

## 📁 Structuur

```
webshop/
├── src/              # Frontend source code
│   ├── pages/        # Shop pagina's
│   ├── components/   # Shop componenten
│   ├── features/     # Shop features (cart, products, etc.)
│   ├── data/         # Product catalog
│   ├── lib/          # Utilities (API, SEO, etc.)
│   └── App.tsx       # Standalone app met alleen shop routes
├── server/           # Backend API
│   ├── index.ts      # Express server met shop endpoints
│   ├── auth.ts       # Authentication helpers
│   ├── env.ts        # Environment config
│   ├── prisma.ts     # Prisma client
│   └── stripe.ts     # Stripe integration
├── prisma/           # Database schema
│   └── schema.prisma # Shop models (User, Product, Order, etc.)
├── public/           # Static assets
├── package.json      # Dependencies
└── vite.config.ts    # Vite config
```

## 🚀 Setup

1. **Installeer dependencies:**
```bash
cd webshop
npm install
```

2. **Configureer environment variables:**
```bash
cp .env.example .env
# Vul .env in met je database URL en andere configuratie
```

3. **Run database migrations:**
```bash
npm run db:generate
npm run db:migrate
```

4. **Start development server:**
```bash
npm run dev
```

## 📦 Deployment

De webshop kan apart gehost worden op:

- **Frontend**: Vercel, Netlify, of elke static host
- **Backend**: Railway, Render, of elke Node.js host  
- **Database**: Supabase, Railway, of elke PostgreSQL host

### Environment Variables

Zie `.env.example` voor alle benodigde environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Frontend domain (voor CORS)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SESSION_COOKIE_NAME` - Cookie naam voor sessies
- `SESSION_COOKIE_DOMAIN` - Cookie domain (optioneel)
- `PORT` - Server port (default: 3001)

## ✅ Wat is inbegrepen

- ✅ Alle shop pagina's (home, product, cart, checkout, etc.)
- ✅ Product catalog met fallback
- ✅ Shopping cart functionaliteit
- ✅ Checkout met Stripe
- ✅ User authentication (login, register, logout)
- ✅ Account management (profile, password change)
- ✅ Order history
- ✅ Newsletter subscription
- ✅ Google Analytics integration
- ✅ SEO optimization
- ✅ Responsive design

## 📝 Notities

- De webshop gebruikt dezelfde database als de hoofdsite (optioneel)
- Login/Aanmelden pagina's kunnen toegevoegd worden of linken naar de hoofdsite
- Alle shop-gerelateerde code staat in deze folder
