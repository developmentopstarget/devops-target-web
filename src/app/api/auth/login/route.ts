import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME, AUTH_ENDPOINTS } from "@/lib/auth/config";

// Token is stored httpOnly (not readable by client JS) instead of localStorage/memory,
// since djoser issues a long-lived opaque bearer token rather than a short-lived JWT —
// keeping it out of reach of XSS is worth the extra route-handler hop.
export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { form: "Auth backend is not configured (set NEXT_PUBLIC_API_BASE_URL)." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const identifier = typeof body?.identifier === "string" ? body.identifier : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const rememberMe = Boolean(body?.rememberMe);

  if (!identifier || !password) {
    return NextResponse.json({ form: "Email/username and password are required." }, { status: 400 });
  }

  try {
    const loginRes = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: identifier, password }),
    });
    const loginData = await loginRes.json().catch(() => ({}));

    if (!loginRes.ok) {
      return NextResponse.json(loginData, { status: loginRes.status });
    }

    const token = loginData.auth_token as string | undefined;
    if (!token) {
      return NextResponse.json({ form: "Unexpected response from the auth server." }, { status: 502 });
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });

    const meRes = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.me}`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });
    const user = meRes.ok ? await meRes.json().catch(() => null) : null;

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ form: "Could not reach the auth server. Please try again." }, { status: 502 });
  }
}
