# Supabase Connection String Setup

Voor Prisma migrations heb je de **direct connection string** nodig, niet de connection pooler.

## Stap 1: Ga naar Supabase Dashboard

1. Open je Supabase project
2. Ga naar **Settings** → **Database**
3. Scroll naar **Connection string**

## Stap 2: Kies de Juiste Connection String

Je ziet verschillende opties. Voor Prisma migrations gebruik je:

**✅ GEBRUIK: "URI" mode (niet "Session mode")**

Het ziet er zo uit:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**❌ NIET GEBRUIKEN:**
- Connection pooler (port 6543)
- Session mode
- Transaction mode

## Stap 3: Kopieer naar .env

Zet deze connection string in je `.env` file:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Belangrijk:** Vervang `[YOUR-PASSWORD]` met je echte database password (niet je Supabase account password).

## Stap 4: Test

```bash
npm run setup:production-db
```

## Troubleshooting

### "Can't reach database server"
- Check dat je de **direct connection** gebruikt (port 5432, niet 6543)
- Check dat je database password correct is
- Check dat je firewall/network de connectie toestaat

### "prepared statement already exists"
- Dit betekent dat je de connection pooler gebruikt
- Gebruik de direct connection string (zie boven)

### Waar vind ik mijn database password?
- Supabase Dashboard → Settings → Database → Database password
- Of reset het als je het niet meer weet
