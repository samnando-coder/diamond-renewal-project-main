import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { StoredUser } from '@/lib/auth';
import { apiLogin, apiLogout, apiMe, apiRegister } from '@/lib/auth';

type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  refresh: () => void;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);

  const refresh = useCallback(() => {
    apiMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (params: { email: string; password: string }) => {
    await apiLogin(params);
    await new Promise((r) => setTimeout(r, 0));
    refresh();
  }, [refresh]);

  const register = useCallback(async (params: { email: string; password: string; name?: string }) => {
    await apiRegister(params);
    await new Promise((r) => setTimeout(r, 0));
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    apiLogout()
      .catch(() => {})
      .finally(() => refresh());
  }, [refresh]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    refresh,
    login,
    register,
    logout,
  }), [user, refresh, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

