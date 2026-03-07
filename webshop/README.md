# Blue Diamonds Club Webshop - Standalone

Dit is een standalone versie van de webshop die apart gehost kan worden.

## Structuur

```
webshop/
├── src/              # Frontend source code
├── server/           # Backend API
├── prisma/           # Database schema
├── public/           # Static assets
└── package.json      # Dependencies
```

## Setup

1. Installeer dependencies:
```bash
npm install
```

2. Configureer environment variables:
```bash
cp .env.example .env
# Vul .env in met je database URL en andere configuratie
```

3. Run database migrations:
```bash
npm run db:migrate
```

4. Start development server:
```bash
npm run dev
```

## Deployment

De webshop kan apart gehost worden op:
- Vercel (frontend)
- Railway (backend + database)
- Of elke andere hosting provider
