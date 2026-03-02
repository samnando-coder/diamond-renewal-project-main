import 'dotenv/config';
import { prisma } from './prisma';

async function main() {
  const email = 'test.user@bluediamonds.local';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // eslint-disable-next-line no-console
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  const items = [
    { name: 'MLX Quartz sessie', qty: 1, priceCents: 1995 },
    { name: 'Welnamis Relax', qty: 1, priceCents: 2495 },
  ];
  const totalCents = items.reduce((sum, i) => sum + i.qty * i.priceCents, 0);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'paid',
      currency: 'EUR',
      totalCents,
      source: 'manual',
      itemsJson: JSON.stringify(items),
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Created order ${order.id} for ${email} (€${(totalCents / 100).toFixed(2)})`);
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

