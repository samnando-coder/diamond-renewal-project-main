# Product Packshot Downloader

Bulk downloader voor product packshot afbeeldingen direct van officiële brand websites.

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Geen API key nodig!

De tool scrapet direct van de officiële websites:
- **Redken**: https://www.redken.eu/nl-nl
- **Thalion**: https://www.thalion.com/en/

## Usage

### Basic usage

```bash
python main.py
```

Dit gebruikt:
- Input: `SHOP_PRODUCTEN_LIJST.md` (in repo root)
- Output: `output/` directory
- 3 images per product
- Minimum 1200px dimension

### Custom options

```bash
python main.py \
  --input SHOP_PRODUCTEN_LIJST.md \
  --outdir output \
  --per-product 3 \
  --min-dim 1200 \
  --concurrency 3
```

### Dry run (test zonder downloads)

```bash
python main.py --dry-run
```

## Output Structure

```
output/
├── Redken/
│   ├── Extreme/
│   │   └── redken-extreme-conditioner-300-ml/
│   │       ├── 1.jpg
│   │       ├── 2.jpg
│   │       └── 3.jpg
│   └── Blondage/
│       └── ...
├── Thalion/
│   ├── ThaliSens/
│   ├── TVS/
│   └── ...
├── results.csv
└── failed.txt
```

## Output Files

- **results.csv**: Metadata van alle gedownloade afbeeldingen
  - product, brand, line, query, image_url, local_path, width, height, file_size, sha256, has_white_background

- **failed.txt**: Producten waar geen geschikte afbeeldingen gevonden zijn

## Features

- ✅ Automatische merk- en lijn-detectie
- ✅ Meerdere search queries per product (fallbacks)
- ✅ Filtering op minimum resolutie
- ✅ White background detection
- ✅ Deduplicatie op basis van SHA256 hash
- ✅ Rate limiting (5 requests/sec)
- ✅ Concurrent downloads (3 tegelijk)
- ✅ Progress tracking met tqdm

## Rate Limits

- Bing API: Max 5 requests per seconde
- Downloads: Max 3 concurrent downloads
- Automatische retry met exponential backoff

## Troubleshooting

### "No search results found"
→ De website structuur kan veranderd zijn. Check of de websites bereikbaar zijn:
   - https://www.redken.eu/nl-nl
   - https://www.thalion.com/en/

### "Download timeout"
→ Verhoog `--concurrency` niet te veel. 3 is een goede balans. Sommige websites kunnen rate limiting hebben.

### "Download timeout"
→ Verhoog `--concurrency` niet te veel. 3 is een goede balans.

## License

Respecteer de usage rights van gedownloade afbeeldingen. Check de licentie van elke afbeelding voordat je ze commercieel gebruikt.
