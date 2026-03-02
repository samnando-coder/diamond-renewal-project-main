import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "./prisma";

function csvEscape(v: string) {
  const s = String(v ?? "");
  if (/[",\n\r;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const fileArg = process.argv.find((a) => a.startsWith("--out="))?.split("=", 2)[1];
  const outFile = fileArg ? path.resolve(fileArg) : path.resolve(process.cwd(), "missing-product-images.csv");

  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ image: null }, { image: "" }],
    },
    orderBy: [{ brand: "asc" }, { name: "asc" }],
    select: { sku: true, name: true, brand: true },
    take: 5000,
  });

  const header = ["sku", "brand", "name", "imageUrl"].join(";");
  const lines = products.map((p) =>
    [
      csvEscape(p.sku ?? ""),
      csvEscape(p.brand),
      csvEscape(p.name),
      "", // imageUrl (fill this in)
    ].join(";"),
  );

  fs.writeFileSync(outFile, [header, ...lines].join("\n"), "utf8");
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ok: true, outFile, count: products.length }, null, 2));
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

