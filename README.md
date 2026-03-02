# Diamond Renewal Project

## How can I edit this code?

You can work locally using your preferred IDE. Clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project using any static hosting service like Vercel, Netlify, or GitHub Pages.

## Production-ready login/accounts (API + DB)

This repo includes a small auth API (Express) + database (Prisma) so **accounts are stored server-side** (production-safe; no localStorage passwords).

### Local development

- **Frontend**: `npm run dev` (Vite on `http://localhost:8080`)
- **API**: `npm run server` (Express on `http://localhost:3001`)

Vite proxies `/api/*` to the backend during development.

### Environment variables

Copy `ENV.example` into your hosting platform’s environment variables (or create a local `.env` on your machine if allowed).

- **DATABASE_URL**: SQLite for dev (`file:./dev.db`). For production, use Postgres and set the connection string.
- **CORS_ORIGIN**: comma-separated allowed origins (e.g. `https://www.example.com,https://shop.example.com`)
- **SESSION_COOKIE_DOMAIN**: set to `.example.com` if you want sessions to work across subdomains (`www` + `shop`).

### Database setup

Generate client + run migrations:

```sh
npx prisma generate
npx prisma migrate deploy
```

## Webshop

De webshop is volledig geïntegreerd met:
- Product catalogus (met filters, search, categories)
- Shopping cart (localStorage + context)
- Checkout via Stripe (iDEAL + card)
- Order management (zichtbaar in `/account`)
- Shipping costs (gratis boven €50, anders €4.95)

### Shop Routes

- `/shop` — Homepage
- `/shop/search` — Alle producten / zoeken
- `/shop/c/:category` — Categoriepagina (haar, gezicht, lichaam, wellness)
- `/shop/p/:id` — Product detail pagina
- `/shop/cart` — Winkelwagen
- `/shop/checkout` — Afrekenen
- `/shop/checkout/success` — Bestelling bevestigd

### Product Data

Producten worden opgehaald van `/api/shop/products` (fallback naar `src/data/shopCatalog.ts` als API niet beschikbaar is).

**Product import opties:**
1. WooCommerce sync: `npm run sync:woo` (vereist WooCommerce API credentials)
2. CSV import: `npm run import:product-images -- --file="products.csv"`
3. Handmatig via Prisma Studio: `npx prisma studio`

Zie `SHOP_IMAGES_IMPORT.md` voor details over product image import.

## Payments (Stripe Checkout)

This repo supports **real payments** via **Stripe Checkout**.

### Required env vars

Set these on your API host:

- `STRIPE_SECRET_KEY` (use test key in dev, live in production)
- `STRIPE_WEBHOOK_SECRET` (from Stripe webhook settings)

### Flow

- Shop frontend calls `POST /api/checkout/create-session` with cart items.
- Backend creates a pending `Order` and returns a `checkoutUrl`.
- Customer pays on Stripe-hosted Checkout (supports iDEAL + card by default).
- Stripe calls `POST /api/webhooks/stripe` and the backend marks the order `paid`.
- User sees the order in `/account`.

### Shipping Costs

- **Free shipping**: Orders above €50.00
- **Fixed cost**: €4.95 for orders below €50.00

Shipping costs are automatically added to Stripe checkout sessions.

## Deployment

Zie `DEPLOYMENT.md` voor een complete deployment guide met:
- Database setup (SQLite → PostgreSQL)
- Environment variables configuratie
- Stripe webhook setup
- Build & deploy stappen
- Troubleshooting
