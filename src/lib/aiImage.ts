function hashString(input: string): number {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length] as T;
}

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function aiGeneratedImageDataUrl(seedText: string, title?: string) {
  const h = hashString(seedText);
  const palettes = [
    ["#0B1B2B", "#C9A441", "#F6F0E6"],
    ["#111827", "#D4AF37", "#F5F5F4"],
    ["#0F172A", "#E3C77B", "#F8FAFC"],
    ["#1F2937", "#BFA76A", "#FFF7ED"],
  ] as const;
  const [bg, accent, cream] = pick(palettes, h);
  const t = title ? escapeXml(title) : "AI generated";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#000000"/>
    </linearGradient>
    <radialGradient id="orb" cx="30%" cy="30%" r="70%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="70%" cy="70%" r="70%">
      <stop offset="0" stop-color="${cream}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${cream}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>

  <rect width="1200" height="900" fill="url(#g)"/>
  <circle cx="260" cy="240" r="320" fill="url(#orb)" filter="url(#blur)"/>
  <circle cx="920" cy="650" r="360" fill="url(#orb2)" filter="url(#blur)"/>

  <path d="M0,650 C240,560 360,860 600,770 C860,675 960,520 1200,580 L1200,900 L0,900 Z"
        fill="${accent}" opacity="0.10"/>

  <g opacity="0.8">
    <text x="60" y="820" font-family="Georgia, serif" font-size="34" fill="${cream}" fill-opacity="0.85">
      ${t}
    </text>
    <text x="60" y="860" font-family="Inter, system-ui, sans-serif" font-size="16" fill="${cream}" fill-opacity="0.60">
      AI generated placeholder
    </text>
  </g>
</svg>`;

  // Encode for data URL (utf8)
  const encoded = encodeURIComponent(svg)
    .replaceAll("%0A", "")
    .replaceAll("%20", " ");

  return `data:image/svg+xml,${encoded}`;
}

