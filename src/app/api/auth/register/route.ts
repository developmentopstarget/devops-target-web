import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME, AUTH_ENDPOINTS } from "@/lib/auth/config";

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { form: "Auth backend is not configured (set NEXT_PUBLIC_API_BASE_URL)." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !email || !password) {
    return NextResponse.json({ form: "Username, email, and password are required." }, { status: 400 });
  }

  try {
    const registerRes = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.register}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const registerData = await registerRes.json().catch(() => ({}));

    if (!registerRes.ok) {
      return NextResponse.json(registerData, { status: registerRes.status });
    }

    // djoser's user-creation endpoint doesn't log the user in — chain a login call
    // so a new account lands the user signed in, mirroring the RDA registration flow.
    const loginRes = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const loginData = await loginRes.json().catch(() => ({}));
    const token = loginData.auth_token as string | undefined;

    if (!loginRes.ok || !token) {
      // Account created but auto-login failed — the user can still sign in manually.
      return NextResponse.json({ ok: true, user: null });
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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
