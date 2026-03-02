import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './prisma';
import { env } from './env';

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  name: z.string().trim().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export function hashSessionToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function newSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export async function createSession(userId: string) {
  const token = newSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + env.sessionDays * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getUserBySessionToken(token: string | undefined) {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { tokenHash } }).catch(() => {});
    return null;
  }
  return session.user;
}

export async function deleteSession(token: string | undefined) {
  if (!token) return;
  const tokenHash = hashSessionToken(token);
  await prisma.session.delete({ where: { tokenHash } }).catch(() => {});
}

export async function createUser(params: { email: string; password: string; name?: string }) {
  const passwordHash = await bcrypt.hash(params.password, 12);
  return prisma.user.create({
    data: {
      email: params.email,
      name: params.name,
      passwordHash,
    },
  });
}

export async function verifyUser(params: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: params.email } });
  if (!user) return null;
  const ok = await bcrypt.compare(params.password, user.passwordHash);
  return ok ? user : null;
}

