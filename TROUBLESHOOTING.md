# Troubleshooting Guide

## 500 Error bij Registratie (`/api/auth/register`)

### Mogelijke Oorzaken:

#### 1. **Prisma Client niet gegenereerd**
De Prisma Client moet gegenereerd zijn voordat de server start.

**Oplossing:**
```bash
# Op Railway, voeg dit toe aan build command:
npm run db:generate

# Of in package.json build script:
"build": "npm run db:generate && npm run build:frontend"
```

#### 2. **Database Migratie niet uitgevoerd**
De database tabellen bestaan mogelijk nog niet.

**Oplossing:**
```bash
# Op Railway, voeg dit toe aan start command:
npm run db:migrate

# Of voer handmatig uit:
npx prisma migrate deploy
```

#### 3. **Database Connectie Probleem**
De `DATABASE_URL` is mogelijk niet correct ingesteld of de database is niet bereikbaar.

**Oplossing:**
- Controleer `DATABASE_URL` in Railway environment variables
- Zorg dat de URL begint met `postgresql://` of `postgres://`
- Test de connectie met: `npx prisma db pull` (lokaal)

#### 4. **Prisma Client Lazy Initialization Issue**
De lazy initialization kan problemen veroorzaken bij eerste database call.

**Oplossing:**
Als het probleem blijft, probeer de lazy initialization te verwijderen in `server/prisma.ts` en gebruik directe initialisatie:

```typescript
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
```

### Debugging Stappen:

1. **Check Railway Logs**
   - Ga naar Railway Dashboard → Your Service → Logs
   - Zoek naar error messages bij registratie poging
   - De nieuwe error handling zou nu specifieke error details loggen

2. **Test Database Connectie**
   ```bash
   # Lokaal (met .env):
   npx prisma db pull
   ```

3. **Check Prisma Schema**
   - Zorg dat `prisma/schema.prisma` correct is
   - Zorg dat alle models correct zijn gedefinieerd

4. **Check Environment Variables**
   - `DATABASE_URL` moet ingesteld zijn
   - `CORS_ORIGIN` moet ingesteld zijn
   - `SESSION_COOKIE_NAME` moet ingesteld zijn

### Meest Waarschijnlijke Oorzaak:

**Prisma Client niet gegenereerd tijdens build** of **Database migratie niet uitgevoerd**.

### Snelle Fix:

Voeg dit toe aan je Railway build/start process:

```json
// package.json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "build": "npm run db:generate && npm run build:frontend",
    "start": "npm run db:migrate && node server/index.js"
  }
}
```

Of in `railway.json` of `nixpacks.toml`:
- Build phase: `npm run db:generate`
- Start phase: `npm run db:migrate && npm start`
