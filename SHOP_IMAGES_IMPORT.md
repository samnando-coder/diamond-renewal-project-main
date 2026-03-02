# Productfoto's importeren (exacte packshots)

De WooCommerce JSON endpoints (`/wp-json/*`) zijn momenteel geblokkeerd (403) door WAF/Cloudflare. Daardoor kunnen we **niet automatisch** alle productfoto's ophalen via de API zonder credentials.

Wat wél altijd werkt: exporteer je productcatalogus (met afbeeldings-URL's) vanuit WooCommerce en importeer die in onze database.

## 1) Export in WooCommerce

In WordPress/WooCommerce:
- Ga naar **Producten → Exporteren**
- Exporteer minimaal de kolommen:
  - **SKU**
  - **Images** / **Afbeelding** (URL)

Sla het bestand op als `product-images.csv`.

## 2) Plaats het CSV-bestand

Plaats `product-images.csv` in de **project root** (zelfde map als `package.json`).

## 3) Import draaien

Voer uit:

```bash
npm run import:product-images
```

Of met een expliciet pad:

```bash
npm run import:product-images -- --file="C:\pad\naar\product-images.csv"
```

De import zoekt automatisch naar kolommen zoals:
- SKU: `sku`, `product sku`, `artikelnr`, `id`
- Image: `images`, `image`, `image url`, `featured image`, `afbeelding`

Alleen **absolute** `http(s)` URLs worden overgenomen.

## 4) Resultaat

De shop gebruikt `Product.image` direct. Omdat we `getCloudinaryImageUrl()` nu absolute URLs ongemoeid laat, worden deze packshots meteen correct gerenderd.

## Alternatief: images verzamelen via merk-sites (zonder Woo keys)

Als je geen Woo API toegang hebt, maar wél toestemming om de packshots te gebruiken, dan is dit de meest gecontroleerde workflow:

1) Exporteer alleen de producten die nog geen image hebben:

```bash
npm run export:missing-product-images
```

Dit maakt `missing-product-images.csv` in de project root.

2) Zoek per product op de officiële merk-site (Redken/Thalion/etc.) de **exacte** productfoto.
- Gebruik bij voorkeur de URL van de productfoto (vaak staat die in `og:image` op de productpagina).
- Let op: hotlinking kan soms geblokkeerd worden; in dat geval is downloaden + eigen hosting nodig.

3) Vul de kolom `imageUrl` in en importeer:

```bash
npm run import:product-images -- --file="missing-product-images.csv"
```

