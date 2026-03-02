import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "./prisma";

type Row = Record<string, string>;

function parseCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let i = 0;
  let inQuotes = false;

  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        const next = line[i + 1];
        if (next === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cur += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (ch === delimiter) {
      out.push(cur.trim());
      cur = "";
      i += 1;
      continue;
    }

    cur += ch;
    i += 1;
  }
  out.push(cur.trim());
  return out;
}

function detectDelimiter(headerLine: string): string {
  const semis = (headerLine.match(/;/g) ?? []).length;
  const commas = (headerLine.match(/,/g) ?? []).length;
  return semis > commas ? ";" : ",";
}

function normalizeKey(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function pick(row: Row, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return null;
}

async function main() {
  const fileArg = process.argv.find((a) => a.startsWith("--file="))?.split("=", 2)[1];
  const file = fileArg ? path.resolve(fileArg) : path.resolve(process.cwd(), "product-images.csv");

  if (!fs.existsSync(file)) {
    throw new Error(
      `CSV not found at ${file}\nProvide --file=PATH or create product-images.csv in the project root.`,
    );
  }

  const raw = fs.readFileSync(file, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) throw new Error("CSV must contain a header row and at least 1 data row.");

  const delimiter = detectDelimiter(lines[0]);
  const headersRaw = parseCsvLine(lines[0], delimiter);
  const headers = headersRaw.map((h) => normalizeKey(h));

  const rows: Row[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line, delimiter);
    const row: Row = {};
    for (let i = 0; i < headers.length; i++) row[headers[i]] = cols[i] ?? "";
    rows.push(row);
  }

  // Common Woo export header variants we can map to:
  const skuKeys = ["sku", "product sku", "artikelnr", "article", "id", "product id"];
  const imageKeys = ["images", "image", "image url", "featured image", "afbeelding", "foto", "photo", "src"];

  let updated = 0;
  let skipped = 0;
  let missingSku = 0;
  let missingImage = 0;

  for (const r of rows) {
    const sku = pick(r, skuKeys);
    const image = pick(r, imageKeys);

    if (!sku) {
      missingSku += 1;
      continue;
    }
    if (!image) {
      missingImage += 1;
      continue;
    }

    // If multiple images are in one field, use the first URL.
    const first = image.split(/[\s,|]+/).find((x) => /^https?:\/\//i.test(x)) ?? image.trim();
    if (!/^https?:\/\//i.test(first)) {
      skipped += 1;
      continue;
    }

    const res = await prisma.product.updateMany({
      where: { sku: sku.trim() },
      data: { image: first.trim() },
    });

    if (res.count > 0) updated += res.count;
    else skipped += 1;
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        file,
        delimiter,
        rows: rows.length,
        updated,
        skipped,
        missingSku,
        missingImage,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

