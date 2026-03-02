import 'dotenv/config';
import { syncWooProducts } from "./wooSync";
import { prisma } from "./prisma";

async function main() {
  // eslint-disable-next-line no-console
  console.log(`[woo] syncing products + exact image urls from Woo…`);
  const { source, total, upserted } = await syncWooProducts();
  // eslint-disable-next-line no-console
  console.log(`[woo] total products: ${total}`);
  // eslint-disable-next-line no-console
  console.log(`[woo] source: ${source}`);
  // eslint-disable-next-line no-console
  console.log(`[woo] upserted: ${upserted}`);
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

