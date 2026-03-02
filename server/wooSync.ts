import { prisma } from "./prisma";
import { env } from "./env";

type WooStoreImage = {
  src: string;
  thumbnail?: string;
  alt?: string;
  name?: string;
};

type WooStorePrices = {
  price: string; // minor units, e.g. "1957"
  currency_code: string; // e.g. "EUR"
  currency_minor_unit: number; // e.g. 2
};

type WooStoreProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  images: WooStoreImage[];
  brands?: { id: number; name: string; slug: string; link?: string }[];
  prices: WooStorePrices;
  type: string;
};

const STORE_API_BASE = "https://bluediamonds.club/wp-json/wc/store/products";

const WOO_FETCH_HEADERS: Record<string, string> = {
  Accept: "application/json,*/*",
  "accept-language": "nl-NL,nl;q=0.9,en;q=0.8",
  // Some hosts/WAFs block default Node fetch UA; use a browser-like UA.
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Referer: "https://bluediamonds.club/",
};

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
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  s = s.replace(/[\u2012\u2013\u2014\u2212]/g, "-");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function inferBrand(name: string): string {
  const n = name.trim();
  if (n.toLowerCase().startsWith("qs cosmetica")) return "QS Cosmetica";
  if (n.toLowerCase().startsWith("thalisens")) return "Thalion";
  if (n.toLowerCase().startsWith("l’eau")) return "Thalion";
  return n.split(/\s+/)[0] || "Overig";
}

async function fetchWooStorePage(page: number, perPage: number): Promise<WooStoreProduct[]> {
  const url = `${STORE_API_BASE}?per_page=${perPage}&page=${page}`;
  const res = await fetch(url, { headers: WOO_FETCH_HEADERS });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Woo fetch failed (${res.status}) for ${url}\n${text.slice(0, 500)}`);
  }
  return (await res.json()) as WooStoreProduct[];
}

type WooRestProduct = {
  id: number;
  name: string;
  sku: string;
  images?: { src: string }[];
  price?: string; // "19.95" (depends on Woo)
  regular_price?: string;
  currency?: string;
  // brand plugins vary; we keep inferBrand fallback
  brands?: { name?: string }[];
};

function toPriceCents(price: string | undefined | null): number {
  const raw = String(price ?? "").trim();
  if (!raw) return 0;
  // allow "19,95" or "19.95"
  const normalized = raw.replace(",", ".");
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

async function fetchWooRestPage(page: number, perPage: number): Promise<WooRestProduct[]> {
  const base = env.wooRestBase;
  const url = `${base}?per_page=${perPage}&page=${page}`;
  const key = env.wooConsumerKey;
  const secret = env.wooConsumerSecret;
  if (!key || !secret) {
    throw new Error("Woo REST credentials missing. Set WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET.");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      "user-agent": WOO_FETCH_HEADERS["user-agent"],
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Woo REST fetch failed (${res.status}) for ${url}\n${text.slice(0, 500)}`);
  }
  return (await res.json()) as WooRestProduct[];
}

export async function syncWooProducts(): Promise<{ source: "store" | "rest"; total: number; upserted: number }> {
  const perPage = 100;
  let page = 1;
  const products: WooStoreProduct[] = [];
  let source: "store" | "rest" = "store";

  try {
    while (true) {
      const batch = await fetchWooStorePage(page, perPage);
      if (batch.length === 0) break;
      products.push(...batch);
      page += 1;
    }
    source = "store";
  } catch (e) {
    // Store API is often blocked by WAF. Fallback to Woo REST API when credentials are present.
    source = "rest";
    page = 1;
    const restProducts: WooRestProduct[] = [];
    while (true) {
      const batch = await fetchWooRestPage(page, perPage);
      if (batch.length === 0) break;
      restProducts.push(...batch);
      page += 1;
    }

    // Convert REST shape to store-like shape so the rest of the logic stays consistent.
    products.splice(0, products.length, ...restProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: "",
      sku: p.sku,
      images: (p.images ?? []).map((img) => ({ src: img.src })),
      brands: p.brands?.map((b, idx) => ({ id: idx, name: b.name ?? "", slug: "" })),
      prices: {
        price: String(toPriceCents(p.price ?? p.regular_price)),
        currency_code: "EUR",
        currency_minor_unit: 2,
      },
      type: "simple",
    })) as unknown as WooStoreProduct[]);
  }

  await prisma.product.updateMany({ data: { active: false } });

  let upserted = 0;
  for (const p of products) {
    const sku = (p.sku || "").trim() || `woo-${p.id}`;
    const image = p.images?.[0]?.src ?? null;
    const currency = p.prices?.currency_code || "EUR";
    const priceCents = Number.parseInt(p.prices?.price || "0", 10);
    const name = decodeHtmlEntities(p.name);
    const brand = decodeHtmlEntities(p.brands?.[0]?.name?.trim() || inferBrand(name));

    await prisma.product.upsert({
      where: { sku },
      create: {
        sku,
        name,
        brand,
        image,
        currency,
        priceCents: Number.isFinite(priceCents) ? priceCents : 0,
        active: true,
      },
      update: {
        name,
        brand,
        image,
        currency,
        priceCents: Number.isFinite(priceCents) ? priceCents : 0,
        active: true,
      },
    });
    upserted += 1;
  }

  return { source, total: products.length, upserted };
}

