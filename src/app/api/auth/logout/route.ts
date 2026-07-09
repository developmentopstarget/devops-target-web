import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME, AUTH_ENDPOINTS } from "@/lib/auth/config";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token && API_BASE_URL) {
    await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.logout}`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    }).catch(() => null);
  }

  cookieStore.delete(AUTH_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
