# Stripe Setup Guide

## Stap 1: Stripe Account Aanmaken

1. Ga naar [stripe.com](https://stripe.com) → Sign up
2. Maak een account aan (of log in als je er al een hebt)
3. Kies je land (Nederland)

## Stap 2: API Keys Ophalen

### Voor Development (Test Mode):
1. Ga naar [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)
2. Kopieer de **Secret key** (begint met `sk_test_...`)
3. Zet deze in `.env` als `STRIPE_SECRET_KEY`

### Voor Production (Live Mode):
1. Schakel over naar **Live mode** (toggle rechtsboven in Stripe Dashboard)
2. Ga naar [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)
3. Kopieer de **Secret key** (begint met `sk_live_...`)
4. Zet deze in `.env` als `STRIPE_SECRET_KEY`

⚠️ **BELANGRIJK:** Gebruik test keys voor development, live keys alleen voor productie!

## Stap 3: Webhook Configureren

### Voor Development (Test Mode):

1. Ga naar [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Klik op **"Add endpoint"**
3. Vul in:
   - **Endpoint URL:** `http://localhost:3001/api/webhooks/stripe` (voor local testing)
     - Of: `https://jouw-domein.com/api/webhooks/stripe` (voor productie)
   - **Events to send:** Selecteer `checkout.session.completed`
4. Klik **"Add endpoint"**
5. Kopieer de **Signing secret** (begint met `whsec_...`)
6. Zet deze in `.env` als `STRIPE_WEBHOOK_SECRET`

### Voor Production (Live Mode):

1. Schakel over naar **Live mode**
2. Ga naar [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
3. Klik op **"Add endpoint"**
4. Vul in:
   - **Endpoint URL:** `https://www.bluediamonds.club/api/webhooks/stripe`
     - (Of je productie domain waar de API draait)
   - **Events to send:** Selecteer `checkout.session.completed`
5. Klik **"Add endpoint"**
6. Kopieer de **Signing secret** (begint met `whsec_...`)
7. Zet deze in `.env` als `STRIPE_WEBHOOK_SECRET`

## Stap 4: Environment Variables Zetten

Voeg toe aan je `.env` file:

```env
# Stripe (voor checkout)
STRIPE_SECRET_KEY="sk_test_..."  # of sk_live_... voor productie
STRIPE_WEBHOOK_SECRET="whsec_..."  # van Stripe Dashboard → Webhooks
```

## Stap 5: Testen

### Local Testing met Stripe CLI (Optioneel):

Als je lokaal wilt testen met webhooks, kun je de Stripe CLI gebruiken:

1. Installeer Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks naar je local server:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
4. Dit geeft je een nieuwe webhook signing secret (begint met `whsec_...`)
5. Gebruik deze voor `STRIPE_WEBHOOK_SECRET` tijdens local development

### Test Checkout Flow:

1. Start je server: `npm run dev` of `npm start`
2. Log in op de shop
3. Voeg producten toe aan winkelwagen
4. Ga naar checkout
5. Gebruik Stripe test card: `4242 4242 4242 4242`
   - Expiry: elke toekomstige datum (bijv. 12/34)
   - CVC: elk 3-cijferig nummer (bijv. 123)
   - ZIP: elk 5-cijferig nummer (bijv. 12345)

## Betalingsmethoden

De shop ondersteunt:
- **Credit/Debit Cards** (Visa, Mastercard, etc.)
- **iDEAL** (Nederlandse banken)

Deze worden automatisch getoond in de Stripe Checkout.

## Verificatie

Run de verificatie script om te checken of Stripe correct is geconfigureerd:

```bash
npm run init:production
```

Dit checkt:
- ✅ `STRIPE_SECRET_KEY` is gezet
- ✅ Stripe API connectie werkt
- ✅ `STRIPE_WEBHOOK_SECRET` is gezet (als geconfigureerd)

## Troubleshooting

### "Payments are not configured (missing Stripe key)"
- Check dat `STRIPE_SECRET_KEY` in `.env` staat
- Check dat de key begint met `sk_test_` of `sk_live_`
- Herstart de server na het toevoegen van de key

### "Stripe webhook not configured"
- Check dat `STRIPE_WEBHOOK_SECRET` in `.env` staat
- Check dat de secret begint met `whsec_`
- Check dat de webhook endpoint correct is ingesteld in Stripe Dashboard

### Webhook ontvangt geen events
- Check dat de webhook URL correct is (moet bereikbaar zijn vanaf internet)
- Check dat `checkout.session.completed` event is geselecteerd
- Test de webhook in Stripe Dashboard → Webhooks → Send test webhook

### "Webhook Error: No signatures found"
- Check dat de webhook secret correct is
- Check dat de server `trust proxy` heeft ingesteld (staat al in code)
- Voor local testing: gebruik Stripe CLI of test in productie

## Productie Checklist

Voor je live gaat:
- [ ] Live mode API key is gezet (`sk_live_...`)
- [ ] Webhook endpoint is ingesteld met productie URL
- [ ] Webhook secret is gezet (`whsec_...`)
- [ ] `npm run init:production` toont geen Stripe errors
- [ ] Test checkout werkt met test card
- [ ] Webhook ontvangt events (check Stripe Dashboard → Events)
