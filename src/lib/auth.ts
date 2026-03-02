export type StoredUser = {
  email: string;
  name?: string | null;
};

type ApiError = { error?: string };

import { apiUrl } from './api';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    let msg = 'Er is iets misgegaan.';
    try {
      const data = (await res.json()) as ApiError;
      if (data?.error) msg = data.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export async function apiMe(): Promise<StoredUser> {
  return api<StoredUser>('/api/auth/me');
}

export async function apiLogin(params: { email: string; password: string }): Promise<StoredUser> {
  return api<StoredUser>('/api/auth/login', { method: 'POST', body: JSON.stringify(params) });
}

export async function apiRegister(params: { email: string; password: string; name?: string }): Promise<StoredUser> {
  return api<StoredUser>('/api/auth/register', { method: 'POST', body: JSON.stringify(params) });
}

export async function apiLogout(): Promise<void> {
  await api<{ ok: true }>('/api/auth/logout', { method: 'POST', body: '{}' });
}

