# 🗄️ Database Setup — Complete Guide

**Alles wat je nodig hebt om de PostgreSQL database klaar te zetten voor productie.**

## 📚 Documentatie Overzicht

- **`QUICK_START_PRODUCTION.md`** — 5 minuten quick start (begin hier!)
- **`DATABASE_SETUP.md`** — Uitgebreide setup guide met alle opties
- **`DEPLOYMENT.md`** — Complete deployment guide (inclusief database)

## 🚀 Snelste Weg (5 minuten)

```bash
# 1. Kies database provider (Supabase/Railway/Render)
# 2. Kopieer DATABASE_URL
# 3. Zet in .env:
DATABASE_URL="postgresql://..."

# 4. Run setup
npm run setup:production-db
```

**Klaar!** Zie `QUICK_START_PRODUCTION.md` voor stap-voor-stap instructies.

## 📋 Wat is er Allemaal Klaargezet?

### ✅ Automatische Setup Scripts

- **`npm run setup:production-db`** — Volledige database setup (generate + migrate + verify)
- **`npm run init:production`** — Verifieert alle configuratie voor productie
- **`npm run db:generate`** — Genereert Prisma Client
- **`npm run db:migrate`** — Runt database migrations
- **`npm run db:studio`** — Opent Prisma Studio (database GUI)

### ✅ Environment Variables

- **`ENV.production.example`** — Complete production .env template
- Alle variabelen zijn gedocumenteerd met voorbeelden

### ✅ Documentatie

- **`QUICK_START_PRODUCTION.md`** — Quick start guide
- **`DATABASE_SETUP.md`** — Uitgebreide setup guide
- **`DEPLOYMENT.md`** — Complete deployment guide

## 🎯 Database Providers

### Supabase (Aanbevolen — Gratis tier)
- ✅ Gratis tier beschikbaar
- ✅ Automatische backups
- ✅ Web interface
- ✅ Goede documentatie

### Railway
- ✅ Eenvoudig te gebruiken
- ✅ Goede performance
- ✅ Automatische scaling

### Render
- ✅ Gratis tier beschikbaar
- ✅ Eenvoudige setup
- ✅ Goede uptime

### Eigen PostgreSQL Server
- ✅ Volledige controle
- ✅ Geen vendor lock-in
- ⚠️ Zelf onderhouden

## 📝 Checklist

Voor je live gaat:

- [ ] Database provider gekozen en account aangemaakt
- [ ] PostgreSQL database aangemaakt
- [ ] `DATABASE_URL` gekopieerd
- [ ] `.env` file aangemaakt (van `ENV.production.example`)
- [ ] `npm run setup:production-db` succesvol gerund
- [ ] `npm run init:production` toont geen errors
- [ ] Producten geïmporteerd (optioneel)
- [ ] Database backups ingesteld (vaak automatisch bij providers)

## 🔧 Troubleshooting

### "DATABASE_URL is not set"
→ Zet `DATABASE_URL` in je `.env` file

### "Connection refused"
→ Check:
- Database provider draait
- `DATABASE_URL` is correct
- Firewall/network settings
- Credentials zijn correct

### "Migration failed"
→ Check:
- Database heeft correcte permissions
- `DATABASE_URL` wijst naar juiste database
- Run: `npm run db:migrate` opnieuw

### "Prisma Client not generated"
→ Run: `npm run db:generate`

## 📞 Support

Voor vragen:
1. Check `QUICK_START_PRODUCTION.md` voor quick start
2. Check `DATABASE_SETUP.md` voor uitgebreide info
3. Check Prisma docs: https://www.prisma.io/docs
4. Check database provider docs

## 🎉 Klaar!

Als alles werkt, zie je:
```
✨ Production database setup complete!
```

Je database is nu klaar voor productie! 🚀
