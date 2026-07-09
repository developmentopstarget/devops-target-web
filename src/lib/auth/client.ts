import { parseAuthErrors } from "@/lib/auth/errors";
import type { AuthUser } from "@/lib/auth/types";

export interface AuthResult {
  ok: boolean;
  user?: AuthUser | null;
  errors?: Record<string, string>;
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  return res.json().catch(() => ({}));
}

export async function loginRequest(
  identifier: string,
  password: string,
  rememberMe: boolean,
): Promise<AuthResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, rememberMe }),
  });
  const data = await parseJson(res);
  if (!res.ok) return { ok: false, errors: parseAuthErrors(data) };
  return { ok: true, user: (data.user as AuthUser | null | undefined) ?? null };
}

export async function registerRequest(
  username: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await parseJson(res);
  if (!res.ok) return { ok: false, errors: parseAuthErrors(data) };
  return { ok: true, user: (data.user as AuthUser | null | undefined) ?? null };
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return null;
  const data = await parseJson(res);
  return (data.user as AuthUser | null | undefined) ?? null;
}

export async function forgotPasswordRequest(email: string): Promise<AuthResult> {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await parseJson(res);
  if (!res.ok) return { ok: false, errors: parseAuthErrors(data) };
  return { ok: true };
}

export async function resetPasswordConfirmRequest(
  uid: string,
  token: string,
  newPassword: string,
): Promise<AuthResult> {
  const res = await fetch("/api/auth/reset-password-confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, newPassword }),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    const errors = parseAuthErrors(data);
    // djoser's confirm endpoint names the field `new_password`; remap so the
    // form (which only knows about a `password` field) can show it inline.
    if (errors.new_password) {
      errors.password = errors.new_password;
      delete errors.new_password;
    }
    return { ok: false, errors };
  }
  return { ok: true };
}

export async function verify2faRequest(code: string): Promise<AuthResult> {
  const res = await fetch("/api/auth/verify-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await parseJson(res);
  if (!res.ok) return { ok: false, errors: parseAuthErrors(data) };
  return { ok: true };
}
