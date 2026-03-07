# Database Configuratie

## ✅ De webshop gebruikt dezelfde database als de hoofdsite

De webshop is geconfigureerd om dezelfde PostgreSQL database te gebruiken als de hoofdsite. Dit betekent:

- ✅ **Geen nieuwe database nodig** - Gebruik gewoon dezelfde `DATABASE_URL`
- ✅ **Gedeelde gebruikers** - Login accounts werken op beide sites
- ✅ **Gedeelde producten** - Producten zijn beschikbaar op beide sites
- ✅ **Gedeelde orders** - Orders worden opgeslagen in dezelfde database

## Configuratie

De webshop gebruikt dezelfde Prisma schema models:
- `User` - Gebruikers accounts
- `Session` - Login sessies
- `Product` - Producten
- `Order` - Bestellingen
- `NewsletterSubscriber` - Nieuwsbrief abonnees

## Environment Variable

Gebruik dezelfde `DATABASE_URL` in je `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

De webshop zal automatisch dezelfde database gebruiken als de hoofdsite.

## Migraties

Als je de webshop apart deployt, zorg ervoor dat:
1. Dezelfde `DATABASE_URL` wordt gebruikt
2. Database migraties zijn al uitgevoerd (via de hoofdsite)
3. Of run `npm run db:migrate` in de webshop folder (gebruikt dezelfde database)

**Let op:** De webshop gebruikt dezelfde Prisma schema, dus migraties hoeven niet opnieuw uitgevoerd te worden als de hoofdsite al gemigreerd is.
