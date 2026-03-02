import 'dotenv/config';
import { prisma } from './prisma';
import { SHOP_PRODUCTS } from '../src/data/shopCatalog';

function priceForIndex(idx: number) {
  // Deterministic tiered pricing for dev/testing until real prices are entered.
  const tiers = [1995, 2495, 2995, 3495, 3995, 4495, 4995, 5495, 5995];
  return tiers[idx % tiers.length];
}

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    // eslint-disable-next-line no-console
    console.log(`Products already seeded (${existing}). Skipping.`);
    return;
  }

  const toSeed = SHOP_PRODUCTS.map((p, idx) => ({
    sku: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image,
    currency: 'EUR',
    priceCents: typeof p.price === 'number' ? Math.round(p.price * 100) : priceForIndex(idx),
    active: true,
  }));

  await prisma.product.createMany({ data: toSeed });
  // eslint-disable-next-line no-console
  console.log(`Seeded ${toSeed.length} products.`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

