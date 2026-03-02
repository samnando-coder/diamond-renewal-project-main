# Migration Fix — Supabase Connection Pooler Issue

## Probleem

Je krijgt deze error bij migrations:
```
Error: P1002
The database server was reached but timed out.
Timed out trying to acquire a postgres advisory lock
```

**Oorzaak:** Supabase connection poolers ondersteunen geen advisory locks die Prisma nodig heeft voor migrations.

## Oplossing 1: Direct Connection String (Aanbevolen)

### Stap 1: Haal Direct Connection String op

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project
3. Ga naar **Settings** → **Database**
4. Scroll naar **Connection string**
5. Kies **"URI"** mode (NIET Session of Transaction mode)
6. Kopieer de connection string

Het ziet er zo uit:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Stap 2: Update .env

Zet deze connection string in je `.env` file:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Belangrijk:** Vervang `[YOUR-PASSWORD]` met je database password (niet je Supabase account password).

### Stap 3: Run Migrations

```bash
npm run setup:production-db
```

## Oplossing 2: Run Migrations op Fly.io

Als de direct connection niet werkt (bijv. netwerk blokkade), run migrations op Fly.io:

### Stap 1: Zet DATABASE_URL als secret

```bash
fly secrets set DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Stap 2: Deploy app

```bash
fly deploy
```

### Stap 3: Run migrations in Fly machine

```bash
fly ssh console -C "cd /app && npm run db:migrate"
```

### Stap 4: Verifieer

```bash
fly ssh console -C "cd /app && npm run init:production"
```

## Waarom werkt de pooler niet?

- **Connection pooler (port 6543)**: Ondersteunt geen advisory locks
- **Session pooler (port 5432)**: Kan soms werken, maar niet altijd betrouwbaar
- **Direct connection (port 5432)**: Werkt altijd voor migrations

## Troubleshooting

### "Can't reach database server"

- Check dat je de **direct connection** gebruikt (niet pooler)
- Check dat je database password correct is
- Test connectie: `Test-NetConnection db.[PROJECT].supabase.co -Port 5432`

### "Name resolution failed"

- DNS probleem - probeer andere DNS (1.1.1.1 of 8.8.8.8)
- Of gebruik Fly.io workaround

### "Still getting advisory lock error"

- Zorg dat je NIET de pooler gebruikt
- Check dat je connection string eindigt op `:5432/postgres` (niet `:6543`)
