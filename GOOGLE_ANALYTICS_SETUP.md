# Google Analytics Setup - G-VGB25BKEWX

## ✅ Wat is er geïmplementeerd:

### 1. Google Analytics 4 (GA4) Integration
- ✅ Measurement ID: `G-VGB25BKEWX`
- ✅ Automatische initialisatie bij app start
- ✅ Page view tracking op alle routes (React Router integratie)

### 2. E-commerce Tracking
- ✅ **Add to Cart** - Wanneer klanten producten toevoegen aan winkelwagen
- ✅ **Begin Checkout** - Wanneer klanten naar checkout pagina gaan
- ✅ **Purchase** - Wanneer een bestelling succesvol is afgerond
- ✅ **View Item** - Wanneer klanten een product pagina bekijken

### 3. Automatische Tracking
- ✅ Alle pagina's worden automatisch getrackt
- ✅ Route changes worden automatisch geregistreerd
- ✅ Werkt op alle pagina's door de hele website

---

## 📊 Wat wordt er getrackt:

### Page Views
- Elke pagina wordt automatisch getrackt
- Route changes (bijv. `/shop` → `/shop/cart`) worden geregistreerd
- Page titles worden meegestuurd

### E-commerce Events

#### 1. Add to Cart
```javascript
// Automatisch wanneer product wordt toegevoegd
{
  event: 'add_to_cart',
  currency: 'EUR',
  value: price * quantity,
  items: [{ item_id, item_name, price, quantity }]
}
```

#### 2. Begin Checkout
```javascript
// Automatisch wanneer checkout pagina wordt geladen
{
  event: 'begin_checkout',
  currency: 'EUR',
  value: totalWithShipping,
  items: [...]
}
```

#### 3. Purchase
```javascript
// Automatisch op checkout success pagina
{
  event: 'purchase',
  transaction_id: orderId,
  value: totalCents,
  currency: 'EUR',
  items: [...]
}
```

#### 4. View Item
```javascript
// Automatisch wanneer product pagina wordt bekeken
{
  event: 'view_item',
  currency: 'EUR',
  value: productPrice,
  items: [{ item_id, item_name, item_brand, price, quantity }]
}
```

---

## 🔍 Waar kun je de data zien:

1. **Ga naar Google Analytics:**
   - [analytics.google.com](https://analytics.google.com)
   - Selecteer je property met ID `G-VGB25BKEWX`

2. **Bekijk Reports:**
   - **Realtime** → Zie live bezoekers
   - **Reports** → **Engagement** → **Events** → Zie alle events
   - **Reports** → **Monetization** → **E-commerce purchases** → Zie bestellingen

3. **E-commerce Data:**
   - **Reports** → **Monetization** → **E-commerce overview**
   - Zie: Revenue, Transactions, Average order value, etc.

---

## 🧪 Testen:

### 1. Test Page Views:
1. Open je website
2. Ga naar Google Analytics → Realtime
3. Navigeer door je site
4. Je zou jezelf moeten zien in Realtime reports

### 2. Test E-commerce:
1. Voeg een product toe aan winkelwagen
2. Ga naar checkout
3. Voltooi een test bestelling
4. Check Google Analytics → Events → `add_to_cart`, `begin_checkout`, `purchase`

### 3. Debug Mode (Development):
Open browser console en type:
```javascript
// Check of GA geladen is
console.log(window.gtag);
console.log(window.dataLayer);

// Test een event handmatig
window.gtag('event', 'test_event', { test: true });
```

---

## 📁 Bestanden:

- **`src/lib/analytics.ts`** - Analytics library met alle tracking functies
- **`src/components/analytics/GoogleAnalytics.tsx`** - React component die GA initialiseert en page views trackt
- **`src/App.tsx`** - GoogleAnalytics component is toegevoegd
- **`src/features/shop/cart.tsx`** - Add to cart tracking
- **`src/pages/shop/ShopCheckout.tsx`** - Begin checkout tracking
- **`src/pages/shop/ShopCheckoutSuccess.tsx`** - Purchase tracking
- **`src/pages/shop/ShopProduct.tsx`** - View item tracking

---

## ✅ Checklist:

- [x] Google Analytics script geladen
- [x] Measurement ID geconfigureerd (`G-VGB25BKEWX`)
- [x] Page view tracking werkt
- [x] Add to cart tracking werkt
- [x] Begin checkout tracking werkt
- [x] Purchase tracking werkt
- [x] View item tracking werkt
- [x] Werkt op alle pagina's

---

## 🚀 Status:

**Google Analytics is volledig geïmplementeerd en actief!**

Je kunt nu:
- ✅ Live bezoekers zien in Google Analytics
- ✅ Page views bekijken per pagina
- ✅ E-commerce events zien (add to cart, checkout, purchases)
- ✅ Revenue en conversie data analyseren

**Data verschijnt binnen enkele minuten in Google Analytics!**

---

## 💡 Tips:

1. **Realtime Data:** Gebruik Realtime reports om direct te zien of tracking werkt
2. **Debug Mode:** Gebruik browser console om te checken of `window.gtag` bestaat
3. **Data Delay:** Normale reports hebben een 24-48 uur delay, Realtime is direct
4. **E-commerce Reports:** Check "Monetization" sectie voor shop-specifieke data

---

## 🆘 Troubleshooting:

### "Geen data in Google Analytics"
- Check of Measurement ID correct is (`G-VGB25BKEWX`)
- Check browser console voor errors
- Check of `window.gtag` bestaat: `console.log(window.gtag)`
- Wacht 24-48 uur voor normale reports (Realtime is direct)

### "Events worden niet getrackt"
- Check browser console voor errors
- Check of GA geladen is: `console.log(window.dataLayer)`
- Test handmatig: `window.gtag('event', 'test', { test: true })`

### "Page views werken niet"
- Check of GoogleAnalytics component in App.tsx staat
- Check React Router werkt correct
- Check browser console voor errors

---

## 📚 Meer Info:

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
