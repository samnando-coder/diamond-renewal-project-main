# Packshot URL Collector

Betrouwbare crawler voor het verzamelen van productfoto (packshot) URLs van Thalion en Redken websites.

## 🎯 Doel

Automatisch packshot URLs verzamelen voor producten uit `SHOP_PRODUCTEN_LIJST.md` door:
1. Category pages te scrapen (Thalion face/body, Redken products)
2. Product pagina's te bezoeken en de beste afbeelding te vinden
3. Producten te matchen met fuzzy matching
4. Resultaten te exporteren naar CSV

## 📋 Vereisten

- Python 3.8 of hoger
- Windows (getest op Windows 10/11)
- Internet verbinding

## 🚀 Installatie (Windows)

### Stap 1: Installeer Python dependencies

```powershell
py -m pip install -r requirements.txt
```

### Stap 2: Installeer Playwright browser

```powershell
py -m playwright install chromium
```

Dit downloadt Chromium browser die nodig is voor web scraping.

## 💻 Gebruik

### Basis gebruik

```powershell
py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --out output/packshots.csv
```

### Opties

```powershell
# Alleen Thalion producten crawlen
py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --brand thalion

# Alleen Redken producten crawlen
py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --brand redken

# Browser in zichtbare modus (voor debugging)
py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --headful

# Beperk tot eerste 20 producten (voor testen)
py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --limit 20

# Pas minimum match score aan (standaard: 80)
py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --min-score 75
```

### Volledige CLI opties

```
--input PATH          Input markdown bestand (default: SHOP_PRODUCTEN_LIJST.md)
--out PATH            Output CSV bestand (default: output/packshots.csv)
--headful             Browser in zichtbare modus (voor debugging)
--limit N             Beperk aantal producten (voor testen)
--brand BRAND         Brand om te crawlen: thalion, redken, of all (default: all)
--min-score N         Minimum fuzzy match score 0-100 (default: 80)
```

## 📊 Output

De crawler genereert drie bestanden:

### 1. `output/packshots.csv`

Hoofdoutput met alle resultaten:
- `product_name`: Originele productnaam
- `brand`: Merk (Redken/Thalion)
- `normalized_name`: Genormaliseerde naam voor matching
- `size_ml`: Grootte in ml (indien gevonden)
- `product_page_url`: URL van productpagina
- `image_url`: URL van beste packshot afbeelding
- `image_source`: Bron van afbeelding (og:image, srcset, img_tag, etc.)
- `status`: Status (found, not_found, no_image, error)
- `notes`: Extra notities (match score, etc.)

### 2. `output/not_found.csv`

Producten die niet gevonden zijn (status: not_found)

### 3. `output/debug.log`

Gedetailleerde logging van alle acties, errors en warnings

## 🔧 Hoe het werkt

### 1. Input parsing

Leest `SHOP_PRODUCTEN_LIJST.md` en extraheert productnamen:
- Herkent genummerde lijsten (1. Product Name)
- Detecteert merk (Redken/Thalion) uit naam
- Normaliseert namen voor matching
- Extraheert grootte (ml) uit productnaam

### 2. Category scraping

**Thalion:**
- Scrapet `https://www.thalion.com/en/face/`
- Scrapet `https://www.thalion.com/en/body/`
- Verzamelt productkaartjes met naam + URL

**Redken:**
- Scrapet `https://www.redken.eu/nl-nl/products`
- Wacht op JavaScript rendering
- Scrollt om alle producten te laden
- Verzamelt product items + URLs

### 3. Image extraction

Voor elke productpagina:
1. **Priority 1:** `<meta property="og:image">` tag
2. **Priority 2:** `<img>` met grootste `srcset` (filter thumbnails < 400px)
3. **Priority 3:** Reguliere `<img src>` met product-achtige URL
4. **Fallback:** Zoek naar image URL patronen in HTML

Kiest altijd de hoogste resolutie uit `srcset` (parse "w" of "x" descriptors).

### 4. Fuzzy matching

- Normaliseert productnamen (lowercase, verwijder accents, streepjes, etc.)
- Gebruikt RapidFuzz voor fuzzy matching
- Bonus voor size match
- Minimum threshold: 80/100 (aanpasbaar met `--min-score`)

### 5. Rate limiting & retries

- **Rate limit:** 1.5 seconden tussen requests
- **Timeout:** 20 seconden per pagina
- **Retries:** 3 pogingen met exponential backoff
- **Defensive:** Logt HTML snippets bij selector failures

## 🐛 Troubleshooting

### "No products found on category page"

- Check `output/debug.log` voor HTML snippets
- Website structuur kan veranderd zijn
- Probeer `--headful` om te zien wat er gebeurt
- Check of website toegankelijk is

### "Match score too low"

- Verlaag `--min-score` (bijv. 75)
- Check of productnaam correct is in input file
- Sommige producten hebben verschillende namen op website

### "Page load failed"

- Check internet verbinding
- Website kan tijdelijk down zijn
- Probeer opnieuw (retries worden automatisch gedaan)
- Check `output/debug.log` voor specifieke errors

### Playwright errors

```powershell
# Herinstalleer Playwright browser
py -m playwright install chromium --force
```

## 📝 Voorbeeld output

```csv
product_name,brand,normalized_name,size_ml,product_page_url,image_url,image_source,status,notes
Redken Extreme Conditioner – 300 ml,Redken,extreme conditioner,300,https://www.redken.eu/...,https://cdn.redken.eu/.../product.jpg,og:image,found,Match score: 95
Thalion Velvet Feet Cream 75ml,Thalion,velvet feet cream,75,https://www.thalion.com/...,https://www.thalion.com/.../packshot.jpg,srcset,found,Match score: 88
```

## 🔒 Privacy & Ethiek

- Respecteert `robots.txt` (indien mogelijk)
- Rate limiting om server load te beperken
- Gebruikt realistische user agent
- Geen externe API keys nodig

## 📚 Technische details

- **Playwright sync API** (geen async/await)
- **BeautifulSoup4** voor HTML parsing
- **RapidFuzz** voor fuzzy string matching
- **Pandas** voor data handling (indien nodig)
- **Defensive coding:** Logt HTML bij failures voor debugging

## 🆘 Support

Bij problemen:
1. Check `output/debug.log` voor details
2. Probeer `--headful` om browser te zien
3. Test met `--limit 5` om snel te debuggen
4. Check of websites toegankelijk zijn in browser

## 📄 Licentie

Zelfde licentie als hoofdproject.
