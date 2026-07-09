import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_ENDPOINTS } from "@/lib/auth/config";

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { form: "Auth backend is not configured (set NEXT_PUBLIC_API_BASE_URL)." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";

  if (!email) {
    return NextResponse.json({ email: "Email is required." }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.resetPassword}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // djoser returns 204 regardless of whether the email is registered, to avoid
    // leaking account existence — only surface real validation errors (e.g. blank/malformed).
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ form: "Could not reach the auth server. Please try again." }, { status: 502 });
  }
}
