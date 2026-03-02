import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://bluediamonds.club';

function readJson(p) {
  const buf = fs.readFileSync(p);
  // Detect UTF-16LE (common when PowerShell redirects output).
  const isUtf16Le =
    buf.length >= 2 &&
    ((buf[0] === 0xff && buf[1] === 0xfe) || (buf[0] !== 0 && buf[1] === 0 && buf[2] !== 0 && buf[3] === 0));

  const str = isUtf16Le ? buf.toString('utf16le') : buf.toString('utf8');
  return JSON.parse(str.replace(/^\uFEFF/, ''));
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.protocol = 'https:';
    url.hash = '';
    url.search = '';
    return url.toString();
  } catch {
    return null;
  }
}

function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, n) => String.fromCodePoint(parseInt(n, 16)));
}

function extractMainHtml(html) {
  // Many pages are built with Elementor and don't use <main> or entry-content consistently.
  // We try a few heuristics and then slice until footer to avoid nav/login noise.

  const bodyStart = html.search(/<body[^>]*>/i);
  const body = bodyStart >= 0 ? html.slice(bodyStart) : html;

  // Try native <main>
  const main = body.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (main?.[1]) return main[1];

  // Elementor post content container
  const wpPostIdx = body.indexOf('data-elementor-type="wp-post"');
  if (wpPostIdx >= 0) {
    const start = Math.max(0, body.lastIndexOf('<div', wpPostIdx));
    const footerIdx =
      body.indexOf('elementor-location-footer', wpPostIdx) >= 0
        ? body.indexOf('elementor-location-footer', wpPostIdx)
        : body.search(/<footer[\s>]/i);
    const end = footerIdx > 0 ? footerIdx : body.search(/<\/body>/i);
    return body.slice(start, end > 0 ? end : undefined);
  }

  // Common WP patterns: entry-content / site-main (best-effort)
  const entryIdx = body.search(/class="[^"]*(entry-content|site-main)[^"]*"/i);
  if (entryIdx >= 0) {
    const start = Math.max(0, body.lastIndexOf('<div', entryIdx));
    const end = body.search(/<footer[\s>]/i);
    return body.slice(start, end > 0 ? end : undefined);
  }

  // Fallback: body only
  return body;
}

function stripSeoSuffix(title) {
  if (!title) return title;
  return title
    .replace(/\s*\|\s*Blue Diamonds.*$/i, '')
    .replace(/\s*-\s*Blue Diamonds.*$/i, '')
    .trim();
}

function htmlToText(html) {
  let s = html;
  // remove script/style
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  // normalize breaks
  s = s.replace(/<br\s*\/?>/gi, '\n');
  // headings start markers (preserve level for parsing)
  s = s
    .replace(/<h1[^>]*>/gi, '\n# ')
    .replace(/<h2[^>]*>/gi, '\n## ')
    .replace(/<h3[^>]*>/gi, '\n### ')
    .replace(/<h4[^>]*>/gi, '\n#### ')
    .replace(/<h5[^>]*>/gi, '\n##### ')
    .replace(/<h6[^>]*>/gi, '\n###### ');
  // make block ends produce newlines
  s = s.replace(/<\/(p|div|section|article|header|footer|main|ul|ol|li|h1|h2|h3|h4|h5|h6|table|tr)>/gi, '\n');
  // list item start marker
  s = s.replace(/<li[^>]*>/gi, '- ');
  // drop all other tags
  s = s.replace(/<[^>]+>/g, '');
  // decode entities
  s = decodeEntities(s);
  // collapse whitespace
  s = s.replace(/\r/g, '');
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

function sliceContent(text) {
  const lines = text.split('\n');
  const isContentHeading = (l) =>
    /^#{2,6}\s+\S/.test(l) &&
    !/^#{2,6}\s+(menu|locatie|openingstijden)$/i.test(l) &&
    !/^#{2,6}\s+behandelingen$/i.test(l);

  let start = lines.findIndex((l) => isContentHeading(l.trim()));
  if (start < 0) start = 0;

  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^#####\s+menu$/i.test(l)) {
      end = i;
      break;
    }
    if (/^copyright/i.test(l)) {
      end = i;
      break;
    }
  }

  return lines.slice(start, end).join('\n').trim();
}

function extractTitleAndBody(contentText) {
  const lines = contentText.split('\n').map((l) => l.trim());
  const first = lines.find((l) => /^#{2,6}\s+\S/.test(l)) ?? '';
  const title = stripSeoSuffix(first.replace(/^#{2,6}\s+/, '').trim());
  const bodyLines = (() => {
    const idx = lines.indexOf(first);
    return idx >= 0 ? lines.slice(idx + 1) : lines;
  })();
  return { title, bodyLines };
}

function labelForSlug(slug) {
  const s = slug.toLowerCase();
  if (/(fysio|podopost|magnesium|massage)/.test(s)) return 'health';
  if (/(wax|tanden|haar|make-up|pmu|permanent|wimpers|wenkbrauwen|balayage|kleuren|highlights|knippen|keratine)/.test(s))
    return 'beauty';
  if (/led/.test(s)) return 'health & beauty';
  return 'beauty & health';
}

function slugFromUrl(url) {
  const u = new URL(url);
  const parts = u.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

function titleFromText(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  // Try first heading-ish line: often the first non-empty line after menu noise.
  // Find a line that is not too long and doesn't look like nav.
  const bad = /^(home|behandelingen|arrangement|webshop|urbanwellness|contact|login|registeren|winkelwagen)$/i;
  for (const l of lines.slice(0, 80)) {
    if (bad.test(l)) continue;
    if (l.startsWith('- ')) continue;
    if (l.length < 2) continue;
    if (l.length > 80) continue;
    // Prefer Title Case-ish lines
    return stripSeoSuffix(l.replace(/^#+\s*/, '').trim());
  }
  return stripSeoSuffix((lines[0] ?? '').replace(/^#+\s*/, '').trim());
}

function extractQuote(text) {
  // Heuristic: looks like Blue Diamonds quote line.
  const m = text.match(/Blue Diamonds Health\s*&?\s*Beauty Club:[\s\S]{0,240}?”/i);
  if (m) return m[0].trim();
  return undefined;
}

function extractPricingFromBodyLines(bodyLines) {
  const sections = [];
  let current = null;

  let pendingName = null;
  let pendingPrice = null;
  let pendingDuration = null;

  const flush = () => {
    if (!current || !pendingName || !pendingPrice) return;
    current.items.push({
      name: pendingName,
      price: pendingPrice,
      duration: pendingDuration ?? undefined,
    });
    pendingName = null;
    pendingPrice = null;
    pendingDuration = null;
  };

  for (const raw of bodyLines) {
    const l = raw.replace(/\s+/g, ' ').trim();
    if (!l) continue;
    if (/^#{2,6}\s+maak direct een afspraak$/i.test(l)) break;

    // Section heading
    if (l.startsWith('###### ') || l.startsWith('##### ') || l.startsWith('#### ')) {
      flush();
      const title = l.replace(/^#{3,6}\s+/, '').trim();
      current = { title, items: [] };
      sections.push(current);
      continue;
    }

    // Bullet separators often appear as lone "-"
    if (l === '-' || l === '—') continue;

    // Price line
    if (/^€\s*[\d.,]+$/i.test(l)) {
      pendingPrice = l.replace(/\s+/g, ' ').trim();
      continue;
    }

    // Duration line
    if (/^\d+\s*(?:-\s*\d+)?\s*minuten\b/i.test(l)) {
      pendingDuration = l.replace(/\s+—\s*$/, '').trim();
      // if we already have name+price, flush
      if (pendingName && pendingPrice) flush();
      continue;
    }

    // Combined "Van €X voor €Y" line
    const vanVoor = l.match(/^van\s+€?\s*([\d.,]+)\s+voor$/i);
    if (vanVoor) {
      pendingName = `Van €${vanVoor[1]} voor`;
      continue;
    }

    // Name line (heuristic): ignore obvious nav/header lines
    if (/^(home|behandelingen|arrangement|webshop|urbanwellness|contact|login|registeren|winkelwagen|afspraak inplannen)$/i.test(l))
      continue;
    if (/^facebook|^instagram|^vragen\?/i.test(l)) continue;

    // If we already have name and price but no duration, flush before overwriting name.
    if (pendingName && pendingPrice) flush();
    pendingName = l;
  }

  flush();
  const cleaned = sections.filter((s) => s.items.length);
  return cleaned.length ? cleaned : undefined;
}

function extractDetailsFromBodyLines(bodyLines) {
  const out = [];
  for (const raw of bodyLines) {
    const l = raw.trim();
    if (!l) continue;
    if (/^#{3,6}\s+/.test(l)) break; // stop at first pricing section
    if (/^(facebook|instagram|vragen\?)$/i.test(l)) continue;
    if (/^maak direct een afspraak$/i.test(l)) continue;
    if (l.length < 20) continue;
    out.push(l);
  }
  // Deduplicate
  const dedup = [];
  for (const p of out) {
    if (dedup[dedup.length - 1] === p) continue;
    dedup.push(p);
  }
  return dedup.length ? dedup.join('\n\n') : undefined;
}

function introFromDetails(details) {
  if (!details) return 'Meer informatie volgt.';
  const first = details.split('\n\n')[0] ?? '';
  return first.length > 180 ? `${first.slice(0, 177).trim()}…` : first;
}

function normalizeSlug(slug) {
  const aliases = {
    'gezichtsbehandelingen-soorten': 'gezichtsbehandelingen',
    'make-up-hair': 'make-up-haarstyling',
    'massage-den-haag': 'massage-stijlen',
    'magnesium-behandeling': 'magnesium-energie-boost',
    'tanden-bleken-den-haag': 'tanden-bleken',
    'led-lichttherapie-behandelingen': 'led-lichttherapie',
    fysiotherapie: 'podoposturale-therapie-fysiotherapie',
    'lichaamsbehandelingen-den-haag': 'lichaam',
    verzorging: 'herstel',
  };
  return aliases[slug] ?? slug;
}

function categoryMetaForSlug(slug) {
  const hair = new Set(['knippen-stijlen', 'kleuren', 'highlights', 'balayage', 'herstel', 'keratine']);
  if (hair.has(slug)) return { category: 'haar', parent: { title: 'Haar', href: '/haar' } };
  const brows = new Set(['wenkbrauwen', 'wimpers']);
  if (brows.has(slug)) return { category: 'wenkbrauwen-wimpers', parent: { title: 'Wenkbrauwen & Wimpers', href: '/wenkbrauwen-wimpers' } };
  return {};
}

function toTsString(v) {
  return JSON.stringify(v ?? null);
}

function writeImportedTs(items) {
  const out = [];
  out.push('/* eslint-disable */');
  out.push('// This file is auto-generated by scripts/importLegacyTreatments.mjs');
  out.push("export const IMPORTED_TREATMENT_PAGES = [");

  for (const it of items) {
    out.push('  {');
    out.push(`    slug: ${toTsString(it.slug)},`);
    out.push(`    title: ${toTsString(it.title)},`);
    out.push(`    label: ${toTsString(it.label)},`);
    out.push(`    intro: ${toTsString(it.intro)},`);
    if (it.quote) out.push(`    quote: ${toTsString(it.quote)},`);
    if (it.details) out.push(`    details: ${toTsString(it.details)},`);
    if (it.highlights?.length) out.push(`    highlights: ${toTsString(it.highlights)},`);
    if (it.image) out.push(`    image: ${toTsString(it.image)},`);
    if (it.pricing) out.push(`    pricing: ${toTsString(it.pricing)},`);
    if (it.category) out.push(`    category: ${toTsString(it.category)},`);
    if (it.parent) out.push(`    parent: ${toTsString(it.parent)},`);
    out.push('  },');
  }
  out.push('] as const;');

  fs.writeFileSync('src/data/legacyImportedTreatments.ts', out.join('\n') + '\n', 'utf8');
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; diamond-renewal-project-importer/1.0)',
      Accept: 'text/html',
    },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return await res.text();
}

async function main() {
  const linksPath = path.resolve('scripts/treatment-links.json');
  const input = readJson(linksPath);

  const urls = uniq((input.urls ?? []).map(normalizeUrl).filter(Boolean));

  const results = [];
  for (const url of urls) {
    // eslint-disable-next-line no-console
    console.log('[fetch]', url);
    const html = await fetchText(url);
    const mainHtml = extractMainHtml(html);
    const rawText = htmlToText(mainHtml);
    const text = sliceContent(rawText);

    const slugRaw = slugFromUrl(url);
    const slug = normalizeSlug(slugRaw);
    const { title, bodyLines } = extractTitleAndBody(text);
    const quote = extractQuote(text);
    const pricing = extractPricingFromBodyLines(bodyLines);
    const details = extractDetailsFromBodyLines(bodyLines);
    const intro = introFromDetails(details);

    results.push({
      legacyUrl: url,
      slug,
      title,
      label: labelForSlug(slug),
      intro,
      quote,
      details,
      pricing,
      ...categoryMetaForSlug(slug),
    });
  }

  // Dedupe by slug (prefer first occurrence)
  const bySlug = new Map();
  for (const it of results) if (!bySlug.has(it.slug)) bySlug.set(it.slug, it);
  const deduped = Array.from(bySlug.values());

  fs.writeFileSync('scripts/treatments-import.json', JSON.stringify({ count: deduped.length, items: deduped }, null, 2));
  writeImportedTs(deduped);
  // eslint-disable-next-line no-console
  console.log('[done] wrote scripts/treatments-import.json');
  // eslint-disable-next-line no-console
  console.log('[done] wrote src/data/legacyImportedTreatments.ts');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

