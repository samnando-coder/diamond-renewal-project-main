import fs from 'node:fs';

const BASE = 'https://bluediamonds.club';
const START_URLS = [`${BASE}/behandelingen/`, `${BASE}/haar/`];

function uniq(arr) {
  return Array.from(new Set(arr));
}

function extractHrefs(html) {
  const out = [];
  for (const m of html.matchAll(/href="([^"]+)"/g)) out.push(m[1]);
  for (const m of html.matchAll(/href='([^']+)'/g)) out.push(m[1]);
  return out;
}

function normalizeUrl(href) {
  try {
    const u = new URL(href, BASE);
    u.hash = '';
    // Keep query? Usually not needed for WP links.
    u.search = '';
    return u.toString();
  } catch {
    return null;
  }
}

function isTreatmentDetail(url) {
  try {
    const u = new URL(url);
    if (u.hostname !== 'bluediamonds.club') return false;
    if (!u.pathname.startsWith('/behandelingen/')) return false;
    if (u.pathname === '/behandelingen/' || u.pathname === '/behandelingen') return false;
    if (u.pathname.includes('/product/') || u.pathname.includes('/cart') || u.pathname.includes('/checkout')) return false;
    if (u.pathname.includes('wp-')) return false;
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const allDetailUrls = [];

  for (const startUrl of START_URLS) {
    const res = await fetch(startUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; diamond-renewal-project-scraper/1.0)',
        Accept: 'text/html',
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${startUrl}: ${res.status}`);
    const html = await res.text();

    const hrefs = extractHrefs(html);
    const urls = uniq(hrefs.map(normalizeUrl).filter(Boolean));
    const detailUrls = urls.filter(isTreatmentDetail);
    allDetailUrls.push(...detailUrls);
  }

  const payload = { startUrls: START_URLS, count: uniq(allDetailUrls).length, urls: uniq(allDetailUrls).sort() };
  fs.writeFileSync('scripts/treatment-links.json', JSON.stringify(payload, null, 2), 'utf8');
  console.log(`[ok] wrote scripts/treatment-links.json (${payload.count} urls)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

