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
  const uid = typeof body?.uid === "string" ? body.uid : "";
  const token = typeof body?.token === "string" ? body.token : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!uid || !token || !newPassword) {
    return NextResponse.json({ form: "Missing reset token or password." }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.resetPasswordConfirm}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, token, new_password: newPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ form: "Could not reach the auth server. Please try again." }, { status: 502 });
  }
}
