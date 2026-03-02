/**
 * Salonized widget supports preselecting services via `services[]` query params.
 * The IDs below are "variation" IDs from:
 * `https://api.salonized.com/widget_api/locations/<locationId>/service_variation_groups`
 */
export const SALONIZED_SERVICES_BY_TREATMENT_SLUG: Partial<Record<string, number[]>> = {
  // Core categories
  'gezichtsbehandelingen': [1291439], // Facial Diamonds Treatment
  'massage-stijlen': [1303780], // Relaxation Massages (variation)
  'massage-relaxation': [1303780],
  'massage-recovery': [1303780],
  'massage-sportmassage': [1303780],
  'massage-shaping-contouring': [1303780],
  'massage-speciale': [1303780],
  'massage-gezichtsmassage': [1303780],
  'massage-nek-schouder-rug': [1303780],
  'massage-hand-voet': [1303780],
  'massage-duo': [1303780],
  'handen': [1291376], // Manicure (variation)
  'voeten': [1569155], // Pedicure (variation)
  'waxen': [1427477], // Waxen - Gezicht (variation)
  'wenkbrauwen-wimpers': [1296054], // Lashlifting (variation)
  'permanent-make-up': [1458118], // Powder Brows (variation)
  'magnesium-energie-boost': [1305863], // Magnesium Experience Light (variation)
  'urban-wellness': [1395431], // Welnamis Stress Relief (variation)
  'lichaam': [1291493], // Colombian Buttlift (variation)

  // Hair routes
  'haar': [2311165], // Dames knippen (variation)
  'knippen-stijlen': [2311165], // Dames knippen (variation) - used for Knippen & Stijlen subpage
  'kleuren': [2311165], // Hair booking entry point (variation) - used for Kleuren subpage
  'highlights': [2311165], // Hair booking entry point (variation) - used for Highlights subpage
  'balayage': [2311165], // Hair booking entry point (variation) - used for Balayage subpage
  'herstel': [2311165], // Hair booking entry point (variation) - used for Herstel subpage
  'keratine': [2311165], // Hair booking entry point (variation) - used for Keratine subpage
  'make-up-haarstyling': [1427774], // Haarstyling (variation)

  // LED pages
  'led-lichttherapie': [1880518], // Rood LED-lichttherapie (variation)
};

