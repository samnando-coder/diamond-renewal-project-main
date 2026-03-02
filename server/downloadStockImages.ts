import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

type StockItem = {
  key: string;
  pexelsPageUrl: string;
  outFileBase: string; // without extension
};

const OUT_DIR = path.join(process.cwd(), 'public', 'stock', 'pexels');

const ITEMS: StockItem[] = [
  // Treatments
  {
    key: 'treatment_makeup_hairstyling',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-make-up-artist-applying-make-up-to-the-client-8092582/',
    outFileBase: 'treatment-makeup-haarstyling',
  },
  {
    key: 'treatment_hair_styling',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-person-getting-a-blow-dry-at-a-hair-salon-7755518/',
    outFileBase: 'treatment-haar',
  },
  {
    key: 'treatment_relaxation_massage',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-therapist-massaging-client-s-back-11982069/',
    outFileBase: 'treatment-massage-relax',
  },
  {
    key: 'treatment_facial_basic',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-woman-getting-a-facial-treatment-on-a-bed-15764071/',
    outFileBase: 'treatment-facial',
  },
  {
    key: 'treatment_led_mask',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-beautician-putting-an-led-face-mask-on-a-woman-7216286/',
    outFileBase: 'treatment-led',
  },
  {
    key: 'treatment_pmu_brows',
    pexelsPageUrl: 'https://www.pexels.com/photo/close-up-of-beautician-doing-permanent-brow-tattoo-8826403/',
    outFileBase: 'treatment-pmu',
  },
  {
    key: 'treatment_lashes',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-young-woman-having-eyelash-extensions-7446922/',
    outFileBase: 'treatment-wimpers',
  },
  {
    key: 'treatment_manicure',
    pexelsPageUrl: 'https://www.pexels.com/photo/close-up-of-woman-manicure-18730147/',
    outFileBase: 'treatment-handen',
  },
  {
    key: 'treatment_pedicure',
    pexelsPageUrl: 'https://www.pexels.com/photo/pedicure-in-spa-5619449/',
    outFileBase: 'treatment-voeten',
  },
  {
    key: 'treatment_waxing',
    pexelsPageUrl: 'https://www.pexels.com/photo/close-up-of-waxing-procedure-in-salon-35103884/',
    outFileBase: 'treatment-waxen',
  },
  {
    key: 'treatment_laser_epilation',
    pexelsPageUrl:
      'https://www.pexels.com/photo/laser-hair-removal-in-the-beauty-salon-woman-having-professional-laser-epilation-procedure-of-arm-19239092/',
    outFileBase: 'treatment-permanente-ontharing',
  },
  {
    key: 'treatment_teeth_whitening',
    pexelsPageUrl: 'https://www.pexels.com/photo/dentist-whitening-mans-teeth-5622271/',
    outFileBase: 'treatment-tanden-bleken',
  },
  {
    key: 'treatment_physio',
    pexelsPageUrl: 'https://www.pexels.com/photo/physiotherapist-and-patient-exercising-20860619/',
    outFileBase: 'treatment-fysio',
  },
  {
    key: 'treatment_magnesium_foot_soak',
    pexelsPageUrl: 'https://www.pexels.com/photo/man-soaking-feet-in-spa-19695948/',
    outFileBase: 'treatment-magnesium',
  },

  // Arrangements
  {
    key: 'arr_japanese_retreat',
    pexelsPageUrl: 'https://www.pexels.com/photo/woman-lying-on-bed-having-facial-13899842/',
    outFileBase: 'arr-japanese-retreat',
  },
  {
    key: 'arr_beauty_weekend',
    pexelsPageUrl: 'https://www.pexels.com/photo/woman-wrapped-in-a-towel-sitting-on-a-bed-in-a-hotel-room-16172628/',
    outFileBase: 'arr-beauty-weekend',
  },
  {
    key: 'arr_energy_boost',
    pexelsPageUrl: 'https://www.pexels.com/photo/healthy-smoothie-bowl-with-berries-and-nuts-34562844/',
    outFileBase: 'arr-energy-boost',
  },
  {
    key: 'arr_private_party',
    pexelsPageUrl: 'https://www.pexels.com/photo/people-having-a-toast-3851240/',
    outFileBase: 'arr-private-party',
  },
  {
    key: 'arr_slimming',
    pexelsPageUrl: 'https://www.pexels.com/photo/hands-of-a-masseur-wrapping-a-leg-18127464/',
    outFileBase: 'arr-slimming',
  },
  {
    key: 'arr_mind_body',
    pexelsPageUrl: 'https://www.pexels.com/photo/photo-of-women-doing-yoga-8436768/',
    outFileBase: 'arr-mind-body',
  },
  {
    key: 'arr_before_holiday',
    pexelsPageUrl: 'https://www.pexels.com/photo/close-up-of-woman-with-manicured-nails-on-a-sunny-beach-35251446/',
    outFileBase: 'arr-before-holiday',
  },
  {
    key: 'arr_callas',
    pexelsPageUrl: 'https://www.pexels.com/photo/woman-doing-facial-mask-3212179/',
    outFileBase: 'arr-callas',
  },

  // Urban Wellness
  {
    key: 'uw_sauna',
    pexelsPageUrl: 'https://www.pexels.com/photo/modern-sauna-with-stone-heater-and-steam-32504788/',
    outFileBase: 'uw-sauna',
  },
  {
    key: 'uw_sound_bath',
    pexelsPageUrl: 'https://www.pexels.com/photo/people-in-a-sound-bath-6252162/',
    outFileBase: 'uw-sound',
  },
  {
    key: 'uw_sand_bed',
    pexelsPageUrl: 'https://www.pexels.com/photo/a-woman-wrapped-around-with-towel-relaxing-on-the-bed-5313639/',
    outFileBase: 'uw-sand-bed',
  },
];

function decodeHtmlEntities(input: string): string {
  let s = input;
  s = s.replace(/&#(\d+);/g, (_m, dec) => {
    const code = Number.parseInt(dec, 10);
    if (!Number.isFinite(code)) return _m;
    try {
      return String.fromCodePoint(code);
    } catch {
      return _m;
    }
  });
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
    const code = Number.parseInt(hex, 16);
    if (!Number.isFinite(code)) return _m;
    try {
      return String.fromCodePoint(code);
    } catch {
      return _m;
    }
  });
  s = s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return s;
}

function pexelsIdFromUrl(pageUrl: string): string {
  // Pexels photo pages end with "...-<id>/".
  const m = /-(\d+)\/?$/.exec(pageUrl.trim());
  if (!m?.[1]) throw new Error(`Could not extract Pexels id from: ${pageUrl}`);
  return m[1];
}

function pexelsCdnUrlFromId(id: string): string {
  // This URL pattern is stable and does not require fetching the Pexels HTML page (which can 403).
  // We request a sane max width so these don't become huge.
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
}

function extFromContentType(contentType: string | null): string {
  const ct = (contentType ?? '').toLowerCase();
  if (ct.includes('image/webp')) return '.webp';
  if (ct.includes('image/png')) return '.png';
  if (ct.includes('image/jpeg') || ct.includes('image/jpg')) return '.jpg';
  // default
  return '.jpg';
}

async function downloadToFile(url: string, outPath: string) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BlueDiamondsImporter/1.0)',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      Referer: 'https://www.pexels.com/',
    },
  });
  if (!res.ok) throw new Error(`Failed to download image (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const item of ITEMS) {
    // eslint-disable-next-line no-console
    console.log(`[stock] ${item.key}`);
    const id = pexelsIdFromUrl(item.pexelsPageUrl);
    const cdnUrl = pexelsCdnUrlFromId(id);

    const head = await fetch(cdnUrl, { method: 'HEAD' }).catch(() => null);
    const ext = extFromContentType(head?.headers?.get('content-type') ?? null);
    const outPath = path.join(OUT_DIR, `${item.outFileBase}${ext}`);

    if (fs.existsSync(outPath)) {
      // eslint-disable-next-line no-console
      console.log(`  - exists: ${path.relative(process.cwd(), outPath)}`);
      continue;
    }

    // eslint-disable-next-line no-console
    console.log(`  - downloading -> ${path.relative(process.cwd(), outPath)}`);
    await downloadToFile(cdnUrl, outPath);
  }

  // eslint-disable-next-line no-console
  console.log('[stock] done');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

