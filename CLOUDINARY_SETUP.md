# Cloudinary Setup

## Stap 1: Upload images naar Cloudinary

Upload alle images uit de "Blue Diamonds Foto's" folder naar Cloudinary in de folder "blue diamonds".

**Belangrijk:** Upload zonder random suffix, gebruik de originele bestandsnaam:
- `IMG_5438.jpg` → `blue diamonds/IMG_5438`
- `IMG_5392.jpg` → `blue diamonds/IMG_5392`

## Stap 2: Genereer mapping

Run het script om de mapping te genereren:

```bash
npm run generate:cloudinary-mapping
```

Dit genereert `blue-diamonds-mapping.json` met alle mappings.

## Stap 3: Code gebruikt automatisch Cloudinary

De code gebruikt automatisch Cloudinary URLs als de mapping file bestaat, anders valt het terug op lokale images.

## Helper functies

```typescript
import { cld, getImageUrl } from '@/lib/cloudinary';

// Direct Cloudinary URL
const url = cld("blue diamonds/IMG_5438");

// Met fallback naar lokaal
const url = getImageUrl("/Blue Diamonds Foto's/IMG_5438.jpg", mapping);
```
