import fs from 'node:fs';

const url = process.argv[2];
if (!url) {
  console.error('usage: node scripts/debugExtract.mjs <url>');
  process.exit(1);
}

const html = await (await fetch(url)).text();

function extractMainHtml(html) {
  const bodyStart = html.search(/<body[^>]*>/i);
  const body = bodyStart >= 0 ? html.slice(bodyStart) : html;
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
  return body;
}

function decodeEntities(s) {
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

function htmlToText(html) {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s
    .replace(/<h1[^>]*>/gi, '\n# ')
    .replace(/<h2[^>]*>/gi, '\n## ')
    .replace(/<h3[^>]*>/gi, '\n### ')
    .replace(/<h4[^>]*>/gi, '\n#### ')
    .replace(/<h5[^>]*>/gi, '\n##### ')
    .replace(/<h6[^>]*>/gi, '\n###### ');
  s = s.replace(/<\/(p|div|section|article|header|footer|main|ul|ol|li|h1|h2|h3|h4|h5|h6|table|tr)>/gi, '\n');
  s = s.replace(/<li[^>]*>/gi, '- ');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);
  s = s.replace(/\r/g, '');
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

const main = extractMainHtml(html);
const text = htmlToText(main);
fs.writeFileSync('scripts/debugExtract.txt', text, 'utf8');
console.log('wrote scripts/debugExtract.txt');
console.log(text.split('\\n').slice(0, 80).join('\\n'));

