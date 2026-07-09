"use client";

import { createContext, useContext, useSyncExternalStore, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  type AuthResult,
} from "@/lib/auth/client";
import type { AuthUser } from "@/lib/auth/types";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  register: (username: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Module-level external store: shared across every AuthProvider instance (there's
// only ever one, mounted in the root layout). The current-user fetch is kicked off
// lazily from getSnapshot (guarded by hasFetched) instead of a React effect, so
// updating it on load never trips "no setState in effect" — same pattern as
// CartProvider's localStorage hydration.
let authState: AuthState = { user: null, loading: true };
let hasFetched = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function setAuthState(next: Partial<AuthState>) {
  authState = { ...authState, ...next };
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AuthState {
  if (!hasFetched) {
    hasFetched = true;
    fetchCurrentUser().then((user) => setAuthState({ user, loading: false }));
  }
  return authState;
}

const SERVER_SNAPSHOT: AuthState = { user: null, loading: true };

function getServerSnapshot(): AuthState {
  return SERVER_SNAPSHOT;
}

async function refresh() {
  const user = await fetchCurrentUser();
  setAuthState({ user, loading: false });
}

async function login(identifier: string, password: string, rememberMe = false): Promise<AuthResult> {
  const result = await loginRequest(identifier, password, rememberMe);
  if (result.ok) setAuthState({ user: result.user ?? null, loading: false });
  return result;
}

async function register(username: string, email: string, password: string): Promise<AuthResult> {
  const result = await registerRequest(username, email, password);
  if (result.ok) setAuthState({ user: result.user ?? null, loading: false });
  return result;
}

async function logout() {
  await logoutRequest();
  setAuthState({ user: null, loading: false });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!state.loading && state.user && (pathname === "/login" || pathname === "/register")) {
      router.replace("/account");
    }
  }, [state.user, state.loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refresh }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
