/**
 * Fetch legacy WP blog HTML and print a cleaned text/markdown-ish version.
 *
 * Usage:
 *   node scripts/fetchLegacyBlog.mjs "https://bluediamonds.club/blogs/slug/"
 */

const url = process.argv[2];
const outIdx = process.argv.indexOf('--out');
const outPath = outIdx !== -1 ? process.argv[outIdx + 1] : null;
if (!url) {
  console.error('Missing URL argument');
  process.exit(1);
}

const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
const html = await res.text();

if (!res.ok) {
  console.error('Request failed', res.status, res.statusText);
  process.exit(1);
}

function extractDivByClass(classNeedle) {
  const re = new RegExp(`<div[^>]+class="[^"]*${classNeedle}[^"]*"[^>]*>`, 'i');
  const m = re.exec(html);
  if (!m || m.index == null) return null;
  const start = m.index;
  let i = start;
  let depth = 0;
  const openRe = /<div\b[^>]*>/gi;
  const closeRe = /<\/div>/gi;

  // Walk forward, counting nested divs.
  while (i < html.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);

    if (!o && !c) break;
    if (o && (!c || o.index < c.index)) {
      depth += 1;
      i = o.index + o[0].length;
      continue;
    }
    if (c) {
      depth -= 1;
      i = c.index + c[0].length;
      if (depth <= 0) return html.slice(start, i);
      continue;
    }
  }
  return html.slice(start);
}

function extractDivByNeedle(needleRe) {
  const m = needleRe.exec(html);
  if (!m || m.index == null) return null;
  const start = m.index;
  let i = start;
  let depth = 0;
  const openRe = /<div\b[^>]*>/gi;
  const closeRe = /<\/div>/gi;

  while (i < html.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!o && !c) break;
    if (o && (!c || o.index < c.index)) {
      depth += 1;
      i = o.index + o[0].length;
      continue;
    }
    if (c) {
      depth -= 1;
      i = c.index + c[0].length;
      if (depth <= 0) return html.slice(start, i);
      continue;
    }
  }
  return html.slice(start);
}

function extractArticle() {
  const m = /<article\b[\s\S]*?<\/article>/i.exec(html);
  return m ? m[0] : null;
}

// Elementor sites often embed the post body in the "theme-post-content" widget container.
const elementorPostContent = extractDivByNeedle(
  /<div[^>]+class="[^"]*elementor-widget-theme-post-content[^"]*"[^>]*>/i
);

let chunk = extractDivByClass('entry-content') ?? elementorPostContent ?? extractArticle() ?? html;

// Remove script/style.
chunk = chunk
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '');

// Convert some tags to newlines.
chunk = chunk
  .replace(/<\/(p|div|section|article|h1|h2|h3|h4|h5|h6|li|ul|ol|br)>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<li[^>]*>/gi, '- ')
  .replace(/<h1[^>]*>/gi, '# ')
  .replace(/<h2[^>]*>/gi, '## ')
  .replace(/<h3[^>]*>/gi, '### ')
  .replace(/<h4[^>]*>/gi, '#### ');

// Strip remaining tags.
chunk = chunk.replace(/<[^>]+>/g, '');

// Decode a few common entities.
chunk = chunk
  .replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

// Decode numeric entities.
chunk = chunk
  .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
    const cp = Number.parseInt(hex, 16);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  })
  .replace(/&#(\d+);/g, (_, dec) => {
    const cp = Number.parseInt(dec, 10);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  });

// Normalize whitespace.
chunk = chunk
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.length)
  .join('\n');

if (outPath) {
  const fs = await import('node:fs');
  fs.writeFileSync(outPath, chunk, 'utf8');
} else {
  console.log(chunk);
}

