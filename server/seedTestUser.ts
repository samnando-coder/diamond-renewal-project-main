import 'dotenv/config';
import { prisma } from './prisma';
import { createUser } from './auth';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'test.user@bluediamonds.local';
  const password = 'Test12345!';
  const name = 'Test User';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Reset to known credentials for local dev convenience.
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash, name },
    });

    // eslint-disable-next-line no-console
    console.log(`[seed] Updated test user (password reset): ${email}`);
    // eslint-disable-next-line no-console
    console.log(`[seed] Password: ${password}`);
    return;
  }

  await createUser({ email, password, name });
  // eslint-disable-next-line no-console
  console.log(`[seed] Created test user: ${email}`);
  // eslint-disable-next-line no-console
  console.log(`[seed] Password: ${password}`);
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

