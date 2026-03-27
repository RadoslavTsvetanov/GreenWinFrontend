"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  clearSession,
  getSessionSnapshot,
  saveSession,
  subscribeAuthSession,
} from "@/lib/auth/storage";
import { AuthSession, AuthUser } from "@/lib/auth/types";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(
    subscribeAuthSession,
    getSessionSnapshot,
    () => null,
  );
  const user: AuthUser | null = session?.user ?? null;
  const token: string | null = session?.token ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping: false,
      setSession: (session) => {
        saveSession(session);
      },
      logout: () => {
        clearSession();
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
