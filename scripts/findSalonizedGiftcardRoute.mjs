const jsUrl = "https://widget.salonized.com/assets/index-DgR8UH54.js";

const res = await fetch(jsUrl, { headers: { accept: "text/javascript,*/*" } });
if (!res.ok) {
  console.error("Failed to fetch JS", res.status, res.statusText);
  process.exit(1);
}

const code = await res.text();

const needles = [
  "giftcard",
  "giftCard",
  "gift_card",
  "cadeaubon",
  "voucher",
  "Giftcard",
  "Voucher",
];

for (const n of needles) {
  const idx = code.toLowerCase().indexOf(n.toLowerCase());
  console.log(n, idx === -1 ? "NOT FOUND" : `FOUND at ${idx}`);
}

// Print a few surrounding snippets for the most promising keywords.
function snippetAround(lowerNeedle, radius = 120) {
  const lower = code.toLowerCase();
  const hits = [];
  let start = 0;
  while (hits.length < 5) {
    const i = lower.indexOf(lowerNeedle, start);
    if (i === -1) break;
    hits.push(i);
    start = i + lowerNeedle.length;
  }
  return hits.map((i) => code.slice(Math.max(0, i - radius), Math.min(code.length, i + radius)));
}

console.log("\n--- snippets: giftcard ---");
for (const s of snippetAround("giftcard")) console.log("\n" + s);

console.log("\n--- snippets: voucher ---");
for (const s of snippetAround("voucher")) console.log("\n" + s);

